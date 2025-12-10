
import { UserProfile, SpartanDayPlan, GymExercise, Book, Habit, CodexChapter } from './types';

export const INFLATION_RATE_BD = 0.085; // 8.5%
export const INVESTMENT_RETURN_RATE = 0.12; // 12%
export const HOURS_WORK_PER_MONTH = 160;

export const INITIAL_USER_PROFILE: UserProfile = {
  name: "Commander",
  age: 24,
  targetRetirementAge: 35,
  missionStatement: "Worship Allah • Achieve Financial Freedom • Maintain Health • Spread Knowledge",
  xp: 0,
  level: 1,
  rank: "Recruit"
};

// ... [Keep existing constants: RICH_VS_POOR_MINDSET, WEALTH_TIMELINE, SECRETS_OF_RICH_7, WEALTH_PRINCIPLES_BANGLA, BUSINESS_STAGES, RULES, FLASH_CARDS, INITIAL_HABITS, INITIAL_LIBRARY, SPARTAN_CHECKLIST_ITEMS, HEALTH_KNOWLEDGE_BASE, GYM ROUTINES, SPARTAN_MASTER_CYCLE, MORNING_PROTOCOL, DAYTIME_PROTOCOL, MASCULINE_MINDSET_CHECKLIST, FINANCIAL_DISCIPLINE_CHECKLIST, INITIAL_STRATEGIC_OBJECTIVES, RULES_OF_POWER_13, RULES_OF_ATTRACTION_7, WEALTH_BLUEPRINT_ROADMAP, WEALTH_BLUEPRINT_MYTHS, WEALTH_BLUEPRINT_VEHICLES] ...
// (Re-declaring standard constants for context)

export const RICH_VS_POOR_MINDSET = [
  { poor: "টাকা নেই বলেই কিছু করতে পারি না (Can't do because no money)", rich: "Create! Don't consume. Money follows value." },
  { poor: "খরচ করলে guilt হয় (Guilt when spending)", rich: "Give purpose to work. Invest in self-care (Farmer vs Horse)." },
  { poor: "Social comparison spending (Showoff)", rich: "Wealth is what you don't see. Silence is power." },
  { poor: "Money is the goal", rich: "Money is a tool for freedom & opportunity." },
  { poor: "Loans for lifestyle/luxury", rich: "Loans only for Assets/Business (Leverage)." }
];

export const WEALTH_TIMELINE = [
  { age: "20-25", focus: "BUILD SKILLS", action: "Master core field (VLSI/AI). Add Finance/Comm skills. Hustle." },
  { age: "25-30", focus: "MONEY DISCIPLINE", action: "Save 20%+, Avoid Lifestyle Debt. 50/30/20 Rule." },
  { age: "30-40", focus: "FINANCIAL STABILITY", action: "Build Assets (House/Biz). Hit 'Job Optional' status." },
  { age: "40+", focus: "FREEDOM & LEGACY", action: "Enjoy wealth. Philanthropy. Teach others." }
];

export const SECRETS_OF_RICH_7 = [
  "1. সময় নয়, সিস্টেমে কাজ করো (Build Systems, don't just sell time).",
  "2. ঋণ শত্রু নয়, অজ্ঞতা শত্রু (Use Debt for Assets, not Luxuries).",
  "3. মালিকানা মুক্তি দেয় (Own equity/business, don't just work jobs).",
  "4. নেটওয়ার্ক = সম্পদ (Your network is your net worth).",
  "5. নীরবতা শক্তি (Wealth is silent. Avoid showoff).",
  "6. আর্থিক শিক্ষা সোনার খনি (Daily learning = Real Money).",
  "7. সবাই বিক্রি করে (Learn to sell - Skills, Ideas, or Products)."
];

export const WEALTH_PRINCIPLES_BANGLA = [
  { title: "১. ভাবনা ঠিক করুন", content: "অভাবের কথা ভাবা বন্ধ করুন। প্রতিদিন ৫ মিনিট স্বপ্নের জীবন কল্পনা করুন।" },
  { title: "২. কাজে দক্ষ হন", content: "শুধু পরিশ্রম নয়, সঠিকভাবে কাজ করাই ধন আনে। গুরুত্বপূর্ণ কাজ আগে করুন।" },
  { title: "৩. সৃষ্টি করুন", content: "প্রতিযোগিতা নয়, সৃষ্টি করুন। অন্যের সঙ্গে তুলনা বন্ধ করুন।" },
  { title: "৪. স্পষ্ট লক্ষ্য", content: "আপনার আদর্শ জীবনের ১–২ লাইনের লক্ষ্য লিখুন। সকালে-রাতে পড়ুন।" },
  { title: "৫. কৃতজ্ঞতা", content: "কৃতজ্ঞ হলে সুযোগ বাড়ে। প্রতিদিন ৩টি কৃতজ্ঞতার বিষয় লিখুন।" },
  { title: "৬. বিশ্বাস রাখুন", content: "প্রতিদিন বলুন: 'আমি ধনের পথে, ধন আমার পথে।' ধৈর্য রাখুন।" },
  { title: "৭. ছোট একশন", content: "প্রতিদিন আপনার লক্ষ্যের দিকে অন্তত ১টি কাজ করুন।" },
  { title: "৮. মূল্য বাড়ান", content: "কাজ হোক বা ব্যবসা—মান, আচরণ ও সেবা উন্নত করুন।" },
  { title: "৯. নিজেকে উন্নত করুন", content: "আপনি যত বাড়বেন, সম্পদও তত বাড়বে। প্রতি মাসে নতুন কিছু শিখুন।" }
];

