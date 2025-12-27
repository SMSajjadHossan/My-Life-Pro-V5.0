
import React, { useMemo, useState, useEffect } from 'react';
import { Habit, UserProfile, SpartanDayPlan } from './types';
import { 
  RETENTION_PHASES, 
  SPARTAN_MASTER_CYCLE, 
  MORNING_PROTOCOL, 
  DAYTIME_PROTOCOL, 
  MASCULINE_MINDSET_CHECKLIST,
  HEALTH_KNOWLEDGE_BASE 
} from './constants';
import { 
  Skull, Zap, Activity, Dna, Flame, Utensils, 
  Dumbbell, ShieldAlert, CheckCircle2, Circle, Clock, 
  Wind, Moon, Sun, Brain, Heart, ChevronRight, Info, Scale, Ruler, TrendingUp
} from 'lucide-react';

interface Props {
  habits: Habit[];
  profile: UserProfile;
  toggleHabit: (id: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setHabits: (habits: Habit[]) => void;
}

export const SpartanVessel: React.FC<Props> = ({ habits, profile, toggleHabit, updateProfile, setHabits }) => {
  const [activeSubTab, setActiveSubTab] = useState<'OVERVIEW' | 'AUDIT' | 'PROTOCOLS' | 'KNOWLEDGE'>('OVERVIEW');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [vitalForm, setVitalForm] = useState({
      weight: profile.weight?.toString() || '',
      bodyFat: profile.bodyFat?.toString() || '',
      sleepHours: profile.sleepHours?.toString() || ''
  });

  const [reminderEditHabit, setReminderEditHabit] = useState<string | null>(null);

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

      // Loopholes Fixed: Full Risk Calculus
      let riskScore = 5;
      if (sleepHours < 7) riskScore += 15;
      if (sleepHours < 6) riskScore += 25;
      if (bodyFat > 18) riskScore += 10;
      if (bodyFat > 25) riskScore += 30;

      // Check for failed critical habits
      const criticalHabitFailures = habits.filter(h => ['Retention Protocol', 'Prayers (5x)'].includes(h.name) && h.streak === 0).length;
      riskScore += (criticalHabitFailures * 15);

      updateProfile({ 
        weight, bodyFat, sleepHours,
        systemicRisk: Math.min(100, riskScore)
      });
      alert("Biological State Committed. v10 Neural Triage re-calculated.");
      setActiveSubTab('OVERVIEW');
  };

