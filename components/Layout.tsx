
import React, { useEffect, useState } from 'react';
import { AppSection } from '../types';
import { LayoutDashboard, Wallet, Activity, Target, Users, LogOut, Clock, BookOpen, Bot, Menu, X, ShieldCheck, Zap, WifiOff, Cloud, Upload, Download, Loader, RefreshCw, Settings, Database, Trash2, Save, HardDrive, FileJson } from 'lucide-react';

interface Props {
  currentSection: AppSection;
  setSection: (section: AppSection) => void;
  children: React.ReactNode;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Layout: React.FC<Props> = ({ currentSection, setSection, children, onExport, onImport }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateLifeStats = () => {
    const birthDate = new Date(2001, 8, 23);
    const now = currentTime;
    
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonthDate.getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }

    return {
        years,
        months,
        days,
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds()
    };
  };

  const ageStats = calculateLifeStats();

  const dateString = currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeString = currentTime.toLocaleTimeString('en-US');
  
  const navItems = [
    { id: AppSection.WAR_ROOM, label: 'War Room', icon: Bot, color: 'text-spartan-red', bg: 'bg-spartan-red/10', border: 'border-spartan-red/20' },
    { id: AppSection.SPARTAN, label: 'Bio-Vessel', icon: Activity, color: 'text-electric-blue', bg: 'bg-electric-blue/10', border: 'border-electric-blue/20' },
    { id: AppSection.ACADEMY, label: 'The Academy', icon: Target, color: 'text-cyber-purple', bg: 'bg-cyber-purple/10', border: 'border-cyber-purple/20' },
    { id: AppSection.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, color: 'text-white', bg: 'bg-white/10', border: 'border-white/20' },
    { id: AppSection.WEALTH, label: 'Wealth', icon: Wallet, color: 'text-wealth-green', bg: 'bg-wealth-green/10', border: 'border-wealth-green/20' },
    { id: AppSection.KNOWLEDGE, label: 'Neural Vault', icon: BookOpen, color: 'text-gold', bg: 'bg-gold/10', border: 'border-gold/20' },
    { id: AppSection.SOCIAL, label: 'Dynamics', icon: Users, color: 'text-gray-400', bg: 'bg-gray-800', border: 'border-gray-700' },
  ];

  return (
    <div className="min-h-screen font-sans flex flex-col md:flex-row overflow-hidden relative bg-obsidian text-gray-200 selection:bg-electric-blue selection:text-white">
      
      {/* --- LIVING AURORA BACKGROUND (Butter Smooth Animation) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-electric-blue/10 rounded-full blur-[150px] animate-blob mix-blend-screen opacity-60"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-spartan-red/5 rounded-full blur-[130px] animate-blob animation-delay-2000 mix-blend-screen opacity-60"></div>
          <div className="absolute top-[40%] left-[30%] w-[600px] h-[600px] bg-cyber-purple/5 rounded-full blur-[180px] animate-blob animation-delay-4000 mix-blend-screen opacity-60"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-white/5 glass-panel z-50 sticky top-0 backdrop-blur-xl">
          <h1 className="text-xl font-display font-black tracking-tighter italic text-white flex items-center gap-2">
                <ShieldCheck size={20} className="text-spartan-red"/>
                MYLIFE<span className="text-spartan-red text-glow-red">PRO</span>
          </h1>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
              {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
          </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`fixed md:relative z-40 w-64 h-full transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-500 cubic-bezier(0.23, 1, 0.32, 1) flex-shrink-0 border-r border-white/5 glass-panel flex flex-col bg-black/40 backdrop-blur-md`}>
        <div className="p-6 border-b border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-spartan-red to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <h1 className="text-2xl font-display font-black tracking-tighter italic text-white mb-1 cursor-default">
                MYLIFE<span className="text-spartan-red text-glow-red">PRO</span>
            </h1>
            <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-electric-blue border border-electric-blue/30 px-1.5 py-0.5 rounded bg-electric-blue/5">TITANIUM CORE</span>
                    <span className="flex items-center gap-1 text-[9px] font-bold uppercase border px-2 py-0.5 rounded transition-colors text-gray-500 border-white/10 bg-white/5">
                        <Zap size={8} className="text-wealth-green fill-wealth-green"/> Local
                    </span>
                </div>
                {/* AUTO-SAVE VISUAL INDICATOR */}
                <div className="flex items-center gap-2 text-[9px] font-bold uppercase text-wealth-green">
                    <span className="w-1.5 h-1.5 rounded-full bg-wealth-green animate-pulse"></span>
                    System Saved
                </div>
            </div>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => { setSection(item.id); setMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-300 group relative overflow-hidden active:scale-95 ${
                        currentSection === item.id 
                        ? `${item.bg} ${item.border} border shadow-[0_0_20px_rgba(0,0,0,0.2)]` 
                        : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                    {currentSection === item.id && (
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor] animate-in`}></div>
                    )}
                    
                    <item.icon size={18} className={`transition-colors duration-300 ${currentSection === item.id ? item.color : 'text-gray-600 group-hover:text-gray-300'}`} />
                    <span className={`font-display font-bold text-sm uppercase tracking-wider ${currentSection === item.id ? 'text-white' : ''}`}>{item.label}</span>
                    
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </button>
            ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)] md:h-screen relative z-10 custom-scrollbar scroll-smooth">
         {/* THE TIME MACHINE HEADER */}
         <div className="w-full p-4 border-b border-white/5 sticky top-0 z-30 glass-panel backdrop-blur-xl transition-all duration-300">
             <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-white/10 shadow-inner group hover:border-white/20 transition-colors">
                        <Clock size={14} className="text-spartan-red animate-pulse" />
                        <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wide">
                            {dateString} <span className="text-gray-700 mx-1">|</span> {timeString}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.2em] hidden md:block">Life Clock Initialized</div>
                    <div className="text-xs font-mono font-bold tracking-tight text-electric-blue text-glow-blue bg-electric-blue/5 px-4 py-1.5 rounded-full border border-electric-blue/20 shadow-[0_0_15px_rgba(41,121,255,0.1)] hover:shadow-[0_0_20px_rgba(41,121,255,0.3)] transition-shadow cursor-default">
                    {ageStats.years}Y {ageStats.months}M {ageStats.days}D <span className="text-gray-600 mx-1">::</span> {ageStats.hours}H {ageStats.minutes}M {ageStats.seconds}S
                    </div>
                </div>
             </div>
         </div>

         {/* Content Wrapper */}
         <div className="p-4 md:p-8 max-w-7xl mx-auto pb-32 animate-in">
            {children}
         </div>
      </main>
    </div>
  );
};
