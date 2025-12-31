
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Terminal, CheckCircle2, Circle, Clock, Zap, Target, Brain, Scroll, 
  ArrowRight, Play, Pause, RotateCcw, Plus, X, AlignLeft,
  Maximize2, ShieldAlert, Award, Compass, Calculator,
  ExternalLink, BarChart3, Scale, Timer, Cpu, ShieldCheck, 
  Maximize, Minimize, Trash2, Edit3, Volume2, VolumeX, Music,
  Coffee, Activity, FastForward, Settings2, Sliders, Headphones
} from 'lucide-react';
import { STUDY_PHASES, RULES_OF_POWER_13, RICH_VS_POOR_MINDSET } from '../constants';
import { JournalTask } from '../types';

interface Props {
    objectives: JournalTask[];
    setObjectives: (objs: JournalTask[]) => void;
}

type TimerMode = 'POMO' | '52_17' | 'ULTRADIAN' | 'FLOW' | 'BREAK';

const SOUNDSCAPES = [
    { id: 'none', label: 'SILENCE', url: '' },
    { id: 'alpha', label: 'ALPHA WAVES', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a1b1b1b1.mp3?filename=deep-meditation-11000.mp3' },
    { id: 'white', label: 'WHITE NOISE', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 'lofi', label: 'LOFI FOCUS', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
];

export const TheAcademy: React.FC<Props> = ({ objectives, setObjectives }) => {
  const [activeTab, setActiveTab] = useState<'DEEP_WORK' | 'PROTOCOLS' | 'WISDOM' | 'DECISION'>('DEEP_WORK');
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // --- TIMER STATE ---
  const [mode, setMode] = useState<TimerMode>('POMO');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [activeTask, setActiveTask] = useState<string>(objectives[0]?.task || 'Choose a goal to start focus...');
  
  // --- CUSTOMIZATION ---
  const [customDurations, setCustomDurations] = useState({
    POMO: 25,
    '52_17': 52,
    ULTRADIAN: 90,
    FLOW: 120,
    BREAK: 5
  });
  
  // --- SOUNDS ---
  const [activeSound, setActiveSound] = useState(SOUNDSCAPES[0]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sessionStats, setSessionStats] = useState({ completedSessions: 0, totalMinutes: 0 });

  // --- MODAL STATE ---
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Partial<JournalTask> | null>(null);

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
        interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
        handleSessionEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Audio handling
  useEffect(() => {
    if (audioRef.current) {
        if (isRunning && activeSound.url) {
            audioRef.current.play().catch(() => {});
        } else {
            audioRef.current.pause();
        }
    }
  }, [isRunning, activeSound]);

  const handleSessionEnd = () => {
    setIsRunning(false);
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(() => {});
    
    if (mode !== 'BREAK') {
        setSessionStats(prev => ({ 
            completedSessions: prev.completedSessions + 1, 
            totalMinutes: prev.totalMinutes + Math.floor(totalSeconds / 60) 
        }));
        setMode('BREAK');
        const breakDur = customDurations.BREAK * 60;
        setTimeLeft(breakDur);
        setTotalSeconds(breakDur);
        alert("Focus Session Complete. Take a human break.");
    } else {
        handleModeChange('POMO');
        alert("Break ended. Ready to re-engage?");
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
      setIsRunning(false);
      setMode(newMode);
      const duration = customDurations[newMode as keyof typeof customDurations] * 60;
      setTimeLeft(duration);
      setTotalSeconds(duration);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = useMemo(() => {
      return ((totalSeconds - timeLeft) / (totalSeconds || 1)) * 100;
  }, [timeLeft, totalSeconds]);

  const saveTaskUpdate = () => {
    if (!editingTask?.task) return;
    if (editingTask.id) {
        setObjectives(objectives.map(o => o.id === editingTask.id ? { ...o, ...editingTask } as JournalTask : o));
    } else {
        const newTask: JournalTask = {
            id: Date.now().toString(),
            category: 'Study',
            task: editingTask.task!,
            status: 'Not Started',
            priority: editingTask.priority || 'Medium',
            progress: 0,
            notes: editingTask.notes || '',
            dueDate: editingTask.dueDate || new Date().toISOString(),
        };
        setObjectives([...objectives, newTask]);
    }
    setShowEditModal(false);
    setEditingTask(null);
  };

  return (
    <div className={`space-y-12 pb-40 max-w-[1400px] mx-auto animate-in fade-in duration-1000 ${isFullScreen ? 'overflow-hidden' : ''}`}>
       
       <audio ref={audioRef} src={activeSound.url} loop />

       {/* FULL SCREEN ISOLATION MODE */}
       {isFullScreen && (
           <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-10 animate-in fade-in zoom-in duration-500">
                <div className="absolute top-10 right-10 flex gap-4">
                    <button 
                        onClick={() => setIsFullScreen(false)} 
                        className="p-6 bg-white/5 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all border border-white/10"
                        title="Exit Full Screen"
                    >
                        <Minimize size={32}/>
                    </button>
                </div>
                
                <div className="text-center space-y-12 relative z-10 w-full max-w-4xl">
                    <p className={`text-[12px] font-mono uppercase tracking-[1.5em] animate-pulse ${mode === 'BREAK' ? 'text-wealth-green' : 'text-spartan-red'}`}>
                        {mode === 'BREAK' ? ':: RECOVERY PHASE ::' : ':: ISOLATION ACTIVE ::'}
                    </p>
                    <h2 className="text-5xl md:text-7xl font-display font-black text-white uppercase italic tracking-tighter text-glow-red opacity-90 px-4">{activeTask}</h2>
                    
                    <div className="relative flex items-center justify-center py-10">
                        <svg className="w-[350px] h-[350px] md:w-[650px] md:h-[650px] rotate-[-90deg]">
                            <circle cx="50%" cy="50%" r="48%" stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="transparent" />
                            <circle cx="50%" cy="50%" r="48%" stroke={mode === 'BREAK' ? '#00E676' : '#FF2A2A'} strokeWidth="10" fill="transparent" 
                                    strokeDasharray="2100" strokeDashoffset={2100 - (2100 * progress / 100)} 
                                    className="transition-all duration-1000 ease-linear shadow-[0_0_40px_rgba(255,42,42,0.3)]" />
                        </svg>
                        <div className="absolute text-[12rem] md:text-[22rem] font-mono font-black text-white text-glow-blue leading-none tracking-tighter tabular-nums select-none">
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    
                    <div className="flex gap-10 justify-center items-center">
                         <button 
                            onClick={() => setIsRunning(!isRunning)} 
                            className={`flex items-center justify-center w-24 h-24 rounded-full transition-all shadow-5xl transform hover:scale-110 active:scale-95 ${isRunning ? 'bg-spartan-red text-white' : 'bg-wealth-green text-black'}`}
                          >
                              {isRunning ? <Pause size={48}/> : <Play size={48} className="ml-2"/>}
                          </button>
                          <button 
                            onClick={() => { setIsRunning(false); handleModeChange(mode); }} 
                            className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-500 hover:text-white transition-all"
                          >
                            <RotateCcw size={32}/>
                          </button>
                    </div>
                </div>

                <div className="absolute bottom-20 flex gap-6">
                    {SOUNDSCAPES.map(s => (
                        <button 
                            key={s.id} 
                            onClick={() => setActiveSound(s)}
                            className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${activeSound.id === s.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-gray-600'}`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
           </div>
       )}

       <div className="flex flex-wrap gap-4 border-b border-white/5 pb-10">
          {[
            { id: 'DEEP_WORK', label: 'Focus Timer', icon: Timer },
            { id: 'PROTOCOLS', label: 'Study Methods', icon: Cpu },
            { id: 'WISDOM', label: 'Empire Wisdom', icon: Scroll },
            { id: 'DECISION', label: 'Problem Solving', icon: Scale }
          ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)} 
                className={`flex items-center gap-4 px-8 py-4 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest border-2 transition-all ${activeTab === t.id ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-black border-white/10 text-gray-500 hover:text-white'}`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
          ))}
       </div>

       {activeTab === 'DEEP_WORK' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8 duration-700">
              {/* SIDEBAR: SOUNDS & STATS */}
              <div className="lg:col-span-3 space-y-8">
                  <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-black/40 space-y-8">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Activity size={14}/> Today's Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
                              <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Sessions</p>
                              <p className="text-2xl font-mono font-black text-white">{sessionStats.completedSessions}</p>
                          </div>
                          <div className="p-5 bg-white/5 rounded-2xl border border-white/5 text-center">
                              <p className="text-[8px] font-black text-gray-600 uppercase mb-1">Minutes</p>
                              <p className="text-2xl font-mono font-black text-wealth-green">{sessionStats.totalMinutes}</p>
                          </div>
                      </div>
                  </div>

                  <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 bg-black/40 space-y-6">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Headphones size={14}/> Brain Booster Sounds</h3>
                      <div className="space-y-2">
                          {SOUNDSCAPES.map(s => (
                              <button 
                                key={s.id} 
                                onClick={() => setActiveSound(s)}
                                className={`w-full p-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all flex items-center justify-between ${activeSound.id === s.id ? 'bg-white text-black border-white' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                              >
                                  {s.label}
                                  {activeSound.id === s.id && isRunning && <Zap size={10} className="animate-pulse text-spartan-red" />}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              {/* TIMER MAIN */}
              <div className="lg:col-span-6 glass-panel p-12 rounded-[4rem] border border-white/5 bg-gradient-to-br from-black/60 to-black/20 flex flex-col items-center justify-center text-center shadow-4xl relative overflow-hidden group min-h-[600px]">
                  <div className="absolute top-10 right-10 z-20 flex gap-2">
                    <button 
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-500 hover:text-white transition-all"
                        title="Customize Durations"
                    >
                        <Settings2 size={20}/>
                    </button>
                    <button 
                        onClick={() => setIsFullScreen(true)}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-500 hover:text-white transition-all flex items-center gap-3"
                    >
                        <Maximize size={20}/>
                    </button>
                  </div>
                  
                  <div className="relative flex items-center justify-center mb-10 w-full">
                      <svg className="w-[320px] h-[320px] rotate-[-90deg]">
                          <circle cx="50%" cy="50%" r="45%" stroke="rgba(255,255,255,0.03)" strokeWidth="5" fill="transparent" />
                          <circle cx="50%" cy="50%" r="45%" stroke={mode === 'BREAK' ? '#00E676' : '#FF2A2A'} strokeWidth="8" fill="transparent" 
                                  strokeDasharray="1000" strokeDashoffset={1000 - (1000 * progress / 100)} 
                                  className="transition-all duration-1000 ease-linear" />
                      </svg>
                      <div className="absolute">
                          <p className={`text-[10px] font-mono uppercase tracking-[0.8em] mb-4 animate-pulse ${mode === 'BREAK' ? 'text-wealth-green' : 'text-gray-600'}`}>
                            {mode === 'BREAK' ? 'RECOVERY' : 'FOCUS'}
                          </p>
                          <h2 className="text-[7rem] font-mono font-black text-white text-glow-blue leading-none tracking-tighter tabular-nums">
                            {formatTime(timeLeft)}
                          </h2>
                      </div>
                  </div>
                  
                  <div className="space-y-8 relative z-10 w-full px-6">
                      <h2 className="text-2xl font-display font-black text-white uppercase italic tracking-tighter drop-shadow-xl">{activeTask}</h2>
                      
                      <div className="flex flex-col gap-8">
                          <div className="flex justify-center bg-black/60 p-1.5 rounded-[2.2rem] border border-white/10 w-fit mx-auto shadow-inner">
                              {['POMO', '52_17', 'ULTRADIAN', 'FLOW', 'BREAK'].map(m => (
                                  <button key={m} onClick={() => handleModeChange(m as any)} className={`px-6 py-2.5 rounded-[1.5rem] text-[9px] font-black uppercase transition-all ${mode === m ? 'bg-white text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}>
                                    {m === 'BREAK' ? 'Break' : m.replace('_', '/')}
                                  </button>
                              ))}
                          </div>
                          <div className="flex gap-4 justify-center">
                            <button 
                              onClick={() => setIsRunning(!isRunning)} 
                              className={`flex items-center gap-5 px-14 py-6 rounded-[2.2rem] font-black uppercase tracking-[0.4em] transition-all shadow-4xl transform hover:translate-y-[-4px] active:scale-95 ${isRunning ? 'bg-spartan-red text-white shadow-red-900/20' : 'bg-wealth-green text-black shadow-green-900/20'}`}
                            >
                                {isRunning ? <><Pause size={24}/> Pause</> : <><Play size={24}/> Start Focus</>}
                            </button>
                            <button 
                              onClick={() => { setIsRunning(false); handleModeChange(mode); }} 
                              className="p-6 bg-white/5 border border-white/10 rounded-[2.2rem] text-gray-600 hover:text-white transition-all"
                            >
                              <RotateCcw size={24}/>
                            </button>
                          </div>
                      </div>
                  </div>

                  {/* SETTINGS INLINE OVERLAY */}
                  {showSettings && (
                      <div className="absolute inset-0 z-30 bg-black/95 p-12 flex flex-col items-center justify-center animate-in fade-in duration-300">
                          <div className="w-full max-w-sm space-y-8">
                              <h4 className="text-xl font-black text-white uppercase tracking-widest mb-8">Customize Durations</h4>
                              {Object.entries(customDurations).map(([k, v]) => (
                                  <div key={k} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{k.replace('_', '/')}</span>
                                      <div className="flex items-center gap-4">
                                          <input 
                                              type="number" 
                                              value={v} 
                                              onChange={(e) => setCustomDurations({...customDurations, [k]: parseInt(e.target.value) || 1})}
                                              className="w-16 bg-black border border-white/10 rounded-xl p-2 text-white font-mono text-center text-sm outline-none focus:border-wealth-green"
                                          />
                                          <span className="text-[9px] font-black text-gray-700">MIN</span>
                                      </div>
                                  </div>
                              ))}
                              <button 
                                onClick={() => { setShowSettings(false); handleModeChange(mode); }}
                                className="w-full py-5 bg-wealth-green text-black font-black uppercase tracking-[0.4em] rounded-2xl text-xs hover:scale-105 transition-all"
                              >
                                Save Changes
                              </button>
                          </div>
                      </div>
                  )}
              </div>

              {/* MISSION QUEUE SIDEBAR */}
              <div className="lg:col-span-3 glass-panel p-8 rounded-[2.5rem] bg-black/40 h-fit border border-white/5">
                  <div className="flex justify-between items-center mb-8">
                      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-3"><Terminal size={14}/> Goal Queue</h3>
                      <button 
                        onClick={() => { setEditingTask({}); setShowEditModal(true); }}
                        className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all"
                      >
                        <Plus size={16}/>
                      </button>
                  </div>
                  
                  <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                      {objectives.filter(o => o.status !== 'Completed').map(obj => (
                          <div 
                            key={obj.id} 
                            className={`group relative p-5 rounded-2xl border transition-all cursor-pointer ${activeTask === obj.task ? 'bg-cyber-purple/10 border-cyber-purple/40' : 'bg-black border-white/5 hover:border-white/15'}`}
                            onClick={() => setActiveTask(obj.task)}
                          >
                              <p className={`text-[11px] font-bold uppercase tracking-tight line-clamp-2 ${activeTask === obj.task ? 'text-white' : 'text-gray-500'}`}>{obj.task}</p>
                              <div className="flex justify-between items-center mt-3">
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${obj.priority === 'Critical' ? 'bg-spartan-red/20 text-spartan-red' : 'bg-white/5 text-gray-700'}`}>{obj.priority}</span>
                                  {activeTask === obj.task && <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-pulse shadow-[0_0_8px_#D500F9]"></div>}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
       )}

       {/* EDIT MODAL (RE-USED) */}
       {showEditModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-in fade-in">
              <div className="glass-panel w-full max-w-xl p-16 rounded-[4rem] border border-white/10 relative">
                  <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter mb-12">New <span className="text-cyber-purple">Focus Goal</span></h3>
                  <div className="space-y-10">
                      <div className="space-y-4">
                          <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-4">Goal Name</label>
                          <input 
                            value={editingTask?.task || ''} 
                            onChange={e => setEditingTask({...editingTask, task: e.target.value})} 
                            placeholder="e.g. Master React Hooks"
                            className="w-full bg-black border border-white/10 rounded-[2rem] p-8 text-white font-mono text-sm outline-none focus:border-cyber-purple shadow-inner"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                          <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-4">Priority</label>
                              <select 
                                value={editingTask?.priority || 'Medium'} 
                                onChange={e => setEditingTask({...editingTask, priority: e.target.value as any})}
                                className="w-full bg-black border border-white/10 rounded-[2rem] p-6 text-white font-mono text-xs outline-none focus:border-cyber-purple appearance-none"
                              >
                                  <option value="Low">Low</option>
                                  <option value="Medium">Medium</option>
                                  <option value="High">High Focus</option>
                                  <option value="Critical">Critical (Frog)</option>
                              </select>
                          </div>
                          <div className="space-y-4">
                              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-4">Due Date</label>
                              <input 
                                type="date" 
                                value={editingTask?.dueDate?.split('T')[0] || ''} 
                                onChange={e => setEditingTask({...editingTask, dueDate: e.target.value + 'T00:00:00'})}
                                className="w-full bg-black border border-white/10 rounded-[2rem] p-6 text-white font-mono text-xs outline-none focus:border-cyber-purple"
                              />
                          </div>
                      </div>
                      <div className="flex gap-6">
                        <button onClick={saveTaskUpdate} className="flex-1 py-6 bg-cyber-purple text-white font-black uppercase tracking-[0.4em] rounded-[2.5rem] text-xs shadow-3xl hover:scale-105 transition-all">Save Goal</button>
                        <button onClick={() => setShowEditModal(false)} className="px-10 py-6 bg-white/5 border border-white/10 rounded-[2.5rem] text-gray-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all">Cancel</button>
                      </div>
                  </div>
              </div>
          </div>
       )}

       {/* CODEX / WISDOM SECTION */}
       {activeTab === 'WISDOM' && (
           <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
               <div className="text-center space-y-4 mb-16">
                   <h3 className="text-4xl font-display font-black text-white uppercase italic tracking-tighter">The Sovereign Codex</h3>
                   <p className="text-[11px] text-gray-500 font-mono uppercase tracking-[0.5em]">Titanium Hardened Mindset Principles</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   {RULES_OF_POWER_13.map((rule, idx) => (
                       <div key={idx} className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-black/40 hover:border-gold/30 transition-all group relative overflow-hidden shadow-2xl">
                           <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-125 transition-transform"><Award size={200} className="text-gold" /></div>
                           <div className="flex items-center gap-5 mb-8">
                               <div className="p-4 bg-gold/10 text-gold rounded-2xl group-hover:rotate-12 transition-transform shadow-xl"><Award size={24}/></div>
                               <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Protocol Directive {idx+1}</p>
                           </div>
                           <p className="text-base font-bold text-gray-200 leading-relaxed italic border-l-2 border-gold/30 pl-6 group-hover:text-white transition-colors">{rule}</p>
                       </div>
                   ))}
               </div>
           </div>
       )}

       {/* PROTOCOLS / SYSTEMS SECTION */}
       {activeTab === 'PROTOCOLS' && (
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-8 duration-700">
                <div className="glass-panel p-12 rounded-[4rem] border border-white/5 bg-black/40 shadow-4xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Compass size={300} className="text-electric-blue" /></div>
                   <h3 className="text-xl font-black text-electric-blue uppercase tracking-[0.5em] mb-12 flex items-center gap-4 relative z-10"><Compass size={28}/> Neural Training OS</h3>
                   <div className="space-y-8 relative z-10">
                       {STUDY_PHASES.map((p, i) => (
                           <div key={i} className="p-8 bg-black/60 rounded-[2.5rem] border border-white/5 hover:border-electric-blue/30 transition-all group">
                               <p className="text-[10px] font-black text-gray-600 uppercase mb-3 tracking-widest">{p.phase}</p>
                               <h4 className="text-lg font-black text-white uppercase tracking-tight mb-4 group-hover:text-electric-blue transition-colors">{p.rule}</h4>
                               <p className="text-sm text-gray-400 italic font-medium leading-relaxed border-t border-white/5 pt-4">Directive: {p.action}</p>
                           </div>
                       ))}
                   </div>
                </div>

                <div className="glass-panel p-12 rounded-[4rem] border border-white/5 bg-black/40 shadow-4xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-12 opacity-[0.02]"><Zap size={300} className="text-wealth-green" /></div>
                   <h3 className="text-xl font-black text-wealth-green uppercase tracking-[0.5em] mb-12 flex items-center gap-4 relative z-10"><Zap size={28}/> Titanium Mindset Triage</h3>
                   <div className="space-y-8 relative z-10">
                       {RICH_VS_POOR_MINDSET.map((m, i) => (
                           <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-10 p-8 bg-black/60 rounded-[2.5rem] border border-white/5 hover:border-wealth-green/20 transition-all shadow-inner">
                               <div className="space-y-2">
                                   <p className="text-[10px] font-black text-spartan-red uppercase mb-2 tracking-widest">Fragile Logic</p>
                                   <p className="text-sm text-gray-500 font-bold leading-relaxed">"{m.poor}"</p>
                               </div>
                               <div className="border-l-2 border-white/5 pl-10 space-y-2">
                                   <p className="text-[10px] font-black text-wealth-green uppercase mb-2 tracking-widest">Sovereign Logic</p>
                                   <p className="text-sm text-gray-200 font-black italic leading-relaxed">"{m.rich}"</p>
                               </div>
                           </div>
                       ))}
                   </div>
                </div>
           </div>
       )}

       {/* DECISION LAB (10-10-10 MATRIX) SECTION */}
       {activeTab === 'DECISION' && (
           <div className="max-w-5xl mx-auto space-y-16 animate-in slide-in-from-bottom-8 duration-700">
               <div className="glass-panel p-16 rounded-[5rem] bg-gradient-to-br from-cyber-purple/10 via-black/40 to-black/60 border border-white/10 space-y-16 shadow-4xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] pointer-events-none"></div>
                   <div className="text-center space-y-6 relative z-10">
                       <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:rotate-[360deg] transition-transform duration-[2s]">
                         <Scale size={44} className="text-cyber-purple" />
                       </div>
                       <h3 className="text-5xl font-display font-black text-white uppercase italic tracking-tighter mb-4 text-glow-purple">The 10-10-10 Matrix</h3>
                       <p className="text-[12px] text-gray-500 font-mono uppercase tracking-[0.6em] font-black">Temporal Consequence Extraction Lab</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                       {[
                           { label: '10 MINUTES', desc: 'How will I feel 10 minutes from now? (Immediate impulse vs guilt)', color: 'text-spartan-red' },
                           { label: '10 MONTHS', desc: 'How will this impact my trajectory 10 months from today? (Strategic vector)', color: 'text-electric-blue' },
                           { label: '10 YEARS', desc: 'Will this matter to the Sovereign Architect in 10 years? (Legacy & Mission)', color: 'text-wealth-green' }
                       ].map(box => (
                           <div key={box.label} className="p-10 bg-black/60 border border-white/10 rounded-[3.5rem] space-y-6 shadow-3xl hover:translate-y-[-10px] transition-all duration-500 group/box">
                               <p className={`text-sm font-black uppercase tracking-[0.3em] ${box.color} border-b border-white/5 pb-4 group-hover/box:tracking-[0.5em] transition-all`}>{box.label}</p>
                               <p className="text-[13px] text-gray-400 font-bold leading-relaxed italic">{box.desc}</p>
                           </div>
                       ))}
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