  const setHabitReminder = (id: string, time: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, reminderTime: time } : h));
    setReminderEditHabit(null);
  };

  const renderOverview = () => (
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
          const isDoneToday = habit.lastCompleted === new Date().toISOString().split('T')[0];
          return (
            <div key={habit.id} className="relative group">
                <div className={`glass-panel p-8 rounded-[2.5rem] border transition-all flex flex-col items-center gap-4 text-center ${isDoneToday ? 'border-wealth-green bg-wealth-green/10 shadow-[0_0_30px_rgba(0,230,118,0.1)]' : 'border-white/5 bg-black/40 hover:border-white/20'}`}>
                    <button 
                        onClick={() => toggleHabit(habit.id)}
                        className={`w-16 h-16 rounded-[1.8rem] transition-all shadow-2xl flex items-center justify-center ${isDoneToday ? 'bg-wealth-green text-black' : 'bg-white/5 text-gray-600 hover:text-white'}`}
                    >
                        {habit.isRetentionHabit ? <Flame size={32}/> : <Zap size={32}/>}
                    </button>
                    <div>
                        <p className="text-[14px] font-black text-white uppercase tracking-tight">{habit.name}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                             <TrendingUp size={14} className="text-wealth-green"/>
                             <span className="text-[11px] font-mono font-black text-white tracking-widest">{habit.streak} DAY STREAK</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setReminderEditHabit(habit.id)}
                        className="mt-2 p-3 bg-white/5 rounded-2xl text-[9px] font-black text-gray-600 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
                    >
                        <Clock size={12}/> {habit.reminderTime || 'NO REMINDER'}
                    </button>
                </div>
                {reminderEditHabit === habit.id && (
                    <div className="absolute inset-0 z-20 bg-black/95 rounded-[2.5rem] p-8 flex flex-col justify-center items-center animate-in zoom-in-95 border border-white/10">
                        <p className="text-[11px] font-black text-gray-500 uppercase mb-6 tracking-widest">Set Alert Directive</p>
                        <input 
                            type="time" 
                            className="bg-black border border-white/10 rounded-2xl p-4 text-white font-mono mb-6 outline-none focus:border-wealth-green shadow-inner w-full text-center"
                            onChange={(e) => setHabitReminder(habit.id, e.target.value)}
                        />
                        <button onClick={() => setReminderEditHabit(null)} className="text-[10px] text-gray-500 uppercase font-black tracking-widest hover:text-white transition-colors">Abort</button>
                    </div>
                )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="glass-panel p-10 rounded-[3.5rem] bg-black/40 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><Utensils size={100} className="text-white"/></div>
          <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-3"><Utensils size={20} className="text-orange-400"/> Nutritional Triage</h4>
          <div className="space-y-8">
            <div className="relative pl-8 border-l-2 border-orange-400/20">
              <div className="absolute -left-1.5 top-0 w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"></div>
              <p className="text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Morning Payload (08:00)</p>
              <p className="text-base font-bold text-gray-200">{todayPlan.morningMeal}</p>
            </div>
            <div className="relative pl-8 border-l-2 border-electric-blue/20">
              <div className="absolute -left-1.5 top-0 w-3 h-3 bg-electric-blue rounded-full shadow-[0_0_10px_rgba(41,121,255,0.5)]"></div>
              <p className="text-[10px] font-black text-gray-600 uppercase mb-1 tracking-widest">Night Payload (20:00)</p>
              <p className="text-base font-bold text-gray-200">{todayPlan.nightMeal}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[3.5rem] bg-black/40 border border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform"><Dumbbell size={100} className="text-white"/></div>
          <h4 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-3"><Dumbbell size={20} className="text-spartan-red"/> Physical Warfare</h4>
          <div className="space-y-6">
            <div className="text-center pb-8 border-b border-white/5">
              <p className="text-[10px] font-black text-gray-600 uppercase mb-2 tracking-widest">Cycle Focus</p>
              <p className="text-4xl font-display font-black text-white uppercase italic text-glow-red tracking-tighter">{todayPlan.gymFocus}</p>
            </div>
            <div className="space-y-4 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
              {todayPlan.gymRoutine.map((ex, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-black/40 rounded-[1.5rem] border border-white/5 hover:border-spartan-red/30 transition-all shadow-inner">
                  <span className="text-[12px] font-bold text-gray-300">{ex.name}</span>
                  <span className="text-[12px] font-mono font-black text-spartan-red">{ex.sets}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-[3.5rem] bg-gradient-to-t from-spartan-red/10 to-transparent border border-white/10 shadow-3xl flex flex-col items-center justify-center text-center group">
          <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 group-hover:border-spartan-red/50 transition-all shadow-2xl">
            <ShieldAlert size={48} className="text-gray-600 group-hover:text-spartan-red transition-colors" />
          </div>
          <h4 className="text-sm font-black text-white uppercase tracking-[0.4em] mb-4">Biological Audit</h4>
          <p className="text-[11px] text-gray-500 font-mono leading-relaxed uppercase max-w-[240px]">Perform manual vital scan for systemic risk verification.</p>
          <button onClick={() => setActiveSubTab('AUDIT')} className="mt-10 px-8 py-3.5 bg-spartan-red text-white text-[11px] font-black uppercase rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-red-900/30">Initiate Audit Scan</button>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
      <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-8 duration-700">
          <div className="glass-panel p-12 lg:p-20 rounded-[4rem] lg:rounded-[5rem] border border-white/10 bg-gradient-to-br from-black/60 to-black/20 shadow-5xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none"><Activity size={400}/></div>
              <div className="flex items-center gap-8 mb-16 border-b border-white/5 pb-10 relative z-10">
                  <div className="p-6 bg-spartan-red/20 text-spartan-red rounded-[2.5rem] shadow-4xl"><Activity size={48}/></div>
                  <div>
                      <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">Bio-Vitals Triage</h3>
                      <p className="text-[11px] text-gray-500 font-mono uppercase tracking-[0.5em] font-black">Manual System Integrity Check Required</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-4">
                      <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><Scale size={18} className="text-spartan-red"/> Mass Indicator (KG)</label>
                      <input 
                        type="number"
                        value={vitalForm.weight}
                        onChange={e => setVitalForm({...vitalForm, weight: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-8 text-3xl font-mono font-black text-white outline-none focus:border-spartan-red transition-all shadow-inner"
                        placeholder="0.0"
                      />
                  </div>
                  <div className="space-y-4">
                      <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><TrendingUp size={18} className="text-spartan-red"/> Lipid Density %</label>
                      <input 
                        type="number"
                        value={vitalForm.bodyFat}
                        onChange={e => setVitalForm({...vitalForm, bodyFat: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-8 text-3xl font-mono font-black text-white outline-none focus:border-spartan-red transition-all shadow-inner"
                        placeholder="0.0"
                      />
                  </div>
                  <div className="space-y-4 md:col-span-2">
                      <label className="text-[12px] font-black text-gray-500 uppercase tracking-[0.4em] flex items-center gap-3"><Moon size={18} className="text-electric-blue"/> Recovery Window (Hrs)</label>
                      <input 
                        type="number"
                        value={vitalForm.sleepHours}
                        onChange={e => setVitalForm({...vitalForm, sleepHours: e.target.value})}
                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-8 text-3xl font-mono font-black text-white outline-none focus:border-electric-blue transition-all shadow-inner"
                        placeholder="0.0"
                      />
                  </div>
              </div>

              <div className="mt-16 p-10 bg-white/5 border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 relative z-10 shadow-inner">
                   <div className="p-6 bg-spartan-red/10 text-spartan-red rounded-[2rem] shadow-2xl"><ShieldAlert size={36}/></div>
                   <div className="space-y-2 text-center md:text-left">
                       <p className="text-sm text-gray-400 font-bold leading-relaxed italic">"Bio-integrity is the prerequisite for Strategic Sovereignity. Dishonest data results in system failure."</p>
                       <p className="text-[10px] text-gray-600 font-mono uppercase tracking-widest font-black">Current Risk Matrix: {profile.systemicRisk}% • Authorized Scan Initiated</p>
                   </div>
              </div>

              <button 
                onClick={handleVitalsSubmit}
                className="w-full mt-16 py-8 bg-spartan-red text-white font-black uppercase tracking-[0.6em] rounded-[3rem] text-sm shadow-[0_30_60_rgba(255,42,42,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                  COMMIT SCAN TO SOVEREIGN LEDGER
              </button>
          </div>
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
            { id: 'PROTOCOLS', label: 'DIRECTIVES', icon: Wind, color: 'text-electric-blue' },
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

      {activeSubTab === 'OVERVIEW' && renderOverview()}
      {activeSubTab === 'AUDIT' && renderAudit()}
      {activeSubTab === 'PROTOCOLS' && <div>{/* Protocols Render Logic */}</div>}
      {activeSubTab === 'KNOWLEDGE' && <div>{/* Knowledge Render Logic */}</div>}
    </div>
  );
};
