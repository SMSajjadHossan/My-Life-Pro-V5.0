
import { UserProfile, SpartanDayPlan, GymExercise, Book, Habit, CodexChapter, JournalTask } from './types';

export const INFLATION_RATE_BD = 0.085;
export const INVESTMENT_RETURN_RATE = 0.12;
export const HOURS_WORK_PER_MONTH = 160;

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Commander",
  age: 23,
  birthDate: "2001-09-23T00:00:00", 
  targetRetirementAge: 35,
  missionStatement: "Worship Allah • Achieve Financial Freedom • Maintain Health • Spread Knowledge",
  xp: 0,
  level: 1,
  rank: "Recruit",
  systemicRisk: 5,
  testosteronePhase: "Baseline",
  retentionDay: 0
};

export const RETENTION_PHASES = [
  { day: 0, title: "Reset", desc: "Energy depleted. Recovery initiated.", color: "text-gray-500" },
  { day: 7, title: "The Spike", desc: "45.7% Testosterone increase peak. High focus.", color: "text-spartan-red" },
  { day: 14, title: "Stabilization", desc: "Aggression turns into drive. Higher skin quality.", color: "text-electric-blue" },
  { day: 30, title: "The Flatline", desc: "Mental testing phase. Neural pathways rewiring.", color: "text-gold" },
  { day: 90, title: "Sovereign State", desc: "Full reboot complete. Unshakeable frame.", color: "text-wealth-green" }
];

export const BD_MARKET_PRESETS = [
  { name: "Sanchaypatra (Family)", roi: 11.52, tax: 5, safety: "S-Tier" },
  { name: "DSE Blue Chip", roi: 15.0, tax: 10, safety: "A-Tier" },
  { name: "FDR (Standard)", roi: 8.5, tax: 10, safety: "S-Tier" },
  { name: "Dhaka Real Estate", roi: 8.0, tax: 0, safety: "A-Tier" }
];

export const WEALTH_TIMELINE = [
  { age: "20-25", focus: "BUILD SKILLS", action: "Master core field (VLSI/AI). Add Finance/Comm skills. Hustle." },
  { age: "25-30", focus: "MONEY DISCIPLINE", action: "Save 20%+, Avoid Lifestyle Debt. 50/30/20 Rule." },
  { age: "30-40", focus: "FINANCIAL STABILITY", action: "Build Assets (House/Biz). Hit 'Job Optional' status." },
  { age: "40+", focus: "FREEDOM & LEGACY", action: "Enjoy wealth. Philanthropy. Teach others." }
];

export const INITIAL_STRATEGIC_OBJECTIVES: JournalTask[] = [
  { id: '1', category: '🎯 MAJOR GOALS', task: 'Electronics 2 registration and pass', status: 'Not Started', priority: 'Critical', progress: 0, notes: 'Must pass', dueDate: "2025-06-15T00:00:00" },
  { id: '2', category: '🎯 MAJOR GOALS', task: 'GRE QUANT preparation', status: 'In Progress', priority: 'High', progress: 10, notes: 'Daily practice', dueDate: "2025-09-01T00:00:00" },
  { id: '11', category: '🎯 GOALS', task: 'MS Application Fall 2026', status: 'Not Started', priority: 'Medium', progress: 0, notes: 'Top priority', dueDate: "2026-01-01T00:00:00" },
];

export const RICH_VS_POOR_MINDSET = [
  { poor: "টাকা নেই বলেই কিছু করতে পারি না (Can't do because no money)", rich: "Create! Don't consume. Money follows value." },
  { poor: "খরচ করলে guilt হয় (Guilt when spending)", rich: "Give purpose to work. Invest in self-care (Farmer vs Horse)." },
  { poor: "Social comparison spending (Showoff)", rich: "Wealth is what you don't see. Silence is power." },
  { poor: "Money is the goal", rich: "Money is a tool for freedom & opportunity." },
  { poor: "Loans for lifestyle/luxury", rich: "Loans only for Assets/Business (Leverage)." }
];

