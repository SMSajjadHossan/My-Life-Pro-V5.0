
import React, { useMemo, useState, useEffect } from 'react';
import { Habit, UserProfile, SpartanDayPlan, JournalTask } from '../types';
import { 
  RETENTION_PHASES, 
  SPARTAN_MASTER_CYCLE, 
  MORNING_PROTOCOL, 
  DAYTIME_PROTOCOL, 
  MASCULINE_MINDSET_CHECKLIST,
  HEALTH_KNOWLEDGE_BASE 
} from '../constants';
import { 
  Skull, Zap, Activity, Dna, Flame, Utensils, 
  Dumbbell, ShieldAlert, CheckCircle2, Circle, Clock, 
  Wind, Moon, Sun, Brain, Heart, ChevronRight, Info, Scale, Ruler, TrendingUp, Target, Calendar, Plus, ListChecks, X, Settings2, BarChart3
} from 'lucide-react';

interface Props {
  habits: Habit[];
  profile: UserProfile;
  toggleHabit: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setHabits: (habits: Habit[]) => void;
  objectives: JournalTask[];
  setObjectives: (objs: JournalTask[]) => void;
}

export const SpartanVessel: React.FC<Props> = ({ habits, profile, toggleHabit, updateProfile, setHabits, objectives, setObjectives }) => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'AUDIT' | 'MISSIONS' | 'PROTOCOLS' | 'KNOWLEDGE'>('OVERVIEW');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedProtocolItems, setCompletedProtocolItems] = useState<Set<string>>(new Set());
  const [detailedHabitId, setDetailedHabitId] = useState<string | null>(null);
  
  const [vitalForm, setVitalForm] = useState({
      weight: profile.weight?.toString() || '',
      bodyFat: profile.bodyFat?.toString() || '',
      sleepHours: profile.sleepHours?.toString() || ''
  });

  const [goalForm, setGoalForm] = useState({
      name: '',
      startDate: '',
      targetDate: '',
      priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
      notes: ''
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const retention = useMemo(() => {
    const habit = habits.find(h => h.isRetentionHabit);
    const day = habit?.streak || 0;
    const phase = [...RETENTION_PHASES].reverse().find(p => day >= p.day) || RETENTION_PHASES[0];
    const nextPhase = RETENTION_PHASES.find(p => p.day > day);
    return { day, phase, nextPhase };
  }, [habits]);

  const todayStr = new Date().toISOString().split('T')[0];
  const today = new Date().getDate();
  const todayPlan: SpartanDayPlan = SPARTAN_MASTER_CYCLE.find(p => p.day === today) || SPARTAN_MASTER_CYCLE[0];

  const circadianStatus = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return { label: 'Peak Alertness', icon: Sun, color: 'text-orange-400' };
    if (hour >= 12 && hour < 17) return { label: 'Metabolic Peak', icon: Activity, color: 'text-wealth-green' };
    if (hour >= 17 && hour < 21) return { label: 'Physical Warfare Window', icon: Flame, color: 'text-spartan-red' };
    return { label: 'Anabolic Recovery', icon: Moon, color: 'text-electric-blue' };
  }, [currentTime]);

  const spartanHabits = habits.filter(h => h.category === 'Health' || h.category === 'Mindset');

  const handleVitalsSubmit = () => {
      const weight = parseFloat(vitalForm.weight);
      const bodyFat = parseFloat(vitalForm.bodyFat);
      const sleepHours = parseFloat(vitalForm.sleepHours);

      if (isNaN(weight) || isNaN(bodyFat) || isNaN(sleepHours)) {
          alert("Biological Input Integrity Failed. Numbers required for all vectors.");
          return;
      }

      let riskScore = 5;
      if (sleepHours < 7) riskScore += 15;
      if (sleepHours < 6) riskScore += 25;
      if (bodyFat > 18) riskScore += 10;
      if (bodyFat > 25) riskScore += 30;

      const criticalHabitFailures = habits.filter(h => ['Retention Protocol', 'Prayers (5x)'].includes(h.name) && h.streak === 0).length;
      riskScore += (criticalHabitFailures * 15);

      updateProfile({ 
        weight, bodyFat, sleepHours,
        systemicRisk: Math.min(100, riskScore)
      });
      alert("Biological State Committed. Neural Triage updated.");
      setActiveSubTab('OVERVIEW');
  };

  const toggleProtocolItem = (item: string) => {
    const newSet = new Set(completedProtocolItems);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setCompletedProtocolItems(newSet);
  };

  const handleGoalSubmit = () => {
    if (!goalForm.name || !goalForm.targetDate) {
      alert("Mission parameters incomplete. Target and Name required.");
      return;
    }

    const newGoal: JournalTask = {
      id: Date.now().toString(),
      category: 'MISSION',
      task: goalForm.name,
      status: 'Not Started',
      priority: goalForm.priority,
      progress: 0,
      notes: goalForm.notes,
      dueDate: goalForm.targetDate + 'T00:00:00',
    };

    setObjectives([...objectives, newGoal]);
    setGoalForm({
      name: '',
      startDate: '',
      targetDate: '',
      priority: 'Medium',
      notes: ''
    });
    alert("Mission Vector Authorized.");
    setActiveSubTab('OVERVIEW');
  };

  const setHabitReminder = (id: string, time: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, reminderTime: time } : h));
  };

  const generateHistoryGrid = (history: string[]) => {
    const grid = [];
    const end = new Date();
    for (let i = 34; i >= 0; i--) {
        const d = new Date();
        d.setDate(end.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        grid.push({
            date: dateStr,
            isDone: history.includes(dateStr),
            isToday: dateStr === todayStr
        });
    }
    return grid;
  };

  const renderProtocols = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-8 duration-700">
        <div className="glass-panel p-10 rounded-[4rem] bg-black/40 border border-white/5 space-y-8 shadow-4xl">
            <h3 className="text-xl font-black text-orange-400 uppercase tracking-[0.4em] flex items-center gap-4"><Sun size={24}/> Morning Sovereignty</h3>
            <div className="space-y-4">
                {MORNING_PROTOCOL.map(p => (
                    <button 
                        key={p} 
                        onClick={() => toggleProtocolItem(p)}
                        className={`w-full p-6 rounded-[2rem] border flex items-center justify-between transition-all ${completedProtocolItems.has(p) ? 'bg-orange-400/10 border-orange-400/40 text-orange-400' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}`}
                    >
                        <span className="text-xs font-black uppercase tracking-widest">{p}</span>
                        {completedProtocolItems.has(p) ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                    </button>
                ))}
            </div>
        </div>
        <div className="glass-panel p-10 rounded-[4rem] bg-black/40 border border-white/5 space-y-8 shadow-4xl">
            <h3 className="text-xl font-black text-electric-blue uppercase tracking-[0.4em] flex items-center gap-4"><Wind size={24}/> Tactical Day-Plan</h3>
            <div className="space-y-4">
                {DAYTIME_PROTOCOL.map(p => (
                    <button 
                        key={p} 
                        onClick={() => toggleProtocolItem(p)}
                        className={`w-full p-6 rounded-[2rem] border flex items-center justify-between transition-all ${completedProtocolItems.has(p) ? 'bg-electric-blue/10 border-electric-blue/40 text-electric-blue' : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'}`}
                    >
                        <span className="text-xs font-black uppercase tracking-widest">{p}</span>
                        {completedProtocolItems.has(p) ? <CheckCircle2 size={20}/> : <Circle size={20}/>}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );

  const renderKnowledge = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
        {Object.entries(HEALTH_KNOWLEDGE_BASE).map(([key, value]) => (
        <div key={key} className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-black/40 shadow-xl group hover:border-blue-400/30 transition-all relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Info size={80} className="text-blue-400"/></div>
            <h4 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
            <Info size={18}/> {key}
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed font-bold italic mb-6">
            {value}
            </p>
            <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Sovereign Intel: Verified</p>
            </div>
        </div>
        ))}
    </div>
  );

  return (
    <div className="space-y-12 animate-in duration-700 pb-20 max-w-7xl mx-auto">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-white/5 pb-10 gap-8">
        <div>
          <h2 className="text-4xl lg:text-5xl font-display font-black text-white uppercase tracking-tighter italic text-glow-red flex items-center gap-6">
            <div className="p-4 bg-spartan-red text-black rounded-[1.8rem] shadow-[0_0_30px_rgba(255,42,42,0.4)]"><Skull size={32}/></div>
            Bio-Vessel <span className="text-spartan-red">v10</span>
          </h2>
          <p className="text-[11px] text-gray-500 font-mono mt-4 uppercase tracking-[0.5em] font-black italic">Optimization Protocol • {profile.rank} Access</p>
        </div>
        
        <div className="flex flex-wrap gap-4 bg-black/40 p-2 rounded-[2rem] border border-white/10">
          {[
            { id: 'OVERVIEW', label: 'HUB', icon: Activity, color: 'text-spartan-red' },
            { id: 'AUDIT', label: 'AUDIT', icon: ShieldAlert, color: 'text-spartan-red' },
            { id: 'MISSIONS', label: 'MISSIONS', icon: Target, color: 'text-cyber-purple' },
            { id: 'PROTOCOLS', label: 'DIRECTIVES', icon: ListChecks, color: 'text-electric-blue' },
            { id: 'KNOWLEDGE', label: 'INTEL', icon: Info, color: 'text-gold' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest border transition-all ${activeSubTab === tab.id ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-transparent border-transparent text-gray-500 hover:text-white'}`}
            >
              <tab.icon size={18} className={activeSubTab === tab.id ? 'text-black' : tab.color} /> {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeSubTab === 'OVERVIEW' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 glass-panel p-10 rounded-[3.5rem] border-t-4 border-spartan-red shadow-4xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Dna size={400} className="text-spartan-red" />
              </div>
              <div className="flex flex-col md:flex-row gap-10 relative z-10 items-center">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-spartan-red/10 flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(255,42,42,0.1)]">
                    <div className="absolute inset-0 border-t-8 border-spartan-red rounded-full animate-[spin_6s_linear_infinite]"></div>
                    <div className="text-center">
                      <p className="text-6xl font-mono font-black text-white text-glow-red leading-none">{retention.day}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Days Deep</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <Flame className="text-spartan-red animate-pulse" size={28}/>
                    <h3 className={`text-2xl font-display font-black uppercase italic ${retention.phase.color}`}>{retention.phase.title}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed italic bg-white/5 p-4 rounded-2xl border border-white/5">
                    {retention.phase.desc}
                  </p>
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      <span>Phase Velocity</span>
                      <span>Target: {retention.nextPhase?.day || 'MAX'} Days</span>
                    </div>
                    <div className="h-2.5 bg-obsidian rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-spartan-red to-gold shadow-[0_0_15px_rgba(255,42,42,0.5)] transition-all duration-1000" 
                           style={{width: `${Math.min(100, (retention.day / (retention.nextPhase?.day || 90)) * 100)}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 bg-gradient-to-br from-black/40 to-transparent flex flex-col justify-between shadow-2xl relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 opacity-[0.05] group-hover:scale-110 transition-transform">
                <Clock size={200} className="text-white"/>
              </div>
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Circadian Sync</h4>
                  <span className="text-xs font-mono font-black text-white">{currentTime.toLocaleTimeString([], { hour12: false })}</span>
                </div>
                <div className="bg-black/40 border border-white/5 p-8 rounded-[2.5rem] text-center">
                  <circadianStatus.icon size={36} className={`${circadianStatus.color} mx-auto mb-4 animate-pulse`} />
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Bio-Triage Mode</p>
                  <p className="text-2xl font-display font-black text-white uppercase italic tracking-tighter">{circadianStatus.label}</p>
                </div>
              </div>
              <button onClick={() => setActiveSubTab('AUDIT')} className="w-full mt-8 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all relative z-10">Run Bio-Vitals Scan</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {spartanHabits.map(habit => {
              const isDoneToday = habit.lastCompleted === todayStr;
              return (
                <div key={habit.id} className="relative group">
                    <div className={`glass-panel p-8 rounded-[2.5rem] border transition-all flex flex-col items-center gap-4 text-center ${isDoneToday ? 'border-wealth-green bg-wealth-green/10 shadow-[0_0_30px_rgba(0,230,118,0.1)]' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                        <div className="flex justify-between w-full mb-2">
                            <button onClick={() => setDetailedHabitId(habit.id)} className="p-2 text-gray-600 hover:text-white transition-colors bg-white/5 rounded-lg"><BarChart3 size={16}/></button>
                            <button onClick={() => setDetailedHabitId(habit.id)} className="p-2 text-gray-600 hover:text-white transition-colors bg-white/5 rounded-lg"><Settings2 size={16}/></button>
                        </div>
                        <button 
                            onClick={() => toggleHabit(habit.id)}
                            className={`w-20 h-20 rounded-[2.2rem] transition-all shadow-2xl flex items-center justify-center ${isDoneToday ? 'bg-wealth-green text-black' : 'bg-white/5 text-gray-600 hover:text-white'}`}
                        >
                            {habit.isRetentionHabit ? <Flame size={40}/> : <Zap size={40}/>}
                        </button>
                        <div>
                            <p className="text-[14px] font-black text-white uppercase tracking-tight">{habit.name}</p>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                 <TrendingUp size={14} className="text-wealth-green"/>
                                 <span className="text-[11px] font-mono font-black text-white tracking-widest">{habit.streak} DAY STREAK</span>
                            </div>
                        </div>
                    </div>
                </div>
              );
            })}
          </div>

          {detailedHabitId && (() => {
              const habit = habits.find(h => h.id === detailedHabitId);
              if (!habit) return null;
              const historyGrid = generateHistoryGrid(habit.history);
              return (
                  <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in">
                      <div className="glass-panel w-full max-w-2xl p-10 lg:p-16 rounded-[4rem] border border-white/10 shadow-5xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Settings2 size={300}/></div>
                          <div className="flex justify-between items-start relative z-10 mb-12">
                              <div>
                                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-2">Neural Habit Analytics</p>
                                  <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter">{habit.name}</h3>
                              </div>
                              <button onClick={() => setDetailedHabitId(null)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 text-gray-500 hover:text-white transition-all"><X size={24}/></button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                              <div className="space-y-8">
                                  <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 shadow-inner">
                                      <div className="flex items-center gap-4 mb-6">
                                          <div className="p-3 bg-spartan-red/10 text-spartan-red rounded-xl"><Activity size={20}/></div>
                                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Streak Strength</p>
                                      </div>
                                      <div className="flex items-baseline gap-2">
                                          <span className="text-5xl font-mono font-black text-white">{habit.streak}</span>
                                          <span className="text-sm font-black text-gray-600 uppercase tracking-widest">Days</span>
                                      </div>
                                  </div>
                                  <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 shadow-inner">
                                      <div className="flex items-center gap-4 mb-6">
                                          <div className="p-3 bg-electric-blue/10 text-electric-blue rounded-xl"><Clock size={20}/></div>
                                          <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Directive</p>
                                      </div>
                                      <div className="space-y-4">
                                          <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest block ml-2">Reminder Protocol</label>
                                          <input 
                                              type="time" 
                                              value={habit.reminderTime || "00:00"}
                                              onChange={(e) => setHabitReminder(habit.id, e.target.value)}
                                              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white font-mono text-xl outline-none focus:border-wealth-green shadow-inner"
                                          />
                                      </div>
                                  </div>
                              </div>
                              <div className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 shadow-inner flex flex-col h-full">
                                  <div className="flex items-center gap-4 mb-8">
                                      <div className="p-3 bg-wealth-green/10 text-wealth-green rounded-xl"><Calendar size={20}/></div>
                                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">35-Day Matrix</p>
                                  </div>
                                  <div className="grid grid-cols-7 gap-2 flex-1 items-center">
                                      {historyGrid.map((day, idx) => (
                                          <div key={idx} title={day.date} className={`aspect-square rounded-lg transition-all duration-500 border ${day.isToday ? 'border-white/40 scale-110 z-10' : 'border-transparent'} ${day.isDone ? 'bg-wealth-green shadow-[0_0_10px_rgba(0,230,118,0.4)]' : 'bg-white/5'}`} />
                                      ))}
                                  </div>
                              </div>
                          </div>
                          <button onClick={() => setDetailedHabitId(null)} className="w-full mt-12 py-6 bg-white text-black font-black uppercase tracking-[0.5em] rounded-[2.5rem] text-[11px] shadow-5xl hover:scale-[1.02] active:scale-95 transition-all">CLOSE</button>
                      </div>
                  </div>
              );
          })()}
        </div>
      )}

      {activeSubTab === 'AUDIT' && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-12 lg:p-20 rounded-[4rem] lg:rounded-[5rem] border border-white/10 bg-gradient-to-br from-black/60 to-black/20 shadow-5xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Activity size={400}/></div>
                <div className="flex items-center gap-8 mb-16 border-b border-white/5 pb-10 relative z-10">
                    <div className="p-6 bg-spartan-red/20 text-spartan-red rounded-[2.5rem] shadow-4xl"><Activity size={48}/></div>
                    <div>
                        <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">Bio-Vitals Triage</h3>
                        <p className="text-[11px] text-gray-500 font-mono uppercase tracking-[0.5em] font-black">System Integrity Check</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-4">
                        <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><Scale size={18} className="text-spartan-red"/> Mass (KG)</label>
                        <input type="number" value={vitalForm.weight} onChange={e => setVitalForm({...vitalForm, weight: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-8 text-3xl font-mono font-black text-white outline-none focus:border-spartan-red shadow-inner" placeholder="0.0" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><TrendingUp size={18} className="text-spartan-red"/> Lipid Density %</label>
                        <input type="number" value={vitalForm.bodyFat} onChange={e => setVitalForm({...vitalForm, bodyFat: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-8 text-3xl font-mono font-black text-white outline-none focus:border-spartan-red shadow-inner" placeholder="0.0" />
                    </div>
                    <div className="space-y-4 md:col-span-2">
                        <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><Moon size={18} className="text-electric-blue"/> Recovery (Hrs)</label>
                        <input type="number" value={vitalForm.sleepHours} onChange={e => setVitalForm({...vitalForm, sleepHours: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-8 text-3xl font-mono font-black text-white outline-none focus:border-electric-blue shadow-inner" placeholder="0.0" />
                    </div>
                </div>
                <button onClick={handleVitalsSubmit} className="w-full mt-16 py-8 bg-spartan-red text-white font-black uppercase tracking-[0.6em] rounded-[3rem] text-sm shadow-[0_30_60_rgba(255,42,42,0.3)] hover:scale-[1.02] active:scale-95 transition-all">COMMIT SCAN</button>
            </div>
        </div>
      )}

      {activeSubTab === 'MISSIONS' && (
        <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
            <div className="glass-panel p-12 lg:p-20 rounded-[4rem] lg:rounded-[5rem] border border-white/10 bg-gradient-to-br from-black/60 to-black/20 shadow-5xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Target size={400} className="text-cyber-purple"/></div>
                <div className="flex items-center gap-8 mb-16 border-b border-white/5 pb-10 relative z-10">
                    <div className="p-6 bg-cyber-purple/20 text-cyber-purple rounded-[2.5rem] shadow-4xl"><Target size={48}/></div>
                    <div>
                        <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">Mission Calibration</h3>
                        <p className="text-[11px] text-gray-500 font-mono uppercase tracking-[0.5em] font-black">Strategic Directives</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div className="space-y-4 md:col-span-2">
                        <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><Activity size={18} className="text-cyber-purple"/> Name</label>
                        <input type="text" value={goalForm.name} onChange={e => setGoalForm({...goalForm, name: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-xl font-mono font-black text-white outline-none focus:border-cyber-purple shadow-inner" placeholder="e.g. COMPLETE 90-DAY RETENTION" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><Calendar size={18} className="text-electric-blue"/> Start Date</label>
                        <input type="date" value={goalForm.startDate} onChange={e => setGoalForm({...goalForm, startDate: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-sm font-mono font-black text-white outline-none focus:border-electric-blue shadow-inner" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><Target size={18} className="text-spartan-red"/> Target Date</label>
                        <input type="date" value={goalForm.targetDate} onChange={e => setGoalForm({...goalForm, targetDate: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-6 text-sm font-mono font-black text-white outline-none focus:border-spartan-red shadow-inner" />
                    </div>
                </div>
                <button onClick={handleGoalSubmit} className="w-full mt-16 py-8 bg-cyber-purple text-white font-black uppercase tracking-[0.6em] rounded-[3rem] text-sm shadow-5xl hover:scale-[1.02] active:scale-95 transition-all">AUTHORIZE MISSION</button>
            </div>
        </div>
      )}

      {activeSubTab === 'PROTOCOLS' && renderProtocols()}
      {activeSubTab === 'KNOWLEDGE' && renderKnowledge()}
    </div>
  );
};
