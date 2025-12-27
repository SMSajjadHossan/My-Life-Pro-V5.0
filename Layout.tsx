
import React, { useEffect, useState } from 'react';
import { AppSection, FinancialState } from './types';
import { 
  LayoutDashboard, Wallet, Activity, Target, Bot, Menu, X, 
  ShieldCheck, Clock, BookOpen, MessageSquare, 
  ChevronRight, Zap, Command, Eye, EyeOff, ShieldAlert, TrendingUp, LifeBuoy, Maximize
} from 'lucide-react';

interface Props {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
  children: React.ReactNode;
  financialData: FinancialState;
  setFinancialData: (data: FinancialState) => void;
  userProfile: any;
}

export const Layout: React.FC<Props> = ({ currentSection, setSection, children, financialData, setFinancialData, userProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [age, setAge] = useState({ y: 0, m: 0, d: 0, h: 0, min: 0, s: 0 });
  const [lifePercent, setLifePercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isZenMode, setIsZenMode] = useState(false);

  const isHighRisk = userProfile.systemicRisk > 40;

  useEffect(() => {
    const timer = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        const birthDateStr = userProfile.birthDate || "2001-09-23T00:00:00";
        const birth = new Date(birthDateStr);
        const diff = now.getTime() - birth.getTime();
        const totalSeconds = Math.floor(diff / 1000);
        
        const y = Math.floor(totalSeconds / (365.25 * 24 * 3600));
        const m = Math.floor((totalSeconds % (365.25 * 24 * 3600)) / (30.44 * 24 * 3600));
        const d = Math.floor((totalSeconds % (30.44 * 24 * 3600)) / (24 * 3600));
        const h = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const min = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        
        setAge({ y, m, d, h, min, s });

        const lifespanSeconds = 80 * 365.25 * 24 * 3600;
        setLifePercent((totalSeconds / lifespanSeconds) * 100);
    }, 1000);
    return () => clearInterval(timer);
  }, [userProfile.birthDate]);

  const navItems = [
    { id: AppSection.DASHBOARD, label: 'Control Center', icon: LayoutDashboard, color: 'text-white' },
    { id: AppSection.WAR_ROOM, label: 'Strategic AI', icon: Bot, color: 'text-spartan-red' },
    { id: AppSection.WEALTH, label: 'Wealth Engine', icon: Wallet, color: 'text-wealth-green' },
    { id: AppSection.SPARTAN, label: 'Bio-Vessel', icon: Activity, color: 'text-electric-blue' },
    { id: AppSection.ACADEMY, label: 'Titan Academy', icon: Target, color: 'text-cyber-purple' },
    { id: AppSection.KNOWLEDGE, label: 'Neural Vault', icon: BookOpen, color: 'text-gold' },
    { id: AppSection.SOCIAL, label: 'Social Frame', icon: MessageSquare, color: 'text-blue-400' },
  ];

  return (
    <div className={`min-h-screen bg-obsidian flex overflow-hidden relative text-gray-200 font-sans selection:bg-spartan-red/30 ${isHighRisk ? 'ring-inset ring-8 ring-spartan-red/10' : ''}`}>
      {/* HUD Layer - Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-[500] opacity-[0.05] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[501] bg-[length:100%_2px,3px_100%]"></div>
      </div>

      {/* Side Navigation Overlay (Mobile & Desktop) */}
      <div 
        className={`fixed inset-0 z-[600] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside 
        className={`fixed left-0 top-0 bottom-0 z-[700] w-80 bg-black/95 backdrop-blur-3xl border-r border-white/10 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} shadow-[50px_0_100px_rgba(0,0,0,0.9)]`}
      >
        <div className="p-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                    <ShieldCheck size={28} className={isHighRisk ? 'text-spartan-red animate-ping' : 'text-spartan-red'} />
                    <span className="font-display font-black text-xl uppercase tracking-tighter italic">SOVEREIGN<span className="text-spartan-red ml-1 text-sm">v10.GOD</span></span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-xl"><X size={24}/></button>
            </div>
            <nav className="space-y-4 flex-1">
                {navItems.map(item => {
                    const Icon = item.icon;
                    return (
                        <button 
                          key={item.id} 
                          onClick={() => { setSection(item.id); setSidebarOpen(false); }} 
                          className={`w-full flex items-center justify-between px-6 py-5 rounded-[2rem] transition-all group ${currentSection === item.id ? 'bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
                        >
                            <div className="flex items-center gap-5">
                                <Icon size={24} className={currentSection === item.id ? item.color : 'text-gray-600 group-hover:text-white transition-colors'} />
                                <span className="font-display font-black text-[13px] uppercase tracking-widest">{item.label}</span>
                            </div>
                            {currentSection === item.id && <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>}
                        </button>
                    );
                })}
            </nav>
            <div className="mt-auto pt-10 border-t border-white/5">
                <div className="bg-black/40 border border-white/5 p-6 rounded-[2.2rem] relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><LifeBuoy size={12}/> Existence Progress</span>
                        <span className="text-[11px] font-mono font-black text-white">{lifePercent.toFixed(5)}%</span>
                    </div>
                    <div className="h-2 bg-black rounded-full overflow-hidden mb-2 shadow-inner border border-white/5">
                        <div className="h-full bg-gradient-to-r from-spartan-red via-gold to-wealth-green transition-all duration-1000 shadow-[0_0_20px_rgba(255,42,42,0.4)]" style={{width: `${lifePercent}%`}}></div>
                    </div>
                    <p className="text-[7px] text-gray-700 font-black uppercase text-center tracking-[0.4em] mt-2">Projection: 80Y Earth Standard</p>
                </div>
            </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        <header className="h-24 flex items-center justify-between px-10 bg-black/60 backdrop-blur-md border-b border-white/5 z-[100] relative">
            <div className="flex items-center gap-10">
                <button 
                  onClick={() => setSidebarOpen(true)} 
                  className={`p-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] transition-all border border-white/10 shadow-inner group ${sidebarOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}
                >
                    <Menu size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
                
                {/* HUD: TIME COUNTER */}
                <div className="hidden md:flex items-center gap-6 bg-black/40 border border-white/5 rounded-[2.5rem] px-8 py-3 shadow-inner group hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4 font-mono text-[11px] font-black tracking-[0.2em]">
                        <div className="flex flex-col items-center">
                            <span className="text-white text-xl">{age.y}</span>
                            <span className="text-[7px] text-gray-600 uppercase">YRS</span>
                        </div>
                        <span className="text-gray-800 text-2xl font-thin">/</span>
                        <div className="flex flex-col items-center">
                            <span className="text-white text-xl">{age.m}</span>
                            <span className="text-[7px] text-gray-600 uppercase">MON</span>
                        </div>
                        <span className="text-gray-800 text-2xl font-thin">/</span>
                        <div className="flex flex-col items-center">
                            <span className="text-white text-xl">{age.d}</span>
                            <span className="text-[7px] text-gray-600 uppercase">DAY</span>
                        </div>
                        <div className="w-px h-10 bg-white/10 mx-4"></div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-spartan-red text-3xl drop-shadow-[0_0_12px_rgba(255,42,42,0.6)]">{age.h.toString().padStart(2, '0')}</span>
                            <span className="text-gray-600 text-xs">:</span>
                            <span className="text-white text-2xl">{age.min.toString().padStart(2, '0')}</span>
                            <span className="text-gray-600 text-xs">:</span>
                            <span className="text-gray-700 text-xl animate-pulse">{age.s.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-8">
                <div className={`hidden sm:flex items-center gap-4 px-8 py-3 rounded-[1.5rem] border ${isHighRisk ? 'bg-spartan-red/10 border-spartan-red/40 animate-pulse' : 'bg-white/5 border-white/5'}`}>
                    <ShieldAlert size={18} className={isHighRisk ? 'text-spartan-red' : 'text-gray-600'} />
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Systemic: <span className={isHighRisk ? 'text-spartan-red' : 'text-wealth-green'}>{userProfile.systemicRisk}%</span></span>
                </div>

                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsZenMode(!isZenMode)} className={`p-3 rounded-xl transition-all ${isZenMode ? 'bg-electric-blue text-white shadow-[0_0_15px_rgba(41,121,255,0.5)]' : 'bg-white/5 text-gray-500'}`}><Maximize size={18}/></button>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                            <Clock size={22} className="text-electric-blue animate-pulse" />
                            <p className="text-3xl font-mono font-black text-white tracking-tighter text-glow-blue tabular-nums">
                              {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        
        <main className={`flex-1 overflow-y-auto custom-scrollbar relative z-10 transition-all duration-1000 ${isZenMode ? 'bg-black' : 'bg-obsidian/40 backdrop-blur-sm'}`}>
            <div className={`p-6 lg:p-10 mx-auto animate-in fade-in duration-1000 ${isZenMode ? 'max-w-[1200px]' : 'max-w-[1800px]'}`}>
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};
