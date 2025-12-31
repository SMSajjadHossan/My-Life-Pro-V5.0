
import React, { useState, useMemo, useEffect } from 'react';
import { FinancialState, Transaction, Asset, AppSection, BusinessEntity, LoanLiability, BankAccount } from '../types';
import { analyzeWealthStrategy } from '../services/geminiService';
import { 
  Landmark, Plus, X, PieChart, Rocket, Settings, ArrowUpCircle, 
  ArrowDownCircle, Target, TrendingUp, History, Map, 
  DollarSign, Activity, Trash2, Edit3, ChevronRight, 
  AlertTriangle, LineChart, CheckCircle2, Circle, Info, 
  Shield, Droplets, Split, Wallet, Save, SlidersHorizontal, RefreshCw,
  BarChart3, Scale, Layers, Zap, Flame, Briefcase, TrendingDown,
  Cpu, Ban, Globe, Anchor, HardDrive, Terminal, Calculator, Fingerprint,
  ShieldCheck, BriefcaseIcon, Building2, CreditCard, ChevronDown, Sparkles,
  GanttChartSquare, Receipt, Banknote, ShieldAlert, Eye, EyeOff, Timer,
  FlameKindling, Coffee, UtensilsCrossed, Gem, Compass, Swords, Lightbulb,
  Skull, Users
} from 'lucide-react';

interface Props {
  data: FinancialState;
  updateData: (newData: FinancialState) => void;
  userAge?: number;
  setSection?: (section: AppSection) => void;
}

type RegistryView = 'ACCOUNTS' | 'ASSETS' | 'BUSINESS' | 'DEBT';

