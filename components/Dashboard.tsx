
import React, { useMemo, useState } from 'react';
import { UserProfile, Habit, FinancialState, JournalTask, AppSection } from '../types';
import { MORNING_PROTOCOL, DAYTIME_PROTOCOL, RULES_OF_POWER_13 } from '../constants';
import { 
  Shield, Target, Zap, Skull, TrendingUp, Lock, Activity, 
  Flame, DollarSign, Brain, ChevronRight, Clock, AlertTriangle,
  CheckCircle2, Circle, ListChecks, Download, Upload, Calendar,
  Quote, Timer, Swords, Trash2, Edit3, Plus, ShieldCheck,
  Terminal
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

  const metrics = useMemo(() => {
    const totalLiquid = (financialData.accounts || []).reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
    const totalAssets = (financialData.assets || []).reduce((a, b) => a + (Number(b.value) || 0), 0);
    const netWorth = totalLiquid + totalAssets;
    const retentionDay = habits.find(h => h.isRetentionHabit)?.streak || 0;
    const frogMission = objectives.find(o => o.priority === 'Critical' && o.status !== 'Completed');
    
    const countdowns = objectives.map(obj => {
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
    }).sort((a, b) => (a.status === 'Completed' ? 1 : -1) || a.daysRemaining - b.daysRemaining);

    const randomWisdom = RULES_OF_POWER_13[Math.floor(Math.random() * RULES_OF_POWER_13.length)];
    const completedMissions = objectives.filter(o => o.status === 'Completed').length;
    const nextLevelXP = profile.level * 5000;
    const levelProgress = Math.min(100, (profile.xp / (nextLevelXP || 1)) * 100);

    return { netWorth, retentionDay, frogMission, countdowns, randomWisdom, levelProgress, totalLiquid };
  }, [financialData, habits, objectives, profile]);

  const toggleAuditItem = (item: string) => {
    const newSet = new Set(checkedAuditItems);
    if (newSet.has(item)) newSet.delete(item);
    else newSet.add(item);
    setCheckedAuditItems(newSet);
  };

  const updateObjectiveStatus = (id: string) => {
    setObjectives(objectives.map(o => {
        if (o.id === id) {
            const isNowCompleted = o.status !== 'Completed';
            return { 
                ...o, status: isNowCompleted ? 'Completed' : 'Pending',
                completionDate: isNowCompleted ? new Date().toISOString() : undefined
            };
        }
        return o;
    }));
  };

  const handleSaveObjective = () => {
    if (!editingObj?.task || !editingObj?.dueDate) return;
    if (editingObj.id) {
        setObjectives(objectives.map(o => o.id === editingObj.id ? { ...o, ...editingObj } as JournalTask : o));
    } else {
        const newObj: JournalTask = {
            id: Date.now().toString(),
            category: editingObj.category || 'Goal',
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
  const auditProgress = (checkedAuditItems.size / (currentProtocol.length || 1)) * 100;
  const blurClass = financialData.isStealthMode ? 'blur-2xl select-none grayscale' : '';

  return (
    <div className="space-y-10 pb-32 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 glass-panel p-10 lg:p-14 rounded-[4rem] relative overflow-hidden bg-gradient-to-br from-black/60 to-obsidian shadow-5xl border border-white/5 group">
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                  <div className="relative">
                      <div className="w-44 h-44 bg-black border-[6px] border-spartan-red/20 rounded-[3.5rem] flex items-center justify-center shadow-5xl group-hover:border-spartan-red/40 transition-colors">
                          <Skull size={64} className="text-white" />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-spartan-red text-black text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] italic border-4 border-obsidian whitespace-nowrap shadow-2xl">RANK: {profile.rank}</div>
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                      <div className="flex flex-col md:flex-row items-center gap-6">
                          <h1 className="text-4xl lg:text-6xl font-display font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">{profile.name}</h1>
                          <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] font-mono font-black text-gray-500 uppercase tracking-widest shadow-inner">LEVEL {profile.level}</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase tracking-widest px-1">
                            <span>Evolution Stage</span>
                            <span>{Math.round(metrics.levelProgress)}%</span>
                        </div>
                        <div className="h-2.5 bg-black rounded-full overflow-hidden border border-white/5 p-0.5 shadow-inner">
                            <div className="h-full bg-gradient-to-r from-spartan-red via-cyber-purple to-electric-blue transition-all duration-1000 rounded-full" style={{ width: `${metrics.levelProgress}%` }}></div>
                        </div>
                      </div>
                      <p className="text-sm lg:text-base text-gray-400 font-mono tracking-wide uppercase italic max-w-2xl leading-relaxed border-l-2 border-spartan-red/40 pl-6">
                        "{profile.missionStatement}"
                      </p>
                  </div>
              </div>
          </div>
          <div className="lg:col-span-4 glass-panel p-10 rounded-[4rem] bg-gradient-to-br from-wealth-green/10 via-black/40 to-black/60 border border-wealth-green/20 flex flex-col justify-between shadow-5xl relative overflow-hidden group">
              <div className="space-y-4 relative z-10">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.6em]">Total Net Worth</p>
                  <h2 className={`text-5xl lg:text-6xl font-mono font-black text-white text-glow-green tracking-tighter ${blurClass}`}>৳{metrics.netWorth.toLocaleString()}</h2>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-2 h-2 rounded-full bg-wealth-green animate-pulse"></div>
                    <span className="text-[10px] font-black text-wealth-green uppercase tracking-[0.4em]">Engine: ACTIVE</span>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-10 relative z-10">
                  <div className="p-5 bg-black/60 rounded-[1.8rem] border border-white/5 text-center shadow-inner group-hover:border-spartan-red/20 transition-colors">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-2">Streak</span>
                      <span className="text-xl font-mono font-black text-spartan-red">{metrics.retentionDay}D</span>
                  </div>
                  <div className="p-5 bg-black/60 rounded-[1.8rem] border border-white/5 text-center shadow-inner group-hover:border-electric-blue/20 transition-colors">
                      <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-2">Available</span>
                      <span className="text-xl font-mono font-black text-electric-blue">৳{(metrics.totalLiquid/1000).toFixed(0)}k</span>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 glass-panel p-10 rounded-[3.5rem] bg-black/40 border border-white/5 flex flex-col shadow-5xl relative overflow-hidden h-[550px]">
              <div className="flex justify-between items-center mb-8 relative z-10">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em] flex items-center gap-4"><ListChecks size={22} className="text-cyber-purple"/> Daily Audit</h3>
                  <div className="flex bg-black/60 rounded-[1.2rem] p-1 border border-white/10 shadow-inner">
                      <button onClick={() => setAuditMode('MORNING')} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${auditMode === 'MORNING' ? 'bg-cyber-purple text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}>AM</button>
                      <button onClick={() => setAuditMode('NIGHT')} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${auditMode === 'NIGHT' ? 'bg-spartan-red text-white shadow-lg' : 'text-gray-600 hover:text-white'}`}>PM</button>
                  </div>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-3 relative z-10">
                  {currentProtocol.map(item => (
                      <div key={item} onClick={() => toggleAuditItem(item)} className={`p-4 rounded-[1.5rem] border flex items-center gap-4 transition-all cursor-pointer ${checkedAuditItems.has(item) ? 'bg-white/5 border-white/5 opacity-40 translate-x-1' : 'bg-black border-white/10 hover:border-white/30 shadow-xl'}`}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${checkedAuditItems.has(item) ? 'bg-wealth-green text-black shadow-inner' : 'bg-white/5 text-gray-700'}`}>
                            {checkedAuditItems.has(item) ? <CheckCircle2 size={16}/> : <Circle size={16}/>}
                          </div>
                          <p className="text-[12px] font-bold text-gray-300 tracking-tight leading-snug">{item}</p>
                      </div>
                  ))}
              </div>
          </div>
          <div className="lg:col-span-8 space-y-8">
              <div className="glass-panel p-10 rounded-[4rem] bg-gradient-to-br from-spartan-red/20 via-black/40 to-black/60 border-2 border-spartan-red/30 flex flex-col justify-between min-h-[260px] group shadow-5xl relative overflow-hidden">
                  <div className="space-y-8 relative z-10">
                      <div className="flex items-center gap-4">
                          <div className="p-4 bg-spartan-red text-black rounded-[1.5rem] shadow-2xl animate-pulse"><Swords size={24}/></div>
                          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em]">PRIMARY FOCUS (FROG)</h3>
                      </div>
                      {metrics.frogMission ? (
                        <p className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-tight text-glow-red group-hover:translate-x-2 transition-transform">
                          {metrics.frogMission.task}
                        </p>
                      ) : (
                        <p className="text-gray-600 font-mono italic uppercase tracking-widest text-lg">No active frontlines detected.</p>
                      )}
                  </div>
                  <button onClick={() => setSection(AppSection.ACADEMY)} className="w-full mt-6 py-6 bg-white text-black font-black uppercase tracking-[0.6em] rounded-[2rem] text-sm hover:scale-[1.02] transition-all shadow-4xl active:scale-95">RE-ENGAGE FOCUS ENGINE</button>
              </div>
              <div className="glass-panel p-10 rounded-[4rem] bg-gradient-to-r from-cyber-purple/10 to-transparent border border-white/5 min-h-[260px] shadow-5xl flex flex-col justify-center group overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-[10s]"><Quote size={300} className="text-white"/></div>
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.6em] mb-8 flex items-center gap-4 relative z-10"><Quote size={24} className="text-gold"/> TITAN DECREE</h3>
                  <p className="text-2xl lg:text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-tight drop-shadow-xl relative z-10 group-hover:text-glow-purple transition-all duration-700">
                    {metrics.randomWisdom}
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};
