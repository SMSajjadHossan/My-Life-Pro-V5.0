
import React, { useEffect, useState } from 'react';
import { AppSection, FinancialState } from '../types';
import { 
  LayoutDashboard, Wallet, Activity, Target, Bot, Menu, X, 
  ShieldCheck, Clock, BookOpen, MessageSquare, 
  ChevronRight, Zap, Command, Eye, EyeOff, ShieldAlert, TrendingUp, LifeBuoy, Maximize,
  ChevronLast, ChevronFirst
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('titan_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [age, setAge] = useState({ y: 0, m: 0, d: 0, h: 0, min: 0, s: 0 });
  const [lifePercent, setLifePercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isZenMode, setIsZenMode] = useState(false);

  const isHighRisk = userProfile.systemicRisk > 40;

  useEffect(() => {
    localStorage.setItem('titan_sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

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
    { id: AppSection.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, color: 'text-white' },
    { id: AppSection.WAR_ROOM, label: 'AI Strategy Coach', icon: Bot, color: 'text-spartan-red' },
    { id: AppSection.WEALTH, label: 'Wealth Manager', icon: Wallet, color: 'text-wealth-green' },
    { id: AppSection.SPARTAN, label: 'Health & Body', icon: Activity, color: 'text-electric-blue' },
    { id: AppSection.ACADEMY, label: 'Focus & Learning', icon: Target, color: 'text-cyber-purple' },
    { id: AppSection.KNOWLEDGE, label: 'Library & Notes', icon: BookOpen, color: 'text-gold' },
    { id: AppSection.SOCIAL, label: 'Social Skills', icon: MessageSquare, color: 'text-blue-400' },
  ];

  return (
    <div className={`min-h-screen bg-obsidian flex overflow-hidden relative text-gray-200 font-sans selection:bg-spartan-red/30 ${isHighRisk ? 'ring-inset ring-8 ring-spartan-red/10' : ''}`}>
      <div className="fixed inset-0 pointer-events-none z-[500] opacity-[0.05] overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[501] bg-[length:100%_2px,3px_100%]"></div>
      </div>

      <div 
        className={`fixed inset-0 z-[600] bg-black/80 backdrop-blur-md transition-opacity duration-500 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside 
        className={`fixed left-0 top-0 bottom-0 z-[700] bg-black/95 backdrop-blur-3xl border-r border-white/10 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] 
          ${isCollapsed ? 'w-24' : 'w-80'} 
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
          shadow-[20px_0_50px_rgba(0,0,0,0.9)]`}
      >
        <div className="flex flex-col h-full overflow-hidden">
            <div className={`flex items-center p-8 mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <div className="flex items-center gap-4">
                    <ShieldCheck size={28} className="text-spartan-red flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-display font-black text-xl uppercase tracking-tighter italic">
                        MYLIFE<span className="text-spartan-red ml-1 text-sm">v10</span>
                      </span>
                    )}
                </div>
                {!isCollapsed && (
                   <button onClick={() => setIsCollapsed(true)} className="hidden lg:flex p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                     <ChevronFirst size={20}/>
                   </button>
                )}
                {mobileMenuOpen && (
                   <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-2 text-gray-500 hover:text-white bg-white/5 rounded-xl transition-all">
                     <X size={24}/>
                   </button>
                )}
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;
                    return (
                        <button 
                          key={item.id} 
                          onClick={() => { setSection(item.id); setMobileMenuOpen(false); }} 
                          title={isCollapsed ? item.label : undefined}
                          className={`w-full flex items-center gap-5 p-5 rounded-[1.8rem] transition-all group relative overflow-hidden
                            ${isActive ? 'bg-white/10 border border-white/10 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'}
                            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                        >
                            <Icon size={24} className={`${isActive ? item.color : 'text-gray-600 group-hover:text-white'} transition-colors flex-shrink-0`} />
                            {!isCollapsed && (
                              <span className="font-display font-black text-[12px] uppercase tracking-widest whitespace-nowrap">
                                {item.label}
                              </span>
                            )}
                            {isActive && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}
                        </button>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto border-t border-white/5">
                {isCollapsed ? (
                   <button onClick={() => setIsCollapsed(false)} className="w-full flex justify-center p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-gray-400">
                     <ChevronLast size={24}/>
                   </button>
                ) : (
                  <div className="bg-black/40 border border-white/5 p-6 rounded-[2.2rem] relative overflow-hidden group">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-2"><LifeBuoy size={12}/> Life Timeline Progress</span>
                          <span className="text-[10px] font-mono font-black text-white">{lifePercent.toFixed(4)}%</span>
                      </div>
                      <div className="h-1.5 bg-black rounded-full overflow-hidden mb-2 shadow-inner border border-white/5">
                          <div className="h-full bg-gradient-to-r from-spartan-red via-gold to-wealth-green transition-all duration-1000" style={{width: `${lifePercent}%`}}></div>
                      </div>
                      <p className="text-[7px] text-gray-800 font-black uppercase text-center tracking-[0.4em] mt-1">Goal: Financial Independence @ 35</p>
                  </div>
                )}
            </div>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-700 
        ${isCollapsed ? 'lg:pl-24' : 'lg:pl-80'}`}>
        
        <header className="h-24 flex items-center justify-between px-6 lg:px-10 bg-black/60 backdrop-blur-md border-b border-white/5 z-[100] relative">
            <div className="flex items-center gap-6 lg:gap-10">
                <button 
                  onClick={() => setMobileMenuOpen(true)} 
                  className="lg:hidden p-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] transition-all border border-white/10 group"
                >
                    <Menu size={22} className="group-hover:rotate-90 transition-transform duration-500" />
                </button>
                
                <div className="hidden sm:flex items-center gap-6 bg-black/40 border border-white/5 rounded-[2.5rem] px-8 py-3 shadow-inner">
                    <div className="flex items-center gap-4 font-mono text-[11px] font-black tracking-[0.2em]">
                        <div className="flex flex-col items-center">
                            <span className="text-white text-lg">{age.y}</span>
                            <span className="text-[6px] text-gray-700 uppercase">AGE</span>
                        </div>
                        <span className="text-gray-800 text-xl font-thin opacity-30">/</span>
                        <div className="flex flex-col items-center">
                            <span className="text-white text-lg">{age.m}</span>
                            <span className="text-[6px] text-gray-700 uppercase">MONTH</span>
                        </div>
                        <span className="text-gray-800 text-xl font-thin opacity-30">/</span>
                        <div className="flex flex-col items-center">
                            <span className="text-white text-lg">{age.d}</span>
                            <span className="text-[6px] text-gray-700 uppercase">DAY</span>
                        </div>
                        <div className="w-px h-8 bg-white/10 mx-2"></div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-spartan-red text-2xl">{age.h.toString().padStart(2, '0')}</span>
                            <span className="text-gray-600 text-xs">:</span>
                            <span className="text-white text-xl">{age.min.toString().padStart(2, '0')}</span>
                            <span className="text-gray-600 text-xs">:</span>
                            <span className="text-gray-800 text-lg tabular-nums animate-pulse">{age.s.toString().padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-4 lg:gap-8">
                <div className={`hidden md:flex items-center gap-4 px-6 py-2.5 rounded-[1.5rem] border ${isHighRisk ? 'bg-spartan-red/10 border-spartan-red/40 animate-pulse' : 'bg-white/5 border-white/5'}`}>
                    <ShieldAlert size={16} className={isHighRisk ? 'text-spartan-red' : 'text-gray-600'} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 whitespace-nowrap">Risk Status: <span className={isHighRisk ? 'text-spartan-red' : 'text-wealth-green'}>{userProfile.systemicRisk}%</span></span>
                </div>

                <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setIsZenMode(!isZenMode)} 
                      className={`p-3 rounded-xl transition-all ${isZenMode ? 'bg-electric-blue text-white shadow-[0_0_15px_rgba(41,121,255,0.4)]' : 'bg-white/5 text-gray-500 hover:text-white'}`}
                      title="Toggle Focus Mode"
                    >
                      <Maximize size={18}/>
                    </button>
                    <div className="flex items-center gap-3 border-l border-white/10 pl-4">
                        <p className="text-2xl lg:text-3xl font-mono font-black text-white tracking-tighter tabular-nums leading-none">
                          {currentTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
            </div>
        </header>
        
        <main className={`flex-1 overflow-y-auto custom-scrollbar relative z-10 transition-all duration-1000 ${isZenMode ? 'bg-black' : 'bg-obsidian/40 backdrop-blur-sm'}`}>
            <div className={`p-6 lg:p-10 mx-auto animate-in fade-in duration-1000 transition-all ${isZenMode ? 'max-w-[1200px]' : 'max-w-[1800px]'}`}>
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};