export const BUSINESS_STAGES = [
  { stage: 1, goal: "Start small & low risk", action: "Choose one skill/product, invest small capital", budget: 10000 },
  { stage: 2, goal: "Improve quality", action: "Collect customer feedback, refine offer", budget: 5000 },
  { stage: 3, goal: "Expand reach", action: "Marketing via Facebook, Instagram, YouTube", budget: 10000 },
  { stage: 4, goal: "Automate", action: "Hire part-time help, use automation tools", budget: 15000 },
  { stage: 5, goal: "Build brand", action: "Website, logo, consistent content", budget: 20000 },
];

export const RULES = [
  "Manush muloto eka (Humans are fundamentally alone).",
  "Stop being consumer, start being creator.",
  "Make testosterone, not estrogen.",
  "Silence is power.",
  "Don't chase, attract.",
  "Ten times rule: Can you buy 10 of them?",
  "Babar hok aday koro."
];

export const FLASH_CARDS = [
  { category: "PROTOCOL", title: "Core Directive", content: "1. Self Desire Slave Control.\n2. Another Person Slave Control.\nKeep your head down. Success makes noise." },
  { category: "REALITY", title: "The Hard Truth", content: "No one is coming to Save You." },
  { category: "REALITY", title: "Solitude", content: "মানুষ মূলত একা (Humans are fundamentally alone)." },
  { category: "CONTROL", title: "Self-Mastery", content: "sob kaj yes bolbo na, nijer upor control rakhbo kar jonno kaj korci." },
  { category: "WEALTH", title: "Passive Income", content: "ami kaj na korlew taka asbe (Build systems, not jobs)." },
  { category: "EGO", title: "Anti-Showoff", content: "Stop showoff. Wealth is silent." },
  { category: "MINDSET", title: "Producer", content: "Stop being consumer. Start creating." },
  { category: "FINANCE", title: "Asset vs Liability", content: "Stop buying Liability." },
  { category: "GROWTH", title: "Guidance", content: "Find Great Mentor." },
  { category: "POWER", title: "Rule 1: Value", content: "দরকার দেখিও না, মূল্য দেখাও। তুমি কীভাবে সাহায্য করতে পারো সেটা দেখাও।" },
  { category: "POWER", title: "Rule 2: Reputation", content: "নামের আগে কাজ পৌঁছাক। নিজের ভালো ইমেজ তৈরি করো।" },
  { category: "POWER", title: "Rule 3: Hierarchy", content: "উপরের লোকের সাথে মিশো, কিন্তু মরিয়া হয়ো না। সম্মান রেখে এগোও।" },
  { category: "POWER", title: "Rule 4: Favors", content: "ছোট উপকারে বড় দরজা খোলে। হালকা সাহায্য সুযোগ তৈরি করে।" },
  { category: "POWER", title: "Rule 5: Interests", content: "তাদের আগ্রহ বুঝে কথা বলো। যে বিষয়ে তারা আগ্রহী, সেটাই ধরো।" },
  { category: "POWER", title: "Rule 6: Connection", content: "মানুষকে মানুষে যুক্ত করো। তুমি হলে সবার কাছেই মূল্যবান।" },
  { category: "POWER", title: "Rule 7: Stoicism", content: "শান্ত থেকো। আবেগ বেশি দেখিও না।" },
  { category: "POWER", title: "Rule 8: Loyalty", content: "লয়্যাল থেকো, কিন্তু অন্ধ নয়। নিজের অবস্থান ধরে রাখো।" },
  { category: "POWER", title: "Rule 9: Context", content: "পরিবেশ আগে দেখো। কার সাথে কীভাবে কথা বলতে হয় বুঝে নাও।" },
  { category: "POWER", title: "Rule 10: Presence", content: "চাপ দিও না, উপস্থিত থেকো। বারবার সামনে আসলে পরিচিতি বাড়ে।" },
  { category: "POWER", title: "Rule 11: Secrecy", content: "গোপন কথা ফাঁস কোরো না। বিশ্বাসযোগ্যতা বাড়ে।" },
  { category: "POWER", title: "Rule 12: Solution", content: "সমস্যা নয়, সমাধান দাও। সবাই তোমাকে চাইবে।" },
  { category: "POWER", title: "Rule 13: Independence", content: "নিজেকে স্বাধীন রাখো। কারও ওপর পুরোপুরি নির্ভর হয়ো না।" },
  { category: "ATTRACTION", title: "Rule 1: Value Frame", content: "I am the value — I don’t chase." },
  { category: "ATTRACTION", title: "Rule 2: Choice", content: "No FOMO — I choose, I don’t beg." },
  { category: "ATTRACTION", title: "Rule 3: Confidence", content: "Present myself well, stay confident." },
  { category: "ATTRACTION", title: "Rule 4: Tests", content: "She will test — I stay calm, silent, controlled." },
  { category: "ATTRACTION", title: "Rule 5: Attention", content: "Give attention slowly, not fully." },
  { category: "ATTRACTION", title: "Rule 6: Absence", content: "Absence creates control — use it." },
  { category: "ATTRACTION", title: "Rule 7: Approval", content: "I never beg for attention or approval." },
];