export const WealthFortress: React.FC<Props> = ({ data, updateData, userAge = 24, setSection }) => {
  const [activeTab, setActiveTab] = useState<'ENGINE' | 'STRATEGY' | 'REGISTRY' | 'ARCHITECT' | 'SIMULATION' | 'LEDGER'>('STRATEGY');
  const [registryView, setRegistryView] = useState<RegistryView>('ACCOUNTS');
  
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Partial<Asset> | null>(null);
  const [showBizModal, setShowBizModal] = useState(false);
  const [editingBiz, setEditingBiz] = useState<Partial<BusinessEntity> | null>(null);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Partial<LoanLiability> | null>(null);
  const [showTxModal, setShowTxModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Partial<Transaction> | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Partial<BankAccount> | null>(null);

  const [simSettings, setSimSettings] = useState({ 
    roi: 12, 
    inflation: 8.5, 
    sip: data.roadmapSettings?.sipAmount || 3000,
    targetExpense: data.roadmapSettings?.targetMonthlyExpense || 40000,
    showRealWealth: true,
    horizon: 20
  });
  
  const [pulseCompound, setPulseCompound] = useState(0);
  const [isArchitectLoading, setIsArchitectLoading] = useState(false);
  const [architectResponse, setArchitectResponse] = useState<string | null>(() => {
    return localStorage.getItem('titan_architect_cache_v10');
  });

  const metrics = useMemo(() => {
    const liquidCash = (data.accounts || []).reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
    const assetVal = (data.assets || []).reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
    const bizVal = (data.businesses || []).reduce((acc, curr) => acc + (Number(curr.valuation) || 0), 0);
    const totalDebt = (data.loans || []).reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalNetWorth = assetVal + bizVal + liquidCash - totalDebt;
    
    const monthlyBurn = Number(simSettings.targetExpense) || 40000;
    const annualExpense = monthlyBurn * 12;
    const targets = {
      lean: annualExpense * 25,
      standard: annualExpense * 30,
      fat: annualExpense * 50
    };
    
    const survivalScore = monthlyBurn > 0 ? (liquidCash / monthlyBurn) : 0;
    const freedomProgress = Math.min(100, (totalNetWorth / (targets.standard || 1)) * 100);
    
    return { 
      totalNetWorth, liquidCash, monthlyBurn, annualExpense, survivalScore, 
      freedomProgress, targets, totalDebt, assetVal, bizVal
    };
  }, [data, simSettings.targetExpense]);

  useEffect(() => {
    const interval = setInterval(() => {
      const perSecondGrowth = (metrics.totalNetWorth * (simSettings.roi / 100)) / (365 * 24 * 3600);
      setPulseCompound(prev => prev + perSecondGrowth);
    }, 1000);
    return () => clearInterval(interval);
  }, [metrics.totalNetWorth, simSettings.roi]);

  const saveAccount = () => {
    if (!editingAccount?.name) return;
    const newAccounts = editingAccount.id 
      ? data.accounts.map(a => a.id === editingAccount.id ? { ...a, ...editingAccount } as BankAccount : a)
      : [...data.accounts, { ...editingAccount, id: Date.now().toString(), balance: editingAccount.balance || 0, type: editingAccount.type || 'Other' } as BankAccount];
    updateData({ ...data, accounts: newAccounts });
    setShowAccountModal(false);
    setEditingAccount(null);
  };

  const deleteItem = (type: 'ASSET' | 'BIZ' | 'LOAN' | 'TX' | 'ACCOUNT', id: string) => {
    if (!window.confirm("CRITICAL: Authorize permanent deletion?")) return;
    const newData = { ...data };
    if (type === 'ASSET') newData.assets = data.assets.filter(a => a.id !== id);
    if (type === 'BIZ') newData.businesses = data.businesses.filter(b => b.id !== id);
    if (type === 'LOAN') newData.loans = data.loans.filter(l => l.id !== id);
    if (type === 'TX') newData.transactions = data.transactions.filter(t => t.id !== id);
    if (type === 'ACCOUNT') newData.accounts = data.accounts.filter(a => a.id !== id);
    updateData(newData);
  };

  const blurClass = data.isStealthMode ? 'blur-2xl opacity-40 select-none' : '';

  const projectionData = useMemo(() => {
    const results = [];
    const monthlyROI = simSettings.roi / 100 / 12;
    const annualInflation = simSettings.inflation / 100;
    let currentNominal = metrics.totalNetWorth;

    for (let y = 1; y <= simSettings.horizon; y++) {
      for (let m = 1; m <= 12; m++) {
        currentNominal = (currentNominal + simSettings.sip) * (1 + monthlyROI);
      }
      const realWealth = currentNominal / Math.pow(1 + annualInflation, y);
      const activeValue = simSettings.showRealWealth ? realWealth : currentNominal;
      results.push({
        year: y,
        age: (userAge || 24) + y,
        nominal: currentNominal,
        real: realWealth,
        isLeanMet: activeValue >= metrics.targets.lean,
        isStandardMet: activeValue >= metrics.targets.standard,
        isFatMet: activeValue >= metrics.targets.fat
      });
    }
    return results;
  }, [metrics.totalNetWorth, metrics.targets, simSettings, userAge]);

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-40 max-w-[1600px] mx-auto">
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center border-b border-white/5 pb-12 gap-10">
        <div className="flex items-center gap-8">
          <div className="p-6 bg-wealth-green text-black rounded-[2.2rem] shadow-[0_0_60px_rgba(0,230,118,0.4)]">
            <Landmark size={44} />
          </div>
          <div>
            <h2 className="text-5xl font-display font-black text-white uppercase tracking-tighter italic text-glow-green leading-none">
              Wealth <span className="text-white">Fortress</span>
            </h2>
            <div className="flex items-center gap-4 mt-4">
                <div className="px-4 py-1.5 bg-black/60 border border-wealth-green/20 rounded-full text-[10px] font-mono font-black text-wealth-green uppercase tracking-widest">
                    ৳{metrics.totalNetWorth.toLocaleString()} NET WORTH
                </div>
                <div className="px-4 py-1.5 bg-black/60 border border-electric-blue/20 rounded-full text-[10px] font-mono font-black text-electric-blue uppercase tracking-widest">
                    {metrics.survivalScore.toFixed(1)} MONTH SURVIVAL
                </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 bg-black/60 p-2.5 rounded-[2.8rem] border border-white/10 shadow-4xl backdrop-blur-3xl">
            {[
              { id: 'STRATEGY', icon: Compass, label: 'Strategy' },
              { id: 'ENGINE', icon: Activity, label: 'Money Ops' },
              { id: 'REGISTRY', icon: Layers, label: 'Vault' },
              { id: 'ARCHITECT', icon: Sparkles, label: 'AI Strategy' },
              { id: 'SIMULATION', icon: LineChart, label: 'Projections' },
              { id: 'LEDGER', icon: History, label: 'Ledger' }
            ].map((tab) => (
                <button 
                  key={tab.id} onClick={() => setActiveTab(tab.id as any)} 
                  className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] text-[11px] font-black uppercase transition-all tracking-[0.2em] border-2 ${activeTab === tab.id ? 'bg-white text-black border-white shadow-2xl scale-105' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                    <tab.icon size={18}/>
                    {tab.label}
                </button>
            ))}
        </div>
      </header>

      {activeTab === 'STRATEGY' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 glass-panel p-16 rounded-[5rem] bg-gradient-to-br from-spartan-red/10 via-black/40 to-black/60 border border-spartan-red/20 shadow-5xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:rotate-12 transition-transform duration-1000"><Skull size={300} className="text-spartan-red"/></div>
                      <div className="relative z-10 space-y-10">
                          <div className="flex items-center gap-6">
                              <div className="p-5 bg-spartan-red text-white rounded-[2.5rem] shadow-4xl animate-pulse"><AlertTriangle size={32}/></div>
                              <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">01. REALITY CHECK</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                              <div className="space-y-4">
                                  <p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Question Directive</p>
                                  <p className="text-2xl font-bold text-gray-200 leading-relaxed italic">"If income stops tomorrow, how long can I survive?"</p>
                                  <div className="p-6 bg-black/60 rounded-[2.5rem] border border-white/5 space-y-2 mt-8">
                                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Diagnostic Calculation</p>
                                      <p className="text-sm font-mono text-gray-400">(৳{metrics.liquidCash.toLocaleString()} / ৳{metrics.monthlyBurn.toLocaleString()})</p>
                                  </div>
                              </div>
                              <div className="flex flex-col justify-center items-center p-10 bg-black/80 rounded-[3.5rem] border-2 border-spartan-red/40 shadow-2xl relative">
                                  <div className="absolute -top-6 bg-spartan-red text-black px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">SURVIVAL SCORE</div>
                                  <p className="text-[8rem] lg:text-[10rem] font-mono font-black text-white leading-none tracking-tighter tabular-nums drop-shadow-[0_0_40px_rgba(255,42,42,0.6)]">{metrics.survivalScore.toFixed(0)}</p>
                                  <p className="text-xl font-black text-spartan-red uppercase tracking-widest mt-4">MONTHS</p>
                              </div>
                          </div>
                          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                              <div className="flex items-center gap-6">
                                  <div className={`p-4 rounded-2xl shadow-xl ${metrics.survivalScore >= 6 ? 'bg-wealth-green text-black' : 'bg-spartan-red text-white'}`}>
                                      {metrics.survivalScore >= 6 ? <ShieldCheck size={28}/> : <Shield size={28}/>}
                                  </div>
                                  <div>
                                      <p className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Recommended Protocol</p>
                                      <p className={`text-2xl font-black uppercase italic ${metrics.survivalScore >= 6 ? 'text-wealth-green' : 'text-spartan-red'}`}>
                                          {metrics.survivalScore >= 6 ? 'PLANT SEEDS (ROI MODE)' : 'BUILD SHIELD (SAFETY MODE)'}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div className="glass-panel p-10 rounded-[4rem] border border-white/5 bg-black/40 h-full flex flex-col justify-center items-center text-center group">
                      <div className="p-6 bg-gold/10 text-gold rounded-[2rem] mb-8 group-hover:scale-110 transition-transform"><Lightbulb size={48}/></div>
                      <h4 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-6">First Principle</h4>
                      <p className="text-lg font-bold text-gray-400 italic px-4 leading-relaxed">"Wealth is not what you spend. Wealth is the freedom to NOT work."</p>
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { id: 2, icon: Shield, label: '02. THE FOUNDATION', desc: 'Reach 6-month buffer.', action: 'Stop lifestyle creep.', color: 'text-blue-400', bg: 'bg-blue-400/5' },
                    { id: 3, icon: Rocket, label: '03. THE AUTOMATION', desc: 'Pay yourself first.', action: 'Register Monthly SIP.', color: 'text-wealth-green', bg: 'bg-wealth-green/5' },
                    { id: 4, icon: Building2, label: '04. BUILD ASSETS', desc: 'Sell once, make forever.', action: 'ID Digital/Passive flow.', color: 'text-cyber-purple', bg: 'bg-cyber-purple/5' },
                    { id: 5, icon: TrendingUp, label: '05. SCALING UP', desc: 'The Snowball effect.', action: 'Re-invest all passive.', color: 'text-gold', bg: 'bg-gold/5' }
                  ].map(step => (
                      <div key={step.id} className={`glass-panel p-10 rounded-[3.5rem] border border-white/5 ${step.bg} shadow-4xl group hover:border-white/20 transition-all flex flex-col justify-between`}>
                          <div className="space-y-6">
                              <div className={`p-5 w-fit rounded-2xl bg-black/40 border border-white/10 ${step.color} shadow-2xl group-hover:rotate-12 transition-transform`}><step.icon size={28}/></div>
                              <h4 className="text-sm font-black text-white uppercase tracking-widest">{step.label}</h4>
                              <p className="text-xs text-gray-400 font-bold italic leading-relaxed">{step.desc}</p>
                          </div>
                          <div className="mt-10 pt-8 border-t border-white/5">
                              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={14} className="text-wealth-green"/> Action Step</p>
                              <p className="text-[11px] font-black text-gray-200 uppercase tracking-widest leading-relaxed">{step.action}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'ENGINE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-8 glass-panel p-16 rounded-[4.5rem] border-2 border-wealth-green/20 bg-gradient-to-br from-wealth-green/10 via-black/40 to-black/60 relative overflow-hidden group shadow-5xl">
            <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-wealth-green text-black rounded-3xl"><Wallet size={32}/></div>
                    <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter leading-none">Money Ops</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-end">
                    <div className="space-y-6">
                        <label className="text-[12px] font-black text-gray-500 uppercase tracking-widest block ml-6">Monthly Income (৳)</label>
                        <input type="number" value={data.monthlyIncome} onChange={(e) => updateData({ ...data, monthlyIncome: parseFloat(e.target.value) || 0 })} className="w-full bg-black/60 border border-white/10 rounded-[3rem] py-12 px-10 text-6xl font-mono font-black text-white text-glow-green focus:border-wealth-green outline-none transition-all shadow-inner" />
                    </div>
                    <div className="space-y-8">
                        <div className="p-8 bg-black/60 border border-white/5 rounded-[3rem] space-y-6">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-gray-500">
                                <span>Monthly Savings</span>
                                <span className="text-wealth-green">{Math.round((simSettings.sip/data.monthlyIncome)*100)}%</span>
                            </div>
                            <input type="range" min="0" max={data.monthlyIncome} step="500" value={simSettings.sip} onChange={e => setSimSettings({...simSettings, sip: parseInt(e.target.value)})} className="w-full accent-wealth-green" />
                            <p className="text-3xl font-mono font-black text-white">৳{simSettings.sip.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-10">
            <div className="glass-panel p-10 rounded-[4.5rem] border border-white/5 bg-black/40 text-center shadow-4xl group hover:border-white/20 transition-all">
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4">Liquid Cash</p>
                <h2 className={`text-5xl font-mono font-black text-white ${blurClass}`}>৳{metrics.liquidCash.toLocaleString()}</h2>
            </div>
            <div className="glass-panel p-10 rounded-[4.5rem] border border-white/5 bg-black/40 text-center shadow-4xl group hover:border-wealth-green/20 transition-all">
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mb-4">Growth Flow</p>
                <h2 className={`text-5xl font-mono font-black text-wealth-green ${blurClass}`}>৳{pulseCompound.toFixed(4)}</h2>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'REGISTRY' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center bg-black/60 p-2.5 rounded-[3rem] border border-white/5 w-fit mx-auto shadow-2xl">
                {[
                  { id: 'ACCOUNTS', icon: Landmark, label: 'ACCOUNTS' },
                  { id: 'ASSETS', icon: PieChart, label: 'ASSETS' },
                  { id: 'BUSINESS', icon: Building2, label: 'BUSINESS' },
                  { id: 'DEBT', icon: CreditCard, label: 'DEBTS' }
                ].map(view => (
                    <button key={view.id} onClick={() => setRegistryView(view.id as any)} className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${registryView === view.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>{view.label}</button>
                ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {registryView === 'ACCOUNTS' && (
                  <>
                    <button onClick={() => { setEditingAccount({}); setShowAccountModal(true); }} className="h-full min-h-[300px] border-4 border-dashed border-white/5 rounded-[4rem] flex flex-col items-center justify-center text-gray-700 hover:text-white hover:border-wealth-green/40 transition-all bg-white/2">
                        <Plus size={48} className="mb-4"/>
                        <span className="font-black uppercase tracking-widest text-xs">Add New Account</span>
                    </button>
                    {data.accounts.map(acc => (
                      <div key={acc.id} className="glass-panel p-10 rounded-[4rem] border border-white/5 bg-black/40 group hover:border-wealth-green/30 transition-all flex flex-col justify-between overflow-hidden relative">
                          <div className="flex justify-between items-start">
                              <div className="p-4 bg-wealth-green/10 rounded-2xl text-wealth-green"><Landmark size={28}/></div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingAccount(acc); setShowAccountModal(true); }} className="p-3 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-xl"><Edit3 size={18}/></button>
                                  <button onClick={() => deleteItem('ACCOUNT', acc.id)} className="p-3 text-gray-400 hover:text-spartan-red transition-colors bg-white/5 rounded-xl"><Trash2 size={18}/></button>
                              </div>
                          </div>
                          <div className="mt-8">
                              <p className="text-[10px] font-black text-gray-600 uppercase mb-1">{acc.type}</p>
                              <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{acc.name}</h4>
                              <p className={`text-4xl font-mono font-black text-wealth-green mt-6 ${blurClass}`}>৳{acc.balance.toLocaleString()}</p>
                          </div>
                      </div>
                    ))}
                  </>
                )}
            </div>
        </div>
      )}

      {showAccountModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in">
              <div className="glass-panel w-full max-w-xl p-16 rounded-[4.5rem] border border-white/10 shadow-5xl relative">
                  <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter mb-12 flex items-center gap-4">
                    <div className="p-4 bg-wealth-green/20 text-wealth-green rounded-2xl"><Landmark size={32}/></div>
                    Manage <span className="text-wealth-green">Bank Account</span>
                  </h3>
                  <div className="space-y-10">
                      <div className="space-y-4">
                          <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] ml-4">Account Name</label>
                          <input value={editingAccount?.name || ''} onChange={e => setEditingAccount({...editingAccount, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-[2rem] p-8 text-white font-mono text-sm outline-none focus:border-wealth-green shadow-inner" placeholder="e.g. Dutch Bangla Bank" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] ml-4">Balance (৳)</label>
                            <input type="number" value={editingAccount?.balance || ''} onChange={e => setEditingAccount({...editingAccount, balance: parseFloat(e.target.value)})} className="w-full bg-black border border-white/10 rounded-[2rem] p-8 text-white font-mono text-sm outline-none focus:border-wealth-green shadow-inner" />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] ml-4">Type</label>
                            <select value={editingAccount?.type || 'Primary'} onChange={e => setEditingAccount({...editingAccount, type: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-[2rem] p-6 text-white font-mono text-xs outline-none focus:border-wealth-green shadow-inner appearance-none">
                                <option value="Primary">Primary (Salary)</option>
                                <option value="Investment">Investment Account</option>
                                <option value="Daily">Daily Spending</option>
                                <option value="Savings">Long-Term Savings</option>
                                <option value="Other">Other Wallet</option>
                            </select>
                        </div>
                      </div>
                      <div className="flex gap-6 pt-4">
                        <button onClick={saveAccount} className="flex-1 py-8 bg-wealth-green text-black font-black uppercase tracking-[0.6em] rounded-[3rem] text-sm shadow-5xl hover:scale-105 active:scale-95 transition-all">SAVE ACCOUNT</button>
                        <button onClick={() => setShowAccountModal(false)} className="px-12 py-8 bg-white/5 border border-white/10 rounded-[3rem] text-gray-500 font-black uppercase tracking-widest text-sm hover:text-white transition-all">CANCEL</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
