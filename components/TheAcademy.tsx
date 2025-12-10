import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, ChevronRight, Target, Shield, Zap, Layout, List, CheckCircle, AlertTriangle, Lightbulb, Users, BarChart3, Heart, Activity, Plus, Trash2, Save, Minus, Edit3, X, GraduationCap, Briefcase, Globe, Cpu, Play, Pause, RotateCcw, Coffee, Timer, Brain } from 'lucide-react';
import { STUDY_PHASES, GENIUS_LEARNING_RULES, CAREER_JOB_TIERS, REMOTE_JOB_STEPS } from '../constants';

// --- STATIC DATA (CONSTANTS) ---

const LIFE_MISSION = [
  "Worship Allah • Achieve Financial Freedom • Maintain Health • Spread Knowledge",
  "Honor Family • Travel the World • Work with Integrity • Keep Hope Alive"
];

const KAIZEN_PRINCIPLES = [
  "Small Steps Matter", "Consistency Beats Intensity", "Everyone Can Contribute", "Eliminate Waste", "Reflect & Learn"
];

const LIFE_RULES = [
  "Create! Don't just consume",
  "Give purpose to your work",
  "You are the farmer, body & mind is the horse 🐎",
  "Think before you act",
  "Read daily (10 pages)",
  "Control emotions - Silence is power",
  "Choose wise friends",
  "Learn from mistakes (Yours & Others)",
  "Manage money wisely (Save/Invest)",
  "Stay disciplined - Do hard things"
];

const CRITICAL_THINKING_LEVELS = [
  { level: 1, title: "Data is Everything", desc: "Trust facts, not feelings. If you can't measure it, you can't trust it." },
  { level: 2, title: "Correlation ≠ Causation", desc: "Coincidence is not a cause. Check the root." },
  { level: 3, title: "Syllogism Sanity", desc: "Check your foundational assumptions (A=B, B=C, so A=C)." },
  { level: 4, title: "Prove Yourself Wrong", desc: "Be your own worst critic. Fight confirmation bias." },
  { level: 5, title: "Second-Order Effects", desc: "Ask: 'And then what?' Look at the chain reaction." }
];

const BEZOS_STEPS = [
  "Define Outcome", "Break into Inputs", "Automate Triggers", "Track Feedback", "Refine Slowly"
];

