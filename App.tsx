
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WealthFortress } from './components/WealthFortress';
import { SpartanVessel } from './components/SpartanVessel';
import { TheAcademy } from './components/TheAcademy';
import { KnowledgeVault } from './components/KnowledgeVault';
import { SocialDynamics } from './components/SocialDynamics';
import { WarRoom } from './components/WarRoom';
import { AppSection, FinancialState, Habit, Book, UserProfile, JournalTask } from './types';
import { INITIAL_USER_PROFILE, INITIAL_HABITS, INITIAL_LIBRARY, INITIAL_STRATEGIC_OBJECTIVES } from './constants';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.DASHBOARD);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
      const saved = localStorage.getItem('titan_profile_v10');
      return saved ? JSON.parse(saved) : { 
        ...INITIAL_USER_PROFILE, 
        name: "Commander TITAN", 
        rank: "Sovereign Architect",
        missionStatement: "Architecting a 100 Crore Empire • Sovereignty via Code & Media • Absolute Victory"
      };
  });

  const [financialData, setFinancialData] = useState<FinancialState>(() => {
    const saved = localStorage.getItem('titan_wealth_v10');
    if (saved) {
        const parsed = JSON.parse(saved);
        // Migration logic: If old bankA exists, convert to accounts array
        if (!parsed.accounts && (parsed.bankA !== undefined)) {
            parsed.accounts = [
                { id: 'a1', name: 'Main Bank', balance: parsed.bankA || 0, type: 'Primary' },
                { id: 'a2', name: 'Investment Bank', balance: parsed.bankB || 0, type: 'Investment' },
                { id: 'a3', name: 'Expense Wallet', balance: parsed.bankC || 0, type: 'Daily' }
            ];
            delete parsed.bankA;
            delete parsed.bankB;
            delete parsed.bankC;
        }
        return parsed;
    }
    return {
      accounts: [
        { id: 'a1', name: 'Main Bank', balance: 100000, type: 'Primary' },
        { id: 'a2', name: 'Investment Fund', balance: 250000, type: 'Investment' },
        { id: 'a3', name: 'Daily Cash', balance: 50000, type: 'Daily' }
      ],
      isStealthMode: false,
      shadowVault: [],
      isShadowVaultLocked: true,
      sessionStartWealth: 0,
      totalCompoundedThisSession: 0,
      monthlyIncome: 50000,
      transactions: [],
      assets: [],
      businesses: [],
      loans: [],
      legacyProjects: [],
      budgetSnapshots: [],
      mindsetLogs: [],
      roadmapSettings: { targetMonthlyExpense: 60000, sipAmount: 30000, currentSIPStreak: 0, retirementTargetAge: 35, inflationAdjusted: true },
      engineSettings: { wealthTaxRate: 20, fixedEmiAllocation: 40000, isSweepInEnabled: true, dividendFlywheelActive: true, inflationAdjustment: true, noLifestyleCreep: true, crashModeActive: false }
    };
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('titan_habits_v10');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('titan_books_v10');
    return saved ? JSON.parse(saved) : INITIAL_LIBRARY;
  });
  
  const [objectives, setObjectives] = useState<JournalTask[]>(() => {
    const saved = localStorage.getItem('titan_objectives_v10');
    return saved ? JSON.parse(saved) : INITIAL_STRATEGIC_OBJECTIVES;
  });

  // EXPORT
  const exportSoul = () => {
    const soulData = {
      profile: userProfile,
      wealth: financialData,
      habits: habits,
      books: books,
      objectives: objectives,
      version: "10.GOD",
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(soulData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SOVEREIGN_SOUL_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // IMPORT
  const importSoul = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const soul = JSON.parse(event.target?.result as string);
        if (soul.profile) setUserProfile(soul.profile);
        if (soul.wealth) setFinancialData(soul.wealth);
        if (soul.habits) setHabits(soul.habits);
        if (soul.books) setBooks(soul.books);
        if (soul.objectives) setObjectives(soul.objectives);
        alert("SOUL RESTORED. SYSTEM REBOOTING...");
        window.location.reload();
      } catch (err) {
        alert("CRITICAL ERROR: Soul file corrupted.");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    const liquidCash = (financialData.accounts || []).reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
    const totalAssetsVal = (financialData.assets || []).reduce((a, b) => a + (Number(b.value) || 0), 0);
    const totalWealth = liquidCash + totalAssetsVal;
    
    const criticalHabits = habits.filter(h => ['Retention Protocol', 'Prayers (5x)', 'Deep Work (4hr)'].includes(h.name));
    const failedCriticalCount = criticalHabits.filter(h => h.streak === 0).length;
    
    let auditRisk = 0;
    if (userProfile.sleepHours && userProfile.sleepHours < 7) auditRisk += 15;
    if (userProfile.bodyFat && userProfile.bodyFat > 20) auditRisk += 20;
    
    const targetBurn = financialData.roadmapSettings?.targetMonthlyExpense || 40000;
    if (liquidCash < (targetBurn * 3)) auditRisk += 25;

    const calculatedRisk = Math.min(100, 5 + (failedCriticalCount * 20) + auditRisk);
    if (userProfile.systemicRisk !== calculatedRisk) setUserProfile(prev => ({ ...prev, systemicRisk: calculatedRisk }));

    const interval = setInterval(() => {
        const growth = (totalWealth * 0.12) / (365 * 24 * 3600);
        setFinancialData(prev => ({ ...prev, totalCompoundedThisSession: (prev.totalCompoundedThisSession || 0) + growth }));
    }, 1000);
    return () => clearInterval(interval);
  }, [financialData.accounts, financialData.assets, habits, userProfile.sleepHours, financialData.roadmapSettings]);

  useEffect(() => {
      localStorage.setItem('titan_wealth_v10', JSON.stringify(financialData));
      localStorage.setItem('titan_profile_v10', JSON.stringify(userProfile));
      localStorage.setItem('titan_habits_v10', JSON.stringify(habits));
      localStorage.setItem('titan_books_v10', JSON.stringify(books));
      localStorage.setItem('titan_objectives_v10', JSON.stringify(objectives));
  }, [financialData, userProfile, habits, books, objectives]);

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(h => h.id === id ? (h.lastCompleted === today ? { ...h, streak: Math.max(0, h.streak - 1), lastCompleted: null, history: h.history.filter(d => d !== today) } : { ...h, streak: h.streak + 1, lastCompleted: today, history: [...h.history, today] }) : h));
  };

  const renderSection = () => {
    switch (currentSection) {
      case AppSection.DASHBOARD: return <Dashboard profile={userProfile} habits={habits} financialData={financialData} objectives={objectives} setObjectives={setObjectives} exportSoul={exportSoul} importSoul={importSoul} setSection={setCurrentSection} />;
      case AppSection.WEALTH: return <WealthFortress data={financialData} updateData={setFinancialData} userAge={userProfile.age} setSection={setCurrentSection} />;
      case AppSection.SPARTAN: return <SpartanVessel habits={habits} profile={userProfile} toggleHabit={toggleHabit} updateProfile={setUserProfile} setHabits={setHabits} objectives={objectives} setObjectives={setObjectives} />;
      case AppSection.ACADEMY: return <TheAcademy objectives={objectives} setObjectives={setObjectives} />;
      case AppSection.KNOWLEDGE: return <KnowledgeVault books={books} setBooks={setBooks} />;
      case AppSection.SOCIAL: return <SocialDynamics />;
      case AppSection.WAR_ROOM: return <WarRoom financialData={financialData} habits={habits} profile={userProfile} objectives={objectives} books={books} />;
      default: return <Dashboard profile={userProfile} habits={habits} financialData={financialData} objectives={objectives} setObjectives={setObjectives} exportSoul={exportSoul} importSoul={importSoul} setSection={setCurrentSection} />;
    }
  };

  return (
    <Layout currentSection={currentSection} setSection={setCurrentSection} financialData={financialData} setFinancialData={setFinancialData} userProfile={userProfile}>
      {renderSection()}
    </Layout>
  );
};

export default App;