export const INITIAL_HABITS: Habit[] = [
  { id: 'h1', name: 'No-Fap Protocol', streak: 0, lastCompleted: null, history: [], category: 'Health' },
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
        timestamp: new Date().toISOString()
      },
      {
        id: 'n2',
        concept: 'Control over time is the highest dividend money pays.',
        action: 'Calculate your "Freedom Rate" (Passive Income / Expenses).',
        iconCategory: 'POWER',
        sourceType: 'BOOK',
        timestamp: new Date().toISOString()
      }
    ],
    rating: 5 
  },
  { 
    id: 'b2', 
    title: 'Atomic Habits', 
    author: 'James Clear', 
    status: 'Reading', 
    neuralNotes: [
      {
        id: 'n3',
        concept: '1% better every day compounds mathematically.',
        action: 'Identify one tiny habit to improve by 1% today.',
        iconCategory: 'SKILL',
        sourceType: 'BOOK',
        timestamp: new Date().toISOString()
      }
    ],
    rating: 5 
  }
];

export const SPARTAN_CHECKLIST_ITEMS = [
  "৭–৯ ঘন্টা ঘুম (7-9h Sleep)",
  "৩০ মিনিট ব্যায়াম (30m Exercise)",
  "২০ মিনিট Brain Game",
  "২০ মিনিট বই পড়া (Reading)",
  "৫–১০ মিনিট ধ্যান (Meditation)",
  "Omega-3 & Brain Food",
  "৩–৩.৫ লিটার পানি (Water)",
  "Junk ও Sugar এড়ানো (No Junk)",
  "নতুন কিছু শেখা (Skill)",
  "হাসি আর Positive থাকা"
];

export const HEALTH_KNOWLEDGE_BASE = {
  "Vitamin B12": `Source: Liver, Beef, Eggs, Milk (Cheese/Yogurt), Fish (Hilsa/Tuna). Vital for Brain & Energy. Vegetarians need supplements.`,
  "Vitamin D": `Source: Sun (10am-2pm, 15-20 mins), Marine Fish, Egg Yolk, Mushrooms. Essential for Testosterone.`,
  "Dopamine Detox": `AVOID: Social Media, Junk Food, Porn, Multitasking. DO: Deep Work, Reading, Walking, Meditation, Boredom. GOAL: Reset receptors.`,
  "Brain Food": `Omega-3 (Salmon/Walnuts), Antioxidants (Dark Choco), Complex Carbs (Oats/Sweet Potato), Protein (Eggs), Water (3L).`,
  "Sleep Protocol": `Window: 10 PM - 6 AM. Deep Sleep = Memory. REM = Creativity. Dark, Cool Room. No screens.`,
  "Best Times": `Analytical: 9AM-12PM. Creative: 10AM-1PM / 8PM-10PM. Memory: 6PM-9PM. Exercise: Morning.`
};

// GYM ROUTINES
const PUSH_DAY: GymExercise[] = [
  { name: "Bench Press", sets: "4x8-10" },
  { name: "Overhead Press", sets: "4x8-10" },
  { name: "Incline DB Press", sets: "3x10" },
  { name: "Lateral Raises", sets: "3x12-15" },
  { name: "Tricep Pushdowns", sets: "3x12-15" },
  { name: "Dips", sets: "3xMax" }
];

const PULL_DAY: GymExercise[] = [
  { name: "Pull-Ups / Lat PD", sets: "4x8-10" },
  { name: "Barbell Rows", sets: "4x8-10" },
  { name: "Cable Rows", sets: "3x10" },
  { name: "Face Pulls", sets: "3x12-15" },
  { name: "Bicep Curls", sets: "3x12-15" },
  { name: "Hammer Curls", sets: "3x12" }
];

const LEGS_DAY: GymExercise[] = [
  { name: "Squats", sets: "4x8-10" },
  { name: "RDLs", sets: "4x8-10" },
  { name: "Leg Press", sets: "3x10" },
  { name: "Lunges", sets: "3x12" },
  { name: "Calf Raises", sets: "4x15-20" },
  { name: "Planks / Leg Raises", sets: "3xFailure" }
];

