
export interface FinancialState {
  // 3-Account Architecture
  bankA: number; // The Hub (Primary / Liquid Shield - Sweep-in FD)
  bankB: number; // The Wealth Lab (Investments)
  bankC: number; // The Operations (Expenses / Bills)
  
  // Account 2: The Wealth Lab Layers
  layerCore: number; // Index/SIP - Foundation
  layerAccelerator: number; // High Growth - Multiplier
  layerOpportunity: number; // Dry Powder - Crash Hunter
  
  monthlyIncome: number;
  transactions: Transaction[];
  assets: Asset[];
  businesses: BusinessEntity[];
  loans: LoanLiability[];
  legacyProjects: LegacyProject[];
  budgetSnapshots: MonthlyBudgetSnapshot[];
  mindsetLogs: MoneyMindsetLog[];
  roadmapSettings?: RoadmapSettings;
  
  // Engine Controls
  engineSettings: {
    wealthTaxRate: number; // 10-30%
    fixedEmiAllocation: number; // Fixed amount for bills (Step 1)
    isSweepInEnabled: boolean; // Sweep-in FD toggle
    dividendFlywheelActive: boolean; // Auto-reinvest dividends
    inflationAdjustment: boolean;
    noLifestyleCreep: boolean;
    crashModeActive: boolean;
  };
}

export interface RoadmapSettings {
  targetMonthlyExpense: number;
  sipAmount: number;
  hasStartedSIP: boolean;
  activePhase: 1 | 2 | 3 | 4 | 5;
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

export interface MonthlyBudgetSnapshot {
  id: string;
  month: string;
  income: number;
  dependents: number;
  essentialExpenses: number;
  nonEssentialExpenses: number;
  notes: string;
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

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'Sanchaypatra' | 'FDR' | 'Stock' | 'Land' | 'Business' | 'Gold';
  roi: number;
  isTaxEfficient?: boolean;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: string | null;
  history: string[];
  reminderTime?: string;
  category: 'Health' | 'Mindset' | 'Skill';
}

export interface UserProfile {
  name: string;
  age: number;
  targetRetirementAge: number;
  missionStatement: string;
  xp: number;
  level: number;
  rank: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
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

export interface NeuralNote {
  id: string;
  concept: string;
  action: string;
  problem?: string;
  example?: string;
  iconCategory: 'MIND' | 'MONEY' | 'POWER' | 'HEALTH' | 'SKILL';
  sourceType: 'BOOK' | 'YOUTUBE' | 'TEXT' | 'IMAGE';
  timestamp: string;
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

export interface JournalTask {
  id: string;
  category: string;
  task: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Done' | 'Pending' | 'URGENT' | string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  notes: string;
  dueDate?: string;
}

export interface DailyAction {
  id: string;
  task: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Not Started' | 'Completed';
  notes: string;
  progress: number;
  category: string;
}

export interface ChecklistState {
  morning: Record<string, boolean>;
  daytime: Record<string, boolean>;
  mindset: Record<string, boolean>;
  finance: Record<string, boolean>;
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
