
import React, { useState, useMemo, useEffect } from 'react';
import { FinancialState, Transaction, Asset, AppSection, BusinessEntity, LoanLiability } from '../types';
import { 
  Landmark, Plus, X, PieChart, Rocket, Settings, ArrowUpCircle, 
  ArrowDownCircle, Target, TrendingUp, History, Map, 
  DollarSign, Activity, Trash2, Edit3, ChevronRight, 
  AlertTriangle, LineChart, CheckCircle2, Circle, Info, 
  Shield, Droplets, Split, Wallet, Save, SlidersHorizontal, RefreshCw,
  BarChart3, Scale, Layers, Zap, Flame, Briefcase, TrendingDown,
  Cpu, Ban, Globe, Anchor, HardDrive, Terminal
} from 'lucide-react';

interface Props {
  data: FinancialState;
  updateData: (newData: FinancialState) => void;
  userAge?: number;
  setSection?: (section: AppSection) => void;
}

type RegistryView = 'ASSETS' | 'BUSINESS' | 'DEBT';

export const WealthFortress: React.FC<Props> = ({ data, updateData, userAge = 24, setSection }) => {
  const [activeTab, setActiveTab] = useState<'ENGINE' | 'ROADMAP' | 'SIMULATION' | 'LEDGER'>('ENGINE');
  const [registryView, setRegistryView] = useState<RegistryView>('ASSETS');
  const [isSaving, setIsSaving] = useState(false);
  
  // Modals
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);
  const [showBizModal, setShowBizModal] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Partial<BusinessEntity> | null>(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Partial<LoanLiability> | null>(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Partial<Transaction> | null>(null);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showProjectorModal, setShowProjectorModal] = useState(false);

  // States
  const [inflowAmount, setInflowAmount] = useState(data.monthlyIncome.toString());
  const [isAutoDistribute, setIsAutoDistribute] = useState(true);
  const [manualSplit, setManualSplit] = useState({ A: 50, B: 30, C: 20 });
  const [pulseCompound, setPulseCompound] = useState(0);
  const [simSettings, setSimSettings] = useState({ roi: 12, inflation: 8.5 });

  const metrics = useMemo(() => {
    const liquidCash = (Number(data.bankA) || 0) + (Number(data.bankB) || 0) + (Number(data.bankC) || 0);
    const assetVal = (data.assets || []).reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const bizVal = (data.businesses || []).reduce((acc, curr) => acc + (Number(curr.valuation) || 0), 0);
    const totalDebt = (data.loans || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    
    const totalNetWorth = assetVal + bizVal + liquidCash - totalDebt;
    const monthlyBurn = Number(data.roadmapSettings?.targetMonthlyExpense) || 40000;
    const survivalScore = monthlyBurn > 0 ? (liquidCash / monthlyBurn).toFixed(1) : "999";
    const targetFreedomNetWorth = monthlyBurn * 12 * 25;
    const freedomProgress = Math.min(100, (totalNetWorth / (targetFreedomNetWorth || 1)) * 100);
    
    return { 
      totalNetWorth, liquidCash, monthlyBurn, survivalScore: Number(survivalScore), 
      freedomProgress, targetFreedomNetWorth, totalDebt
    };
  }, [data]);

  const projection = useMemo(() => {
    const years = 30;
    const results = [];
    let currentBalance = metrics.totalNetWorth;
    let annualExpenses = metrics.monthlyBurn * 12;
    const annualIncome = (Number(data.monthlyIncome) || 0) * 12;
    
    for (let i = 0; i < years; i++) {
        const startBal = currentBalance;
        const growth = startBal * (simSettings.roi / 100);
        const endBal = startBal + (annualIncome - annualExpenses) + growth;
        results.push({ year: i + 1, age: userAge + i, startBal, endBal, isFree: endBal >= (annualExpenses * 25) });
        currentBalance = endBal;
        annualExpenses *= (1 + simSettings.inflation / 100);
    }
    return results;
  }, [data, metrics.totalNetWorth, metrics.monthlyBurn, userAge, simSettings]);

  useEffect(() => {
    const interval = setInterval(() => {
      const perSecondGrowth = (metrics.totalNetWorth * (simSettings.roi / 100)) / (365 * 24 * 3600);
      setPulseCompound(prev => prev + perSecondGrowth);
    }, 1000);
    return () => clearInterval(interval);
  }, [metrics.totalNetWorth, simSettings.roi]);

  const handleCommitInflow = () => {
    const amt = parseFloat(inflowAmount);
    if (isNaN(amt) || amt <= 0) return;
    let splitA, splitB, splitC;
    if (isAutoDistribute) { splitA = amt * 0.50; splitB = amt * 0.30; splitC = amt * 0.20; }
    else {
        const total = manualSplit.A + manualSplit.B + manualSplit.C;
        splitA = amt * (manualSplit.A / total); splitB = amt * (manualSplit.B / total); splitC = amt * (manualSplit.C / total);
    }
    updateData({ ...data, bankA: data.bankA + splitA, bankB: data.bankB + splitB, bankC: data.bankC + splitC, monthlyIncome: amt });
  };

  const updateBankBalance = (node: 'A' | 'B' | 'C', val: string) => {
      setIsSaving(true);
      updateData({ ...data, [`bank${node}`]: parseFloat(val) || 0 });
      setTimeout(() => setIsSaving(false), 800);
  };

  const deleteNode = (node: 'A' | 'B' | 'C') => {
      if (window.confirm(`LIQUIDATION WARNING: Purge all capital from Node ${node}?`)) {
          updateData({ ...data, [`bank${node}`]: 0 });
      }
  };

  const saveEntry = (type: 'ASSET' | 'BIZ' | 'LOAN' | 'TX', entry: any) => {
    const newData = { ...data };
    const id = entry.id || Date.now().toString();
    if (type === 'ASSET') newData.assets = entry.id ? data.assets.map(a => a.id === id ? entry : a) : [entry, ...data.assets];
    if (type === 'BIZ') newData.businesses = entry.id ? data.businesses.map(b => b.id === id ? entry : b) : [entry, ...data.businesses];
    if (type === 'LOAN') newData.loans = entry.id ? data.loans.map(l => l.id === id ? entry : l) : [entry, ...data.loans];
    if (type === 'TX') newData.transactions = entry.id ? data.transactions.map(t => t.id === id ? entry : t) : [entry, ...data.transactions];
    updateData(newData);
    setShowAssetModal(false); setShowBizModal(false); setShowLoanModal(false); setShowTxModal(false);
  };

  const deleteEntry = (type: 'ASSET' | 'BIZ' | 'LOAN' | 'TX', id: string) => {
    if (!window.confirm("CRITICAL: Authorize permanent deletion?")) return;
    const newData = { ...data };
    if (type === 'ASSET') newData.assets = data.assets.filter(a => a.id !== id);
    if (type === 'BIZ') newData.businesses = data.businesses.filter(b => b.id !== id);
    if (type === 'LOAN') newData.loans = data.loans.filter(l => l.id !== id);
    if (type === 'TX') newData.transactions = data.transactions.filter(t => t.id !== id);
    updateData(newData);
  };

  const blurClass = data.isStealthMode ? 'blur-2xl opacity-40' : '';

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40 max-w-[1600px] mx-auto">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-white/5 pb-12 gap-10">
        <div className="flex items-center gap-8">
          <div className="p-6 bg-wealth-green text-black rounded-[2.2rem] shadow-[0_0_50px_rgba(0,230,118,0.4)]">
            <Landmark size={40} />
          </div>
          <div>
            <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter italic text-glow-green leading-none">
              TITAN <span className="text-white">FORTRESS <span className="text-wealth-green text-2xl ml-2">v10.GOD</span></span>
            </h2>
            <p className="text-[10px] text-gray-500 font-mono mt-4 uppercase tracking-[0.5em] font-black italic">Net Worth: ৳{metrics.totalNetWorth.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex bg-black/60 p-2.5 rounded-[2.8rem] border border-white/10 shadow-3xl backdrop-blur-3xl">
            {['ENGINE', 'ROADMAP', 'SIMULATION', 'LEDGER'].map((tab) => (
                <button 
                  key={tab} onClick={() => setActiveTab(tab as any)} 
                  className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] text-[11px] font-black uppercase transition-all tracking-[0.2em] border-2 ${activeTab === tab ? 'bg-white text-black border-white shadow-2xl' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    {tab === 'ENGINE' && <Activity size={18}/>}
                    {tab === 'ROADMAP' && <Map size={18}/>}
                    {tab === 'SIMULATION' && <LineChart size={18}/>}
                    {tab === 'LEDGER' && <History size={18}/>}
                    {tab}
                </button>
            ))}
        </div>
      </header>

      {activeTab === 'ENGINE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-8 glass-panel p-16 rounded-[4.5rem] border-2 border-wealth-green/20 bg-gradient-to-br from-wealth-green/5 via-black/40 to-black/20 relative overflow-hidden group shadow-5xl">
            <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-wealth-green text-black rounded-3xl"><Wallet size={32}/></div>
                    <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter leading-none">Capital Triage</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-end">
                    <div className="space-y-5">
                        <label className="text-[12px] font-black text-gray-600 uppercase tracking-widest block ml-4">Monthly Payload (৳)</label>
                        <input 
                          type="number" value={inflowAmount} onChange={(e) => setInflowAmount(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-[3rem] py-12 px-10 text-7xl font-mono font-black text-white text-glow-green focus:border-wealth-green outline-none transition-all shadow-inner"
                        />
                    </div>
                    <div className="space-y-10">
                        <div className="flex items-center justify-between p-10 bg-black/60 border border-white/5 rounded-[3rem]">
                            <div className="flex items-center gap-5">
                                <Split size={28} className="text-wealth-green" />
                                <div><span className="text-[12px] font-black text-white uppercase tracking-widest block">Distribution</span><span className="text-[10px] text-gray-500 font-mono font-bold">{isAutoDistribute ? 'Auto 50/30/20' : 'Manual Weight'}</span></div>
                            </div>
                            <button onClick={() => setIsAutoDistribute(!isAutoDistribute)} className={`w-18 h-10 rounded-full relative ${isAutoDistribute ? 'bg-wealth-green' : 'bg-gray-800'}`}>
                                <div className={`absolute top-1 w-8 h-8 bg-white rounded-full transition-all ${isAutoDistribute ? 'right-1' : 'left-1'}`}></div>
                            </button>
                        </div>
                        <button onClick={handleCommitInflow} className="w-full py-10 bg-wealth-green text-black font-black uppercase tracking-[0.5em] rounded-[3rem] text-sm shadow-5xl hover:scale-[1.02] active:scale-95 transition-all">COMMIT_PAYLOAD</button>
                    </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            <div className="glass-panel p-12 rounded-[4.5rem] border border-white/5 bg-black/40 space-y-10 shadow-5xl">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <Terminal size={18} className="text-wealth-green animate-pulse" />
                      <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em]">Live Node Calibration</h4>
                    </div>
                    {isSaving && <span className="text-[8px] font-black text-wealth-green uppercase animate-pulse">SAVING_STATE...</span>}
                </div>
                {[
                  { id: 'A', label: 'Hub (A)', val: data.bankA, color: 'text-spartan-red', icon: Anchor },
                  { id: 'B', label: 'Lab (B)', val: data.bankB, color: 'text-wealth-green', icon: HardDrive },
                  { id: 'C', label: 'Ops (C)', val: data.bankC, color: 'text-electric-blue', icon: Globe }
                ].map((node) => (
                    <div key={node.id} className="relative group">
                        <label className="absolute left-8 -top-3 bg-obsidian px-3 text-[9px] font-black text-gray-600 uppercase tracking-widest z-10 flex items-center gap-2"><node.icon size={10}/> {node.label}</label>
                        <div className="relative">
                            <input 
                              type="number" value={node.val} onChange={(e) => updateBankBalance(node.id as any, e.target.value)}
                              className={`w-full bg-black/60 border border-white/5 rounded-[2.2rem] py-8 px-10 text-3xl font-mono font-black ${node.color} outline-none focus:border-white/20 transition-all ${blurClass} ${node.val === 0 ? 'opacity-30 border-spartan-red/20' : ''}`}
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               {node.val === 0 && <span className="text-[8px] font-black text-spartan-red uppercase">DEAD_CAPITAL</span>}
                               <button onClick={() => deleteNode(node.id as any)} className="p-3 text-gray-700 hover:text-spartan-red transition-colors"><Trash2 size={18}/></button>
                            </div>
                        </div>
                    </div>
                ))}
                <p className="text-[8px] text-gray-700 font-mono text-center uppercase tracking-widest italic">All changes are committed to the Sovereign Soul file instantly.</p>
            </div>
            <div className="glass-panel p-12 rounded-[4.5rem] border border-white/5 bg-black/40 flex flex-col items-center justify-center text-center shadow-4xl overflow-hidden relative">
                <div className="absolute inset-0 bg-white/[0.02] animate-pulse"></div>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4">Real-Time Yield Pulse</p>
                <h2 className={`text-5xl font-mono font-black text-white text-glow-white tracking-tighter ${blurClass}`}>৳{pulseCompound.toFixed(4)}</h2>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'LEDGER' && (
        <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-bottom-8 duration-700">
            <div className="flex justify-between items-center px-10">
                <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">Sovereign Ledger</h3>
                <button onClick={() => { setEditingTx({}); setShowTxModal(true); }} className="px-10 py-5 bg-white text-black rounded-[2rem] text-[12px] font-black uppercase tracking-[0.4em] shadow-4xl hover:scale-105 active:scale-95 flex items-center gap-4"><Plus size={18}/> MANUAL_ENTRY</button>
            </div>
            <div className="glass-panel p-10 rounded-[5rem] border border-white/5 bg-black/40 max-h-[800px] overflow-y-auto custom-scrollbar">
                {data.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-10 bg-black/60 border border-white/5 hover:border-white/10 rounded-[3.5rem] transition-all group mb-6">
                        <div className="flex items-center gap-10">
                            <div className={`p-6 rounded-[2.5rem] ${tx.amount > 0 ? 'bg-wealth-green/10 text-wealth-green' : 'bg-spartan-red/10 text-spartan-red'}`}>
                                {tx.amount > 0 ? <ArrowUpCircle size={36}/> : <ArrowDownCircle size={36}/>}
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-100">{tx.description}</p>
                                <p className="text-[11px] font-mono text-gray-600 uppercase tracking-widest">{new Date(tx.date).toLocaleDateString()} • NODE_{tx.bank} • {tx.category}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-10">
                            <p className={`text-4xl font-mono font-black ${tx.amount > 0 ? 'text-wealth-green' : 'text-spartan-red'} ${blurClass}`}>৳{Math.abs(tx.amount).toLocaleString()}</p>
                            <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingTx(tx); setShowTxModal(true); }} className="p-4 bg-white/5 text-gray-500 hover:text-white rounded-2xl border border-white/5"><Edit3 size={20}/></button>
                                <button onClick={() => deleteEntry('TX', tx.id)} className="p-4 bg-white/5 text-gray-500 hover:text-spartan-red rounded-2xl border border-white/5"><Trash2 size={20}/></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};