export const TheAcademy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STRATEGY' | 'SYSTEMS' | 'ACADEMICS' | 'CAREER' | 'WISDOM'>('ACADEMICS');
  
  // --- STATE MANAGEMENT WITH PERSISTENCE ---

  // 1. CAPITALS
  const [capitals, setCapitals] = useState(() => {
    const saved = localStorage.getItem('academy_capitals');
    return saved ? JSON.parse(saved) : [
      { type: "Financial", level: 1, target: 5, action: "Build passive income, invest monthly", priority: "Critical" },
      { type: "Skill", level: 3, target: 5, action: "Master AI/ML, EEE, Data Science", priority: "High" },
      { type: "Social", level: 4, target: 5, action: "Network with leaders, Mentors", priority: "Medium" },
      { type: "Intellectual", level: 3, target: 5, action: "Read 12+ books/year", priority: "High" },
      { type: "Physical", level: 5, target: 5, action: "Exercise daily, maintain health", priority: "Medium" },
      { type: "Emotional", level: 5, target: 5, action: "Practice emotional intelligence", priority: "High" }
    ];
  });

  // 2. GAPS
  const [gaps, setGaps] = useState(() => {
    const saved = localStorage.getItem('academy_gaps');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "English (IELTS)", deadline: "2025-11-30", status: "Critical" },
      { id: 2, name: "GK (General Knowledge)", deadline: "Ongoing", status: "Pending" },
      { id: 3, name: "Math Proficiency", deadline: "Ongoing", status: "Pending" },
      { id: 4, name: "Physics Core", deadline: "Ongoing", status: "Pending" },
      { id: 5, name: "EEE Core Subjects", deadline: "Ongoing", status: "Pending" },
      { id: 6, name: "JCO Application", deadline: "27 Oct 2025", status: "URGENT" }
    ];
  });
  const [newGapName, setNewGapName] = useState('');
  const [newGapDeadline, setNewGapDeadline] = useState('');

  // 3. BEZOS STEPS
  const [bezosProgress, setBezosProgress] = useState<boolean[]>(() => {
     const saved = localStorage.getItem('academy_bezos');
     return saved ? JSON.parse(saved) : [false, false, false, false, false];
  });

  // 4. EVENING CHECKS
  const [eveningChecks, setEveningChecks] = useState(() => {
    const saved = localStorage.getItem('academy_evening_checks');
    return saved ? JSON.parse(saved) : {
      goalWork: false, discipline: false, selfCare: false, learning: false, peace: false
    };
  });

  // 5. FAILURE LOG
  const [failureLog, setFailureLog] = useState<any[]>(() => {
     const saved = localStorage.getItem('academy_failures');
     return saved ? JSON.parse(saved) : [];
  });
  const [newFailure, setNewFailure] = useState({ what: '', why: '', lesson: '' });

  // 6. 48-Hour Sprint & Pomodoro
  const [sprintObjective, setSprintObjective] = useState(() => localStorage.getItem('academy_sprint_obj') || "Complete Electronics 2 Chapter 4");
  const [isEditingSprint, setIsEditingSprint] = useState(false);
  const [sprintEndTime, setSprintEndTime] = useState<number | null>(() => {
      const saved = localStorage.getItem('academy_sprint_end');
      return saved ? parseInt(saved) : null;
  });
  const [timeRemaining, setTimeRemaining] = useState<string>("48:00:00");

  // Pomodoro State
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [isPomoActive, setIsPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState<'FOCUS' | 'SHORT' | 'LONG'>('FOCUS');
  const [pomoStreak, setPomoStreak] = useState(0);

  // PERSISTENCE EFFECTS
  useEffect(() => { localStorage.setItem('academy_capitals', JSON.stringify(capitals)); }, [capitals]);
  useEffect(() => { localStorage.setItem('academy_gaps', JSON.stringify(gaps)); }, [gaps]);
  useEffect(() => { localStorage.setItem('academy_bezos', JSON.stringify(bezosProgress)); }, [bezosProgress]);
  useEffect(() => { localStorage.setItem('academy_evening_checks', JSON.stringify(eveningChecks)); }, [eveningChecks]);
  useEffect(() => { localStorage.setItem('academy_failures', JSON.stringify(failureLog)); }, [failureLog]);
  useEffect(() => { localStorage.setItem('academy_sprint_obj', sprintObjective); }, [sprintObjective]);
  useEffect(() => {
      if (sprintEndTime) localStorage.setItem('academy_sprint_end', sprintEndTime.toString());
      else localStorage.removeItem('academy_sprint_end');
  }, [sprintEndTime]);

  // POMODORO TIMER EFFECT
  useEffect(() => {
    let interval: any;
    if (isPomoActive && pomoTime > 0) {
      interval = setInterval(() => {
        setPomoTime((prev) => prev - 1);
      }, 1000);
    } else if (pomoTime === 0) {
      setIsPomoActive(false);
      if (pomoMode === 'FOCUS') setPomoStreak(s => s + 1);
      // Optional: Audio alert here
    }
    return () => clearInterval(interval);
  }, [isPomoActive, pomoTime, pomoMode]);

  // SPRINT TIMER EFFECT
  useEffect(() => {
      if (!sprintEndTime) {
          setTimeRemaining("48:00:00");
          return;
      }
      const interval = setInterval(() => {
          const now = Date.now();
          const distance = sprintEndTime - now;
          if (distance < 0) {
              setTimeRemaining("00:00:00");
              clearInterval(interval);
          } else {
              const hours = Math.floor((distance % (1000 * 60 * 60 * 48 * 365)) / (1000 * 60 * 60)); // Simple hours display
              // For 48h, hours can be > 24.
              const totalHours = Math.floor(distance / (1000 * 60 * 60));
              const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((distance % (1000 * 60)) / 1000);
              setTimeRemaining(`${totalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          }
      }, 1000);
      return () => clearInterval(interval);
  }, [sprintEndTime]);

  // --- HANDLERS ---

  const handleUpdateCapital = (index: number, newLevel: number) => {
    const updated = [...capitals];
    updated[index].level = Math.max(1, Math.min(5, newLevel));
    setCapitals(updated);
  };

  const handleAddGap = () => {
    if (!newGapName) return;
    setGaps([...gaps, { id: Date.now(), name: newGapName, deadline: newGapDeadline || 'Ongoing', status: 'Pending' }]);
    setNewGapName('');
    setNewGapDeadline('');
  };

  const handleDeleteGap = (id: number) => {
    setGaps(gaps.filter((g: any) => g.id !== id));
  };

  const handleToggleGapStatus = (id: number) => {
    setGaps(gaps.map((g: any) => {
        if(g.id === id) {
            const nextStatus = g.status === 'Pending' ? 'In Progress' : g.status === 'In Progress' ? 'Done' : 'Pending';
            return { ...g, status: nextStatus };
        }
        return g;
    }));
  };

  const handleBezosToggle = (index: number) => {
    const updated = [...bezosProgress];
    updated[index] = !updated[index];
    setBezosProgress(updated);
  };

  const handleLogFailure = () => {
    if (!newFailure.what) return;
    setFailureLog([{ id: Date.now(), date: new Date().toLocaleDateString(), ...newFailure }, ...failureLog]);
    setNewFailure({ what: '', why: '', lesson: '' });
  };
  
  const handleDeleteFailure = (id: number) => {
      setFailureLog(failureLog.filter((f: any) => f.id !== id));
  };

  // POMODORO HANDLERS
  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const setPomoModeHandler = (mode: 'FOCUS' | 'SHORT' | 'LONG') => {
      setPomoMode(mode);
      setIsPomoActive(false);
      if (mode === 'FOCUS') setPomoTime(25 * 60);
      if (mode === 'SHORT') setPomoTime(5 * 60);
      if (mode === 'LONG') setPomoTime(15 * 60);
  };

  // SPRINT HANDLERS
  const startSprint = () => {
      const now = Date.now();
      const end = now + (48 * 60 * 60 * 1000);
      setSprintEndTime(end);
  };

  const resetSprint = () => {
      if (confirm("Reset current sprint?")) {
          setSprintEndTime(null);
      }
  };

  // --- RENDER SECTIONS ---

  const renderOverview = () => {
    const capitalScore = capitals.reduce((acc: number, curr: any) => acc + curr.level, 0);
    const totalCapitalTarget = capitals.length * 5;
    const gapsCount = gaps.filter((g: any) => g.status !== 'Done').length;

    return (
    <div className="space-y-6 animate-in fade-in">
       {/* KPI BOARD */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 uppercase">Productivity Score</p>
             <p className="text-2xl font-mono font-bold text-wealth-green">85.0%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 uppercase">Current Streak</p>
             <p className="text-2xl font-mono font-bold text-spartan-red">52 Days</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 uppercase">Gaps to Close</p>
             <p className="text-2xl font-mono font-bold text-amber-500">
                 {gapsCount}
             </p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 uppercase">Capital Score</p>
             <p className="text-2xl font-mono font-bold text-blue-500">{capitalScore}/{totalCapitalTarget}</p>
          </div>
       </div>

       {/* KAIZEN & RULES SUMMARY */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <Target className="text-spartan-red" />
                <h3 className="font-bold text-gray-900 dark:text-white uppercase">Kaizen Principles</h3>
             </div>
             <ul className="space-y-2">
                {KAIZEN_PRINCIPLES.map((k, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle size={14} className="text-wealth-green"/> {k}
                    </li>
                ))}
             </ul>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <Shield className="text-gold" />
                <h3 className="font-bold text-gray-900 dark:text-white uppercase">Identity & Ikigai</h3>
             </div>
             <div className="text-sm space-y-3">
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                    <span className="text-gray-500">Love:</span>
                    <span className="text-gray-800 dark:text-gray-200">Teaching, Engineering, Problem Solving</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                    <span className="text-gray-500">Good At:</span>
                    <span className="text-gray-800 dark:text-gray-200">EEE, Data Science, Writing</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                    <span className="text-gray-500">World Needs:</span>
                    <span className="text-gray-800 dark:text-gray-200">AI Solutions, Education</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Paid For:</span>
                    <span className="text-gray-800 dark:text-gray-200">Engineering, Consulting, Courses</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  )};

  const renderStrategy = () => (
    <div className="space-y-6 animate-in fade-in">
        {/* 6 CAPITALS TRACKER */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                <BarChart3 className="text-blue-500"/> The 6 Capitals (Control)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {capitals.map((cap: any, index: number) => (
                    <div key={cap.type} className="bg-gray-50 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-800 select-none">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-gray-800 dark:text-gray-200">{cap.type} Capital</span>
                            <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${cap.priority === 'Critical' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200' : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                                {cap.priority}
                            </span>
                        </div>
                        {/* Interactive Bar */}
                        <div className="flex items-center gap-1 mb-2">
                            {[1,2,3,4,5].map(lvl => (
                                <div 
                                    key={lvl}
                                    onClick={() => handleUpdateCapital(index, lvl)}
                                    className={`h-4 flex-1 rounded cursor-pointer transition-colors ${lvl <= cap.level ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700'}`}
                                ></div>
                            ))}
                            <span className="text-xs font-mono text-gray-500 ml-2">{cap.level}/5</span>
                        </div>
                        <p className="text-xs text-gray-500 italic">"{cap.action}"</p>
                    </div>
                ))}
            </div>
        </div>

        {/* BEZOS 5-STEP & WHO NOT HOW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Layout className="text-gold" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase">Bezos 5-Step Progress</h3>
                </div>
                <p className="text-xs text-gray-500 mb-4">Applied to Goal: "Financial Freedom"</p>
                <div className="space-y-3">
                    {BEZOS_STEPS.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3 group cursor-pointer" onClick={() => handleBezosToggle(idx)}>
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-mono transition-colors ${bezosProgress[idx] ? 'bg-amber-400 dark:bg-gold text-black font-bold' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}>
                                {idx + 1}
                            </div>
                            <div className={`flex-1 p-2 rounded border text-sm transition-all ${bezosProgress[idx] ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 dark:border-gold text-gray-900 dark:text-white' : 'bg-gray-50 dark:bg-black border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 group-hover:border-gray-400 dark:group-hover:border-gray-600'}`}>
                                {step}
                            </div>
                            <input 
                                type="checkbox" 
                                checked={bezosProgress[idx]} 
                                readOnly
                                className="accent-amber-400 h-4 w-4 cursor-pointer" 
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="text-purple-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase">Who Not How</h3>
                </div>
                <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="bg-purple-100 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/30 p-3 rounded">
                        <strong className="text-purple-600 dark:text-purple-400 block mb-1">Core Idea:</strong>
                        Stop asking "How can I do this?" Ask "Who can help me do this?"
                    </div>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                        <li>• Freedom 1: Time (Delegate tasks)</li>
                        <li>• Freedom 2: Money (Focus on strengths)</li>
                        <li>• Freedom 3: Relationship (Select network)</li>
                        <li>• Freedom 4: Purpose (Expand vision)</li>
                    </ul>
                    <div className="p-3 bg-gray-50 dark:bg-black rounded border border-gray-200 dark:border-gray-800">
                        <strong className="block text-xs text-gray-500 uppercase mb-1">Success Definition</strong>
                        "Having freedom to focus on what you love, while others handle the rest."
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  const renderSystems = () => (
    <div className="space-y-6 animate-in fade-in">
        {/* DECISION FLOWCHART VISUALIZATION */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase mb-6 flex items-center gap-2">
                <Zap className="text-yellow-400"/> Master Decision Flowchart
            </h3>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                <div className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 p-4 rounded w-full">
                    <p className="text-xs text-gray-500 uppercase mb-1">Q1</p>
                    <p className="font-bold text-gray-900 dark:text-white">Time is limited?</p>
                    <div className="mt-2 text-xs text-green-500">YES → Be Productive</div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-600 hidden md:block" />
                <div className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 p-4 rounded w-full">
                    <p className="text-xs text-gray-500 uppercase mb-1">Q2</p>
                    <p className="font-bold text-gray-900 dark:text-white">Living for others?</p>
                    <div className="mt-2 text-xs text-red-500">YES → Avoid It</div>
                </div>
                <ChevronRight className="text-gray-400 dark:text-gray-600 hidden md:block" />
                <div className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 p-4 rounded w-full">
                    <p className="text-xs text-gray-500 uppercase mb-1">Q3</p>
                    <p className="font-bold text-gray-900 dark:text-white">Life Worth Living?</p>
                    <div className="mt-2 text-xs text-blue-500">NO → Align Values</div>
                </div>
            </div>
        </div>

        {/* EVENING 5-POINT CHECK */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                <Heart className="text-pink-500"/> Everyday 5-Point Self-Check
            </h3>
            <div className="space-y-2">
                {[
                    { key: 'goalWork', label: 'Did I work towards my MOST important goal?' },
                    { key: 'discipline', label: 'Did I maintain discipline (wake early, no distractions)?' },
                    { key: 'selfCare', label: 'Did I take care of body & mind (exercise, food)?' },
                    { key: 'learning', label: 'Did I learn something new or practice a skill?' },
                    { key: 'peace', label: 'Am I at peace with how I spent today?' }
                ].map((check) => (
                    <label key={check.key} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-black rounded border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
                        <input 
                            type="checkbox" 
                            checked={eveningChecks[check.key as keyof typeof eveningChecks]} 
                            onChange={() => setEveningChecks(prev => ({...prev, [check.key]: !prev[check.key as keyof typeof eveningChecks]}))}
                            className="h-5 w-5 accent-pink-500"
                        />
                        <span className={`text-sm ${eveningChecks[check.key as keyof typeof eveningChecks] ? 'text-gray-400 dark:text-gray-300 line-through' : 'text-gray-700 dark:text-gray-500'}`}>
                            {check.label}
                        </span>
                    </label>
                ))}
            </div>
        </div>

        {/* FAILURE IMMUNITY */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
             <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="text-orange-500" />
                <h3 className="font-bold text-gray-900 dark:text-white uppercase">Failure Immunity Log</h3>
            </div>
            <div className="bg-orange-50 dark:bg-black p-4 rounded border border-orange-200 dark:border-gray-800 text-sm mb-4">
                <strong className="text-orange-500 dark:text-orange-400">Concept:</strong> Treat failures as DATA, not defeat. Reframe rejection as redirection.
            </div>
            {/* Input Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <input 
                    type="text" 
                    placeholder="What Failed?" 
                    value={newFailure.what}
                    onChange={(e) => setNewFailure({...newFailure, what: e.target.value})}
                    className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 p-2 rounded text-gray-900 dark:text-white text-xs focus:border-orange-500 outline-none" 
                />
                <input 
                    type="text" 
                    placeholder="Why? (Root Cause)" 
                    value={newFailure.why}
                    onChange={(e) => setNewFailure({...newFailure, why: e.target.value})}
                    className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 p-2 rounded text-gray-900 dark:text-white text-xs focus:border-orange-500 outline-none" 
                />
                <input 
                    type="text" 
                    placeholder="Lesson Learned" 
                    value={newFailure.lesson}
                    onChange={(e) => setNewFailure({...newFailure, lesson: e.target.value})}
                    className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 p-2 rounded text-gray-900 dark:text-white text-xs focus:border-orange-500 outline-none" 
                />
            </div>
            <button 
                onClick={handleLogFailure}
                className="bg-orange-100 dark:bg-orange-600/20 text-orange-600 dark:text-orange-500 border border-orange-200 dark:border-orange-600 w-full py-2 rounded text-xs font-bold uppercase hover:bg-orange-200 dark:hover:bg-orange-600/40 mb-6"
            >
                Log Failure Data
            </button>
            
            {/* Log List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {failureLog.length === 0 && <p className="text-xs text-gray-500 text-center italic">No failures logged yet. Go fail at something.</p>}
                {failureLog.map((f: any) => (
                    <div key={f.id} className="bg-gray-50 dark:bg-black p-3 rounded border border-gray-200 dark:border-gray-800 relative group">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] text-gray-500 font-mono">{f.date}</span>
                            <button onClick={() => handleDeleteFailure(f.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm font-bold">{f.what}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><span className="text-orange-500">Why:</span> {f.why}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400"><span className="text-green-500">Lesson:</span> {f.lesson}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderAcademics = () => (
    <div className="space-y-6 animate-in fade-in">
        {/* --- DEEP WORK COMMAND CENTER (POMODORO & SPRINT) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* 1. POMODORO STATION */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg relative overflow-hidden shadow-sm">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <Brain className="text-purple-500" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Deep Work HQ</h3>
                    </div>
                    <div className="flex gap-2">
                        {['FOCUS', 'SHORT', 'LONG'].map((mode) => (
                            <button 
                                key={mode}
                                onClick={() => setPomoModeHandler(mode as any)}
                                className={`text-[10px] font-bold px-2 py-1 rounded border transition-colors ${
                                    pomoMode === mode 
                                    ? 'bg-purple-600 border-purple-600 text-white' 
                                    : 'bg-gray-100 dark:bg-black border-gray-300 dark:border-gray-700 text-gray-500 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-6 relative z-10">
                    <div className="text-6xl font-mono font-black text-gray-900 dark:text-white tracking-widest mb-6">
                        {formatTime(pomoTime)}
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setIsPomoActive(!isPomoActive)}
                            className={`flex items-center gap-2 px-6 py-3 rounded font-bold uppercase text-xs tracking-widest transition-all ${
                                isPomoActive 
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-black' 
                                : 'bg-green-600 hover:bg-green-500 text-white'
                            }`}
                        >
                            {isPomoActive ? <Pause size={16}/> : <Play size={16}/>}
                            {isPomoActive ? "Pause Protocol" : "Engage Focus"}
                        </button>
                        <button 
                            onClick={() => { setIsPomoActive(false); setPomoModeHandler(pomoMode); }}
                            className="p-3 rounded bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 transition-colors"
                        >
                            <RotateCcw size={16}/>
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-4 relative z-10">
                    <span>Sessions Completed Today: <span className="text-gray-900 dark:text-white font-bold">{pomoStreak}</span></span>
                    <span className="flex items-center gap-1"><Coffee size={12}/> {pomoMode === 'FOCUS' ? 'Stay Hard.' : 'Recover.'}</span>
                </div>
                
                {/* Background Decoration */}
                <Timer size={200} className="absolute -bottom-10 -right-10 text-purple-200 dark:text-purple-900/20 opacity-20 pointer-events-none" />
            </div>

            {/* 2. 48-HOUR SPRINT OPERATIONS */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg relative overflow-hidden flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <Clock className="text-spartan-red" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Op: 48-Hour Sprint</h3>
                    </div>
                    {sprintEndTime && (
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 px-2 py-1 rounded border border-red-200 dark:border-red-900 font-bold animate-pulse">
                            ACTIVE
                        </span>
                    )}
                </div>

                <div className="flex-1 flex flex-col relative z-10">
                    {/* Objective Display */}
                    <div className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-800 p-4 rounded mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Current Objective (Parkinson's Law)</span>
                            <button onClick={() => setIsEditingSprint(!isEditingSprint)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><Edit3 size={12}/></button>
                        </div>
                        {isEditingSprint ? (
                            <textarea 
                                value={sprintObjective}
                                onChange={(e) => setSprintObjective(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm p-2 rounded border border-gray-300 dark:border-gray-700 outline-none focus:border-spartan-red h-20 resize-none"
                            />
                        ) : (
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 leading-relaxed">{sprintObjective}</p>
                        )}
                    </div>

                    {/* Countdown Display */}
                    <div className="mt-auto text-center">
                        {sprintEndTime ? (
                            <>
                                <div className="text-4xl md:text-5xl font-mono font-black text-gray-900 dark:text-white tracking-widest mb-4 tabular-nums">
                                    {timeRemaining}
                                </div>
                                <button 
                                    onClick={resetSprint}
                                    className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-widest"
                                >
                                    Abort Mission
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <p className="text-xs text-gray-500 mb-4 text-center">"Work expands to fill the time available."<br/>Set a 48h deadline to force completion.</p>
                                <button 
                                    onClick={startSprint}
                                    className="bg-spartan-red hover:bg-red-600 text-white font-bold py-3 px-8 rounded uppercase text-xs tracking-widest transition-all shadow-lg shadow-red-500/20"
                                >
                                    Initialize Sprint
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* 3. THE 1% STUDY PROTOCOL (VISUALIZED PHASES) */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">The 1% Study Protocol</h3>
            </div>
            
            <div className="space-y-4">
                {STUDY_PHASES.map((p, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-lg relative overflow-hidden group hover:border-blue-500 transition-colors">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                        <h4 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-1">{p.phase}: {p.rule}</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{p.action}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* 4. GENIUS LEARNING RULES */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="text-gold" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Genius Learning Rules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GENIUS_LEARNING_RULES.map((rule, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-black p-3 rounded border border-gray-200 dark:border-gray-800">
                        <p className="text-amber-600 dark:text-gold font-bold text-xs uppercase mb-1">{rule.title}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-xs">{rule.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* 5. MY GAPS TO CLOSE */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg border-l-4 border-l-red-600 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">❌ Gaps to Close</h3>
                <div className="flex gap-2">
                    <input 
                        className="bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 text-xs text-gray-900 dark:text-white p-2 rounded w-32 outline-none" 
                        placeholder="New Gap..." 
                        value={newGapName}
                        onChange={(e) => setNewGapName(e.target.value)}
                    />
                     <input 
                        className="bg-gray-100 dark:bg-black border border-gray-300 dark:border-gray-700 text-xs text-gray-900 dark:text-white p-2 rounded w-24 outline-none" 
                        placeholder="Deadline..." 
                        value={newGapDeadline}
                        onChange={(e) => setNewGapDeadline(e.target.value)}
                    />
                    <button onClick={handleAddGap} className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"><Plus size={14}/></button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gaps.map((gap: any) => (
                    <div key={gap.id} className={`flex justify-between items-center p-3 bg-gray-50 dark:bg-black rounded border cursor-pointer select-none transition-all ${gap.status === 'Done' ? 'opacity-50 border-gray-200 dark:border-gray-800' : 'border-gray-300 dark:border-gray-700 hover:border-gray-500'}`} onClick={() => handleToggleGapStatus(gap.id)}>
                        <div>
                            <p className={`font-bold text-sm ${gap.status === 'Done' ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>{gap.name}</p>
                            <p className="text-xs text-red-500 dark:text-red-400 font-mono">Deadline: {gap.deadline}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                                gap.status === 'Done' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-500' : 
                                gap.status === 'Critical' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500' : 
                                'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                                {gap.status}
                            </span>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteGap(gap.id); }} className="text-gray-400 hover:text-red-500">
                                <Trash2 size={12}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderCareer = () => (
      <div className="space-y-6 animate-in fade-in">
          {/* HIGH INCOME JOB TIERS */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="text-emerald-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">100-Year AI-Resistant Jobs</h3>
              </div>
              <div className="space-y-4">
                  {CAREER_JOB_TIERS.map((tier, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                              <h4 className="text-gray-900 dark:text-white font-bold text-sm">{tier.tier}</h4>
                              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">{tier.pay}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                              {tier.jobs.map((job, jIdx) => (
                                  <span key={jIdx} className="text-[10px] bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-300 dark:border-gray-700">
                                      {job}
                                  </span>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          {/* REMOTE JOB ROADMAP */}
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                  <Globe className="text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Remote Job Strategy (BD to Global)</h3>
              </div>
              <div className="space-y-4">
                  {REMOTE_JOB_STEPS.map((step, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold h-6 w-6 rounded-full flex items-center justify-center text-xs border border-blue-200 dark:border-blue-900 shrink-0">
                              {idx + 1}
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step.substring(3)}</p>
                      </div>
                  ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded text-center">
                  <p className="text-xs text-blue-500 dark:text-blue-300 font-bold uppercase">"Freelance first → Build Ratings → Scale to Remote Job"</p>
              </div>
          </div>
      </div>
  );

  const renderWisdom = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 10 LIFE RULES */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <List className="text-wealth-green" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase">10 Smart Life Rules</h3>
                </div>
                <ul className="space-y-2">
                    {LIFE_RULES.map((rule, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800 pb-1 last:border-0">
                            <span className="text-wealth-green font-bold mr-2">{i+1}.</span> {rule}
                        </li>
                    ))}
                </ul>
            </div>

            {/* CRITICAL THINKING LEVELS */}
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="text-blue-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase">5 Levels of Critical Thinking</h3>
                </div>
                <div className="space-y-4">
                    {CRITICAL_THINKING_LEVELS.map((lvl) => (
                        <div key={lvl.level} className="bg-gray-50 dark:bg-black p-3 rounded border border-gray-200 dark:border-gray-800">
                            <p className="text-blue-500 dark:text-blue-400 font-bold text-xs uppercase mb-1">Level {lvl.level}</p>
                            <p className="text-gray-900 dark:text-white font-bold text-sm mb-1">{lvl.title}</p>
                            <p className="text-gray-600 dark:text-gray-500 text-xs">{lvl.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
       {/* MISSION HEADER */}
       <div className="bg-black border-y border-gray-800 py-4 text-center">
          {LIFE_MISSION.map((line, i) => (
            <p key={i} className={`text-xs md:text-sm font-mono uppercase tracking-widest ${i === 0 ? 'text-white font-bold mb-1' : 'text-gray-500'}`}>
                {line}
            </p>
          ))}
       </div>

       {/* TAB NAVIGATION */}
       <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-800 pb-4">
          {[
              { id: 'OVERVIEW', icon: Activity }, 
              { id: 'STRATEGY', icon: Target }, 
              { id: 'SYSTEMS', icon: Zap }, 
              { id: 'ACADEMICS', icon: BookOpen }, 
              { id: 'CAREER', icon: Briefcase }, // New Tab
              { id: 'WISDOM', icon: Lightbulb }
          ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all ${
                    activeTab === tab.id 
                    ? 'bg-spartan-red text-white' 
                    : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
                }`}
              >
                  <tab.icon size={14} /> {tab.id}
              </button>
          ))}
       </div>

       {/* CONTENT RENDERER */}
       <div className="min-h-[500px]">
          {activeTab === 'OVERVIEW' && renderOverview()}
          {activeTab === 'STRATEGY' && renderStrategy()}
          {activeTab === 'SYSTEMS' && renderSystems()}
          {activeTab === 'ACADEMICS' && renderAcademics()}
          {activeTab === 'CAREER' && renderCareer()}
          {activeTab === 'WISDOM' && renderWisdom()}
       </div>
    </div>
  );
};