
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
      const saved = localStorage.getItem('user_profile_v10_final');
      return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [financialData, setFinancialData] = useState<FinancialState>(() => {
    const defaultData: FinancialState = {
      bankA: 50000, bankB: 120000, bankC: 15000, 
      isStealthMode: false,
      shadowVault: [],
      isShadowVaultLocked: true,
      sessionStartWealth: 0,
      totalCompoundedThisSession: 0,
      monthlyIncome: 25000,
      transactions: [],
      assets: [],
      businesses: [],
      loans: [],
      legacyProjects: [],
      budgetSnapshots: [],
      mindsetLogs: [],
      roadmapSettings: {
        targetMonthlyExpense: 40000,
        sipAmount: 25000,
        currentSIPStreak: 0,
        retirementTargetAge: 35,
        inflationAdjusted: true
      },
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
    const saved = localStorage.getItem('financial_data_v10_final');
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits_v10_final');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('books_v10_final');
    return saved ? JSON.parse(saved) : INITIAL_LIBRARY;
  });
  
  const [objectives, setObjectives] = useState<JournalTask[]>(() => {
    const saved = localStorage.getItem('objectives_v10_final');
    return saved ? JSON.parse(saved) : INITIAL_STRATEGIC_OBJECTIVES;
  });

  // Pulse Compounding Engine & High-Sensitivity Systemic Risk Calculator
  useEffect(() => {
    const liquidCash = (Number(financialData.bankA) || 0) + (Number(financialData.bankB) || 0) + (Number(financialData.bankC) || 0);
    const totalAssetsVal = (financialData.assets || []).reduce((a, b) => a + (Number(b.value) || 0), 0);
    const totalWealth = liquidCash + totalAssetsVal;
    
    // God Mode Risk Logic: Tied to critical habits AND financial liquidity
    const criticalHabits = habits.filter(h => ['Retention Protocol', 'Prayers (5x)', 'Deep Work (4hr)'].includes(h.name));
    const failedCriticalCount = criticalHabits.filter(h => h.streak === 0).length;
    const totalMissedCount = habits.filter(h => h.streak === 0).length;
    
    // Custom Biological & Financial Audit Risk
    let auditRisk = 0;
    if (userProfile.sleepHours && userProfile.sleepHours < 7) auditRisk += 10;
    if (userProfile.bodyFat && userProfile.bodyFat > 20) auditRisk += 15;
    
    // Financial Risk: Low liquidity relative to burn
    const monthlyBurn = financialData.roadmapSettings?.targetMonthlyExpense || 40000;
    if (liquidCash < (monthlyBurn * 2)) auditRisk += 20; // High risk if less than 2 months buffer

    const riskBaseline = 5;
    const calculatedRisk = Math.min(100, riskBaseline + (failedCriticalCount * 15) + ((totalMissedCount - failedCriticalCount) * 5) + auditRisk);
    
    if (userProfile.systemicRisk !== calculatedRisk) {
        setUserProfile(prev => ({ ...prev, systemicRisk: calculatedRisk }));
    }

    if (totalWealth <= 0) return;

    // Pulse compounding simulation (12% APR default, can be dynamic based on assets)
    const interval = setInterval(() => {
        const growth = (totalWealth * 0.12) / (365 * 24 * 3600);
        setFinancialData(prev => ({
            ...prev,
            totalCompoundedThisSession: (prev.totalCompoundedThisSession || 0) + growth
        }));
    }, 1000);
    return () => clearInterval(interval);
  }, [financialData.bankA, financialData.bankB, financialData.bankC, financialData.assets, financialData.roadmapSettings, habits, userProfile.systemicRisk, userProfile.sleepHours, userProfile.bodyFat]);

  // Persistent Auto-Save
  useEffect(() => {
      localStorage.setItem('financial_data_v10_final', JSON.stringify(financialData));
      localStorage.setItem('user_profile_v10_final', JSON.stringify(userProfile));
      localStorage.setItem('habits_v10_final', JSON.stringify(habits));
      localStorage.setItem('books_v10_final', JSON.stringify(books));
      localStorage.setItem('objectives_v10_final', JSON.stringify(objectives));
  }, [financialData, userProfile, habits, books, objectives]);

  const toggleHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(h => {
      if (h.id === id) {
        if (h.lastCompleted === today) {
            return { 
                ...h, 
                streak: Math.max(0, h.streak - 1), 
                lastCompleted: null,
                history: h.history.filter(d => d !== today)
            };
        }
        return { 
            ...h, 
            streak: h.streak + 1, 
            lastCompleted: today,
            history: [...h.history, today]
        };
      }
      return h;
    }));
  };

  const exportSoul = () => {
    const soulData = { financialData, userProfile, habits, books, objectives };
    const blob = new Blob([JSON.stringify(soulData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sovereign_Soul_v10_GOD_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const importSoul = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.financialData) setFinancialData(data.financialData);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.habits) setHabits(data.habits);
        if (data.books) setBooks(data.books);
        if (data.objectives) setObjectives(data.objectives);
        alert("Soul Reconstruction Successful. v10.GOD System fully recalibrated.");
      } catch (err) {
        console.error("Import error:", err);
        alert("Integrity Failure in Persona File. Data structure mismatch.");
      }
    };
    reader.readAsText(file);
  };

  const renderSection = () => {
    switch (currentSection) {
      case AppSection.DASHBOARD: return <Dashboard profile={userProfile} habits={habits} financialData={financialData} objectives={objectives} setObjectives={setObjectives} exportSoul={exportSoul} importSoul={importSoul} setSection={setCurrentSection} />;
      case AppSection.WEALTH: return <WealthFortress data={financialData} updateData={setFinancialData} userAge={userProfile.age} />;
      case AppSection.SPARTAN: return <SpartanVessel habits={habits} profile={userProfile} toggleHabit={toggleHabit} updateProfile={setUserProfile} setHabits={setHabits} />;
      case AppSection.ACADEMY: return <TheAcademy objectives={objectives} setObjectives={setObjectives} />;
      case AppSection.KNOWLEDGE: return <KnowledgeVault books={books} setBooks={setBooks} />;
      case AppSection.SOCIAL: return <SocialDynamics />;
      case AppSection.WAR_ROOM: return <WarRoom financialData={financialData} habits={habits} profile={userProfile} objectives={objectives} books={books} />;
      default: return <Dashboard profile={userProfile} habits={habits} financialData={financialData} objectives={objectives} setObjectives={setObjectives} exportSoul={exportSoul} importSoul={importSoul} setSection={setCurrentSection} />;
    }
  };

  return (
    <Layout 
      currentSection={currentSection} 
      setSection={setCurrentSection} 
      financialData={financialData} 
      setFinancialData={setFinancialData}
      userProfile={userProfile}
    >
      {renderSection()}
    </Layout>
  );
};

export default App;
