
import React, { useEffect, useState, useMemo } from 'react';
import { UserProfile, Habit, FinancialState, JournalTask, DailyAction, ChecklistState } from '../types';
import { RULES, MORNING_PROTOCOL, DAYTIME_PROTOCOL, MASCULINE_MINDSET_CHECKLIST, FINANCIAL_DISCIPLINE_CHECKLIST, RULES_OF_POWER_13, RULES_OF_ATTRACTION_7 } from '../constants';
import { Shield, Target, Zap, Activity, CheckSquare, List, Sun, Moon, Brain, Wallet, ChevronDown, ChevronUp, AlertCircle, Plus, Trash2, Save, Edit3, X, Scan, Eye, EyeOff, Loader } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, Tooltip } from 'recharts';

interface Props {
  profile: UserProfile;
  habits: Habit[];
  financialData: FinancialState;
  objectives: JournalTask[];
  setObjectives: (objs: JournalTask[]) => void;
  checklists: ChecklistState;
  setChecklists: (newState: ChecklistState) => void;
  dailyActions: DailyAction[];
  setDailyActions: (actions: DailyAction[]) => void;
}

// Memoized Radar Chart for Performance
const LifeRadar = React.memo(({ data }: { data: any[] }) => (
    <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data}>
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 'bold' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <RechartsRadar name="Stats" dataKey="A" stroke="#2979FF" strokeWidth={2} fill="#2979FF" fillOpacity={0.3} />
            <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#333', fontSize: '12px'}} />
        </RadarChart>
    </ResponsiveContainer>
));

