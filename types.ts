
export interface FinancialState {
  bankA: number; // Income Hub
  bankB: number; // Wealth/Freedom (Investments)
  bankC: number; // Survival (Needs + Wants)
  monthlyIncome: number;
  transactions: Transaction[];
  assets: Asset[];
  businesses: BusinessEntity[];
  loans: LoanLiability[];
  legacyProjects: LegacyProject[];
  budgetSnapshots: MonthlyBudgetSnapshot[];
  mindsetLogs: MoneyMindsetLog[];
  roadmapSettings?: RoadmapSettings; // NEW: For the 5-Step Plan
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
  patternProblem: string; // "Impulse Buy", "Fear", "Showoff"
  identifyTrigger: string; // "Saw friend buy it", "Felt sad"
  solveAction: string; // "Waited 24h", "Invested instead"
  guiltFreeSpent: number; // Amount spent on self-care
  notes: string;
}

export interface MonthlyBudgetSnapshot {
  id: string;
  month: string; // YYYY-MM
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
  stage: 1 | 2 | 3 | 4 | 5; // 1=Start, 5=Brand
  monthlyRevenue: number;
  valuation: number;
  growthRate: number; // Percentage
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
  impactScore: number; // 0-100
  status: 'Idea' | 'Planning' | 'Active' | 'Completed';
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: 'Needs' | 'Wants' | 'Investment' | 'Income' | 'Debt';
  subcategory?: string; // e.g., "Food", "Rent", "Salary"
  paymentMethod?: string; // "Cash", "Card", "Bank Transfer"
  date: string;
  bank: 'A' | 'B' | 'C';
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: 'Sanchaypatra' | 'FDR' | 'Stock' | 'Land' | 'Business' | 'Gold';
  roi: number; // Percentage
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted: string | null; // Date string YYYY-MM-DD
  history: string[]; // Array of Date strings YYYY-MM-DD
  reminderTime?: string; // HH:MM format
  category: 'Health' | 'Mindset' | 'Skill';
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  category: 'Exam' | 'Skill' | 'Project';
  status: 'Pending' | 'Done' | 'Failed';
  progress?: number; // Added for detailed tracking
  notes?: string; // Added for detailed tracking
  urgent: boolean;
}

// NEW: For Strategic Objectives & Daily Journal
export interface JournalTask {
    id: string;
    category: string;
    task: string;
    status: string; // Not Started, In Progress, Done
    priority: string;
    progress: number;
    notes: string;
    dueDate?: string;
}

export interface DailyAction {
    id: string;
    category: string;
    task: string;
    status: string; // Not Started, In Progress, Done
    priority: string;
    progress: number;
    notes: string;
    isCompleted?: boolean; // Legacy support
}

export interface ChecklistState {
  morning: Record<string, boolean>;
  daytime: Record<string, boolean>;
  mindset: Record<string, boolean>;
  finance: Record<string, boolean>;
}

// NEW: Advanced Learning Point Structure
export interface NeuralNote {
  id: string;
  concept: string; // The "What"
  action: string;  // The "Do This" (Real Life Action)
  problem?: string; // The "Why/Pain" (Real Life Problem)
  example?: string; // Legacy support or extra context
  iconCategory: 'MONEY' | 'MIND' | 'POWER' | 'HEALTH' | 'SKILL'; 
  sourceType: 'TEXT' | 'YOUTUBE' | 'IMAGE' | 'BOOK';
  timestamp: string;
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

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'Reading' | 'Completed' | 'To Read';
  neuralNotes: NeuralNote[]; // Replaced simple 'learnings' array
  rating: number; // 1-5
}

export interface UserProfile {
  name: string;
  age: number;
  targetRetirementAge: number;
  missionStatement: string;
  xp: number; // Gamification
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

export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  WAR_ROOM = 'WAR_ROOM', // New
  WEALTH = 'WEALTH',
  KNOWLEDGE = 'KNOWLEDGE',
  SPARTAN = 'SPARTAN',
  ACADEMY = 'ACADEMY',
  SOCIAL = 'SOCIAL',
}