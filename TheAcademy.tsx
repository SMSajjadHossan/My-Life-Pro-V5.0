
import React, { useState, useEffect } from 'react';
import { 
  Terminal, CheckCircle2, Circle, Clock, Zap, Target, Brain, Scroll, 
  ArrowRight, Play, Pause, RotateCcw, Plus, X, AlignLeft,
  Maximize2, ShieldAlert, Award, Compass, Calculator,
  ExternalLink, BarChart3, Scale, Timer, Cpu, ShieldCheck
} from 'lucide-react';
import { STUDY_PHASES, RULES_OF_POWER_13, RICH_VS_POOR_MINDSET } from './constants';
import { JournalTask } from './types';

interface Props {
    objectives: JournalTask[];
    setObjectives: (objs: JournalTask[]) => void;
}

type TimerMode = 'POMO' | '52_17' | 'ULTRADIAN';

export const TheAcademy: React.FC<Props> = ({ objectives, setObjectives }) => {
  const [activeTab, setActiveTab] = useState<'DEEP_WORK' | 'PROTOCOLS' | 'WISDOM' | 'DECISION'>('DEEP_WORK');
  
  // --- TIMER STATE ---
  const [mode, setMode] = useState<TimerMode>('POMO');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [activeTask, setActiveTask] = useState<string>(objectives[0]?.task || 'Neural Lockdown Initiated...');

  useEffect(() => {
    let interval: any;
    if (isRunning && timeLeft > 0) {
        interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
        setIsRunning(false);
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(() => {});
        alert("COMMAND: Focus Session Concluded. Authorizing 5-minute Neural Cool-down.");
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleModeChange = (newMode: TimerMode) => {
      setIsRunning(false);
      setMode(newMode);
      switch(newMode) {
          case 'POMO': setTimeLeft(25 * 60); break;
          case '52_17': setTimeLeft(52 * 60); break;
          case 'ULTRADIAN': setTimeLeft(90 * 60); break;
      }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-16 pb-48 max-w-[1400px] mx-auto animate-in fade-in duration-1000">
       {/* NAVIGATION TABS */}
       <div className="flex flex-wrap gap-6 border-b border-white/5 pb-12">
          {[
            { id: 'DEEP_WORK', label: 'Neural Focus', icon: Timer },
            { id: 'PROTOCOLS', label: 'Operating Systems', icon: Cpu },
            { id: 'WISDOM', label: 'The Codex', icon: Scroll },
            { id: 'DECISION', label: 'Decision Lab', icon: Scale }
          ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)} 
                className={`flex items-center gap-4 px-10 py-5 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[0.3em] border-2 transition-all shadow-2xl ${activeTab === t.id ? 'bg-white text-black border-white scale-105' : 'bg-black border-white/10 text-gray-600 hover:text-white hover:border-white/30'}`}
              >
                <t.icon size={18} />
                {t.label}
              </button>
          ))}
       </div>

       {/* DEEP WORK TIMER SECTION */}
       {activeTab === 'DEEP_WORK' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in slide-in-from-bottom-8 duration-700">
              <div className="lg:col-span-4 glass-panel p-12 rounded-[3.5rem] bg-black/40 h-fit border border-white/5 shadow-4xl">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3"><Terminal size={14}/> Mission Selection</h3>
                  <div className="space-y-5">
                      {objectives.filter(o => o.status !== 'Completed').map(obj => (
                          <div 
                            key={obj.id} 
                            onClick={() => setActiveTask(obj.task)} 
                            className={`p-6 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden ${activeTask === obj.task ? 'bg-cyber-purple/10 border-cyber-purple/40 shadow-[0_0_30px_rgba(213,0,249,0.1)]' : 'bg-black border-white/5 hover:border-white/20 hover:bg-white/5'}`}
                          >
                              <div className="relative z-10 flex justify-between items-center">
                                <p className={`text-xs font-black uppercase tracking-tight transition-colors ${activeTask === obj.task ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{obj.task}</p>
                                {activeTask === obj.task && <Zap size={14} className="text-cyber-purple animate-pulse" />}
                              </div>
                              {activeTask === obj.task && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-purple"></div>}
                          </div>
                      ))}
                      {objectives.filter(o => o.status !== 'Completed').length === 0 && (
                          <div className="py-12 text-center opacity-20 italic font-mono text-[10px] uppercase tracking-widest">No Active Frontlines detected. Scan for missions.</div>
                      )}
                  </div>
              </div>

              <div className="lg:col-span-8 glass-panel p-20 rounded-[5rem] border border-white/5 bg-gradient-to-br from-black/60 to-black/20 flex flex-col items-center justify-center text-center shadow-4xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                  <p className="text-[11px] font-mono text-gray-600 uppercase tracking-[1em] mb-12 animate-pulse relative z-10">:: Neural Focus Lock Protocol ::</p>
                  <h2 className="text-4xl font-display font-black text-white uppercase italic text-glow-blue mb-12 relative z-10 drop-shadow-2xl">{activeTask}</h2>
                  
                  <div className="text-[12rem] font-mono font-black text-white text-glow-blue leading-none mb-16 tracking-tighter relative z-10 select-none transition-all duration-700 hover:scale-105">
                    {formatTime(timeLeft)}
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-8 relative z-10">
                      <div className="flex bg-black/60 p-2 rounded-[2.5rem] border border-white/10">
                          {['POMO', '52_17', 'ULTRADIAN'].map(m => (
                              <button key={m} onClick={() => handleModeChange(m as any)} className={`px-8 py-3 rounded-[1.8rem] text-[9px] font-black uppercase transition-all ${mode === m ? 'bg-white text-black shadow-2xl' : 'text-gray-500 hover:text-white'}`}>{m.replace('_', '/')}</button>
                          ))}
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setIsRunning(!isRunning)} 
                          className={`flex items-center gap-4 px-16 py-5 rounded-[2.5rem] font-black uppercase tracking-[0.4em] transition-all shadow-4xl transform hover:translate-y-[-4px] active:scale-95 ${isRunning ? 'bg-spartan-red text-white' : 'bg-wealth-green text-black'}`}
                        >
                            {isRunning ? <><Pause size={20}/> Pause</> : <><Play size={20}/> Engage Focus</>}
                        </button>
                        <button 
                          onClick={() => { setIsRunning(false); handleModeChange(mode); }} 
                          className="p-5 bg-white/5 border border-white/10 rounded-[2.5rem] text-gray-600 hover:text-white hover:bg-white/10 transition-all active:rotate-180 duration-500"
                        >
                          <RotateCcw size={24}/>
                        </button>
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

                   <div className="p-12 bg-white/5 rounded-[4rem] border border-dashed border-white/10 flex flex-col md:flex-row items-center gap-12 text-center md:text-left relative z-10">
                       <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center shadow-inner flex-shrink-0"><Brain size={32} className="text-gray-500" /></div>
                       <div className="space-y-4">
                         <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Architect's Heuristic</h4>
                         <p className="text-xl font-bold text-gray-300 italic leading-relaxed">"If it's not a <span className="text-wealth-green">'Hell Yes'</span>, it's a <span className="text-spartan-red">'Hell No'</span>. Avoid the trap of over-optimizing for the short term."</p>
                       </div>
                   </div>
               </div>

               {/* ADDITIONAL ANALYTICS MOCKUP */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 bg-black/40 flex items-center gap-8">
                      <div className="p-6 bg-electric-blue/10 text-electric-blue rounded-[2rem]"><BarChart3 size={32}/></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Decisional Velocity</p>
                        <p className="text-2xl font-mono font-black text-white">94% OPTIMIZED</p>
                      </div>
                   </div>
                   <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 bg-black/40 flex items-center gap-8">
                      <div className="p-6 bg-wealth-green/10 text-wealth-green rounded-[2rem]"><ShieldCheck size={32}/></div>
                      <div>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Strategic Integrity</p>
                        <p className="text-2xl font-mono font-black text-white">S-TIER SECURE</p>
                      </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
