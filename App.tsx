
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WealthFortress } from './components/WealthFortress';
import { SpartanVessel } from './components/SpartanVessel';
import { TheAcademy } from './components/TheAcademy';
import { KnowledgeVault } from './components/KnowledgeVault';
import { SocialDynamics } from './components/SocialDynamics';
import { WarRoom } from './components/WarRoom';
import { AppSection, FinancialState, Habit, Book, UserProfile, Transaction, JournalTask, DailyAction, ChecklistState } from './types';
import { INITIAL_USER_PROFILE, INITIAL_HABITS, INITIAL_LIBRARY, INITIAL_STRATEGIC_OBJECTIVES } from './constants';
import { Command, Search, Zap, DollarSign, CheckSquare, ArrowRight, X, Terminal, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.WEALTH);
  
  // -- USER PROFILE WITH XP --
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
      try {
          const saved = localStorage.getItem('user_profile');
          return saved ? JSON.parse(saved) : { ...INITIAL_USER_PROFILE, xp: 0, level: 1, rank: 'Recruit' };
      } catch (e) {
          console.error("Profile load error", e);
          return { ...INITIAL_USER_PROFILE, xp: 0, level: 1, rank: 'Recruit' };
      }
  });

  // State initialization with SAFETY MERGE
  const [financialData, setFinancialData] = useState<FinancialState>(() => {
    const defaultData: FinancialState = {
      bankA: 0, bankB: 0, bankC: 0, monthlyIncome: 0,
      transactions: [],
      assets: [],
      businesses: [],
      loans: [],
      legacyProjects: [],
      budgetSnapshots: [],
      mindsetLogs: [] 
    };

    try {
        const saved = localStorage.getItem('financialData');
        if (!saved) return defaultData;

        const parsed = JSON.parse(saved);
        
        // Deep Merge / Sanitize
        return {
            ...defaultData,
            ...parsed,
            transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
            assets: Array.isArray(parsed.assets) ? parsed.assets : [],
            businesses: Array.isArray(parsed.businesses) ? parsed.businesses : [],
            loans: Array.isArray(parsed.loans) ? parsed.loans : [],
            legacyProjects: Array.isArray(parsed.legacyProjects) ? parsed.legacyProjects : [],
            budgetSnapshots: Array.isArray(parsed.budgetSnapshots) ? parsed.budgetSnapshots : [],
            mindsetLogs: Array.isArray(parsed.mindsetLogs) ? parsed.mindsetLogs : []
        };
    } catch (e) {
        console.error("Financial Data Corruption Detected. Resetting to Safe Default.", e);
        return defaultData;
    }
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
        const saved = localStorage.getItem('habits');
        if (saved) {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed.map((h: any) => ({
            ...h,
            history: h.history || (h.lastCompleted ? [h.lastCompleted] : [])
          })) : INITIAL_HABITS;
        }
        return INITIAL_HABITS;
    } catch {
        return INITIAL_HABITS;
    }
  });

  const [books, setBooks] = useState<Book[]>(() => {
    try {
        const saved = localStorage.getItem('books');
        return saved ? JSON.parse(saved) : INITIAL_LIBRARY;
    } catch {
        return INITIAL_LIBRARY;
    }
  });
  
  // -- NEW: LIFTED DASHBOARD STATE --
  const [objectives, setObjectives] = useState<JournalTask[]>(() => {
      try {
          const saved = localStorage.getItem('dash_objectives');
          return saved ? JSON.parse(saved) : INITIAL_STRATEGIC_OBJECTIVES;
      } catch {
          return INITIAL_STRATEGIC_OBJECTIVES;
      }
  });

  const [checklists, setChecklists] = useState<ChecklistState>(() => {
      try {
          const saved = localStorage.getItem('dash_checklists');
          return saved ? JSON.parse(saved) : { morning: {}, daytime: {}, mindset: {}, finance: {} };
      } catch {
          return { morning: {}, daytime: {}, mindset: {}, finance: {} };
      }
  });

  const [dailyActions, setDailyActions] = useState<DailyAction[]>(() => {
      try {
          const saved = localStorage.getItem('dash_daily_actions');
          return saved ? JSON.parse(saved) : [];
      } catch {
          return [];
      }
  });

  // --- 🔥 AUTO-SAVE (SYNC TO LOCALSTORAGE) ---
  useEffect(() => {
      localStorage.setItem('financialData', JSON.stringify(financialData));
      localStorage.setItem('habits', JSON.stringify(habits));
      localStorage.setItem('books', JSON.stringify(books));
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      localStorage.setItem('dash_objectives', JSON.stringify(objectives));
      localStorage.setItem('dash_checklists', JSON.stringify(checklists));
      localStorage.setItem('dash_daily_actions', JSON.stringify(dailyActions));
  }, [financialData, habits, books, userProfile, objectives, checklists, dailyActions]);

  // --- COMPREHENSIVE DATA CORE EXPORT/IMPORT ---
  // We explicitly list every key used by every component to ensure a full backup.
  const ALL_SYSTEM_KEYS = [
      // Main State
      'financialData', 'habits', 'books', 'user_profile', 
      'dash_objectives', 'dash_checklists', 'dash_daily_actions', 'dash_tomorrow',
      // War Room
      'war_room_chat', 'pending_audit', 'pending_ai_trigger',
      // Wealth Fortress
      'wealth_journal_data_v2', 'wealth_fire_inputs_v2',
      // Spartan Vessel
      'spartan_daily_tracker_v6', 'spartan_custom_checklist', 'spartan_daily_code_v2', 'spartan_custom_knowledge',
      // The Academy
      'academy_capitals', 'academy_gaps', 'academy_bezos', 'academy_evening_checks', 'academy_failures', 'academy_sprint_obj', 'academy_sprint_end', 'academy_exams', 'academy_logs'
  ];

  const handleExport = () => {
      const exportBundle: Record<string, any> = {
          meta: {
              version: "Titanium-5.3",
              timestamp: new Date().toISOString(),
              agent: navigator.userAgent
          },
          data: {}
      };

      // Read directly from LocalStorage to capture sub-component state not held in App.tsx
      ALL_SYSTEM_KEYS.forEach(key => {
          const raw = localStorage.getItem(key);
          if (raw !== null) {
              try {
                  exportBundle.data[key] = JSON.parse(raw);
              } catch (e) {
                  exportBundle.data[key] = raw; // Handle raw strings if any
              }
          }
      });

      const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MYLIFE_CORE_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Soul File Extracted Successfully", "success");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const file = input.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const content = event.target?.result as string;
              if (!content) {
                  alert("Error: Empty file uploaded.");
                  return;
              }

              let bundle;
              try {
                  bundle = JSON.parse(content);
              } catch (jsonErr) {
                  alert("Error: File is not valid JSON.");
                  return;
              }
              
              // SUPPORT BOTH NEW (bundle.data) AND LEGACY (flat) FORMATS
              let dataToRestore: any = null;
              let version = bundle.meta?.version || "Legacy Format";
              
              if (bundle.data) {
                  dataToRestore = bundle.data;
              } else if (bundle.financialData || bundle.habits) {
                  // It's a legacy flat file
                  dataToRestore = bundle;
              }

              if (!dataToRestore || Object.keys(dataToRestore).length === 0) {
                  alert("Error: No valid system data found in file.");
                  return;
              }

              const keyCount = Object.keys(dataToRestore).length;

              if(confirm(`⚠ SYSTEM RESTORE DETECTED ⚠\n\nVersion: ${version}\nData Points: ${keyCount}\n\nThis will DELETE current data and load the backup. Proceed?`)) {
                  
                  // 1. Wipe current system
                  localStorage.clear();
                  
                  // 2. Write new data
                  // CRITICAL: We do NOT call setFinancialData or other state setters here.
                  // Calling them would trigger the 'useEffect' auto-save, which would capture
                  // the *current* (old) state of other variables (like habits/books) and overwrite
                  // what we just restored to localStorage.
                  // Instead, we write to localStorage and force a reload.
                  
                  Object.entries(dataToRestore).forEach(([key, value]) => {
                      if (typeof value === 'object') {
                          localStorage.setItem(key, JSON.stringify(value));
                      } else {
                          localStorage.setItem(key, String(value));
                      }
                  });

                  alert("System Restored Successfully. Rebooting interface...");
                  
                  // 3. Hard Reload to re-initialize all components from the fresh localStorage
                  window.location.reload();
              }
          } catch (err) {
              console.error(err);
              alert("Critical Error during restore. Check console for details.");
          } finally {
              // Ensure input is reset so the same file can be selected again if needed
              input.value = '';
          }
      };
      reader.readAsText(file);
  };

  // --- LOGIC HELPERS ---
  const calculateStreak = (history: string[]): number => {
    if (!history || history.length === 0) return 0;
    const sorted = [...new Set(history)].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    if (!sorted.includes(today) && !sorted.includes(yesterday)) return 0;

    let streak = 0;
    let checkDateStr = sorted.includes(today) ? today : yesterday;
    while (sorted.includes(checkDateStr)) {
        streak++;
        const d = new Date(checkDateStr);
        d.setDate(d.getDate() - 1);
        checkDateStr = d.toISOString().split('T')[0];
    }
    return streak;
  };

  const addXp = (amount: number) => {
      setUserProfile(prev => {
          let newXp = prev.xp + amount;
          const nextLevelXp = prev.level * 1000;
          if (newXp >= nextLevelXp) {
              const newLevel = prev.level + 1;
              newXp = newXp - nextLevelXp;
              let newRank = prev.rank;
              if (newLevel >= 5) newRank = 'Soldier';
              if (newLevel >= 10) newRank = 'Commander';
              if (newLevel >= 20) newRank = 'Warlord';
              if (newLevel >= 50) newRank = 'Emperor';
              return { ...prev, xp: newXp, level: newLevel, rank: newRank };
          }
          return { ...prev, xp: newXp };
      });
      showToast(`+${amount} XP Gained`, 'success');
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
        if(h.id === id) {
            const today = new Date().toISOString().split('T')[0];
            const historySet = new Set<string>(h.history || []);
            if (historySet.has(today)) {
                historySet.delete(today);
                addXp(-50);
            } else {
                historySet.add(today);
                addXp(100);
            }
            const newHistory = Array.from(historySet);
            return { 
                ...h, history: newHistory, streak: calculateStreak(newHistory), 
                lastCompleted: historySet.has(today) ? today : (newHistory.sort().reverse()[0] || null) 
            };
        }
        return h;
    }));
  };

  const adjustHabit = (id: string, amount: number) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, streak: Math.max(0, h.streak + amount) } : h));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  // --- COMMAND CENTER LOGIC ---
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCmdOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
      if (cmdOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [cmdOpen]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3000);
  };

  const executeCommand = (cmd: string) => {
      const lower = cmd.toLowerCase().trim();
      setCmdOpen(false);
      setCmdQuery('');

      if (lower.includes('wealth')) { setCurrentSection(AppSection.WEALTH); return; }
      if (lower.includes('health') || lower.includes('spartan')) { setCurrentSection(AppSection.SPARTAN); return; }
      if (lower.includes('war') || lower.includes('chat')) { setCurrentSection(AppSection.WAR_ROOM); return; }
      if (lower.includes('dash')) { setCurrentSection(AppSection.DASHBOARD); return; }
      if (lower.includes('learn') || lower.includes('book')) { setCurrentSection(AppSection.KNOWLEDGE); return; }
      if (lower.includes('goal') || lower.includes('acad')) { setCurrentSection(AppSection.ACADEMY); return; }

      if (lower.startsWith('/log')) {
          const parts = lower.split(' ');
          if (parts.length >= 3) {
              const amount = parseFloat(parts[1]);
              const desc = parts.slice(2).join(' ');
              if (!isNaN(amount)) {
                  const newTx: Transaction = {
                      id: Date.now().toString(),
                      date: new Date().toISOString().split('T')[0],
                      amount: -amount,
                      description: desc,
                      category: 'Needs',
                      bank: 'C'
                  };
                  setFinancialData(prev => ({ ...prev, bankC: prev.bankC - amount, transactions: [newTx, ...prev.transactions] }));
                  showToast(`Logged ৳${amount} for ${desc}`, 'success');
                  addXp(20);
                  return;
              }
          }
      }

      if (lower.startsWith('/done')) {
          const search = lower.replace('/done', '').trim();
          const target = habits.find(h => h.name.toLowerCase().includes(search));
          if (target) {
              toggleHabit(target.id);
              showToast(`Toggled Habit: ${target.name}`, 'success');
              return;
          } else {
              showToast('Habit not found', 'error');
              return;
          }
      }

      if (lower.startsWith('/audit')) {
          localStorage.setItem('pending_audit', 'true');
          setCurrentSection(AppSection.WAR_ROOM);
          showToast('Initializing Life Audit Protocol...', 'info');
          return;
      }

      const warRoomHistory = JSON.parse(localStorage.getItem('war_room_chat') || '[]');
      warRoomHistory.push({ id: Date.now().toString(), role: 'user', content: cmd, timestamp: new Date().toISOString() });
      localStorage.setItem('war_room_chat', JSON.stringify(warRoomHistory));
      localStorage.setItem('pending_ai_trigger', 'true'); 
      setCurrentSection(AppSection.WAR_ROOM);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
          executeCommand(cmdQuery);
      }
  };

  const renderSection = () => {
    switch(currentSection) {
      case AppSection.DASHBOARD: 
        return <Dashboard 
                  profile={userProfile} 
                  habits={habits} 
                  financialData={financialData}
                  objectives={objectives}
                  setObjectives={setObjectives}
                  checklists={checklists}
                  setChecklists={setChecklists}
                  dailyActions={dailyActions}
                  setDailyActions={setDailyActions}
               />;
      case AppSection.WAR_ROOM: return <WarRoom financialData={financialData} habits={habits} profile={userProfile} objectives={objectives} books={books} />;
      case AppSection.WEALTH: return <WealthFortress data={financialData} updateData={setFinancialData} />;
      case AppSection.KNOWLEDGE: return <KnowledgeVault books={books} setBooks={setBooks} />;
      case AppSection.SPARTAN: return <SpartanVessel habits={habits} toggleHabit={toggleHabit} adjustHabit={adjustHabit} updateHabit={updateHabit} />;
      case AppSection.ACADEMY: return <TheAcademy />;
      case AppSection.SOCIAL: return <SocialDynamics />;
      default: return <Dashboard 
                  profile={userProfile} 
                  habits={habits} 
                  financialData={financialData}
                  objectives={objectives}
                  setObjectives={setObjectives}
                  checklists={checklists}
                  setChecklists={setChecklists}
                  dailyActions={dailyActions}
                  setDailyActions={setDailyActions}
               />;
    }
  };

  return (
    <>
        {toast && (
            <div className={`fixed top-4 right-4 z-[100] px-6 py-3 rounded shadow-2xl border flex items-center gap-3 animate-in slide-in-from-top-5 ${toast.type === 'success' ? 'bg-green-900/90 border-green-500 text-white' : toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-white' : 'bg-slate-900/90 border-blue-500 text-white'}`}>
                {toast.type === 'success' && <CheckSquare size={18}/>}
                <span className="font-bold text-sm font-mono">{toast.msg}</span>
            </div>
        )}

        {cmdOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh] animate-in fade-in duration-200" onClick={() => setCmdOpen(false)}>
                <div className="w-full max-w-2xl bg-black border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-4 p-4 border-b border-gray-800">
                        <Terminal className="text-spartan-red" size={24} />
                        <input 
                            ref={inputRef}
                            className="flex-1 bg-transparent text-xl text-white placeholder-gray-600 outline-none font-mono"
                            placeholder="Type a command or ask AI..."
                            value={cmdQuery}
                            onChange={e => setCmdQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="hidden md:flex gap-2">
                            <span className="text-[10px] text-gray-500 border border-gray-800 px-2 py-1 rounded">ESC</span>
                            <span className="text-[10px] text-gray-500 border border-gray-800 px-2 py-1 rounded">↵ ENTER</span>
                        </div>
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto p-2 bg-slate-950/50">
                        {!cmdQuery && (
                            <div className="p-2 space-y-2">
                                <p className="text-[10px] uppercase font-bold text-gray-500 pl-2 mb-1">Quick Links</p>
                                {[
                                    { cmd: 'Goto War Room', icon: Cpu, desc: 'AI Commander' },
                                    { cmd: 'Goto Wealth', icon: DollarSign, desc: 'Financial Fortress' },
                                    { cmd: 'Goto Dashboard', icon: Zap, desc: 'Main Status' }
                                ].map(item => (
                                    <button key={item.cmd} onClick={() => executeCommand(item.cmd)} className="w-full flex items-center gap-3 p-3 rounded hover:bg-white/10 group transition-colors">
                                        <item.icon size={18} className="text-gray-500 group-hover:text-white"/>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-gray-300 group-hover:text-white">{item.cmd}</p>
                                            <p className="text-[10px] text-gray-600">{item.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                        {cmdQuery && (
                            <div className="p-2">
                                <button onClick={() => executeCommand(cmdQuery)} className="w-full flex items-center gap-3 p-3 rounded bg-blue-900/20 border border-blue-900/50 hover:bg-blue-900/40">
                                    <Search size={18} className="text-blue-400"/>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-blue-200">Ask General: "{cmdQuery}"</p>
                                        <p className="text-[10px] text-blue-400">Send query to War Room AI</p>
                                    </div>
                                    <ArrowRight size={16} className="ml-auto text-blue-500"/>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        <Layout 
            currentSection={currentSection} 
            setSection={setCurrentSection}
            onExport={handleExport}
            onImport={handleImport}
        >
          {renderSection()}
        </Layout>
    </>
  );
};

export default App;