const REST_DAY: GymExercise[] = [
  { name: "Light Walk", sets: "30 mins" },
  { name: "Stretching", sets: "15 mins" }
];

export const SPARTAN_MASTER_CYCLE: SpartanDayPlan[] = Array.from({ length: 31 }, (_, i) => {
  const day = i + 1;
  const flavorIndex = (day - 1) % 7;
  const gymIndex = (day - 1) % 7;
  const gymFocus = ["Push", "Pull", "Legs+Abs", "Push", "Pull", "Legs+Abs", "Rest"][gymIndex];
  
  let gymRoutine = REST_DAY;
  if (gymFocus.includes("Push")) gymRoutine = PUSH_DAY;
  if (gymFocus.includes("Pull")) gymRoutine = PULL_DAY;
  if (gymFocus.includes("Legs")) gymRoutine = LEGS_DAY;

  const isOdd = day % 2 !== 0;
  
  return {
    day,
    morningMeal: "2 eggs + 1 egg white + 50g chola + 50g soy",
    morningFlavor: ["Onion+Garlic", "Tomato+Chili", "Mustard", "Cumin+Coriander", "Lemon+Pepper", "Spinach Mix", "Dry Roast"][flavorIndex],
    nightMeal: isOdd ? "50g dal + 20g peanuts + greens" : "50g soy + 20g peanuts + greens",
    nightFlavor: isOdd ? "Dal" : ["Tomato+Chili", "Mustard", "Cumin+Coriander", "Lemon+Pepper", "Spinach Mix", "Dry Roast", "Onion+Garlic"][flavorIndex],
    carbSource: isOdd ? 'Rice' : 'Potato',
    gymFocus: gymFocus,
    gymRoutine: gymRoutine,
    cardio: gymFocus === "Rest" ? "Active Recovery Walk" : (gymFocus.includes("Legs") ? "10m Stair Climber" : "15m HIIT / 20m Incline Walk"),
  };
});

export const MORNING_PROTOCOL = [
  "⏰ Wake up early (before 6am)",
  "🏋️ Morning exercise (30 min)",
  "🧘 Meditation/silence (10 min) & Email check",
  "📖 Read (30 min / 10+ pages)/writing",
  "💧 Hydrate (8 glasses / 2L water)",
  "📓 Write top 3 priorities",
  "🎯 What's one thing to make me proud?/visualization",
  "🧠 How do I want to feel today? Positive affirmation",
  "🔒 No social media before 9am/masturbation",
  "🎯 How will I stay focused? Deep work (2 hrs)"
];

export const DAYTIME_PROTOCOL = [
  "🎯 Eat That Frog (hardest first)",
  "📅 Plan tomorrow (10 min) & Review today",
  "🔑 Be Proactive (initiative)",
  "🛠️ Begin with End in Mind & Reflection",
  "🧩 Put First Things First",
  "🤝 Think Win-Win",
  "⚖️ Control Over Emotion",
  "👂 Seek First to Understand",
  "🌍 Synergize (collaborate)",
  "🔁 Sharpen the Saw (renew) & No screens 1hr before bed"
];

export const MASCULINE_MINDSET_CHECKLIST = [
  "🧠 Strategic Mindset (Planning)",
  "💪 Discipline & Leadership",
  "🎯 Calculated Risk Taking",
  "🌐 Power of Network",
  "🕴️ Open body language",
  "🧘 Calm mind",
  "📚 Invest/grow skills",
  "📝 Create daily study/work routine",
  "📌 Practice consistently",
  "📊 Track failures & learn",
  "📖 Disappear with direction (Self Learning)",
  "🎯 Define clear goal"
];

export const FINANCIAL_DISCIPLINE_CHECKLIST = [
  "💰 Financial Discipline Maintained",
  "💵 Check savings - saved 10% today/week?",
  "📊 Track expenses - spent only on needs?",
  "📈 Invest/grow skills today?",
  "🏦 Plan for future - retirement/security step?",
  "❓ Need vs ego/status?",
  "💰 Can afford if income drops?",
  "🏠 Decision making free or trapping?",
  "🚫 Avoid bad people/habits?",
  "📚 Learn something useful?",
  "⚡ When most energized/free today?",
  "📊 Progress toward goal?"
];