export const Dashboard: React.FC<Props> = ({ 
    profile, habits, financialData, 
    objectives, setObjectives, 
    checklists, setChecklists,
    dailyActions, setDailyActions
}) => {
  const [dailyMotto, setDailyMotto] = useState(RULES[0]);
  const [zenMode, setZenMode] = useState(false);
  
  const [tomorrowPlan, setTomorrowPlan] = useState(() => localStorage.getItem('dash_tomorrow') || '');

  // UI State
  const [showPowerRules, setShowPowerRules] = useState(false);
  const [showAttractRules, setShowAttractRules] = useState(false);
  
  // Objective Edit State
  const [editingObjId, setEditingObjId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<JournalTask | null>(null);
  
  // Protocol Tab State
  const [activeProtocolTab, setActiveProtocolTab] = useState<'MORNING' | 'DAYTIME' | 'MINDSET' | 'FINANCE'>('MORNING');

  // -- ANALYSIS MODAL STATE --
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  // -- FINANCIAL CALCULATIONS --
  const safeAssets = financialData.assets || [];
  const totalAssetsValue = safeAssets.reduce((acc, curr) => acc + curr.value, 0);
  const totalNetWorth = (financialData.bankA || 0) + (financialData.bankB || 0) + (financialData.bankC || 0) + totalAssetsValue;
  
  // -- RADAR CHART DATA CALCULATION --
  const radarData = useMemo(() => {
      const wealthScore = Math.min(100, (totalNetWorth / 500000) * 100);
      const healthHabits = habits.filter(h => h.category === 'Health');
      const avgStreak = healthHabits.reduce((acc, h) => acc + h.streak, 0) / (healthHabits.length || 1);
      const healthScore = Math.min(100, avgStreak * 5); 
      const intellectScore = 60; 
      const morningDone = Object.values(checklists?.morning || {}).filter(Boolean).length;
      const disciplineScore = (morningDone / MORNING_PROTOCOL.length) * 100;
      const socialScore = 80;

      return [
        { subject: 'Wealth', A: Math.round(wealthScore), fullMark: 100 },
        { subject: 'Health', A: Math.round(healthScore), fullMark: 100 },
        { subject: 'Intellect', A: intellectScore, fullMark: 100 },
        { subject: 'Social', A: socialScore, fullMark: 100 },
        { subject: 'Discipline', A: Math.round(disciplineScore), fullMark: 100 },
        { subject: 'Spirit', A: 70, fullMark: 100 },
      ];
  }, [totalNetWorth, habits, checklists]);

  // -- PROFILE ANALYSIS GENERATOR --
  const analysis = useMemo(() => {
      const wealth = radarData.find(s => s.subject === 'Wealth')?.A || 0;
      const health = radarData.find(s => s.subject === 'Health')?.A || 0;
      const discipline = radarData.find(s => s.subject === 'Discipline')?.A || 0;
      const totalScore = Math.round((wealth + health + discipline) / 3);
      
      let rank = "RECRUIT";
      let color = "text-gray-500";
      if (totalScore > 80) { rank = "WARLORD"; color = "text-gold"; }
      else if (totalScore > 60) { rank = "COMMANDER"; color = "text-spartan-red"; }
      else if (totalScore > 40) { rank = "SOLDIER"; color = "text-electric-blue"; }

      const directive = totalScore < 50 ? "IMMEDIATE DISCIPLINE REQUIRED." : "MAINTAIN MOMENTUM. SCALE UP.";

      return { wealth, health, discipline, totalScore, rank, color, directive };
  }, [radarData]);

  // -- EFFECTS --
  useEffect(() => {
    const randomRule = RULES[Math.floor(Math.random() * RULES.length)];
    setDailyMotto(randomRule);
  }, []);

  useEffect(() => { localStorage.setItem('dash_tomorrow', tomorrowPlan); }, [tomorrowPlan]);

  // -- HANDLERS --

  // Start the gamified audit process
  const startAudit = () => {
      setShowAnalysis(true);
      setIsAuditing(true);
      // Simulate system scan duration
      setTimeout(() => setIsAuditing(false), 2000); 
  };

  // Checklists (Syncs via parent state)
  const toggleItem = (item: string, category: keyof ChecklistState) => {
    setChecklists({
        ...checklists,
        [category]: {
            ...checklists[category],
            [item]: !checklists[category]?.[item]
        }
    });
  };

  const calculateProgress = (list: Record<string, boolean> | undefined, total: number) => {
    if (!list) return 0;
    const checked = Object.values(list).filter(Boolean).length;
    return Math.round((checked / total) * 100) || 0;
  };

  // Objective Handlers
  const handleEditObj = (obj: JournalTask) => {
    setEditingObjId(obj.id);
    setEditForm({...obj});
  };

  const saveObj = () => {
    if (!editForm) return;
    setObjectives(objectives.map(o => o.id === editForm.id ? editForm : o));
    setEditingObjId(null);
  };

  const deleteObj = (id: string) => {
    if(confirm('Delete this objective?')) setObjectives(objectives.filter(o => o.id !== id));
  };

  const addNewObj = () => {
    const newObj: JournalTask = {
        id: Date.now().toString(),
        category: 'NEW',
        task: 'New Objective',
        status: 'Not Started',
        priority: 'Medium',
        progress: 0,
        notes: '',
        dueDate: ''
    };
    setObjectives([newObj, ...objectives]);
    handleEditObj(newObj);
  };

  // Daily Action Journal Handlers
  const toggleAction = (id: string) => {
    setDailyActions(dailyActions.map(f => f.id === id ? { ...f, status: f.status === 'Completed' ? 'Not Started' : 'Completed' } : f));
  };

  const updateAction = (id: string, field: keyof DailyAction, value: any) => {
    setDailyActions(dailyActions.map(f => f.id === id ? {...f, [field]: value} : f));
  };

  const addAction = () => {
    setDailyActions([...dailyActions, { id: Date.now().toString(), task: '', priority: 'Medium', status: 'Not Started', notes: '', progress: 0, category: '⚡ DAYTIME' }]);
  };

  const deleteAction = (id: string) => {
    setDailyActions(dailyActions.filter(f => f.id !== id));
  };

  // Render Checklist (GLASS STYLE)
  const renderChecklist = (items: string[], category: keyof ChecklistState) => (
    <div className="space-y-1 h-full overflow-y-auto custom-scrollbar p-2">
        {items.map((item, idx) => (
            <div key={idx} onClick={() => toggleItem(item, category)} className="flex items-start gap-3 p-3 rounded hover:bg-white/5 cursor-pointer group border border-transparent hover:border-gray-800 transition-all">
                <div className={`mt-0.5 min-w-[16px] h-[16px] border rounded flex items-center justify-center transition-all ${checklists[category]?.[item] ? 'bg-wealth-green border-wealth-green shadow-[0_0_8px_#00E676]' : 'border-gray-600 group-hover:border-gray-400'}`}>
                    {checklists[category]?.[item] && <CheckSquare size={12} className="text-black" />}
                </div>
                <span className={`text-xs leading-tight font-medium ${checklists[category]?.[item] ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{item}</span>
            </div>
        ))}
    </div>
  );

  // --- XP CALCULATOR ---
  const calculateNextLevelXp = (level: number) => level * 1000;
  const xpProgress = (profile.xp / calculateNextLevelXp(profile.level)) * 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
      
      {/* ANALYSIS POPUP MODAL */}
      {showAnalysis && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => !isAuditing && setShowAnalysis(false)}>
              <div className="bg-slate-950 border border-spartan-red/50 rounded-xl max-w-md w-full overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)] relative" onClick={e => e.stopPropagation()}>
                  {/* Scanner Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-spartan-red shadow-[0_0_20px_rgba(220,38,38,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
                  
                  {isAuditing ? (
                      <div className="p-12 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in">
                          <div className="relative">
                              <Loader className="animate-spin text-spartan-red" size={64} />
                              <div className="absolute inset-0 flex items-center justify-center">
                                  <Scan size={24} className="text-white animate-pulse" />
                              </div>
                          </div>
                          <div>
                              <h3 className="text-xl font-bold text-white uppercase tracking-widest animate-pulse">System Diagnostic Running...</h3>
                              <p className="text-xs text-gray-500 font-mono mt-2">ANALYZING BIO-METRICS & FINANCIAL DATA</p>
                          </div>
                          <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-spartan-red animate-[load_2s_ease-in-out_infinite] w-full"></div>
                          </div>
                      </div>
                  ) : (
                      <>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-display font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                        <Scan size={24} className="text-spartan-red text-glow-red"/> Identity Audit
                                    </h3>
                                    <p className="text-xs text-gray-500 font-mono mt-1">SYSTEM DIAGNOSTIC V2.4</p>
                                </div>
                                <button onClick={() => setShowAnalysis(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
                            </div>

                            <div className="space-y-6">
                                {/* Rank Display */}
                                <div className="text-center p-4 bg-black border border-gray-800 rounded-lg">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">CURRENT DESIGNATION</p>
                                    <h2 className={`text-4xl font-display font-black uppercase tracking-tighter ${analysis.color} mt-2`}>{analysis.rank}</h2>
                                    <p className="text-xs text-gray-400 mt-1">Score: {analysis.totalScore}/100</p>
                                </div>

                                {/* Stats Grid */}
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase mb-1">
                                            <span className="text-wealth-green">Financial Integrity</span>
                                            <span className="text-white">{analysis.wealth}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-wealth-green shadow-[0_0_10px_#00E676]" style={{width: `${analysis.wealth}%`}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase mb-1">
                                            <span className="text-spartan-red">Biological Status</span>
                                            <span className="text-white">{analysis.health}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-spartan-red shadow-[0_0_10px_#FF2A2A]" style={{width: `${analysis.health}%`}}></div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold uppercase mb-1">
                                            <span className="text-electric-blue">Mental Fortitude</span>
                                            <span className="text-white">{analysis.discipline}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-900 rounded-full overflow-hidden"><div className="h-full bg-electric-blue shadow-[0_0_10px_#2979FF]" style={{width: `${analysis.discipline}%`}}></div></div>
                                    </div>
                                </div>

                                {/* Verdict */}
                                <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-lg">
                                    <p className="text-[10px] text-spartan-red uppercase font-bold mb-1">COMMANDER'S DIRECTIVE</p>
                                    <p className="text-sm font-mono text-white leading-relaxed">{analysis.directive}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-black p-3 border-t border-gray-800 text-center">
                            <button onClick={() => setShowAnalysis(false)} className="text-xs text-gray-500 hover:text-white uppercase font-bold">Close Diagnostic</button>
                        </div>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* 1. HUD: GAMIFIED STATUS (COMPACT v6.0) */}
      <div className="glass-panel rounded-xl p-6 relative overflow-hidden border-t border-white/10 group">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div className="flex items-center gap-4">
                  {/* Rank Insignia */}
                  <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black border-2 border-white/10 rounded-lg flex items-center justify-center shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      <Shield size={32} className={`${analysis.color} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />
                  </div>
                  
                  <div>
                      <h1 className="text-3xl font-display font-black text-white uppercase tracking-tighter leading-none flex items-center gap-2">
                          {profile.rank} <span className="text-sm text-gray-500 font-mono bg-black/50 px-2 py-0.5 rounded border border-white/5">LVL {profile.level}</span>
                      </h1>
                      <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                              <Activity size={10} className="text-wealth-green"/> {analysis.totalScore}% OPTIMIZED
                          </p>
                          <div className="h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-electric-blue to-cyber-purple transition-all duration-1000 shadow-[0_0_10px_rgba(41,121,255,0.5)]" style={{width: `${Math.min(100, xpProgress)}%`}}></div>
                          </div>
                      </div>
                  </div>
              </div>

              {/* HUD Actions */}
              <div className="flex gap-2">
                  <button 
                      onClick={() => setZenMode(!zenMode)} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold uppercase transition-all ${zenMode ? 'bg-indigo-900/30 border-indigo-500 text-indigo-300' : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'}`}
                  >
                      {zenMode ? <EyeOff size={14}/> : <Eye size={14}/>}
                      {zenMode ? "Zen Mode Active" : "Focus Mode"}
                  </button>
                  <button 
                      onClick={startAudit} 
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-spartan-red/10 border border-spartan-red/30 text-spartan-red hover:bg-spartan-red hover:text-white transition-all text-xs font-bold uppercase"
                  >
                      <Scan size={14}/> Scan
                  </button>
              </div>
          </div>
          
          {/* HUD Background Decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ZEN MODE: ONLY CRITICAL TASKS */}
      {zenMode ? (
          <div className="grid grid-cols-1 gap-6 animate-in fade-in">
              {/* EAT THAT FROG (FOCUS) */}
              <div className="bg-black/60 border border-indigo-500/30 rounded-lg p-8 relative overflow-hidden group shadow-[0_0_50px_rgba(79,70,229,0.1)]">
                  <div className="flex justify-between items-center mb-8 relative z-10">
                      <div className="flex items-center gap-3">
                          <Target className="text-indigo-500 animate-pulse" size={24} />
                          <h3 className="text-2xl font-display font-black text-white uppercase tracking-wider">Prime Directive</h3>
                      </div>
                      <button onClick={addAction} className="text-xs bg-indigo-600 text-white font-bold px-4 py-2 rounded hover:bg-indigo-500 transition-all">
                          + ADD TARGET
                      </button>
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                      {dailyActions.filter(a => a.status !== 'Completed').map((frog) => (
                          <div key={frog.id} className="bg-slate-900/80 border border-gray-700/50 p-4 rounded-lg flex flex-col gap-2 group hover:border-indigo-500 transition-all shadow-lg">
                              <div className="flex items-center gap-4">
                                  <input 
                                      type="checkbox" 
                                      checked={frog.status === 'Completed'} 
                                      onChange={() => toggleAction(frog.id)} 
                                      className="h-6 w-6 accent-indigo-500 bg-black border-gray-600 rounded cursor-pointer"
                                  />
                                  <input 
                                      value={frog.task} 
                                      onChange={(e) => updateAction(frog.id, 'task', e.target.value)}
                                      placeholder="Identify Critical Task..."
                                      className={`bg-transparent outline-none flex-1 font-bold text-lg ${frog.status === 'Completed' ? 'text-gray-500 line-through' : 'text-white'}`}
                                  />
                                  <button onClick={() => deleteAction(frog.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                              </div>
                          </div>
                      ))}
                      {dailyActions.filter(a => a.status !== 'Completed').length === 0 && <p className="text-center text-gray-500 italic py-8">No active targets. Set your sights.</p>}
                  </div>
                  
                  {/* Background Noise */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
              </div>
              
              <div className="text-center text-gray-500 text-xs font-mono uppercase tracking-widest animate-pulse">
                  Distractions Eliminated. Execute.
              </div>
          </div>
      ) : (
          /* STANDARD DASHBOARD LAYOUT */
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 2. THE MATRIX (CHECKLISTS) - TABBED INTERFACE */}
                <div className="lg:col-span-2 glass-panel rounded-lg overflow-hidden border-t border-white/5 flex flex-col">
                    <div className="flex border-b border-white/5 bg-black/40">
                        <button onClick={() => setActiveProtocolTab('MORNING')} className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeProtocolTab === 'MORNING' ? 'text-amber-500 bg-amber-900/10 border-b-2 border-amber-500' : 'text-gray-500 hover:text-white'}`}><Sun size={14}/> Morning</button>
                        <button onClick={() => setActiveProtocolTab('DAYTIME')} className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeProtocolTab === 'DAYTIME' ? 'text-blue-500 bg-blue-900/10 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}><Activity size={14}/> Daytime</button>
                        <button onClick={() => setActiveProtocolTab('MINDSET')} className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeProtocolTab === 'MINDSET' ? 'text-purple-500 bg-purple-900/10 border-b-2 border-purple-500' : 'text-gray-500 hover:text-white'}`}><Brain size={14}/> Mindset</button>
                        <button onClick={() => setActiveProtocolTab('FINANCE')} className={`flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 transition-all ${activeProtocolTab === 'FINANCE' ? 'text-emerald-500 bg-emerald-900/10 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-white'}`}><Wallet size={14}/> Finance</button>
                    </div>
                    <div className="flex-1 bg-black/20 relative min-h-[300px]">
                        {activeProtocolTab === 'MORNING' && renderChecklist(MORNING_PROTOCOL, 'morning')}
                        {activeProtocolTab === 'DAYTIME' && renderChecklist(DAYTIME_PROTOCOL, 'daytime')}
                        {activeProtocolTab === 'MINDSET' && renderChecklist(MASCULINE_MINDSET_CHECKLIST, 'mindset')}
                        {activeProtocolTab === 'FINANCE' && renderChecklist(FINANCIAL_DISCIPLINE_CHECKLIST, 'finance')}
                        
                        {/* Progress Bar */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-800">
                            <div 
                                className={`h-full transition-all duration-500 ${
                                    activeProtocolTab === 'MORNING' ? 'bg-amber-500' : 
                                    activeProtocolTab === 'DAYTIME' ? 'bg-blue-500' : 
                                    activeProtocolTab === 'MINDSET' ? 'bg-purple-500' : 'bg-emerald-500'
                                }`}
                                style={{
                                    width: `${calculateProgress(
                                        activeProtocolTab === 'MORNING' ? checklists?.morning : 
                                        activeProtocolTab === 'DAYTIME' ? checklists?.daytime : 
                                        activeProtocolTab === 'MINDSET' ? checklists?.mindset : checklists?.finance, 
                                        activeProtocolTab === 'MORNING' ? MORNING_PROTOCOL.length : 
                                        activeProtocolTab === 'DAYTIME' ? DAYTIME_PROTOCOL.length : 
                                        activeProtocolTab === 'MINDSET' ? MASCULINE_MINDSET_CHECKLIST.length : FINANCIAL_DISCIPLINE_CHECKLIST.length
                                    )}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* 3. RADAR CHART */}
                <div className="glass-panel rounded-xl p-2 flex flex-col items-center justify-center shadow-lg relative h-64 lg:h-auto border-t border-white/10">
                    <div className="absolute top-3 left-4">
                        <p className="text-[10px] text-gray-400 uppercase font-bold flex items-center gap-1 tracking-widest">
                            <Activity size={10} className="text-electric-blue"/> Bio-Stats
                        </p>
                    </div>
                    <LifeRadar data={radarData} />
                </div>
            </div>
            
            {/* 4. RULES OF ENGAGEMENT (COLLAPSIBLE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-panel rounded-lg overflow-hidden border-t border-white/5">
                    <button onClick={() => setShowPowerRules(!showPowerRules)} className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                        <h3 className="text-sm font-display font-bold text-gray-200 uppercase flex items-center gap-2">
                            <Shield size={16} className="text-gold text-glow-gold"/> 13 Rules of Power
                        </h3>
                        {showPowerRules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {showPowerRules && (
                        <div className="p-4 space-y-2 bg-black/40 animate-in slide-in-from-top-2 border-t border-white/5">
                            {RULES_OF_POWER_13.map((rule, idx) => (
                                <p key={idx} className="text-xs text-gray-400 border-b border-gray-800 pb-1 last:border-0 font-mono">{rule}</p>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-panel rounded-lg overflow-hidden border-t border-white/5">
                    <button onClick={() => setShowAttractRules(!showAttractRules)} className="w-full p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                        <h3 className="text-sm font-display font-bold text-gray-200 uppercase flex items-center gap-2">
                            <Target size={16} className="text-spartan-red text-glow-red"/> 7 Rules of Attraction
                        </h3>
                        {showAttractRules ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {showAttractRules && (
                        <div className="p-4 space-y-2 bg-black/40 animate-in slide-in-from-top-2 border-t border-white/5">
                            {RULES_OF_ATTRACTION_7.map((rule, idx) => (
                                <p key={idx} className="text-xs text-gray-400 border-b border-gray-800 pb-1 last:border-0 font-mono">{rule}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 5. STRATEGIC OBJECTIVES (Mission Control) */}
            <div className="glass-panel rounded-lg p-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-display font-bold text-white uppercase flex items-center gap-2">
                        <List size={18} className="text-electric-blue" /> Mission Control
                    </h3>
                    <button onClick={addNewObj} className="text-xs bg-electric-blue/20 text-electric-blue px-3 py-1 rounded border border-electric-blue/50 hover:bg-electric-blue/30 flex items-center gap-1 font-bold transition-colors">
                        <Plus size={12}/> ADD GOAL
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                                <th className="p-3">Category</th>
                                <th className="p-3">Mission</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3 text-center">Prog %</th>
                                <th className="p-3">Intel / Notes</th>
                                <th className="p-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs">
                            {objectives.map(obj => (
                                <tr key={obj.id} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors group">
                                    {editingObjId === obj.id ? (
                                        <>
                                            <td className="p-2"><input value={editForm?.category} onChange={e => setEditForm(prev => prev ? {...prev, category: e.target.value} : null)} className="bg-black border border-gray-700 text-white w-full p-1 rounded font-mono"/></td>
                                            <td className="p-2"><input value={editForm?.task} onChange={e => setEditForm(prev => prev ? {...prev, task: e.target.value} : null)} className="bg-black border border-gray-700 text-white w-full p-1 rounded font-mono"/></td>
                                            <td className="p-2">
                                                <select value={editForm?.status} onChange={e => setEditForm(prev => prev ? {...prev, status: e.target.value} : null)} className="bg-black border border-gray-700 text-white w-full p-1 rounded font-mono">
                                                    <option>Not Started</option><option>In Progress</option><option>Completed</option>
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <select value={editForm?.priority} onChange={e => setEditForm(prev => prev ? {...prev, priority: e.target.value} : null)} className="bg-black border border-gray-700 text-white w-full p-1 rounded font-mono">
                                                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                                                </select>
                                            </td>
                                            <td className="p-2"><input type="date" value={editForm?.dueDate} onChange={e => setEditForm(prev => prev ? {...prev, dueDate: e.target.value} : null)} className="bg-black border border-gray-700 text-white w-full p-1 rounded font-mono"/></td>
                                            <td className="p-2"><input type="number" value={editForm?.progress} onChange={e => setEditForm(prev => prev ? {...prev, progress: parseInt(e.target.value)} : null)} className="bg-black border border-gray-700 text-white w-full p-1 rounded text-center font-mono"/></td>
                                            <td className="p-2"><input value={editForm?.notes} onChange={e => setEditForm(prev => prev ? {...prev, notes: e.target.value} : null)} className="bg-black border border-gray-700 text-white w-full p-1 rounded font-mono"/></td>
                                            <td className="p-2 text-right flex justify-end gap-1">
                                                <button onClick={saveObj} className="text-wealth-green hover:text-green-400 p-1"><Save size={14}/></button>
                                                <button onClick={() => setEditingObjId(null)} className="text-gray-500 hover:text-white p-1"><X size={14}/></button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="p-3 font-bold text-gray-400 font-mono tracking-tight">{obj.category}</td>
                                            <td className="p-3 text-white font-medium">{obj.task}</td>
                                            <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${obj.status === 'Completed' ? 'bg-green-900/20 border-green-900 text-wealth-green' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}>{obj.status}</span></td>
                                            <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${obj.priority === 'High' || obj.priority === 'Critical' ? 'bg-red-900/20 border-red-900 text-spartan-red' : 'bg-gray-800/50 border-gray-700 text-gray-400'}`}>{obj.priority}</span></td>
                                            <td className="p-3 text-gray-500 font-mono text-[10px]">{obj.dueDate || '-'}</td>
                                            <td className="p-3 text-center">
                                                <div className="w-12 bg-gray-800 h-1.5 rounded-full overflow-hidden mx-auto">
                                                    <div className="bg-electric-blue h-full" style={{width: `${obj.progress}%`}}></div>
                                                </div>
                                                <span className="text-[9px] text-gray-500">{obj.progress}%</span>
                                            </td>
                                            <td className="p-3 text-gray-500 truncate max-w-[150px] font-mono text-[10px]">{obj.notes}</td>
                                            <td className="p-3 text-right">
                                                <button onClick={() => handleEditObj(obj)} className="text-gray-600 hover:text-electric-blue p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={12}/></button>
                                                <button onClick={() => deleteObj(obj.id)} className="text-gray-600 hover:text-spartan-red p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 6. DAILY ACTION & FOCUS JOURNAL (New Implementation) */}
            <div className="bg-black/60 border border-spartan-red/30 rounded-lg p-6 relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.1)]">
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="text-xl font-display font-black text-white uppercase flex items-center gap-2">
                            <AlertCircle className="text-spartan-red animate-pulse" /> Daily Action & Focus Journal
                        </h3>
                        <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Today's Tactical Execution - Eat That Frog</p>
                    </div>
                    <button onClick={addAction} className="text-xs bg-spartan-red text-white font-bold px-4 py-2 rounded hover:bg-red-600 shadow-lg shadow-red-900/20 transition-all flex items-center gap-1">
                        <Plus size={12}/> ADD ENTRY
                    </button>
                </div>
                
                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left text-xs text-gray-400">
                        <thead className="bg-slate-900/50 uppercase font-bold text-[10px] tracking-wider text-gray-500">
                            <tr>
                                <th className="p-3">Category</th>
                                <th className="p-3">Task / Habit</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3">Priority</th>
                                <th className="p-3 text-center">Progress</th>
                                <th className="p-3">Notes / Outcome</th>
                                <th className="p-3 text-right">Cmd</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/50">
                            {dailyActions.map((action) => (
                                <tr key={action.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-3">
                                        <input 
                                            value={action.category} 
                                            onChange={(e) => updateAction(action.id, 'category', e.target.value)}
                                            className="bg-transparent text-gray-400 font-bold uppercase text-[10px] outline-none w-full"
                                            placeholder="CATEGORY"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            value={action.task} 
                                            onChange={(e) => updateAction(action.id, 'task', e.target.value)}
                                            className={`bg-transparent text-white font-bold outline-none w-full ${action.status === 'Completed' ? 'line-through text-gray-500' : ''}`}
                                            placeholder="Task Name..."
                                        />
                                    </td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => toggleAction(action.id)} className={`px-2 py-1 rounded text-[10px] font-bold border ${action.status === 'Completed' ? 'bg-green-900/20 text-green-500 border-green-900' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                            {action.status === 'Completed' ? 'COMPLETED' : 'PENDING'}
                                        </button>
                                    </td>
                                    <td className="p-3">
                                        <select 
                                            value={action.priority}
                                            onChange={(e) => updateAction(action.id, 'priority', e.target.value)}
                                            className="bg-black border border-gray-800 text-gray-300 rounded px-2 py-1 outline-none text-[10px] uppercase font-bold"
                                        >
                                            <option>Medium</option><option>High</option><option>Critical</option>
                                        </select>
                                    </td>
                                    <td className="p-3 text-center">
                                        <input 
                                            type="number" 
                                            value={action.progress} 
                                            onChange={(e) => updateAction(action.id, 'progress', parseInt(e.target.value))}
                                            className="bg-black border border-gray-800 text-white w-12 text-center rounded outline-none"
                                        />
                                        <span className="ml-1">%</span>
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            value={action.notes} 
                                            onChange={(e) => updateAction(action.id, 'notes', e.target.value)}
                                            className="bg-transparent text-gray-500 w-full outline-none"
                                            placeholder="Notes..."
                                        />
                                    </td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => deleteAction(action.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {dailyActions.length === 0 && <div className="text-center py-8 text-gray-600 italic text-xs">No daily actions logged. Plan your day.</div>}
                </div>
            </div>

            {/* 7. NIGHT PROTOCOL */}
            <div className="glass-panel rounded-lg p-6 border-t border-white/5 mt-6">
                <div className="flex items-center gap-2 mb-4">
                    <Moon className="text-electric-blue" />
                    <h3 className="text-xl font-display font-black text-white uppercase">Night Protocol (Tomorrow's Plan)</h3>
                </div>
                <p className="text-xs text-gray-500 mb-2 font-mono">Write tomorrow's To-Do list before sleeping. Clear your mind.</p>
                <textarea 
                    value={tomorrowPlan}
                    onChange={(e) => setTomorrowPlan(e.target.value)}
                    placeholder="1. Wake up 6 AM...&#10;2. Complete Electronics Chapter...&#10;3. Gym Leg Day..."
                    className="w-full h-40 bg-black/50 border border-gray-700 rounded p-4 text-gray-300 font-mono text-sm leading-relaxed focus:border-electric-blue outline-none resize-none"
                />
            </div>
          </>
      )}
    </div>
  );
};
