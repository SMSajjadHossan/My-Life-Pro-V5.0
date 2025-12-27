
export interface FinancialState {
  bankA: number; 
  bankB: number; 
  bankC: number; 
  isStealthMode: boolean; 
  shadowVault: Asset[];
  isShadowVaultLocked: boolean;
  sessionStartWealth: number;
  totalCompoundedThisSession: number;
  monthlyIncome: number;
  transactions: Transaction[];
  assets: Asset[];
  businesses: BusinessEntity[];
  loans: LoanLiability[];
  legacyProjects: LegacyProject[];
  budgetSnapshots: MonthlyBudgetSnapshot[];
  mindsetLogs: MoneyMindsetLog[];
  roadmapSettings: {
    targetMonthlyExpense: number;
    sipAmount: number;
    currentSIPStreak: number;
    retirementTargetAge: number;
    inflationAdjusted: boolean;
  };
  engineSettings: {
    wealthTaxRate: number;
    fixedEmiAllocation: number;
    isSweepInEnabled: boolean;
    dividendFlywheelActive: boolean;
    inflationAdjustment: boolean;
    noLifestyleCreep: boolean;
    crashModeActive: boolean;
  };
}

export interface UserProfile {
  name: string;
  age: number;
  birthDate: string; 
  targetRetirementAge: number;
  missionStatement: string;
  xp: number;
  level: number;
  rank: string;
  systemicRisk: number; 
  testosteronePhase: string;
  retentionDay: number;
  weight?: number;
  bodyFat?: number;
  sleepHours?: number;
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'Sanchaypatra' | 'FDR' | 'Stock' | 'Land' | 'Business' | 'Gold' | 'Crypto';
  roi: number;
  isTaxEfficient?: boolean;
  isShadow?: boolean; 
}

export interface NeuralNote {
  id: string;
  concept: string;
  action: string;
  problem?: string;
  example?: string;
  feynmanSimplified?: string;
  isMastered: boolean; 
  iconCategory: 'MIND' | 'MONEY' | 'POWER' | 'HEALTH' | 'SKILL';
  sourceType: 'BOOK' | 'YOUTUBE' | 'TEXT' | 'IMAGE';
  timestamp: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: string | null;
  history: string[]; // Array of ISO Dates (YYYY-MM-DD)
  reminderTime?: string; // HH:mm
  category: 'Health' | 'Mindset' | 'Skill';
  isRetentionHabit?: boolean; 
}

export interface JournalTask {
  id: string;
  category: string;
  task: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Done' | 'Pending' | 'URGENT' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  notes: string;
  dueDate: string; 
  completionDate?: string;
  validityYears?: number; // For GRE/Certs (e.g., 5)
  reminderDays?: number; // Days before due to start intensive tracking
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  sources?: { title: string; uri: string }[]; 
}

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  WAR_ROOM = 'WAR_ROOM',
  WEALTH = 'WEALTH',
  KNOWLEDGE = 'KNOWLEDGE',
  SPARTAN = 'SPARTAN',
  ACADEMY = 'ACADEMY',
  SOCIAL = 'SOCIAL',
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: 'Needs' | 'Wants' | 'Investment' | 'Income' | 'Debt' | 'Dividend';
  subcategory?: string;
  paymentMethod?: string;
  date: string;
  bank: 'A' | 'B' | 'C';
}

export interface BusinessEntity {
  id: string;
  name: string;
  type: 'Service' | 'Product' | 'Passive';
  stage: 1 | 2 | 3 | 4 | 5;
  monthlyRevenue: number;
  valuation: number;
  growthRate: number;
}

export interface LoanLiability {
  id: string;
  purpose: string;
  amount: number;
  interestRate: number;
  monthlyEMI: number;
  remainingMonths: number;
}

export interface LegacyProject {
  id: string;
  name: string;
  budget: number;
  impactScore: number;
  status: 'Idea' | 'Planning' | 'Active' | 'Completed';
}

export interface MonthlyBudgetSnapshot {
  id: string;
  month: string;
  income: number;
  dependents: number;
  essentialExpenses: number;
  nonEssentialExpenses: number;
  notes: string;
}

export interface MoneyMindsetLog {
  id: string;
  date: string;
  patternProblem: string;
  identifyTrigger: string;
  solveAction: string;
  guiltFreeSpent: number;
  notes: string;
}

export interface GymExercise {
  name: string;
  sets: string;
}

export interface SpartanDayPlan {
  day: number;
  morningMeal: string;
  morningFlavor: string;
  nightMeal: string;
  nightFlavor: string;
  carbSource: 'Rice' | 'Potato';
  gymFocus: string;
  gymRoutine: GymExercise[];
  cardio: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'All' | 'Reading' | 'To Read' | 'Completed' | string;
  neuralNotes: NeuralNote[];
  rating: number;
}

export interface CodexChapter {
  id: string;
  title: string;
  description: string;
  content: {
    sectionTitle: string;
    points: string[];
  }[];
}