export const INITIAL_STRATEGIC_OBJECTIVES = [
  { id: '1', category: '🎯 MAJOR GOALS', task: 'Electronics 2 registration and pass', status: 'Not Started', priority: 'Medium', progress: 0, notes: '✅' },
  { id: '2', category: '🎯 MAJOR GOALS', task: 'GRE QUANT preparation', status: 'Not Started', priority: 'Medium', progress: 0, notes: '✅' },
  { id: '3', category: '🎯 MAJOR GOALS', task: 'IELTS/GRE Registration', status: 'Not Started', priority: 'Medium', progress: 0, notes: '✅' },
  { id: '4', category: '🎯 MAJOR GOALS', task: 'SOP + University applications', status: 'Not Started', priority: 'Medium', progress: 0, notes: '✅' },
  { id: '5', category: '🎯 MAJOR GOALS', task: 'Portfolio website', status: 'In Progress', priority: 'Medium', progress: 50, notes: '✅' },
  { id: '6', category: '💪 PERSONAL', task: 'Control Emotions (stay calm)', status: 'Not Started', priority: 'High', progress: 0, notes: 'Positive affirmation' },
  { id: '7', category: '💪 PERSONAL', task: 'Strategic Mindset', status: 'Not Started', priority: 'Medium', progress: 0, notes: 'Mindfulness' },
  { id: '8', category: '💰 FINANCE', task: 'Save 10% of income', status: 'Not Started', priority: 'High', progress: 0, notes: 'Build wealth' },
  { id: '9', category: '📚 ACADEMIC', task: 'Electronics 2 - Daily 2hr', status: 'In Progress', priority: 'High', progress: 66, notes: 'Must pass' },
  { id: '10', category: '📚 ACADEMIC', task: 'University Shortlist', status: 'Not Started', priority: 'High', progress: 0, notes: 'Target: 10 unis' },
  { id: '11', category: '🎯 GOALS', task: 'MS Application Fall 2026', status: 'In Progress', priority: 'High', progress: 25, notes: 'Top priority' },
  { id: '12', category: '🎯 GOALS', task: 'Read 2 books/month', status: 'In Progress', priority: 'Medium', progress: 30, notes: 'Current: 0.6 books' },
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

export const RULES_OF_ATTRACTION_7 = [
  "1. I am the value — I don’t chase.",
  "2. No FOMO — I choose, I don’t beg.",
  "3. Present myself well, stay confident.",
  "4. She will test — I stay calm, silent, controlled.",
  "5. Give attention slowly, not fully.",
  "6. Absence creates control — use it.",
  "7. I never beg for attention or approval."
];

export const WEALTH_BLUEPRINT_ROADMAP = [
  "1. মাইন্ডসেট ও লক্ষ্য (Mindset & Goals)",
  "2. আয় বাড়ানো (Increase Income)",
  "3. খরচ নিয়ন্ত্রণ (Control Expenses)",
  "4. সঞ্চয় (Build Savings)",
  "5. বিনিয়োগ শিখুন (Learn Investing)",
  "6. জরুরি তহবিল (Emergency Fund)",
  "7. ঝুঁকি সুরক্ষা (Risk Protection)",
  "8. সময় ও কম্পাউন্ডিং (Time & Compounding)",
  "9. ক্রমাগত শেখা (Continuous Learning)"
];

export const WEALTH_BLUEPRINT_MYTHS = [
  { myth: "More income = more wealth", reality: "It's about savings rate. Earning $100k but spending $100k = Zero Wealth." },
  { myth: "Lifestyle inflation", reality: "Rich keep expenses low as income grows. Middle class matches expenses to income." },
  { myth: "Wealth comes from Paychecks", reality: "Wealth comes from Assets that work while you sleep." },
  { myth: "Debt is bad", reality: "Rich use debt as leverage (Assets). Middle class use it for consumption (Liabilities)." },
  { myth: "Cash is safe", reality: "Inflation (8.3%) destroys cash. Investing protects it." },
  { myth: "Taxes", reality: "Wages are taxed highest. Capital gains are taxed lower." },
  { myth: "Market Crashes", reality: "Don't panic sell. It's a discount sale for the rich." },
  { myth: "DIY vs Advisors", reality: "Rich pay for expert advice. It pays for itself." }
];

export const WEALTH_BLUEPRINT_VEHICLES = [
  { title: "Real Estate / Land", desc: "Appreciation Play. Lease (Borga) for yield while waiting." },
  { title: "Business Ownership", desc: "Equity Play. Buy/Partner at low valuation, exit high." },
  { title: "Rental Ecosystems", desc: "Cash Flow Play. Solves daily logistics (CNG, Auto, Garage)." },
  { title: "Digital IP", desc: "Time Leverage. Sell courses/services with zero reproduction cost." },
  { title: "Market Assets", desc: "Hedge Play. REITs, Gold, Luxury Watches (Defensive)." }
];

// --- NEW ACADEMY CONSTANTS ---

export const STUDY_PHASES = [
  { phase: "Phase 1: Mindset", rule: "The 1% Identity", action: "Grit: 'Na parlew porre thakbo'. Be honest about gaps." },
  { phase: "Phase 2: Setup", rule: "Environment Anchoring", action: "Specific chair/table. Phone away. 7-8h Sleep." },
  { phase: "Phase 3: Process", rule: "90/20 Protocol", action: "90m Deep Work -> 20m Break. Active Recall (No Re-reading)." },
  { phase: "Phase 4: Retention", rule: "Spaced Repetition", action: "Review: Day 1 -> Day 3 -> Day 7 -> Day 21. Interleaving." },
  { phase: "Phase 5: Dopamine", rule: "Reward System", action: "Temptation Bundling (Music with Math). Progress Bar Effect." }
];

export const GENIUS_LEARNING_RULES = [
  { title: "Adapt to Technology", desc: "Don't resist AI. Learn it immediately." },
  { title: "Problem-Based Learning", desc: "Real problems teach faster than lectures. Build to learn." },
  { title: "Break Huge Goals", desc: "Master basics -> Build tool -> Solve disease. Step by step." },
  { title: "Know Your 'Why'", desc: "Clarity multiplies speed. Problem-driven learning is 10x faster." },
  { title: "Networking", desc: "Ask mentors. Collaboration is not cheating in real life." },
  { title: "Iterations > Hours", desc: "Writing 100 bad emails > Reading 1 book on email." },
  { title: "Build Portfolio", desc: "Projects > Certificates. Show what you can do." },
  { title: "Mix Subjects", desc: "Real life is interdisciplinary. Combine skills." },
  { title: "Start Before Ready", desc: "Readiness is a myth. Learn by starting imperfectly." },
  { title: "Continuous Learning", desc: "One degree won't save you. Learn new skills every year." }
];

export const CAREER_JOB_TIERS = [
  { tier: "Tier 1: Strategic & High Pay", pay: "$150k - $500k+", jobs: ["Surgeon", "AI Researcher", "Product Manager", "VLSI Lead", "Data Scientist"] },
  { tier: "Tier 2: High-Tech Engineering", pay: "$90k - $180k", jobs: ["Electronics Design", "Embedded Systems", "RF Engineer", "Biomedical", "Renewable Energy"] },
  { tier: "Tier 3: Stable Professional", pay: "$80k - $200k", jobs: ["Professor", "Research Scientist", "Cloud Architect", "Robotics", "Industrial Automation"] },
  { tier: "Tier 4: Creative & Ethical", pay: "$70k - $180k", jobs: ["Architect", "UX/UI Designer", "Brand Strategist", "Lawyer", "Policy Advisor"] },
  { tier: "Tier 5: Field & Critical Ops", pay: "$50k - $150k", jobs: ["Industrial Electrician", "Construction Lead", "Aircraft Maintenance", "Marine Engineer"] },
  { tier: "Tier 6: Emerging Future", pay: "$100k - $300k", jobs: ["Space Systems", "Quantum Computing", "Bioelectronics", "Nanotech", "Ethical AI"] }
];

export const REMOTE_JOB_STEPS = [
  "1. Build Strong Skills (Data Analysis, ML, PyTorch, Tableau)",
  "2. Create World-Class Resume (LaTeX, GitHub links, Live Projects)",
  "3. Register on Platforms (Toptal, Upwork, RemoteOK, LinkedIn)",
  "4. Freelance First (Upwork/Fiverr to build ratings)",
  "5. Master Communication (English, Slack, Zoom, Time Zones)",
  "6. Apply Smartly (Custom cover letters, Follow ups)",
  "7. Ace Interviews (Leetcode, System Design, Mock Interviews)"
];

// --- THE CODEX: Life Time Learning Note ---
export const THE_CODEX: CodexChapter[] = [
  {
    id: "masculine",
    title: "1. The Masculine Core",
    description: "Identity, Respect, and The Unshakeable Mind",
    content: [
      {
        sectionTitle: "High Value Traits",
        points: [
          "Don't seek attention and validation. Kaw k bishas korbo na (Trust no one blindly).",
          "Respect = power, dominance, responsibility.",
          "Silence and pause. Speak less about yourself.",
          "Eye contact. Deep voice. Calmness.",
          "Be a leader, not a follower. Don't be available always.",
          "Stop being a 'Nice Guy'. Don't be creepy or desperate.",
          "Respond, don't react. Don't complain.",
          "Live as if your father is dead (Take full responsibility).",
          "Never tell your secret. Guard your past.",
          "Don't loose respect. Avoid lust. Avoid cheap entertainment."
        ]
      },
      {
        sectionTitle: "Emotional Control",
        points: [
          "Pause (10 seconds) before reacting.",
          "Name the emotion: 'I feel angry'. Don't let it hijack you.",
          "Reframe: 'Is there another way to see this?'",
          "Stoicism: Focus on what you control.",
          "Don't argue with dull people.",
          "Don't blame anyone. Take ownership.",
          "Use journaling to express emotions safely."
        ]
      },
      {
        sectionTitle: "Confidence & Body Language",
        points: [
          "Body posture: Stand tall, take up space.",
          "Fit and clean. Clear skin. Grooming.",
          "Smile (genuine).",
          "Don't fear looking stupid. Ask questions.",
          "Act fast instead of overthinking.",
          "Take risks. Apply for jobs you are 60% qualified for.",
          "Pitch yourself boldly. DM 10 companies."
        ]
      }
    ]
  },
  {
    id: "wealth",
    title: "2. The Wealth Code",
    description: "The Lazy Millionaire & Billionaire Roadmap",
    content: [
      {
        sectionTitle: "Lazy Millionaire Principles",
        points: [
          "Money is made by SYSTEMS, not hard work alone.",
          "Equation: Value Creation = Money (Not Time = Money).",
          "Don't chase money, chase problems.",
          "Leverage: Use people, capital, code, and media.",
          "4 types of leverage: Labor, Capital, Code, Media.",
          "The Lazy Millionaire works smarter, builds assets, and lets money work.",
          "Buy Assets (put money in pocket), Avoid Liabilities (take money out).",
          "Say NO to 99% of offers. Focus on the 1%."
        ]
      },
      {
        sectionTitle: "Billionaire Roadmap (Ages 15-50+)",
        points: [
          "Phase 1 (15-25): Foundation. Learn high-value skills (Coding, Sales, Finance).",
          "Phase 2 (20-30): Launch. Start a lean business. Fail fast.",
          "Phase 3 (25-35): Scale. Automate & delegate. Reach $1M-$10M.",
          "Phase 4 (30-45): Invest. Diversify into Real Estate, Stocks, Angel Investing.",
          "Phase 5 (35-50+): Legacy. Global influence, philanthropy.",
          "Core Principle: Think in Billions. Target massive problems.",
          "Own Equity. Salary will never make you a billionaire."
        ]
      },
      {
        sectionTitle: "Rich vs Poor Mindset",
        points: [
          "Poor: Trade time for money. Rich: Trade value for money.",
          "Poor: Save what's left after spending. Rich: Spend what's left after saving.",
          "Poor: Buy liabilities (phones, cars) to look rich. Rich: Buy assets to be rich.",
          "Poor: Fear risk. Rich: Manage risk.",
          "Poor: Think 'I can't afford it'. Rich: Ask 'How can I afford it?'",
          "Poor: Focus on obstacles. Rich: Focus on opportunities."
        ]
      },
      {
        sectionTitle: "Money Rules",
        points: [
          "10x Rule: Can you buy 10 of them? If not, don't buy.",
          "50/30/20 Rule: 50% Needs, 30% Wants, 20% Savings.",
          "Rule of 72: 72 / Interest Rate = Years to double money.",
          "2x Investing Rule: Invest 2x the amount of any luxury purchase.",
          "Emergency Fund: 3-6 months expenses saved.",
          "Pay yourself first (10% minimum).",
          "Don't show off. Wealth is silent."
        ]
      }
    ]
  },
  {
    id: "social",
    title: "3. Social Dynamics",
    description: "Seduction, Influence, and Networking",
    content: [
      {
        sectionTitle: "Attraction & Seduction",
        points: [
          "Be 'The Prize'. Don't chase.",
          "Scarcity principle: Be unavailable sometimes.",
          "Confidence & Leadership attract women.",
          "Don't be a 'Nice Guy'. Be assertive.",
          "Mixed signals: Push-pull technique.",
          "Respect her boundaries, but have your own.",
          "Don't make her your #1 priority. Purpose comes first.",
          "Physical touch (when appropriate) builds connection.",
          "Humor without harm. Be witty."
        ]
      },
      {
        sectionTitle: "Dark Psychology & Influence",
        points: [
          "Create a need. Be the solution.",
          "Use 'Social Proof'. People copy others.",
          "Reciprocity: Give a small favor to get a big one.",
          "Mirroring: Copy body language to build rapport.",
          "Ask for help (Ben Franklin effect).",
          "Don't argue. Give evidence or ask questions.",
          "Call people by their name.",
          "Listen more than you talk."
        ]
      },
      {
        sectionTitle: "Networking & Friends",
        points: [
          "You are the average of the 5 people you hang out with.",
          "Network = Net Worth.",
          "Don't share secrets. Be mysterious.",
          "Cut toxic friends (complainers, doubters).",
          "Give value first in networking.",
          "Treat everyone with respect, from waiter to CEO."
        ]
      }
    ]
  },
  {
    id: "health",
    title: "4. The Spartan Vessel",
    description: "Health, Habits, and Bio-Hacking",
    content: [
      {
        sectionTitle: "21-Day Challenges",
        points: [
          "No Social Media (Dopamine Detox).",
          "No Fap / Celibacy.",
          "Wake up at 5 AM.",
          "Cold Showers.",
          "Meditation (10 mins daily).",
          "Journaling & Gratitude.",
          "Workout daily (Sweat).",
          "Read 30 mins daily."
        ]
      },
      {
        sectionTitle: "Testosterone & Energy",
        points: [
          "Eat: Eggs, Nuts, Beans, Garlic, Ginger, Pomegranate.",
          "Vitamin D (Sunlight 15 mins).",
          "Resistance Training (Lift heavy).",
          "Sleep 7-8 hours (Deep sleep).",
          "Avoid: Sugar, Junk Food, Soy (excess), Plastic.",
          "Reduce stress (Cortisol kills Testosterone)."
        ]
      },
      {
        sectionTitle: "Sleep Optimization",
        points: [
          "Dark room.",
          "No screens 1 hour before bed.",
          "Consistent wake/sleep time.",
          "No caffeine after 2 PM.",
          "Magnesium for relaxation."
        ]
      }
    ]
  },
  {
    id: "academy",
    title: "5. The Academy",
    description: "Learning Like a Genius & Study Protocols",
    content: [
      {
        sectionTitle: "The 1% Study Protocol (5 Phases)",
        points: [
          "Phase 1 (Mindset): Identity Shift ('I am a top 1% student'). Grit ('Na parlew porre thakbo').",
          "Phase 2 (Setup): Environment Anchoring. Phone away. Sleep 7-8 hours (Memory consolidation).",
          "Phase 3 (Process): Chunking. Visualization (Mental Movie). 90/20 Rule (Deep work/Break). Active Recall (Close book & Write).",
          "Phase 4 (Retention): Spaced Repetition (Day 1, 3, 7, 21). Interleaving (Mix subjects).",
          "Phase 5 (Dopamine): Reward system. Temptation Bundling (Music only with Math). Progress Bar."
        ]
      },
      {
        sectionTitle: "Genius Learning Rules (10 Points)",
        points: [
          "1. Technology Changes Jobs: Don't resist AI, learn to adapt immediately.",
          "2. Problem-Based Learning: Real problems teach faster than school. Build to learn.",
          "3. Break Huge Goals: Solve progressively harder problems (Basics -> AlphaGo -> AlphaFold).",
          "4. Know Your 'Why': Clarity multiplies learning speed.",
          "5. Networking: Ask for help. Collaboration is not cheating in real life.",
          "6. Iterations > Hours: 50 iterations beat 500 hours of passive reading.",
          "7. Portfolio > Certificates: Build projects that show what you can do.",
          "8. Mix Subjects: Real world problems are interdisciplinary.",
          "9. Start Before Ready: Readiness is a myth. Learn by doing.",
          "10. Continuous Learning: One degree won't protect you. Keep learning."
        ]
      },
      {
        sectionTitle: "48-Hour Success Formula",
        points: [
          "Parkinson's Law: Work expands to fill time. Set 48h deadlines.",
          "Identity Shift: 'I am a coder', not 'I am trying to code'.",
          "2-Minute Rule: Just start for 2 mins to break inertia.",
          "Habit Stacking: Code after Coffee.",
          "Reverse Engineering: Break big goal into small steps.",
          "Neuro-association: Link hard work to pleasure (Music/Reward)."
        ]
      },
      {
        sectionTitle: "Daily Routine (1% Club)",
        points: [
          "Night Before: Write 3 tasks for tomorrow.",
          "Morning: Eat the Frog (Hardest subject first).",
          "Study Block: 90 mins Deep Work.",
          "Review: Feynman Test (Teach it to a child).",
          "End of Day: Track habits."
        ]
      }
    ]
  },
  {
    id: "career",
    title: "6. Career Warfare",
    description: "High-Income Jobs & Remote Work Roadmap",
    content: [
      {
        sectionTitle: "Job Tiers (High Income & AI Resistant)",
        points: [
          "Tier 1 ($150k-$500k): Surgeon, AI Researcher, Product Manager, VLSI Lead.",
          "Tier 2 ($90k-$180k): Embedded Systems, RF Engineer, Biomedical, Renewable Energy.",
          "Tier 3 ($80k-$200k): Professor, Research Scientist, Cloud Architect, Robotics.",
          "Tier 4 ($70k-$180k): Architect, UX/UI Designer, Brand Strategist.",
          "Tier 5 ($50k-$150k): Industrial Electrician, Construction Lead, Marine Engineer.",
          "Tier 6 ($100k-$300k): Space Systems, Quantum Computing, Bioelectronics."
        ]
      },
      {
        sectionTitle: "Remote Job Roadmap (Bangladesh to Global)",
        points: [
          "1. Build Skills: Data Analysis, ML, Python, Tableau. Real-world projects.",
          "2. World-Class Resume: Clean PDF, GitHub links, Live projects.",
          "3. Platforms: Toptal, Upwork, RemoteOK, LinkedIn, Wellfound.",
          "4. Freelance First: Build ratings on Upwork/Fiverr to prove reliability.",
          "5. Communication: Master English, Slack, Zoom. Be time-zone flexible.",
          "6. Apply Smartly: Custom cover letters. Follow up.",
          "7. Interview Prep: Leetcode, System Design, Mock interviews."
        ]
      }
    ]
  }
];
