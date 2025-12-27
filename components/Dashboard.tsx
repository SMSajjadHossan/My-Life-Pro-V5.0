
import React, { useMemo, useState } from 'react';
import { UserProfile, Habit, FinancialState, JournalTask, AppSection } from '../types';
import { MORNING_PROTOCOL, DAYTIME_PROTOCOL, RULES_OF_POWER_13 } from '../constants';
import { 
  Shield, Target, Zap, Skull, TrendingUp, Lock, Activity, 
  Flame, DollarSign, Brain, ChevronRight, Clock, AlertTriangle,
  CheckCircle2, Circle, ListChecks, Download, Upload, Calendar,
  Quote, Timer, Swords, Trash2, Edit3, Plus, ShieldCheck,
  CalendarDays, Star, Layers, Save, Terminal
} from 'lucide-react';

interface Props {
  profile: UserProfile;
  habits: Habit[];
  financialData: FinancialState;
  objectives: JournalTask[];
  setObjectives: (objs: JournalTask[]) => void;
  exportSoul: () => void;
  importSoul: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSection: (section: AppSection) => void;
}

export const Dashboard: React.FC<Props> = ({ profile, habits, financialData, objectives, setObjectives, exportSoul, importSoul, setSection }) => {
  const [auditMode, setAuditMode] = useState<'MORNING' | 'NIGHT'>('MORNING');
  const [checkedAuditItems, setCheckedAuditItems] = useState<Set<string>>(new Set());
  const [showObjEditor, setShowObjEditor] = useState(false);
  const [editingObj, setEditingObj] = useState<Partial<JournalTask> | null>(null);

  // Mission Calibration Form State
  const [goalForm, setGoalForm] = useState({
      name: '',
      startDate: '',
      targetDate: '',
      priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
      notes: ''
  });

  const metrics = useMemo(() => {
    const totalLiquid = (Number(financialData.bankA) || 0) + (Number(financialData.bankB) || 0) + (Number(financialData.bankC) || 0);
    const totalAssets = (financialData.assets || []).reduce((a, b) => a + (Number(b.value) || 0), 0);
    const netWorth = totalLiquid + totalAssets;
    const retentionDay = habits.find(h => h.isRetentionHabit)?.streak || 0;
    
    const frogMission = objectives.find(o => o.priority === 'Critical' && o.status !== 'Completed') || 
                       objectives.find(o => o.priority === 'High' && o.status !== 'Completed');
    
    const countdowns = objectives
      .map(obj => {
        const diff = new Date(obj.dueDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        
        let expiryDateStr = 'PERMANENT';
        if (obj.status === 'Completed' && obj.validityYears) {
            const completedOn = obj.completionDate ? new Date(obj.completionDate) : new Date();
            const expiry = new Date(completedOn);
            expiry.setFullYear(expiry.getFullYear() + obj.validityYears);
            expiryDateStr = expiry.toLocaleDateString();
        }

        return { ...obj, daysRemaining: days, expiryDateStr };
      })
      .sort((a, b) => (a.status === 'Completed' ? 1 : -1) || a.daysRemaining - b.daysRemaining);

    const randomWisdom = RULES_OF_POWER_13[Math.floor(Math.random() * RULES_OF_POWER_13.length)];

    return { netWorth, retentionDay, frogMission, countdowns, randomWisdom };
  }, [financialData, habits, objectives]);

  const toggleAuditItem = (item: string) => {
    const newSet = new Set(checkedAuditItems);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setCheckedAuditItems(newSet);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalForm.name || !goalForm.targetDate) {
        alert("MISSION FAILURE: Directive Name and Target Date are non-negotiable.");
        return;
    }

    const newObjective: JournalTask = {
        id: Date.now().toString(),
        category: 'Bio-Strategic',
        task: goalForm.name,
        status: 'Not Started',
        priority: goalForm.priority,
        progress: 0,
        notes: `INITIALIZED: ${goalForm.startDate || 'NOW'}\nNOTES: ${goalForm.notes}`,
        dueDate: goalForm.targetDate + 'T23:59:59',
    };

    setObjectives([...objectives, newObjective]);
    setGoalForm({ name: '', startDate: '', targetDate: '', priority: 'Medium', notes: '' });
    alert("STRATEGIC VECTOR ADDED: Mission committed to the Sovereign Soul.");
  };

  const updateObjectiveStatus = (id: string) => {
    setObjectives(objectives.map(o => {
        if (o.id === id) {
            const isNowCompleted = o.status !== 'Completed';
            return { 
                ...o, 
                status: isNowCompleted ? 'Completed' : 'Pending',
                completionDate: isNowCompleted ? new Date().toISOString() : undefined
            };
        }
        return o;
    }));
  };

  const deleteObjective = (id: string) => {
    if (window.confirm("Authorize Deletion of Mission Vector?")) {
        setObjectives(objectives.filter(o => o.id !== id));
    }
  };

  const handleSaveObjective = () => {
    if (!editingObj?.task || !editingObj?.dueDate) return;
    
    if (editingObj.id) {
        setObjectives(objectives.map(o => o.id === editingObj.id ? { ...o, ...editingObj } as JournalTask : o));
    } else {
        const newObj: JournalTask = {
            id: Date.now().toString(),
            category: 'Strategic',
            task: editingObj.task!,
            status: 'Not Started',
            priority: editingObj.priority || 'Medium',
            progress: 0,
            notes: editingObj.notes || '',
            dueDate: editingObj.dueDate!,
            validityYears: editingObj.validityYears || 0,
            reminderDays: editingObj.reminderDays || 60
        };
        setObjectives([...objectives, newObj]);
    }
    setShowObjEditor(false);
    setEditingObj(null);
  };

  const currentProtocol = auditMode === 'MORNING' ? MORNING_PROTOCOL : DAYTIME_PROTOCOL;
  const auditProgress = (checkedAuditItems.size / currentProtocol.length) * 100;
  const blurClass = financialData.isStealthMode ? 'blur-2xl select-none' : '';

  return (
    <div className="space-y-12 pb-32">
      {/* IDENTITY HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3 glass-panel p-8 lg:p-16 rounded-[4rem] lg:rounded-[5rem] relative overflow-hidden group border border-white/5 shadow-4xl">
              <div className="absolute -top-40 -right-40 opacity-[0.02] group-hover:scale-110 transition-transform duration-[8s]"><Shield size={1000} className="text-white"/></div>
              <div className="relative z-10 flex flex-col xl:flex-row items-center gap-10 lg:gap-16">
                  <div className="relative">
                      <div className="w-44 h-44 lg:w-56 lg:h-56 bg-black border-[8px] lg:border-[10px] border-spartan-red/20 rounded-[3.5rem] lg:rounded-[4.5rem] flex items-center justify-center shadow-5xl relative overflow-hidden group-hover:border-spartan-red/40 transition-colors">
                          <Skull size={72} className="text-white animate-pulse drop-shadow-[0_0_30px_rgba(255,42,42,0.8)] lg:w-24 lg:h-24" />
                          <div className="absolute inset-0 bg-gradient-to-t from-spartan-red/30 via-transparent to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-spartan-red text-black text-[10px] lg:text-[12px] font-black px-6 lg:px-8 py-2 lg:py-3 rounded-full uppercase tracking-[0.4em] italic border-4 lg:border-8 border-obsidian whitespace-nowrap shadow-2xl">RANK: {profile.rank}</div>
                  </div>
                  <div className="flex-1 space-y-6 lg:space-y-8 text-center xl:text-left">
                      <div className="flex flex-col xl:flex-row items-center gap-6 lg:gap-8">
                          <h1 className="text-4xl lg:text-7xl font-display font-black text-white uppercase italic tracking-tighter text-glow-red leading-none drop-shadow-2xl">{profile.name}</h1>
                          <div className="px-6 lg:px-8 py-2 lg:py-3 bg-white/5 border border-white/10 rounded-full text-[11px] lg:text-[13px] font-mono font-black text-gray-500 uppercase tracking-widest shadow-inner">TITAN LEVEL {profile.level}</div>
                      </div>
                      <p className="text-sm lg:text-xl text-gray-400 font-mono tracking-widest uppercase italic max-w-4xl leading-relaxed border-l-4 border-spartan-red/60 pl-6 lg:pl-10 ml-0 lg:ml-4 drop-shadow-md">
                        "{profile.missionStatement}"
                      </p>
                      <div className="flex flex-wrap gap-4 lg:gap-6 pt-4 lg:pt-6 justify-center xl:justify-start">
                          <button onClick={exportSoul} className="flex items-center gap-3 lg:gap-4 px-8 lg:px-12 py-3 lg:py-5 bg-white/5 border border-white/10 rounded-[1.5rem] lg:rounded-[2rem] text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-3xl active:scale-95">
                            <Download size={18}/> BACKUP
                          </button>
                          <label className="flex items-center gap-3 lg:gap-4 px-8 lg:px-12 py-3 lg:py-5 bg-white/5 border border-white/10 rounded-[1.5rem] lg:rounded-[2rem] text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white/10 text-gray-500 hover:text-white transition-all cursor-pointer shadow-3xl">
                            <Upload size={18}/> RESTORE
                            <input type="file" className="hidden" onChange={importSoul} accept=".json" />
                          </label>
                      </div>
                  </div>
              </div>
          </div>

          <div className="glass-panel p-10 lg:p-12 rounded-[3.5rem] lg:rounded-[5rem] bg-gradient-to-br from-wealth-green/20 via-black/40 to-black/60 border border-wealth-green/30 flex flex-col justify-between shadow-5xl group overflow-hidden relative">
              <div className="absolute -top-10 -right-10 opacity-[0.05] group-hover:rotate-12 transition-transform duration-1000"><DollarSign size={200} className="text-wealth-green"/></div>
              <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] lg:text-[12px] font-black text-gray-500 uppercase tracking-[0.6em]">Net_Worth_Apex</p>
                    <div className="p-3 bg-wealth-green/20 rounded-[1.2rem] text-wealth-green group-hover:scale-110 transition-transform"><TrendingUp size={24}/></div>
                  </div>
                  <h2 className={`text-4xl lg:text-6xl font-mono font-black text-white text-glow-green tracking-tighter ${blurClass}`}>৳{metrics.netWorth.toLocaleString()}</h2>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-2.5 h-2.5 rounded-full bg-wealth-green animate-pulse shadow-[0_0_10px_rgba(0,230,118,1)]"></div>
                    <span className="text-[10px] lg:text-[11px] font-black text-wealth-green uppercase tracking-[0.4em]">COMPOUND_ENGINE: ACTIVE</span>
                  </div>
              </div>
              <div className="pt-10 lg:pt-16 space-y-4 relative z-10">
                  <div className="flex justify-between items-center p-5 bg-black/60 rounded-[2rem] border border-white/5 hover:border-spartan-red/40 transition-all shadow-inner">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Activity size={16}/> Retention</span>
                      <span className="text-2xl font-mono font-black text-spartan-red drop-shadow-[0_0_15px_rgba(255,42,42,0.6)]">{metrics.retentionDay}D</span>
                  </div>
                  <div className="flex justify-between items-center p-5 bg-black/60 rounded-[2rem] border border-white/5 hover:border-cyber-purple/40 transition-all shadow-inner">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Target size={16}/> Frontiers</span>
                      <span className="text-2xl font-mono font-black text-cyber-purple">{objectives.filter(o => o.status !== 'Completed').length}</span>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* DAILY AUDIT (COL 4) */}
          <div className="lg:col-span-4 glass-panel p-10 rounded-[4rem] bg-black/40 border border-white/5 shadow-5xl flex flex-col h-full overflow-hidden relative min-h-[600px]">
                <div className="absolute -bottom-20 -left-20 opacity-[0.02]"><ListChecks size={400} className="text-cyber-purple"/></div>
                <div className="flex justify-between items-center mb-10 relative z-10">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.6em] flex items-center gap-4"><ListChecks size={24} className="text-cyber-purple"/> PROTOCOL_AUDIT</h3>
                    <div className="flex bg-black/60 rounded-[1.5rem] p-1.5 border border-white/10 shadow-inner">
                        <button onClick={() => setAuditMode('MORNING')} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${auditMode === 'MORNING' ? 'bg-cyber-purple text-white shadow-xl' : 'text-gray-600 hover:text-white'}`}>AM</button>
                        <button onClick={() => setAuditMode('NIGHT')} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${auditMode === 'NIGHT' ? 'bg-spartan-red text-white shadow-xl' : 'text-gray-600 hover:text-white'}`}>PM</button>
                    </div>
                </div>
                <div className="mb-8 relative z-10">
                  <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-3">
                    <span>Integrity_Status</span>
                    <span>{Math.round(auditProgress)}%</span>
                  </div>
                  <div className="h-2.5 bg-obsidian rounded-full overflow-hidden border border-white/5 p-0.5">
                    <div className={`h-full transition-all duration-1000 rounded-full shadow-lg ${auditMode === 'MORNING' ? 'bg-cyber-purple' : 'bg-spartan-red'}`} style={{ width: `${auditProgress}%` }}></div>
                  </div>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-3 relative z-10">
                    {currentProtocol.map(item => (
                        <div key={item} onClick={() => toggleAuditItem(item)} className={`p-6 rounded-[2rem] border flex items-center gap-5 transition-all cursor-pointer group ${checkedAuditItems.has(item) ? 'bg-white/5 border-white/5 opacity-40 translate-x-2' : 'bg-black border-white/10 hover:border-white/30 shadow-2xl'}`}>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-inner ${checkedAuditItems.has(item) ? 'bg-wealth-green text-black' : 'bg-white/5 text-gray-700 group-hover:text-white'}`}>
                              {checkedAuditItems.has(item) ? <CheckCircle2 size={18}/> : <Circle size={18}/>}
                            </div>
                            <p className="text-[13px] font-bold text-gray-200 tracking-tight leading-snug">{item}</p>
                        </div>
                    ))}
                </div>
          </div>

          <div className="lg:col-span-8 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* TITAN FOCUS VECTOR (COL 4 in nested) */}
                  <div className="glass-panel p-10 rounded-[4rem] bg-gradient-to-br from-spartan-red/10 via-black/40 to-black/60 border border-spartan-red/30 flex flex-col justify-between min-h-[450px] group shadow-5xl relative overflow-hidden">
                      <div className="absolute -bottom-20 -right-20 opacity-[0.08] group-hover:scale-110 transition-transform duration-[5s]"><Skull size={300} className="text-spartan-red" /></div>
                      <div className="space-y-8 relative z-10">
                          <div className="flex items-center gap-4">
                              <div className="p-4 bg-spartan-red text-black rounded-[1.5rem] shadow-2xl animate-pulse"><Swords size={24}/></div>
                              <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em]">TITAN_FOCUS_VECTOR</h3>
                          </div>
                          {metrics.frogMission ? (
                            <div className="space-y-6">
                              <p className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-tight text-glow-red group-hover:translate-x-3 transition-transform duration-700">
                                {metrics.frogMission.task}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500 font-mono uppercase tracking-[0.2em] border-l-4 border-spartan-red/40 pl-6 py-1">
                                 <Clock size={16}/> DEPTH_REQUIRED
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-16 opacity-30">
                              <p className="text-lg text-gray-600 font-mono italic uppercase tracking-[0.4em]">NO_TARGETS</p>
                            </div>
                          )}
                      </div>
                      <button onClick={() => setSection(AppSection.ACADEMY)} className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.6em] rounded-[2rem] text-sm shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-[1.03] active:scale-95 transition-all relative z-10">
                        ENGAGE_FOCUS
                      </button>
                  </div>

                  {/* MISSION CALIBRATION FORM (COL 4 in nested) */}
                  <div className="glass-panel p-10 rounded-[4rem] bg-gradient-to-br from-cyber-purple/10 via-black/40 to-black/60 border border-cyber-purple/30 flex flex-col shadow-5xl relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none"><Target size={300} className="text-cyber-purple" /></div>
                      <div className="flex items-center gap-4 mb-8">
                          <div className="p-4 bg-cyber-purple/20 text-cyber-purple rounded-[1.5rem] shadow-2xl"><Target size={24}/></div>
                          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em]">MISSION_CALIBRATION</h3>
                      </div>
                      <form onSubmit={handleGoalSubmit} className="space-y-4 relative z-10">
                          <input 
                            type="text" value={goalForm.name} placeholder="Directive Name (e.g. GRE QUANT)" 
                            onChange={e => setGoalForm({...goalForm, name: e.target.value})}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-xs font-mono font-black text-white outline-none focus:border-cyber-purple shadow-inner"
                          />
                          <div className="grid grid-cols-2 gap-4">
                              <input 
                                type="date" value={goalForm.targetDate}
                                onChange={e => setGoalForm({...goalForm, targetDate: e.target.value})}
                                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-[10px] font-mono font-black text-gray-400 outline-none focus:border-cyber-purple"
                              />
                              <select 
                                value={goalForm.priority}
                                onChange={e => setGoalForm({...goalForm, priority: e.target.value as any})}
                                className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-[10px] font-mono font-black text-gray-400 outline-none focus:border-cyber-purple"
                              >
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High</option>
                                  <option value="Critical">Critical</option>
                              </select>
                          </div>
                          <textarea 
                            value={goalForm.notes} placeholder="Tactical Notes..." 
                            onChange={e => setGoalForm({...goalForm, notes: e.target.value})}
                            className="w-full bg-black/60 border border-white/10 rounded-2xl p-4 text-[10px] font-mono font-black text-gray-500 outline-none focus:border-cyber-purple h-20 resize-none shadow-inner"
                          />
                          <button type="submit" className="w-full py-4 bg-cyber-purple text-white font-black uppercase tracking-[0.4em] rounded-[1.5rem] text-[10px] shadow-3xl hover:scale-105 transition-all">
                              AUTHORIZE_VECTOR
                          </button>
                      </form>
                  </div>
              </div>

              {/* TIMELINE DEADLINES (FULL WIDTH OF SECTION) */}
              <div className="glass-panel p-10 rounded-[4rem] border border-white/5 bg-black/40 min-h-[450px] shadow-5xl relative overflow-hidden group">
                  <div className="absolute -top-20 -right-20 opacity-[0.05] group-hover:rotate-12 transition-transform duration-[3s]"><Calendar size={300} className="text-gold" /></div>
                  <div className="flex justify-between items-center mb-8 relative z-10">
                      <div className="flex items-center gap-4">
                          <div className="p-4 bg-gold/20 text-gold rounded-[1.5rem] shadow-2xl"><Timer size={24}/></div>
                          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em]">TIMELINE_DEADLINES</h3>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 overflow-y-auto custom-scrollbar h-[350px] pr-2">
                      {metrics.countdowns.length > 0 ? metrics.countdowns.map((c) => {
                          const isNear = c.daysRemaining > 0 && c.daysRemaining <= (c.reminderDays || 60);
                          return (
                            <div key={c.id} className={`flex justify-between items-center p-6 bg-black/60 border rounded-[2rem] transition-all group/item shadow-inner relative overflow-hidden ${c.status === 'Completed' ? 'border-wealth-green/30 opacity-60' : isNear ? 'border-spartan-red/40' : 'border-white/5 hover:border-gold/40'}`}>
                                <div className="flex flex-col gap-1 relative z-10 max-w-[65%]">
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[14px] font-black uppercase tracking-tight line-clamp-1 ${c.status === 'Completed' ? 'text-wealth-green line-through' : 'text-white'}`}>{c.task}</span>
                                        {c.status === 'Completed' && <ShieldCheck size={14} className="text-wealth-green"/>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${c.priority === 'Critical' ? 'text-spartan-red' : 'text-gray-600'}`}>{c.priority} Vector</span>
                                        {c.status === 'Completed' && (
                                            <span className="text-[8px] font-mono text-gold uppercase px-2 py-0.5 bg-gold/10 rounded-full border border-gold/20">Valid Until: {c.expiryDateStr}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end relative z-10">
                                    <div className="flex gap-1.5 mb-2">
                                        <button onClick={() => updateObjectiveStatus(c.id)} className={`p-1.5 rounded-lg transition-all ${c.status === 'Completed' ? 'bg-wealth-green text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}><CheckCircle2 size={14}/></button>
                                        <button onClick={() => { setEditingObj(c); setShowObjEditor(true); }} className="p-1.5 bg-white/5 rounded-lg text-gray-500 hover:text-white"><Edit3 size={14}/></button>
                                        <button onClick={() => deleteObjective(c.id)} className="p-1.5 bg-white/5 rounded-lg text-gray-500 hover:text-spartan-red"><Trash2 size={14}/></button>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xl font-mono font-black ${c.daysRemaining < 0 ? 'text-gray-700' : isNear ? 'text-spartan-red animate-pulse' : 'text-white'}`}>{c.daysRemaining}D</span>
                                        <p className="text-[7px] text-gray-700 font-black uppercase tracking-widest">T_MINUS</p>
                                    </div>
                                </div>
                            </div>
                          );
                      }) : (
                        <div className="col-span-2 flex flex-col items-center justify-center py-24 opacity-20 italic font-mono text-xs uppercase tracking-[0.5em]">SCANNING_FOR_ACTIVE_FRONT_LINES...</div>
                      )}
                  </div>
              </div>

              {/* TITAN DECREE */}
              <div className="glass-panel p-10 rounded-[4rem] bg-gradient-to-r from-cyber-purple/20 via-black/60 to-black/20 border border-white/5 relative overflow-hidden shadow-5xl group">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-150 transition-transform duration-[15s]"><Quote size={300} className="text-white"/></div>
                  <div className="relative z-10 flex flex-col xl:flex-row items-center gap-8">
                      <div className="p-6 bg-cyber-purple/30 text-cyber-purple rounded-[2.5rem] border border-cyber-purple/40 shadow-4xl group-hover:rotate-[360deg] transition-transform duration-[1s]">
                        <Brain size={48}/>
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em] flex items-center gap-3">TITAN_DECREE</h3>
                        <p className="text-2xl font-display font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl group-hover:text-glow-purple transition-all">
                          {metrics.randomWisdom}
                        </p>
                      </div>
                      <button onClick={() => setSection(AppSection.ACADEMY)} className="p-5 bg-white/5 hover:bg-white/10 rounded-[2rem] border border-white/10 text-gray-400 hover:text-white transition-all shadow-4xl hover:scale-110 active:scale-95">
                        <ChevronRight size={28}/>
                      </button>
                  </div>
              </div>
          </div>
      </div>

      {/* OBJECTIVE EDITOR MODAL */}
      {showObjEditor && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in">
              <div className="glass-panel w-full max-w-2xl p-10 lg:p-16 rounded-[3.5rem] lg:rounded-[4rem] border border-white/10 shadow-5xl relative">
                  <h3 className="text-2xl lg:text-3xl font-display font-black text-white uppercase italic tracking-tighter mb-8 lg:mb-12">MISSION_VECTOR <span className="text-gold">CALIBRATION</span></h3>
                  <div className="space-y-8 lg:space-y-10">
                      <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Mission Directive Name</label>
                          <input value={editingObj?.task || ''} onChange={e => setEditingObj({...editingObj, task: e.target.value})} placeholder="e.g. GRE QUANT MASTER EXAM" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-mono text-sm outline-none focus:border-gold shadow-inner" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Deadline</label>
                              <input type="date" value={editingObj?.dueDate?.split('T')[0] || ''} onChange={e => setEditingObj({...editingObj, dueDate: e.target.value + 'T00:00:00'})} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-mono text-xs outline-none focus:border-gold shadow-inner" />
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Priority Phase</label>
                              <select value={editingObj?.priority || 'Medium'} onChange={e => setEditingObj({...editingObj, priority: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-mono text-xs outline-none focus:border-gold shadow-inner">
                                  <option value="Low">Low Priority</option>
                                  <option value="Medium">Standard Mission</option>
                                  <option value="High">High Depth Focus</option>
                                  <option value="Critical">FRONT_LINE (Frog)</option>
                              </select>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 lg:gap-8">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Validity (Years)</label>
                              <input type="number" value={editingObj?.validityYears || ''} onChange={e => setEditingObj({...editingObj, validityYears: Number(e.target.value)})} placeholder="e.g. 5 for GRE" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-mono text-sm outline-none shadow-inner" />
                          </div>
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reminder Lead (Days)</label>
                              <input type="number" value={editingObj?.reminderDays || ''} onChange={e => setEditingObj({...editingObj, reminderDays: Number(e.target.value)})} placeholder="e.g. 60" className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-mono text-sm outline-none shadow-inner" />
                          </div>
                      </div>
                      <div className="flex gap-4 lg:gap-6 pt-4">
                          <button onClick={handleSaveObjective} className="flex-1 py-5 bg-gold text-black font-black uppercase tracking-[0.4em] rounded-[2.2rem] text-[11px] shadow-3xl hover:scale-105 transition-all">ENGAGE MISSION</button>
                          <button onClick={() => { setShowObjEditor(false); setEditingObj(null); }} className="px-8 lg:px-10 py-5 bg-white/5 border border-white/10 rounded-[2.2rem] text-gray-500 font-black uppercase tracking-widest text-[11px] hover:text-white transition-all">ABORT</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
