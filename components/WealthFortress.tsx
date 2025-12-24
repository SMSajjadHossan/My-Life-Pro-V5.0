
import React, { useState, useMemo } from 'react';
import { FinancialState, Transaction, Asset } from '../types';
import { INFLATION_RATE_BD } from '../constants';
// Import Terminal from lucide-react to fix missing reference error
import { Activity, Crown, Rocket, Shield, Save, Trash2, LayoutDashboard, Zap, RefreshCw, Flame, Landmark, TrendingDown, Wallet, ArrowDownRight, ShieldCheck, CreditCard, Inbox, ChevronRight, Edit3, X, ShieldAlert, Percent, Wind, Binary, ArrowDown, Terminal } from 'lucide-react';

interface Props {
  data: FinancialState;
  updateData: (newData: FinancialState) => void;
}

export const WealthFortress: React.FC<Props> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<'COMMAND' | 'ENGINE' | 'STRATEGY' | 'AUDIT'>('ENGINE');
  
  // Ledger Editing State
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [txEditForm, setTxEditForm] = useState<Transaction | null>(null);

  // --- 1. METRICS ENGINE (Billionaire IQ) ---
  const metrics = useMemo(() => {
    const totalAssets = (data.assets || []).reduce((acc, curr) => acc + (curr.value || 0), 0);
    const totalDebt = (data.loans || []).reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const liquidCash = (data.bankA || 0) + (data.bankB || 0) + (data.bankC || 0);
    const realNetWorth = totalAssets + liquidCash - totalDebt;
    
    const passiveIncomeMo = (data.assets || []).reduce((acc, curr) => acc + (curr.value * ((curr.roi || 0) / 100 / 12)), 0);
    const emiTotal = (data.loans || []).reduce((acc, curr) => acc + (curr.monthlyEMI || 0), 0);
    const burnRate = (data.bankC > 0 ? data.bankC : 50000) + emiTotal; 
    
    const freedomRatio = burnRate > 0 ? (passiveIncomeMo / burnRate) * 100 : 0;
    const emergencyTarget = burnRate * 6;
    const emergencyProgress = Math.min(100, (data.bankA / emergencyTarget) * 100);

    return { totalAssets, totalDebt, liquidCash, realNetWorth, passiveIncomeMo, burnRate, freedomRatio, emergencyTarget, emergencyProgress };
  }, [data]);

  // --- 2. WATERFALL ENGINE LOGIC ---
  const settings = data.engineSettings || {
    wealthTaxRate: 20,
    fixedEmiAllocation: 30000,
    isSweepInEnabled: true,
    dividendFlywheelActive: true,
    inflationAdjustment: true,
    noLifestyleCreep: true,
    crashModeActive: false
  };

  const handleEngineToggle = (key: keyof typeof settings) => {
    updateData({
      ...data,
      engineSettings: { ...settings, [key]: !settings[key] }
    });
  };

  const handleManualSweep = () => {
    // THE OVERFLOW: Step 3 of your Strategic Flow
    const surplus = data.bankC; 
    if (surplus <= 0) return;
    updateData({
      ...data,
      bankC: 0,
      bankB: (data.bankB || 0) + surplus,
      layerOpportunity: (data.layerOpportunity || 0) + surplus,
      transactions: [{
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        description: "Waterfall Overflow Sweep",
        amount: -surplus,
        category: 'Investment',
        bank: 'C'
      }, {
        id: (Date.now() + 1).toString(),
        date: new Date().toISOString().split('T')[0],
        description: "Sweep into Opportunity Fund",
        amount: surplus,
        category: 'Investment',
        bank: 'B'
      }, ...data.transactions]
    });
    alert(`WATERFALL OVERFLOW: ৳${surplus.toLocaleString()} moved to Account 2 Opportunity Fund.`);
  };

  const [txForm, setTxForm] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    type: 'Expense' as 'Income' | 'Expense' | 'Dividend', 
    amount: '', 
    desc: '', 
    category: 'Needs', 
    bank: 'C' as 'A' | 'B' | 'C'
  });

  const handleSaveTransaction = () => {
    if (!txForm.amount || !txForm.desc) return;
    const amountVal = parseFloat(txForm.amount);
    let newData = { ...data };

    if (txForm.type === 'Income') {
      // THE WATERFALL AUTOMATION SEQUENCE (Your Exact Request)
      // Step 1: Fixed amount to Account 3 (Bills)
      const emiDivert = Math.min(amountVal, settings.fixedEmiAllocation);
      const remainingAfterEmi = amountVal - emiDivert;

      // Step 2: Wealth Tax % to Account 2 (Investments)
      const wealthTax = remainingAfterEmi * (settings.wealthTaxRate / 100);
      const hubFinalDeposit = remainingAfterEmi - wealthTax;

      newData.bankA = (newData.bankA || 0) + hubFinalDeposit;
      newData.bankB = (newData.bankB || 0) + wealthTax;
      newData.bankC = (newData.bankC || 0) + emiDivert;
      
      // Auto-Layering inside Account 2
      newData.layerCore = (newData.layerCore || 0) + (wealthTax * 0.7);
      newData.layerAccelerator = (newData.layerAccelerator || 0) + (wealthTax * 0.3);
    } else if (txForm.type === 'Dividend') {
        // THE DIVIDEND FLYWHEEL: Reinvest 100% into Core Layer
        newData.bankB = (newData.bankB || 0) + amountVal;
        newData.layerCore = (newData.layerCore || 0) + amountVal;
    } else {
      if (txForm.bank === 'A') newData.bankA = (newData.bankA || 0) - amountVal;
      if (txForm.bank === 'B') newData.bankB = (newData.bankB || 0) - amountVal;
      if (txForm.bank === 'C') newData.bankC = (newData.bankC || 0) - amountVal;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      date: txForm.date,
      description: txForm.desc,
      amount: txForm.type === 'Expense' ? -amountVal : amountVal,
      category: txForm.type === 'Income' ? 'Income' : txForm.type === 'Dividend' ? 'Dividend' : txForm.category as any,
      bank: txForm.type === 'Income' ? 'A' : txForm.type === 'Dividend' ? 'B' : txForm.bank
    };

    newData.transactions = [newTx, ...(newData.transactions || [])];
    updateData(newData);
    setTxForm({ ...txForm, amount: '', desc: '', type: 'Expense' });
  };

  const startEditTx = (tx: Transaction) => {
    setEditingTxId(tx.id);
    setTxEditForm({ ...tx });
  };

  const saveTxEdit = () => {
    if (!txEditForm) return;
    updateData({
        ...data,
        transactions: data.transactions.map(t => t.id === txEditForm.id ? txEditForm : t)
    });
    setEditingTxId(null);
    setTxEditForm(null);
  };

  const deleteTx = (id: string) => {
    if (confirm("Permanently delete this entry?")) {
        updateData({
            ...data,
            transactions: data.transactions.filter(t => t.id !== id)
        });
    }
  };

  const renderEngine = () => (
    <div className="space-y-10 animate-in fade-in">
      {/* WATERFALL FLOW VISUALIZATION */}
      <div className="glass-panel p-8 rounded-[2.5rem] border-l-4 border-l-electric-blue relative overflow-hidden bg-gradient-to-br from-obsidian via-slate-900/40 to-obsidian shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12"><Zap size={300} className="text-electric-blue"/></div>
        
        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-3 bg-electric-blue/20 rounded-2xl border border-electric-blue/30 shadow-[0_0_20px_rgba(41,121,255,0.2)]"><Zap className="text-electric-blue" size={28}/></div>
             <h3 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Strategic <span className="text-electric-blue">Waterfall</span> Flow</h3>
          </div>

          {/* STEP 1: INCOME ARRIVAL */}
          <div className="w-full max-w-sm flex flex-col items-center group">
            <div className="w-full bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl text-center shadow-2xl transition-all group-hover:border-emerald-400">
                <div className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-1">Step 1: Intake</div>
                <p className="text-2xl font-display font-black text-white uppercase tracking-tighter">The Rainmaker</p>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent w-full my-2"></div>
                <p className="text-[10px] text-emerald-500/70 font-mono font-bold uppercase tracking-widest">Inflow Pool (Acc 1)</p>
            </div>
            <ArrowDown className="text-gray-700 animate-bounce mt-3" size={28}/>
          </div>

          {/* STEP 2: THE HUB */}
          <div className="w-full max-w-xl">
            <div className="bg-slate-900 border border-white/10 p-10 rounded-[3rem] text-center shadow-inner relative group hover:border-electric-blue/50 transition-all">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-black px-6 py-2 rounded-full border-2 border-white/20 shadow-xl tracking-widest uppercase">Account 1: The Command Center</div>
                
                <div className="flex flex-col items-center mb-8">
                    <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest mb-2">Liquid Shield Balance</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-mono font-black text-white tracking-tighter">৳ {data.bankA.toLocaleString()}</span>
                        {settings.isSweepInEnabled && (
                            <div className="flex items-center gap-1.5 text-[10px] bg-emerald-900/40 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800/50 animate-pulse">
                                <RefreshCw size={12}/> SWEEP-IN FD
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-black/60 p-5 rounded-2xl border border-white/5 group/item hover:border-spartan-red/30 transition-colors">
                        <p className="text-[10px] text-spartan-red font-black uppercase mb-1">Fixed Divert</p>
                        <p className="text-sm font-bold text-gray-300 leading-tight">Step 1: Account 3 (EMI)</p>
                        <p className="text-xl font-mono font-black text-white mt-2">৳ {settings.fixedEmiAllocation.toLocaleString()}</p>
                    </div>
                    <div className="bg-black/60 p-5 rounded-2xl border border-white/5 group/item hover:border-wealth-green/30 transition-colors">
                        <p className="text-[10px] text-wealth-green font-black uppercase mb-1">Wealth Tax ({settings.wealthTaxRate}%)</p>
                        <p className="text-sm font-bold text-gray-300 leading-tight">Step 2: Account 2 (Lab)</p>
                        <p className="text-xl font-mono font-black text-white mt-2">৳ {((data.monthlyIncome || 0) * (settings.wealthTaxRate/100)).toLocaleString()}</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="w-full flex justify-between max-w-2xl px-20">
              <ChevronRight className="rotate-90 text-spartan-red/30" size={32} />
              <ChevronRight className="rotate-90 text-wealth-green/30" size={32} />
          </div>

          {/* ACCOUNTS 2 & 3: OPS & LAB */}
          <div className="flex flex-col md:flex-row gap-8 w-full">
            
            {/* OPS */}
            <div className="flex-1 bg-slate-950 border border-spartan-red/20 p-8 rounded-[2.5rem] relative shadow-2xl flex flex-col group hover:border-spartan-red/40 transition-all">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-spartan-red text-white text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Account 3: Operations</div>
                <div className="text-center mb-8">
                    <p className="text-[11px] text-gray-500 font-black uppercase mb-1">Daily Outflow pool</p>
                    <p className="text-4xl font-mono font-black text-white tracking-tighter">৳ {data.bankC.toLocaleString()}</p>
                </div>
                <div className="space-y-4 flex-1">
                    <div className="p-5 bg-red-950/20 border border-red-900/30 rounded-3xl flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-red-500 font-black uppercase tracking-widest">Bills Reserved</p>
                            <p className="text-lg font-mono font-black text-white">৳ {settings.fixedEmiAllocation.toLocaleString()}</p>
                        </div>
                        <CreditCard size={24} className="text-red-500"/>
                    </div>
                    <div className="bg-black/60 p-6 rounded-3xl border border-gray-800 shadow-inner">
                        <p className="text-[10px] text-blue-400 font-black uppercase italic tracking-widest mb-2">The Overflow Rule</p>
                        <p className="text-xs text-gray-400 mb-5 leading-relaxed">Flush remaining balance into the Opportunity Fund at end of month.</p>
                        <button onClick={handleManualSweep} className="w-full py-4 bg-gradient-to-r from-blue-600 to-electric-blue text-white text-[10px] font-black uppercase rounded-2xl shadow-xl transition-all active:scale-95">Execute Overflow Move</button>
                    </div>
                </div>
            </div>

            {/* LAB */}
            <div className="flex-1 bg-emerald-950/20 border border-wealth-green/20 p-8 rounded-[2.5rem] relative group hover:border-wealth-green/40 hover:bg-emerald-950/30 transition-all shadow-2xl">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-wealth-green text-black text-[10px] font-black px-5 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Account 2: Wealth Lab</div>
                <div className="text-center mb-8">
                    <p className="text-[11px] text-emerald-400 font-black uppercase mb-1">Total Investment Power</p>
                    <p className="text-4xl font-mono font-black text-wealth-green text-glow-green tracking-tighter">৳ {data.bankB.toLocaleString()}</p>
                </div>
                <div className="space-y-3">
                    <div className="bg-black/50 p-5 rounded-2xl border border-white/5 relative group/item overflow-hidden">
                        <div className="absolute inset-y-0 left-0 w-1.5 bg-blue-500"></div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] text-blue-400 font-black uppercase tracking-tighter">Layer 1: Core (SIP)</span>
                            <Shield size={16} className="text-blue-500" />
                        </div>
                        <p className="text-2xl font-mono font-black text-white">৳ {(data.layerCore || 0).toLocaleString()}</p>
                        {settings.dividendFlywheelActive && (
                            <div className="absolute top-2 right-4 flex items-center gap-1.5 text-[9px] text-blue-400 font-black uppercase bg-blue-900/20 px-2 py-0.5 rounded-full">
                                <RefreshCw size={10} className="animate-spin-slow"/> Flywheel
                            </div>
                        )}
                    </div>
                    <div className="bg-black/50 p-5 rounded-2xl border border-white/5 relative group/item">
                        <div className="absolute inset-y-0 left-0 w-1.5 bg-spartan-red"></div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[11px] text-spartan-red font-black uppercase tracking-tighter">Layer 2: Accelerator</span>
                            <Rocket size={16} className="text-spartan-red" />
                        </div>
                        <p className="text-2xl font-mono font-black text-white">৳ {(data.layerAccelerator || 0).toLocaleString()}</p>
                    </div>
                    <div className={`bg-black/50 p-5 rounded-2xl border relative transition-all ${settings.crashModeActive ? 'border-gold bg-gold/5 animate-pulse' : 'border-white/5'}`}>
                        <div className="absolute inset-y-0 left-0 w-1.5 bg-gold"></div>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-[11px] font-black uppercase tracking-tighter ${settings.crashModeActive ? 'text-gold' : 'text-gray-400'}`}>Layer 3: Opportunity</span>
                            <Flame size={16} className={settings.crashModeActive ? 'text-gold' : 'text-gray-600'} />
                        </div>
                        <p className={`text-2xl font-mono font-black ${settings.crashModeActive ? 'text-gold' : 'text-white'}`}>৳ {(data.layerOpportunity || 0).toLocaleString()}</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPGRADES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`glass-panel p-6 rounded-[2rem] border-t-4 transition-all cursor-pointer group shadow-xl ${settings.isSweepInEnabled ? 'border-t-electric-blue bg-electric-blue/5' : 'border-t-gray-800'}`} onClick={() => handleEngineToggle('isSweepInEnabled')}>
          <ShieldCheck size={28} className={settings.isSweepInEnabled ? 'text-electric-blue' : 'text-gray-600'}/>
          <h4 className="font-black text-white uppercase text-xs mt-3 tracking-[0.2em]">Liquid Shield</h4>
          <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">Sweep-in FD active on Account 1. Earn FDR interest on emergency funds while maintaining 100% liquidity.</p>
        </div>
        
        <div className={`glass-panel p-6 rounded-[2rem] border-t-4 transition-all cursor-pointer group shadow-xl ${settings.dividendFlywheelActive ? 'border-t-blue-400 bg-blue-400/5' : 'border-t-gray-800'}`} onClick={() => handleEngineToggle('dividendFlywheelActive')}>
          <Wind size={28} className={settings.dividendFlywheelActive ? 'text-blue-400' : 'text-gray-600'}/>
          <h4 className="font-black text-white uppercase text-xs mt-3 tracking-[0.2em]">Flywheel</h4>
          <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">Auto-reinvest 100% of dividends back into Layer 1. Never spend the seed; only eat the fruit of a giant forest.</p>
        </div>

        <div className={`glass-panel p-6 rounded-[2rem] border-t-4 transition-all cursor-pointer group shadow-xl ${settings.crashModeActive ? 'border-t-gold bg-gold/5' : 'border-t-gray-800'}`} onClick={() => handleEngineToggle('crashModeActive')}>
          <Flame size={28} className={settings.crashModeActive ? 'text-gold' : 'text-gray-600'}/>
          <h4 className="font-black text-white uppercase text-xs mt-3 tracking-[0.2em]">Crash Hunter</h4>
          <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">Deploy Layer 3 Dry Powder when markets drop 10-20% for billionaire growth capture.</p>
        </div>

        <div className="glass-panel p-6 rounded-[2rem] border-t-4 border-t-wealth-green bg-wealth-green/5 shadow-xl group">
          <Binary size={28} className="text-wealth-green"/>
          <h4 className="font-black text-white uppercase text-xs mt-3 tracking-[0.2em]">Tax Shield</h4>
          <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">Prioritizing ELSS, PPF, and Tax-loss harvesting logic to minimize leakages and maximize CAGR.</p>
        </div>
      </div>
    </div>
  );

  const renderCommand = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group border-t border-white/5 bg-black/40">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Crown size={56} className="text-white"/></div>
                <p className="text-[10px] text-gold uppercase font-black tracking-widest">Net Worth Status</p>
                <p className="text-2xl font-display font-black text-white mt-1 text-glow-gold">৳ {(metrics.realNetWorth / 1000).toFixed(1)}k</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl bg-black/40 border-t border-white/5">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-2">
                    <TrendingDown size={14} className="text-red-500"/> Inflation Decay
                </p>
                <p className="text-2xl font-mono font-black text-spartan-red mt-1">
                    -৳{((metrics.liquidCash * INFLATION_RATE_BD) / 365).toFixed(0)} <span className="text-[10px] text-gray-500 uppercase">/Day</span>
                </p>
            </div>
            <div className="glass-panel p-5 rounded-2xl bg-black/40 border-t border-white/5">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Freedom Quotient</p>
                <p className={`text-2xl font-mono font-black mt-1 ${metrics.freedomRatio >= 100 ? 'text-wealth-green' : 'text-orange-500'}`}>
                    {metrics.freedomRatio.toFixed(1)}%
                </p>
                <p className="text-[8px] text-gray-600 font-mono mt-1">Dividends / Operations</p>
            </div>
            <div className="glass-panel p-5 rounded-2xl border-b-4 border-b-electric-blue bg-black/40 border-t border-white/5">
                <p className="text-[10px] text-electric-blue uppercase font-black tracking-widest">Liquid Total</p>
                <p className="text-2xl font-mono font-black text-white mt-1">৳ {metrics.liquidCash.toLocaleString()}</p>
                <div className="flex gap-1 mt-4">
                   <div className="h-1.5 bg-blue-500 rounded-full flex-1" title="Hub"></div>
                   <div className="h-1.5 bg-emerald-500 rounded-full flex-1" title="Lab"></div>
                   <div className="h-1.5 bg-slate-600 rounded-full flex-1" title="Ops"></div>
                </div>
            </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Inbox className="text-electric-blue" size={20} />
                    <h3 className="text-xl font-display font-black text-white uppercase tracking-wider">Transaction Entry</h3>
                </div>
                <div className="flex items-center gap-2 bg-emerald-900/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-wealth-green animate-pulse"></span>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black italic">Waterfall Automator Active</span>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-5">
                    <div className="flex bg-black p-1.5 rounded-xl border border-gray-800 shadow-inner">
                        <button onClick={() => setTxForm({...txForm, type: 'Income'})} className={`flex-1 py-3 text-xs font-black uppercase rounded-lg transition-all ${txForm.type === 'Income' ? 'bg-wealth-green text-black shadow-[0_0_15px_#00E676]' : 'text-gray-500 hover:text-white'}`}>Income</button>
                        <button onClick={() => setTxForm({...txForm, type: 'Dividend'})} className={`flex-1 py-3 text-xs font-black uppercase rounded-lg transition-all ${txForm.type === 'Dividend' ? 'bg-blue-600 text-white shadow-[0_0_15px_#2979FF]' : 'text-gray-500 hover:text-white'}`}>Dividend</button>
                        <button onClick={() => setTxForm({...txForm, type: 'Expense'})} className={`flex-1 py-3 text-xs font-black uppercase rounded-lg transition-all ${txForm.type === 'Expense' ? 'bg-red-600 text-white shadow-[0_0_15px_#DC2626]' : 'text-gray-500 hover:text-white'}`}>Expense</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-mono font-bold group-focus-within:text-electric-blue">৳</span>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value={txForm.amount}
                                onChange={e => setTxForm({...txForm, amount: e.target.value})}
                                className="w-full bg-black border border-gray-800 rounded-xl p-4 pl-9 text-white font-mono text-xl focus:border-electric-blue outline-none transition-all"
                            />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Descriptor" 
                            value={txForm.desc}
                            onChange={e => setTxForm({...txForm, desc: e.target.value})} 
                            className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white text-sm font-bold uppercase focus:border-electric-blue outline-none transition-all"
                        />
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                        <input type="date" value={txForm.date} onChange={e => setTxForm({...txForm, date: e.target.value})} className="flex-1 bg-black border border-gray-800 rounded-xl p-3 text-gray-400 text-xs font-mono font-bold outline-none"/>
                        {txForm.type === 'Expense' ? (
                            <select value={txForm.bank} onChange={e => setTxForm({...txForm, bank: e.target.value as any})} className="flex-1 bg-black border border-gray-800 rounded-xl p-3 text-gray-300 text-xs font-black uppercase tracking-widest border-l-2 border-l-red-500">
                                <option value="C">Account 3: Operations</option>
                                <option value="A">Account 1: The Hub</option>
                                <option value="B">Account 2: Wealth Lab</option>
                            </select>
                        ) : (
                          <div className="flex-[2] bg-emerald-900/10 border border-emerald-500/30 p-3 rounded-xl text-[10px] text-emerald-400 flex items-center justify-center font-black uppercase tracking-tighter">
                             {txForm.type === 'Income' ? 'Protocol: EMI Divert -> Wealth Tax -> Hub' : 'Protocol: Auto-Reinvest into Layer 1'}
                          </div>
                        )}
                    </div>

                    <button onClick={handleSaveTransaction} className={`w-full py-5 rounded-2xl text-sm font-black uppercase tracking-[0.3em] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl ${txForm.type === 'Income' ? 'bg-wealth-green text-black' : txForm.type === 'Dividend' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                        {txForm.type === 'Income' ? "Feed Engine" : txForm.type === 'Dividend' ? "Engage Flywheel" : "Log Deduction"}
                    </button>
                </div>

                {/* DISTRIBUTION PREVIEW */}
                <div className="bg-black/40 border border-gray-800 p-8 rounded-3xl flex flex-col justify-center text-center shadow-inner relative group font-mono">
                    <div className="absolute top-4 left-4 text-[9px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity size={10} /> Live Calculation Pulse
                    </div>
                    {txForm.amount ? (
                      <div className="animate-in fade-in space-y-8">
                        <div>
                          <p className="text-4xl font-black text-white tracking-tighter">৳ {parseFloat(txForm.amount).toLocaleString()}</p>
                          <p className={`text-[11px] mt-2 uppercase font-black tracking-widest ${txForm.type === 'Income' ? 'text-wealth-green' : txForm.type === 'Dividend' ? 'text-blue-400' : 'text-spartan-red'}`}>{txForm.type} Detect Protocol</p>
                        </div>
                        {txForm.type === 'Income' && (
                          <div className="grid grid-cols-3 gap-3">
                             <div className="bg-blue-900/10 p-4 rounded-2xl border border-blue-900/30">
                                <p className="text-[9px] text-blue-400 font-black uppercase mb-1">Acc 1 Final</p>
                                <p className="text-sm font-black text-white">৳ {( (parseFloat(txForm.amount) - Math.min(parseFloat(txForm.amount), settings.fixedEmiAllocation)) * (1 - settings.wealthTaxRate/100) ).toFixed(0)}</p>
                             </div>
                             <div className="bg-emerald-900/10 p-4 rounded-2xl border border-emerald-900/30">
                                <p className="text-[9px] text-emerald-400 font-black uppercase mb-1">Acc 2 Tax</p>
                                <p className="text-sm font-black text-white">৳ {( (parseFloat(txForm.amount) - Math.min(parseFloat(txForm.amount), settings.fixedEmiAllocation)) * (settings.wealthTaxRate/100) ).toFixed(0)}</p>
                             </div>
                             <div className="bg-red-900/10 p-4 rounded-2xl border border-red-900/30">
                                <p className="text-[9px] text-red-400 font-black uppercase mb-1">Acc 3 EMI</p>
                                <p className="text-sm font-black text-white">৳ {Math.min(parseFloat(txForm.amount), settings.fixedEmiAllocation).toFixed(0)}</p>
                             </div>
                          </div>
                        )}
                        {txForm.type === 'Dividend' && (
                          <div className="flex flex-col items-center justify-center gap-4 text-blue-400 py-6 animate-pulse">
                             <RefreshCw size={48} className="drop-shadow-[0_0_15px_currentColor] animate-spin-slow" />
                             <p className="text-xs font-black uppercase tracking-widest">Auto-Reinvesting to Core Layer</p>
                          </div>
                        )}
                        {txForm.type === 'Expense' && (
                          <div className="flex flex-col items-center justify-center gap-4 text-spartan-red py-6 animate-pulse">
                             <ArrowDownRight size={48} className="drop-shadow-[0_0_15px_currentColor]" />
                             <p className="text-xs font-black uppercase tracking-widest">Deducting from Acc {txForm.bank}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 opacity-30">
                        <Terminal size={40} className="text-gray-500 mb-4" />
                        <p className="text-xs text-gray-500 italic uppercase tracking-widest">Awaiting Pulse...</p>
                      </div>
                    )}
                </div>
             </div>
        </div>

        {/* LEDGER */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
             <div className="p-5 border-b border-gray-800 bg-black/60 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-spartan-red" />
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">Core Intelligence Ledger</h3>
                </div>
                <span className="text-[10px] text-gray-600 font-mono font-bold uppercase tracking-widest">{data.transactions.length} Secure Entries</span>
             </div>
             <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-black/20">
                <table className="w-full text-left text-[11px] text-gray-400">
                    <thead className="bg-black text-gray-500 font-black sticky top-0 uppercase tracking-widest z-10 border-b border-gray-800">
                        <tr>
                            <th className="p-5">Timestamp</th>
                            <th className="p-5">Descriptor</th>
                            <th className="p-5">Financial Vector</th>
                            <th className="p-5 text-right">Delta (৳)</th>
                            <th className="p-5 text-center">Protocol</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/40">
                        {data.transactions.map((tx) => (
                            <tr key={tx.id} className={`transition-colors group ${editingTxId === tx.id ? 'bg-blue-900/10' : 'hover:bg-white/[0.03]'}`}>
                                {editingTxId === tx.id ? (
                                    <>
                                        <td className="p-4"><input type="date" value={txEditForm?.date} onChange={e => setTxEditForm(prev => prev ? {...prev, date: e.target.value} : null)} className="bg-black border border-gray-700 text-white text-[10px] p-1 rounded w-full outline-none"/></td>
                                        <td className="p-4"><input value={txEditForm?.description} onChange={e => setTxEditForm(prev => prev ? {...prev, description: e.target.value} : null)} className="bg-black border border-gray-700 text-white text-[10px] p-1 rounded w-full outline-none uppercase font-black"/></td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <select value={txEditForm?.category} onChange={e => setTxEditForm(prev => prev ? {...prev, category: e.target.value as any} : null)} className="bg-black border border-gray-700 text-white text-[9px] p-1 rounded outline-none"><option>Income</option><option>Expense</option><option>Investment</option><option>Dividend</option></select>
                                                <select value={txEditForm?.bank} onChange={e => setTxEditForm(prev => prev ? {...prev, bank: e.target.value as any} : null)} className="bg-black border border-gray-700 text-white text-[9px] p-1 rounded outline-none"><option value="A">A</option><option value="B">B</option><option value="C">C</option></select>
                                            </div>
                                        </td>
                                        <td className="p-4"><input type="number" value={txEditForm?.amount} onChange={e => setTxEditForm(prev => prev ? {...prev, amount: parseFloat(e.target.value)} : null)} className="bg-black border border-gray-700 text-white text-[10px] p-1 rounded w-full text-right outline-none"/></td>
                                        <td className="p-4 text-center"><button onClick={saveTxEdit} className="text-wealth-green p-1"><Save size={14}/></button></td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-5 font-mono text-gray-600 font-bold">{tx.date}</td>
                                        <td className="p-5 text-white font-black uppercase tracking-tight text-xs">{tx.description}</td>
                                        <td className="p-5"><span className={`px-2 py-1 rounded-md border font-black uppercase text-[8px] tracking-widest ${tx.amount > 0 ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-500' : 'bg-red-950/40 border-red-900/30 text-red-500'}`}>{tx.category} [Bank {tx.bank}]</span></td>
                                        <td className={`p-5 text-right font-mono font-black text-sm tracking-tighter ${tx.amount > 0 ? 'text-wealth-green' : 'text-gray-400'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}</td>
                                        <td className="p-5 text-center">
                                            <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEditTx(tx)} className="p-1.5 hover:bg-blue-900/30 text-gray-500 hover:text-blue-400 rounded"><Edit3 size={12}/></button>
                                                <button onClick={() => deleteTx(tx.id)} className="p-1.5 hover:bg-red-900/30 text-gray-500 hover:text-red-500 rounded"><Trash2 size={12}/></button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800/50 pb-6 gap-6">
        <div>
           <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter flex items-center gap-4 group">
             <div className="p-2 bg-wealth-green text-black rounded-lg shadow-[0_0_20px_rgba(0,230,118,0.4)]"><Landmark size={32} /></div>
             Wealth <span className="text-wealth-green text-glow-green">Fortress</span>
           </h2>
           <p className="text-xs text-gray-500 font-mono mt-2 uppercase tracking-[0.4em] font-black italic">Billionaire Engine Architecture • Optimized for Sovereignty</p>
        </div>
        <div className="flex flex-wrap gap-3">
            {[
                {id: 'ENGINE', icon: Zap, label: 'Billionaire Engine'}, 
                {id: 'COMMAND', icon: LayoutDashboard, label: 'Audit Hub'},
                {id: 'STRATEGY', icon: Binary, label: 'Efficiency Layers'},
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-xs font-black uppercase transition-all tracking-widest border ${
                        activeTab === tab.id 
                        ? 'bg-amber-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.3)] border-amber-300 scale-105' 
                        : 'bg-slate-900/50 border-gray-800 text-gray-500 hover:text-white'
                    }`}
                >
                    <tab.icon size={16} /> {tab.label}
                </button>
            ))}
        </div>
      </header>

      {activeTab === 'ENGINE' && renderEngine()}
      {activeTab === 'COMMAND' && renderCommand()}
      {activeTab === 'STRATEGY' && (
          <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                      <h3 className="text-xl font-display font-black text-white uppercase mb-6 flex items-center gap-3"><ShieldCheck className="text-wealth-green" /> The Tax Shield</h3>
                      <div className="space-y-4">
                          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-wealth-green/30 transition-colors">
                              <p className="text-[10px] text-wealth-green font-black uppercase mb-1">Harvesting Protocol</p>
                              <p className="text-sm text-gray-300">Offset share profits with losses before year-end to minimize taxable gains.</p>
                          </div>
                          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-wealth-green/30 transition-colors">
                              <p className="text-[10px] text-wealth-green font-black uppercase mb-1">ELSS & PPF Vectors</p>
                              <p className="text-sm text-gray-300">Utilize Layer 1 for compounded zero-tax growth vehicles.</p>
                          </div>
                      </div>
                  </div>
                  <div className="glass-panel p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
                      <h3 className="text-xl font-display font-black text-white uppercase mb-6 flex items-center gap-3"><Wind className="text-blue-500" /> Freedom Flywheel</h3>
                      <div className="space-y-4">
                          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                              <p className="text-[10px] text-blue-400 font-black uppercase mb-1">Sovereignty Target</p>
                              <p className="text-2xl font-mono font-black text-white">৳ {metrics.passiveIncomeMo.toFixed(0)} <span className="text-xs text-gray-500 font-bold uppercase">/ Mo</span></p>
                              <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden mt-3 relative">
                                  <div className="h-full bg-blue-500 shadow-[0_0_10px_#2979FF]" style={{width: `${Math.min(100, metrics.freedomRatio)}%`}}></div>
                              </div>
                              <p className="text-[9px] text-gray-600 mt-2 uppercase font-bold tracking-widest">{metrics.freedomRatio.toFixed(1)}% TO SOVEREIGNTY DAY</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