export const RULES_OF_POWER_13 = [
  "1. Don't show need, show value. (দরকার দেখিও না, মূল্য দেখাও)",
  "2. Let work precede name. (নামের আগে কাজ পৌঁছাক)",
  "3. Mix with ups, don't be desperate. (উপরের লোকের সাথে মিশো, কিন্তু মরিয়া হয়ো না)",
  "4. Small favors open big doors. (ছোট উপকারে বড় দরজা খোলে)",
  "5. Speak to their interests. (তাদের আগ্রহ বুঝে কথা বলো)",
  "6. Connect people. (মানুষকে মানুষে যুক্ত করো)",
  "7. Stay calm, hide emotion. (শান্ত থেকো। আবেগ বেশি দেখিও না)",
  "8. Be loyal, not blind. (লয়্যাল থেকো, কিন্তু অন্ধ নয়)",
  "9. Read the room. (পরিবেশ আগে দেখো)",
  "10. Don't pressure, be present. (চাপ দিও না, উপস্থিত থেকো)",
  "11. Don't reveal secrets. (গোপন কথা ফাঁস কোরো না)",
  "12. Give solutions not problems. (সমস্যা নয়, সমাধান দাও)",
  "13. Keep yourself independent. (নিজেকে স্বাধীন রাখো)"
];

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', name: 'Retention Protocol', streak: 0, lastCompleted: null, history: [], category: 'Health', isRetentionHabit: true },
  { id: 'h2', name: 'Cold Shower', streak: 0, lastCompleted: null, history: [], category: 'Health' },
  { id: 'h3', name: 'Prayers (5x)', streak: 0, lastCompleted: null, history: [], category: 'Mindset' },
  { id: 'h4', name: 'Deep Work (4hr)', streak: 0, lastCompleted: null, history: [], category: 'Skill' },
];

export const INITIAL_LIBRARY: Book[] = [
  { 
    id: 'b1', 
    title: 'The Psychology of Money', 
    author: 'Morgan Housel', 
    status: 'Completed', 
    neuralNotes: [
      {
        id: 'n1',
        concept: 'Wealth is what you do not see.',
        action: 'Do not post your next purchase on social media.',
        iconCategory: 'MONEY',
        sourceType: 'BOOK',
        timestamp: new Date().toISOString(),
        isMastered: false
      }
    ],
    rating: 5 
  }
];

export const STUDY_PHASES = [
  { phase: "Phase 1: Mindset", rule: "The 1% Identity", action: "Grit: 'Na parlew porre thakbo'. Be honest about gaps." },
  { phase: "Phase 2: Setup", rule: "Environment Anchoring", action: "Specific chair/table. Phone away. 7-8h Sleep." },
  { phase: "Phase 3: Process", rule: "90/20 Protocol", action: "90m Deep Work -> 20m Break. Active Recall (No Re-reading)." },
  { phase: "Phase 4: Retention", rule: "Spaced Repetition", action: "Review: Day 1 -> Day 3 -> Day 7 -> Day 21. Interleaving." },
  { phase: "Phase 5: Dopamine", rule: "Reward System", action: "Temptation Bundling (Music with Math). Progress Bar Effect." }
];

const PUSH_DAY: GymExercise[] = [
  { name: "Bench Press", sets: "4x8-10" },
  { name: "Overhead Press", sets: "4x8-10" },
  { name: "Tricep Pushdowns", sets: "3x12-15" }
];

const REST_DAY: GymExercise[] = [
  { name: "Light Walk", sets: "30 mins" }
];

export const SPARTAN_MASTER_CYCLE: SpartanDayPlan[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  return {
    day,
    morningMeal: "2 eggs + 1 egg white + 50g chola",
    morningFlavor: "Onion+Garlic",
    nightMeal: "50g dal + peanuts",
    nightFlavor: "Dal",
    carbSource: day % 2 === 0 ? 'Rice' : 'Potato',
    gymFocus: "Push",
    gymRoutine: day % 7 === 0 ? REST_DAY : PUSH_DAY,
    cardio: "15m Incline Walk",
  };
});

export const MORNING_PROTOCOL = [
  "⏰ Wake up before 6am",
  "🏋️ Morning exercise (30 min)",
  "🧘 Meditation/silence (10 min)",
  "📖 Read (10+ pages)",
  "💧 Hydrate (2L water)"
];

export const DAYTIME_PROTOCOL = [
  "🎯 Eat That Frog (hardest first)",
  "📅 Plan tomorrow",
  "🔒 No social media before 9am"
];

export const MASCULINE_MINDSET_CHECKLIST = [
  "🧠 Strategic Mindset",
  "💪 Discipline & Leadership",
  "🎯 Calculated Risk Taking"
];

export const HEALTH_KNOWLEDGE_BASE = {
  "Vitamin B12": `Source: Liver, Beef, Eggs. Vital for Brain & Energy.`,
  "Vitamin D": `Source: Sun (10am-2pm). Essential for Testosterone.`,
  "Dopamine Detox": `AVOID: Social Media, Junk. DO: Deep Work, Reading.`
};

export const THE_CODEX: CodexChapter[] = [
  {
    id: "masculine",
    title: "1. The Masculine Core",
    description: "Identity, Respect, and The Unshakeable Mind",
    content: [
      {
        sectionTitle: "High Value Traits",
        points: [
          "Don't seek attention.",
          "Silence and pause. Speak less.",
          "Eye contact. Deep voice.",
          "Respond, don't react."
        ]
      }
    ]
  }
];
