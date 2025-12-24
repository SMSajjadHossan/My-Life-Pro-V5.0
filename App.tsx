
import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WealthFortress } from './components/WealthFortress';
import { SpartanVessel } from './components/SpartanVessel';
import { TheAcademy } from './components/TheAcademy';
import { KnowledgeVault } from './components/KnowledgeVault';
import { SocialDynamics } from './components/SocialDynamics';
import { WarRoom } from './components/WarRoom';
import { AppSection, FinancialState, Habit, Book, UserProfile, JournalTask, DailyAction, ChecklistState } from './types';
import { INITIAL_USER_PROFILE, INITIAL_HABITS, INITIAL_LIBRARY, INITIAL_STRATEGIC_OBJECTIVES } from './constants';
import { Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.DASHBOARD);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
      try {
          const saved = localStorage.getItem('user_profile');
          return saved ? JSON.parse(saved) : { ...INITIAL_USER_PROFILE, xp: 0, level: 1, rank: 'Recruit' };
      } catch (e) {
          return { ...INITIAL_USER_PROFILE, xp: 0, level: 1, rank: 'Recruit' };
      }
  });

  const [financialData, setFinancialData] = useState<FinancialState>(() => {
    const defaultData: FinancialState = {
      bankA: 12000, bankB: 8000, bankC: 20000, 
      layerCore: 0, layerAccelerator: 0, layerOpportunity: 0,
      monthlyIncome: 8000,
      transactions: [],
      assets: [],
      businesses: [],
      loans: [],
      legacyProjects: [],
      budgetSnapshots: [],
      mindsetLogs: [],
      engineSettings: {
        wealthTaxRate: 20,
        fixedEmiAllocation: 30000,
        isSweepInEnabled: true,
        dividendFlywheelActive: true,
        inflationAdjustment: true,
        noLifestyleCreep: true,
        crashModeActive: false
      }
    };

    try {
        const saved = localStorage.getItem('financialData');
        if (!saved) return defaultData;
        const parsed = JSON.parse(saved);
        // Ensure new settings are merged if they don't exist in old storage
        return { 
          ...defaultData, 
          ...parsed, 
          engineSettings: { ...defaultData.engineSettings, ...(parsed.engineSettings || {}) }
        };
    } catch (e) {
        return defaultData;
    }
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
        const saved = localStorage.getItem('habits');
        return saved ? JSON.parse(saved) : INITIAL_HABITS;
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

  useEffect(() => {
      localStorage.setItem('financialData', JSON.stringify(financialData));
      localStorage.setItem('habits', JSON.stringify(habits));
      localStorage.setItem('books', JSON.stringify(books));
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      localStorage.setItem('dash_objectives', JSON.stringify(objectives));
      localStorage.setItem('dash_checklists', JSON.stringify(checklists));
      localStorage.setItem('dash_daily_actions', JSON.stringify(dailyActions));
  }, [financialData, habits, books, userProfile, objectives, checklists, dailyActions]);

  const handleExport = () => {
      const exportBundle = {
          meta: { version: "Titanium-9.0", timestamp: new Date().toISOString() },
          data: { financialData, habits, books, userProfile, objectives, checklists, dailyActions }
      };
      const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MYLIFE_SOUL_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const bundle = JSON.parse(event.target?.result as string);
              if (bundle.data) {
                  setFinancialData(bundle.data.financialData);
                  setHabits(bundle.data.habits);
                  setBooks(bundle.data.books);
                  setUserProfile(bundle.data.userProfile);
                  setObjectives(bundle.data.objectives);
                  setChecklists(bundle.data.checklists);
                  setDailyActions(bundle.data.dailyActions);
                  alert("System Re-Sychronized.");
              }
          } catch (err) {
              alert("Import failed.");
          }
      };
      reader.readAsText(file);
  };

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
        if(h.id === id) {
            const today = new Date().toISOString().split('T')[0];
            const historySet = new Set<string>(h.history || []);
            if (historySet.has(today)) historySet.delete(today);
            else historySet.add(today);
            return { ...h, history: Array.from(historySet), lastCompleted: historySet.has(today) ? today : h.lastCompleted };
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
      default: return null;
    }
  };

  return (
    <Layout 
        currentSection={currentSection} 
        setSection={setCurrentSection}
        onExport={handleExport}
        onImport={handleImport}
    >
      {renderSection()}
    </Layout>
  );
};

export default App;
