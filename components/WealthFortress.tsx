
import React, { useState, useMemo, useEffect } from 'react';
import { FinancialState, Transaction, Asset } from '../types';
import { WEALTH_TIMELINE, BD_MARKET_PRESETS, INVESTMENT_RETURN_RATE, INFLATION_RATE_BD } from '../constants';
import { 
  Landmark, Plus, X, PieChart, Rocket, Settings, ArrowUpCircle, 
  Calculator, Unlock, ArrowDownCircle, Target, TrendingUp, 
  ShieldCheck, History, Map, Landmark as BankIcon, Flame, Zap, DollarSign,
  ArrowRightCircle, Calendar, Trash2, Edit3, Briefcase, Activity, 
  ChevronRight, AlertTriangle, ShieldAlert, FastForward, Timer, LineChart, CheckCircle2,
  Circle, Info, Shield, Droplets, ArrowRight, Gauge, Layers, Split, Wallet, Save
} from 'lucide-react';

interface Props {
  data: FinancialState;
  updateData: (newData: FinancialState) => void;
  userAge?: number;
}

export const WealthFortress: React.FC<Props> = ({ data, updateData, userAge = 24 }) => {
  const [activeTab, setActiveTab] = useState<'ENGINE' | 'ROADMAP' | 'SIMULATION' | 'LEDGER'>('ENGINE');
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);
  
  // Inflow Logic State
  const [inflowAmount, setInflowAmount] = useState(data.monthlyIncome.toString());
  const [isAutoDistribute, setIsAutoDistribute] = useState(true);
  const [manualSplit, setManualSplit] = useState({ A: 50, B: 30, C: 20 });

  const [pulseCompound, setPulseCompound] = useState(0);

  const metrics = useMemo(() => {
    const liquidCash = (Number(data.bankA) || 0) + (Number(data.bankB) || 0) + (Number(data.bankC) || 0);
    const assetVal = (data.assets || []).reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const totalNetWorth = assetVal + liquidCash;
    const monthlyBurn = Number(data.roadmapSettings?.targetMonthlyExpense) || 40000;
    const survivalScore = monthlyBurn > 0 ? (liquidCash / monthlyBurn).toFixed(1) : "999";
    const targetFreedomNetWorth = monthlyBurn * 12 * 25;
    const freedomProgress = Math.min(100, (totalNetWorth / (targetFreedomNetWorth || 1)) * 100);
    const monthlyROI = data.assets.reduce((acc, a) => acc + (a.value * (a.roi / 100 / 12)), 0);
    const wealthVelocity = monthlyROI + (Number(data.monthlyIncome) || 0) - monthlyBurn;

    return { 
      totalNetWorth, liquidCash, monthlyBurn, survivalScore: Number(survivalScore), 
      freedomProgress, targetFreedomNetWorth, wealthVelocity, monthlyROI 
    };
  }, [data]);

  // 30 Year Simulation Logic
  const projection = useMemo(() => {
    const years = 30;
    const results = [];
    let currentBalance = metrics.totalNetWorth;
    let annualExpenses = metrics.monthlyBurn * 12;
    const annualIncome = (Number(data.monthlyIncome) || 25000) * 12;
    const weightedROI = data.assets.length > 0 
        ? data.assets.reduce((acc, a) => acc + (a.roi * (a.value / (metrics.totalNetWorth || 1))), 0) / 100
        : INVESTMENT_RETURN_RATE;

    for (let i = 0; i < years; i++) {
        const startBal = currentBalance;
        const savings = Math.max(0, annualIncome - annualExpenses);
        const growth = (startBal + savings) * (weightedROI);
        const endBal = startBal + savings + growth;
        const isFree = endBal >= (annualExpenses * 25);

        results.push({
            year: i + 1, age: userAge + i, startBal, income: annualIncome,
            expenses: annualExpenses, savings, roi: (weightedROI * 100).toFixed(1),
            endBal, isFree
        });

        currentBalance = endBal;
        annualExpenses *= (1 + INFLATION_RATE_BD);
    }
    return results;
  }, [data, metrics.totalNetWorth, metrics.monthlyBurn, userAge]);

  useEffect(() => {
    const interval = setInterval(() => {
      const perSecondGrowth = (metrics.totalNetWorth * INVESTMENT_RETURN_RATE) / (365 * 24 * 3600);
      setPulseCompound(prev => prev + perSecondGrowth);
    }, 1000);
    return () => clearInterval(interval);
  }, [metrics.totalNetWorth]);

  const handleCommitInflow = () => {
    const amt = parseFloat(inflowAmount);
    if (isNaN(amt) || amt <= 0) return;

    let splitA, splitB, splitC;
    if (isAutoDistribute) {
        splitA = amt * 0.50; splitB = amt * 0.30; splitC = amt * 0.20;
    } else {
        const total = manualSplit.A + manualSplit.B + manualSplit.C;
        splitA = amt * (manualSplit.A / total);
        splitB = amt * (manualSplit.B / total);
        splitC = amt * (manualSplit.C / total);
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      amount: amt,
      description: 'System Inflow: ' + new Date().toLocaleDateString(),
      category: 'Income',
      date: new Date().toISOString(),
      bank: 'A'
    };

    updateData({
        ...data,
        bankA: data.bankA + splitA,
        bankB: data.bankB + splitB,
        bankC: data.bankC + splitC,
        monthlyIncome: amt,
        transactions: [newTx, ...data.transactions]
    });
    alert("Capital Committed to Sovereign Nodes.");
  };

  const deleteAsset = (id: string) => {
    if (window.confirm("Authorize Asset Liquidation?")) {
        updateData({ ...data, assets: data.assets.filter(a => a.id !== id) });
    }
  };

  const saveAsset = () => {
    if (!editingAsset?.name || !editingAsset?.value) return;
    const asset: Asset = {
        id: editingAsset.id || Date.now().toString(),
        name: editingAsset.name!,
        value: Number(editingAsset.value),
        type: editingAsset.type as any || 'Stock',
        roi: Number(editingAsset.roi) || 12
    };

    const newAssets = editingAsset.id 
        ? data.assets.map(a => a.id === editingAsset.id ? asset : a)
        : [asset, ...data.assets];

    updateData({ ...data, assets: newAssets });
    setShowAssetModal(false);
    setEditingAsset(null);
  };

  const updateBankBalance = (node: 'A' | 'B' | 'C', val: string) => {
      const num = parseFloat(val) || 0;
      updateData({ ...data, [`bank${node}`]: num });
  };

  const blurClass = data.isStealthMode ? 'blur-xl select-none' : '';

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32 max-w-[1600px] mx-auto">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-white/5 pb-12 gap-10">
        <div className="flex items-center gap-8">
          <div className="p-5 bg-wealth-green text-black rounded-[2rem] shadow-[0_0_40px_rgba(0,230,118,0.4)] animate-pulse">
            <Landmark size={36} />
          </div>
          <div>
            <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter italic text-glow-green leading-none">
              Wealth <span className="text-white">Fortress <span className="text-wealth-green text-2xl ml-2">v10</span></span>
            </h2>
            <div className="flex items-center gap-4 mt-4">
                <span className="text-[10px] bg-white/5 px-4 py-1.5 rounded-full text-gray-500 font-black uppercase tracking-[0.3em] border border-white/5">Status: Sovereign</span>
                <span className="text-[10px] bg-wealth-green/10 px-4 py-1.5 rounded-full text-wealth-green font-black uppercase tracking-[0.3em] border border-wealth-green/20">Freedom_Progress: {metrics.freedomProgress.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 bg-black/60 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl">
            {[
                { id: 'ENGINE', label: 'Engine', icon: Activity },
                { id: 'ROADMAP', label: 'Roadmap', icon: Map },
                { id: 'SIMULATION', label: 'Projector', icon: LineChart },
                { id: 'LEDGER', label: 'Ledger', icon: History }
            ].map((tab) => (
                <button 
                  key={tab.id} 
                  onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center gap-3 px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase transition-all tracking-[0.2em] border-2 ${activeTab === tab.id ? 'bg-white text-black border-white shadow-2xl scale-105' : 'border-transparent text-gray-600 hover:text-white hover:bg-white/5'}`}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>
      </header>

      {activeTab === 'ENGINE' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* INFLOW MODULE */}
              <div className="lg:col-span-8 glass-panel p-12 rounded-[4rem] border-2 border-wealth-green/20 bg-gradient-to-br from-wealth-green/5 to-black/40 relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><DollarSign size={400} className="text-wealth-green"/></div>
                  <div className="relative z-10 space-y-10">
                      <div className="flex items-center gap-6">
                          <div className="p-4 bg-wealth-green text-black rounded-2xl shadow-xl"><Wallet size={28}/></div>
                          <div>
                              <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-none">Capital Inflow</h3>
                              <p className="text-[10px] text-gray-500 font-mono uppercase tracking-[0.4em] mt-2">Manual Income Triage</p>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest block ml-2">Amount to Process (BDT)</label>
                              <div className="relative">
                                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-mono font-black text-gray-700">৳</span>
                                  <input 
                                    type="number" 
                                    value={inflowAmount}
                                    onChange={(e) => setInflowAmount(e.target.value)}
                                    className="w-full bg-black/60 border border-white/10 rounded-[2.5rem] py-10 pl-14 pr-8 text-6xl font-mono font-black text-white text-glow-green focus:border-wealth-green outline-none transition-all"
                                  />
                              </div>
                          </div>
                          <div className="space-y-8">
                              <div className="flex items-center justify-between p-8 bg-black/40 border border-white/5 rounded-[2.5rem]">
                                  <div className="flex items-center gap-4">
                                      <Split size={24} className="text-wealth-green" />
                                      <div>
                                          <span className="text-[11px] font-black text-white uppercase tracking-widest block">Distribution Mode</span>
                                          <span className="text-[9px] text-gray-600 font-mono uppercase">{isAutoDistribute ? '50% / 30% / 20% (Hub/Lab/Ops)' : 'Manual Percentile Split'}</span>
                                      </div>
                                  </div>
                                  <button 
                                    onClick={() => setIsAutoDistribute(!isAutoDistribute)}
                                    className={`w-16 h-9 rounded-full relative transition-all ${isAutoDistribute ? 'bg-wealth-green' : 'bg-gray-800'}`}
                                  >
                                      <div className={`absolute top-1 w-7 h-7 bg-white rounded-full transition-all ${isAutoDistribute ? 'right-1' : 'left-1'}`}></div>
                                  </button>
                              </div>
                              <button 
                                onClick={handleCommitInflow}
                                className="w-full py-8 bg-wealth-green text-black font-black uppercase tracking-[0.5em] rounded-[2.5rem] text-sm shadow-3xl hover:scale-[1.02] active:scale-95 transition-all"
                              >
                                Commit To Nodes
                              </button>
                          </div>
                      </div>

                      {!isAutoDistribute && (
                          <div className="grid grid-cols-3 gap-6 animate-in zoom-in-95">
                              {['A', 'B', 'C'].map((node) => (
                                  <div key={node} className="space-y-3">
                                      <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Node {node} %</label>
                                      <input 
                                        type="number" 
                                        value={manualSplit[node as keyof typeof manualSplit]} 
                                        onChange={(e) => setManualSplit({...manualSplit, [node]: Number(e.target.value)})}
                                        className="w-full bg-black border border-white/10 rounded-2xl p-4 text-center text-white font-mono font-black"
                                      />
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>

              {/* NODE BALANCES - FULLY EDITABLE */}
              <div className="lg:col-span-4 space-y-8">
                  <div className="glass-panel p-10 rounded-[4rem] border border-white/5 bg-black/40 space-y-8">
                      <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">Live Node Override</h4>
                      {[
                        { id: 'A', label: 'Node A (Hub)', val: data.bankA, color: 'text-spartan-red' },
                        { id: 'B', label: 'Node B (Lab)', val: data.bankB, color: 'text-wealth-green' },
                        { id: 'C', label: 'Node C (Ops)', val: data.bankC, color: 'text-electric-blue' }
                      ].map((node) => (
                          <div key={node.id} className="relative group">
                              <label className="absolute left-6 -top-2.5 bg-obsidian px-2 text-[8px] font-black text-gray-600 uppercase tracking-widest z-10">{node.label}</label>
                              <div className="relative">
                                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-gray-700">৳</span>
                                  <input 
                                    type="number" 
                                    value={node.val}
                                    onChange={(e) => updateBankBalance(node.id as any, e.target.value)}
                                    className={`w-full bg-black/60 border border-white/5 rounded-[1.8rem] py-6 pl-12 pr-6 text-2xl font-mono font-black ${node.color} outline-none focus:border-white/20 transition-all`}
                                  />
                                  <Edit3 size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                          </div>
                      ))}
                  </div>

                  <div className="glass-panel p-10 rounded-[4rem] border border-white/5 bg-black/40 flex flex-col items-center justify-center text-center group">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-4">Pulse Compound Gain</p>
                      <h2 className="text-4xl font-mono font-black text-white text-glow-white tracking-tighter">৳{pulseCompound.toFixed(4)}</h2>
                      <p className="text-[8px] text-gray-700 font-mono mt-2 uppercase tracking-widest">Real-time Session Yield</p>
                  </div>
              </div>
          </div>

          {/* ASSET MANAGEMENT */}
          <div className="glass-panel p-12 rounded-[4rem] border border-white/5 bg-black/40 h-full relative overflow-hidden">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-gold/10 text-gold rounded-2xl"><PieChart size={24}/></div>
                        <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">Strategic Alpha Vectors</h3>
                    </div>
                    <button onClick={() => { setEditingAsset({}); setShowAssetModal(true); }} className="px-10 py-5 bg-gold text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] hover:scale-105 transition-all shadow-2xl flex items-center gap-3">
                        <Plus size={18}/> Deploy Asset
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {data.assets.map(asset => (
                        <div key={asset.id} className="p-8 bg-black/60 border border-white/5 rounded-[3rem] group hover:border-gold/40 transition-all shadow-inner relative overflow-hidden">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => { setEditingAsset(asset); setShowAssetModal(true); }} className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-xl"><Edit3 size={16}/></button>
                                <button onClick={() => deleteAsset(asset.id)} className="p-2.5 bg-white/5 hover:bg-spartan-red/20 text-gray-500 hover:text-spartan-red rounded-xl"><Trash2 size={16}/></button>
                            </div>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="p-4 bg-gold/10 text-gold rounded-2xl"><TrendingUp size={24}/></div>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tight">{asset.name}</h4>
                                    <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">{asset.type} • {asset.roi}% Yield</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <p className={`text-4xl font-mono font-black text-white tracking-tighter ${blurClass}`}>৳{asset.value.toLocaleString()}</p>
                                <div className="text-right">
                                    <p className="text-[8px] font-black text-gray-700 uppercase tracking-widest">Monthly Growth</p>
                                    <p className="text-sm font-mono font-bold text-wealth-green">+৳{(asset.value * (asset.roi / 100 / 12)).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.assets.length === 0 && (
                        <div className="col-span-full py-32 text-center opacity-20 border-4 border-dashed border-white/5 rounded-[4rem]">
                            <Target size={64} className="mx-auto mb-6 text-gray-600"/>
                            <p className="font-mono text-sm uppercase tracking-[0.5em]">No Active Asset Vectors Tracked</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* ROADMAP VIEW - INTERACTIVE FLOWCHART */}
      {activeTab === 'ROADMAP' && (
        <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4">
                <h3 className="text-5xl font-display font-black text-white uppercase italic tracking-tighter">Strategic Sovereignty Path</h3>
                <p className="text-[12px] text-gray-500 font-mono uppercase tracking-[0.6em]">The 5-Phase Deployment Sequence</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-white/5 -translate-y-1/2 hidden lg:block z-0"></div>
                {[
                  { step: 1, title: "REALITY CHECK", icon: AlertTriangle, val: `${metrics.survivalScore} Mo`, sub: 'Current Runway', status: metrics.survivalScore >= 6 ? 'SECURE' : 'CRITICAL', color: metrics.survivalScore >= 6 ? 'text-wealth-green' : 'text-spartan-red' },
                  { step: 2, title: "THE SHIELD", icon: Shield, val: `৳${(metrics.monthlyBurn * 6).toLocaleString()}`, sub: '6 Month Target', status: metrics.survivalScore >= 6 ? 'COMPLETE' : 'BUILDING', color: 'text-gold' },
                  { step: 3, title: "AUTOMATION", icon: Droplets, val: `৳${(data.roadmapSettings?.sipAmount || 0).toLocaleString()}`, sub: 'Monthly SIP', status: 'ACTIVE', color: 'text-electric-blue' },
                  { step: 4, title: "BUILD ASSETS", icon: Layers, val: `${data.assets.length} Vectors`, sub: 'Active Engines', status: 'SCALING', color: 'text-cyber-purple' },
                  { step: 5, title: "FREEDOM", icon: Rocket, val: `${metrics.freedomProgress.toFixed(1)}%`, sub: 'Progress To Apex', status: metrics.freedomProgress >= 100 ? 'REACHED' : 'APPROACHING', color: 'text-wealth-green' }
                ].map((s, i) => (
                    <div key={i} className="glass-panel p-10 rounded-[3.5rem] border border-white/10 bg-black/60 flex flex-col items-center text-center relative z-10 group hover:-translate-y-4 transition-all duration-500">
                        <div className={`w-20 h-20 rounded-[2.2rem] flex items-center justify-center mb-8 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${s.color}`}>
                            <s.icon size={32} />
                        </div>
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] mb-2">Step 0{s.step}</span>
                        <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8 leading-none">{s.title}</h4>
                        <div className="mt-auto w-full pt-8 border-t border-white/5">
                            <p className={`text-2xl font-mono font-black ${s.color} tracking-tighter`}>{s.val}</p>
                            <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest mt-1">{s.sub}</p>
                            <div className={`mt-4 px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.3em] inline-block ${s.color} bg-white/5`}>{s.status}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* PROJECTOR VIEW - 30 YEAR TABLE */}
      {activeTab === 'SIMULATION' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-12 rounded-[4rem] border border-white/5 bg-black/40 shadow-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><LineChart size={500}/></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 gap-8">
                    <div>
                        <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter leading-none mb-3">Chronos Projector</h3>
                        <p className="text-[10px] text-gray-600 font-mono uppercase tracking-[0.4em]">30-Year Inflation Adjusted Trajectory Analysis</p>
                    </div>
                    <div className="flex items-center gap-4 bg-black/60 border border-white/5 p-5 rounded-3xl">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-wealth-green rounded-full shadow-[0_0_10px_#00E676]"></div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sovereignty Checkpoint</span>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto custom-scrollbar relative z-10">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
                                <th className="pb-4 pl-8">Year / Age</th>
                                <th className="pb-4 text-right">Start Bal</th>
                                <th className="pb-4 text-right">Income</th>
                                <th className="pb-4 text-right">Burn (Exp)</th>
                                <th className="pb-4 text-right">Savings</th>
                                <th className="pb-4 text-right">ROI %</th>
                                <th className="pb-4 text-right">Ending Bal</th>
                                <th className="pb-4 pr-8 text-center">Freedom?</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projection.map((row) => (
                                <tr key={row.year} className={`group transition-all ${row.isFree ? 'bg-wealth-green/5' : 'bg-white/5'} hover:bg-white/10`}>
                                    <td className="py-6 pl-8 rounded-l-[2rem] border-y border-l border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-white font-black text-sm">Year {row.year}</span>
                                            <span className="text-gray-500 font-mono text-[9px]">Age {row.age}</span>
                                        </div>
                                    </td>
                                    <td className="py-6 text-right font-mono text-xs text-gray-400 border-y border-white/5 tabular-nums">৳{row.startBal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="py-6 text-right font-mono text-xs text-wealth-green border-y border-white/5 tabular-nums">৳{row.income.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="py-6 text-right font-mono text-xs text-spartan-red border-y border-white/5 tabular-nums">৳{row.expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="py-6 text-right font-mono text-xs text-blue-400 border-y border-white/5 tabular-nums">৳{row.savings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="py-6 text-right font-mono text-xs text-gold border-y border-white/5 tabular-nums">{row.roi}%</td>
                                    <td className="py-6 text-right font-mono text-lg font-black text-white text-glow-white border-y border-white/5 tabular-nums">৳{row.endBal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                    <td className="py-6 pr-8 rounded-r-[2rem] border-y border-r border-white/5">
                                        <div className="flex justify-center">
                                            {row.isFree ? (
                                                <div className="p-2 bg-wealth-green/20 text-wealth-green rounded-full shadow-lg"><CheckCircle2 size={24} /></div>
                                            ) : (
                                                <Circle className="text-gray-800" size={24} />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      )}

      {/* LEDGER VIEW */}
      {activeTab === 'LEDGER' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700 max-w-5xl mx-auto">
            <div className="glass-panel p-12 rounded-[4rem] border border-white/5 bg-black/40 shadow-4xl">
                <div className="flex justify-between items-center mb-12">
                    <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">Sovereign Ledger</h3>
                    <button onClick={() => updateData({...data, transactions: []})} className="text-[10px] font-black text-gray-600 hover:text-spartan-red transition-colors uppercase tracking-widest flex items-center gap-3"><Trash2 size={16}/> Wipe Buffer</button>
                </div>
                
                <div className="space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar pr-4">
                    {data.transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-8 bg-black/60 border border-white/5 hover:border-white/10 rounded-[2.5rem] transition-all group shadow-inner">
                            <div className="flex items-center gap-8">
                                <div className={`p-4 rounded-2xl ${tx.amount > 0 ? 'bg-wealth-green/10 text-wealth-green' : 'bg-spartan-red/10 text-spartan-red'}`}>
                                    {tx.amount > 0 ? <ArrowUpCircle size={24}/> : <ArrowDownCircle size={24}/>}
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-gray-200 tracking-tight leading-none">{tx.description}</p>
                                    <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest mt-2">{new Date(tx.date).toLocaleDateString()} • NODE {tx.bank}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-10">
                                <p className={`text-2xl font-mono font-black ${tx.amount > 0 ? 'text-wealth-green' : 'text-spartan-red'}`}>
                                    {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount).toLocaleString()}
                                </p>
                                <button onClick={() => updateData({...data, transactions: data.transactions.filter(t => t.id !== tx.id)})} className="p-3 bg-white/5 hover:bg-spartan-red/20 text-gray-700 hover:text-spartan-red rounded-xl opacity-0 group-hover:opacity-100 transition-all"><X size={18}/></button>
                            </div>
                        </div>
                    ))}
                    {data.transactions.length === 0 && (
                        <div className="py-40 text-center opacity-20 border-2 border-dashed border-white/10 rounded-[4rem]">
                            <History size={64} className="mx-auto mb-6"/>
                            <p className="font-mono text-xs uppercase tracking-[0.5em]">Ledger Buffer Void</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* ASSET MODAL */}
      {showAssetModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in">
              <div className="glass-panel w-full max-w-xl p-16 rounded-[4rem] border border-white/10 shadow-5xl relative">
                  <div className="flex justify-between items-center mb-12">
                      <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">Vector <span className="text-gold">Calibration</span></h3>
                      <button onClick={() => setShowAssetModal(false)} className="p-4 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white"><X size={32}/></button>
                  </div>
                  <div className="space-y-10">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Name</label>
                          <input value={editingAsset?.name || ''} onChange={e => setEditingAsset({...editingAsset, name: e.target.value})} placeholder="e.g. ALPHA_EQUITY_PORTFOLIO" className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white font-mono text-sm outline-none focus:border-gold" />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Valuation (BDT)</label>
                          <input type="number" value={editingAsset?.value || ''} onChange={e => setEditingAsset({...editingAsset, value: Number(e.target.value)})} placeholder="0" className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white font-mono text-3xl font-black outline-none focus:border-gold" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Type</label>
                              <select value={editingAsset?.type || 'Stock'} onChange={e => setEditingAsset({...editingAsset, type: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white font-mono text-xs outline-none">
                                  <option value="Stock">Index/Stock</option>
                                  <option value="Sanchaypatra">Sanchaypatra</option>
                                  <option value="FDR">FDR/Fixed Deposit</option>
                                  <option value="Land">Real Estate</option>
                                  <option value="Gold">Physical Reserve</option>
                                  <option value="Business">Enterprise</option>
                              </select>
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Est. ROI %</label>
                              <input type="number" value={editingAsset?.roi || ''} onChange={e => setEditingAsset({...editingAsset, roi: Number(e.target.value)})} placeholder="12" className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white font-mono text-xl font-bold outline-none" />
                          </div>
                      </div>
                      <button onClick={saveAsset} className="w-full py-8 bg-gold text-black font-black uppercase tracking-[0.6em] rounded-[2.5rem] text-xs shadow-3xl hover:scale-[1.01] active:scale-95 transition-all">Authorize Vector</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
