
import React, { useState, useEffect, useMemo } from 'react';
import { BookOpen, Clock, ChevronRight, Target, Shield, Zap, Layout, List, CheckCircle, AlertTriangle, Lightbulb, Users, BarChart3, Heart, Activity, Plus, Trash2, Save, Minus, Edit3, X, GraduationCap, Briefcase, Globe, Cpu, Play, Pause, RotateCcw, Coffee, Timer, Brain, Calendar, PenTool, TrendingUp, AlertCircle, Hourglass, Scan } from 'lucide-react';
import { 
  STUDY_PHASES, 
  GENIUS_LEARNING_RULES, 
  CAREER_JOB_TIERS, 
  REMOTE_JOB_STEPS, 
  KAIZEN_PRINCIPLES, 
  BEZOS_STEPS, 
  LIFE_MISSION, 
  LIFE_RULES, 
  CRITICAL_THINKING_LEVELS 
} from '../constants';

// --- TYPES FOR JOURNAL ---
interface Exam {
    id: string;
    name: string;
    date: string; // Target Date (YYYY-MM-DD)
    startDate: string; // Start Date (YYYY-MM-DD)
    validity?: number; // Years the score is valid for
}

interface StudyLog {
    id: string;
    date: string;
    timestamp: string;
    subject: string;
    topic: string;
    duration: number; // minutes
    focus: number; // 1-10
    summary: string; // Feynman
    distraction: string; // What broke focus?
}

// Helper to get local date string YYYY-MM-DD
const getLocalDate = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

export const TheAcademy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'STRATEGY' | 'SYSTEMS' | 'ACADEMICS' | 'JOURNAL' | 'CAREER' | 'WISDOM'>('JOURNAL');
  
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

  // 7. EXAMS & STUDY JOURNAL
  const [exams, setExams] = useState<Exam[]>(() => {
      const saved = localStorage.getItem('academy_exams');
      return saved ? JSON.parse(saved) : [
          { id: '1', name: 'GRE Exam', date: '2025-10-14', startDate: getLocalDate() }
      ];
  });
  const [newExam, setNewExam] = useState({ name: '', date: '', startDate: getLocalDate() });
  
  // EDIT EXAM STATE
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [editExamForm, setEditExamForm] = useState<Exam | null>(null);

  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
      const saved = localStorage.getItem('academy_logs');
      return saved ? JSON.parse(saved) : [];
  });
  const [newLog, setNewLog] = useState({ subject: '', topic: '', duration: '', focus: '8', summary: '', distraction: '' });

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
  useEffect(() => { localStorage.setItem('academy_exams', JSON.stringify(exams)); }, [exams]);
  useEffect(() => { localStorage.setItem('academy_logs', JSON.stringify(studyLogs)); }, [studyLogs]);

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

  // JOURNAL HANDLERS
  const handleAddExam = () => {
      if (!newExam.name || !newExam.date) return;
      setExams([...exams, { 
          id: Date.now().toString(), 
          name: newExam.name, 
          date: newExam.date, 
          startDate: newExam.startDate || getLocalDate()
      }]);
      setNewExam({ name: '', date: '', startDate: getLocalDate() });
  };

  const handleDeleteExam = (id: string) => {
      setExams(exams.filter(e => e.id !== id));
  };

  const startEditingExam = (exam: Exam) => {
      setEditingExamId(exam.id);
      setEditExamForm({ ...exam });
  };

  const saveExamEdit = () => {
      if (!editExamForm || !editExamForm.name || !editExamForm.date) return;
      setExams(exams.map(e => e.id === editExamForm.id ? editExamForm : e));
      setEditingExamId(null);
      setEditExamForm(null);
  };

  const handleAddLog = () => {
      if (!newLog.subject || !newLog.topic) return;
      const log: StudyLog = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          timestamp: new Date().toLocaleTimeString(),
          subject: newLog.subject,
          topic: newLog.topic,
          duration: parseInt(newLog.duration) || 0,
          focus: parseInt(newLog.focus),
          summary: newLog.summary,
          distraction: newLog.distraction
      };
      setStudyLogs([log, ...studyLogs]);
      setNewLog({ subject: '', topic: '', duration: '', focus: '8', summary: '', distraction: '' });
  };

  const handleDeleteLog = (id: string) => {
      setStudyLogs(studyLogs.filter(l => l.id !== id));
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
             <p className="text-xs text-gray-500 uppercase font-bold">Productivity Score</p>
             <p className="text-2xl font-mono font-bold text-wealth-green">85.0%</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 uppercase font-bold">Current Streak</p>
             <p className="text-2xl font-mono font-bold text-spartan-red">52 Days</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 uppercase font-bold">Gaps to Close</p>
             <p className="text-2xl font-mono font-bold text-amber-500">{gapsCount}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm">
             <p className="text-xs text-gray-500 uppercase font-bold">Capital Score</p>
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

        {/* EVENING CHECK */}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <input 
                    type="text" 
                    placeholder="What Failed?" 
                    value={newFailure.what}
                    onChange={(e) => setNewFailure({...newFailure, what: e.target.value})}
                    className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 p-2 rounded text-gray-900 dark:text-white text-xs outline-none" 
                />
                <input 
                    type="text" 
                    placeholder="Why? (Root Cause)" 
                    value={newFailure.why}
                    onChange={(e) => setNewFailure({...newFailure, why: e.target.value})}
                    className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 p-2 rounded text-gray-900 dark:text-white text-xs outline-none" 
                />
                <input 
                    type="text" 
                    placeholder="Lesson Learned" 
                    value={newFailure.lesson}
                    onChange={(e) => setNewFailure({...newFailure, lesson: e.target.value})}
                    className="bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-gray-700 p-2 rounded text-gray-900 dark:text-white text-xs outline-none" 
                />
            </div>
            <button 
                onClick={handleLogFailure}
                className="bg-orange-100 dark:bg-orange-600/20 text-orange-600 dark:text-orange-500 border border-orange-200 w-full py-2 rounded text-xs font-bold uppercase hover:bg-orange-200 mb-6"
            >
                Log Failure Data
            </button>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {failureLog.map((f: any) => (
                    <div key={f.id} className="bg-gray-50 dark:bg-black p-3 rounded border border-gray-200 dark:border-gray-800 relative group">
                        <div className="flex justify-between items-start">
                            <span className="text-[10px] text-gray-500 font-mono">{f.date}</span>
                            <button onClick={() => handleDeleteFailure(f.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                        </div>
                        <p className="text-gray-900 dark:text-white text-sm font-bold">{f.what}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1"><span className="text-orange-500 font-bold">Why:</span> {f.why}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400"><span className="text-green-500 font-bold">Lesson:</span> {f.lesson}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderAcademics = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                isPomoActive ? 'bg-yellow-500 text-black' : 'bg-green-600 text-white'
                            }`}
                        >
                            {isPomoActive ? <Pause size={16}/> : <Play size={16}/>}
                            {isPomoActive ? "Pause Protocol" : "Engage Focus"}
                        </button>
                        <button 
                            onClick={() => { setIsPomoActive(false); setPomoModeHandler(pomoMode); }}
                            className="p-3 rounded bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-400"
                        >
                            <RotateCcw size={16}/>
                        </button>
                    </div>
                </div>
                <div className="mt-6 flex justify-between items-center text-xs text-gray-500 border-t border-gray-200 dark:border-gray-800 pt-4 relative z-10">
                    <span>Sessions: <span className="text-gray-900 dark:text-white font-bold">{pomoStreak}</span></span>
                    <span className="flex items-center gap-1"><Coffee size={12}/> Focus Hard.</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg relative overflow-hidden flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-2">
                        <Clock className="text-spartan-red" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Op: 48-Hour Sprint</h3>
                    </div>
                </div>
                <div className="flex-1 flex flex-col relative z-10">
                    <div className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-800 p-4 rounded mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-gray-500 uppercase font-bold">Objective</span>
                            <button onClick={() => setIsEditingSprint(!isEditingSprint)} className="text-gray-400"><Edit3 size={12}/></button>
                        </div>
                        {isEditingSprint ? (
                            <textarea 
                                value={sprintObjective}
                                onChange={(e) => setSprintObjective(e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm p-2 rounded border outline-none focus:border-spartan-red h-20 resize-none"
                            />
                        ) : (
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{sprintObjective}</p>
                        )}
                    </div>
                    <div className="mt-auto text-center">
                        {sprintEndTime ? (
                            <>
                                <div className="text-4xl md:text-5xl font-mono font-black text-gray-900 dark:text-white tracking-widest mb-4">
                                    {timeRemaining}
                                </div>
                                <button onClick={resetSprint} className="text-xs text-red-500 font-bold uppercase">Abort Mission</button>
                            </>
                        ) : (
                            <button onClick={startSprint} className="bg-spartan-red text-white font-bold py-3 px-8 rounded uppercase text-xs tracking-widest">Initialize Sprint</button>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">The 1% Study Protocol</h3>
            </div>
            <div className="space-y-4">
                {STUDY_PHASES.map((p, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-lg border-l-4 border-l-blue-600">
                        <h4 className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase mb-1">{p.phase}: {p.rule}</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{p.action}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  const renderJournal = () => {
    // UPDATED EXPERT CALCULATION LOGIC
    const getCalculatedData = (targetDateStr: string, startDayStr?: string) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const targetDate = new Date(targetDateStr);
        targetDate.setHours(0,0,0,0);
        
        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24)); // -ve for past, +ve for future
        
        // Days Gone/Difference: Positive absolute integer
        const daysGone = Math.abs(diffDays);
        
        // Years Gone: Complete years
        const yearsGone = Math.floor(daysGone / 365);
        
        // Status Logic
        let status = "Valid";
        let color = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500";
        
        if (diffDays < -60) {
            status = "Completed";
            color = "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
        } else if (diffDays >= -60 && diffDays < 0) {
            status = "Recent";
            color = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
        } else if (diffDays === 0) {
            status = "Today";
            color = "bg-red-600 text-white animate-pulse";
        } else if (diffDays > 0 && diffDays <= 7) {
            status = "Imminent";
            color = "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-500";
        } else {
            status = "Valid";
            color = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500";
        }

        return { daysGone, yearsGone, status, color, diffDays };
    };

    const sortedExams = [...exams].sort((a, b) => {
        const dataA = getCalculatedData(a.date);
        const dataB = getCalculatedData(b.date);
        // Put Today/Imminent first, then Valid, then Recent, then Completed
        const getPriority = (s: string) => {
            if (s === "Today") return 0;
            if (s === "Imminent") return 1;
            if (s === "Valid") return 2;
            if (s === "Recent") return 3;
            return 4;
        };
        return getPriority(dataA.status) - getPriority(dataB.status);
    });

    return (
    <div className="space-y-6 animate-in fade-in">
        {/* GOAL TRACKER MATRIX UPGRADE */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm overflow-hidden relative">
            <div className="flex justify-between items-center mb-6 relative z-10">
                <div className="flex items-center gap-2">
                    <Scan className="text-spartan-red" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Goal Tracker Matrix</h3>
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                    <input 
                        value={newExam.name} 
                        onChange={(e) => setNewExam({...newExam, name: e.target.value})} 
                        placeholder="Target Name..." 
                        className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 text-xs p-2 rounded text-gray-900 dark:text-white outline-none w-32"
                    />
                    <div>
                        <label className="text-[9px] text-gray-500 uppercase font-bold block mb-1">Target Date</label>
                        <input 
                            type="date"
                            value={newExam.date} 
                            onChange={(e) => setNewExam({...newExam, date: e.target.value})} 
                            className="bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 text-xs p-2 rounded text-gray-900 dark:text-white outline-none"
                        />
                    </div>
                    <button onClick={handleAddExam} className="bg-spartan-red text-white p-2 rounded h-8 flex items-center justify-center mt-auto"><Plus size={16}/></button>
                </div>
            </div>

            <div className="overflow-x-auto rounded border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black/20">
                <table className="w-full text-left text-sm font-mono">
                    <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase font-bold text-xs border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="p-4">Event Date</th>
                            <th className="p-4">Name / Mission</th>
                            <th className="p-4 text-center">Days Gone/Diff</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-center">Years</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {sortedExams.map(exam => {
                            const { daysGone, yearsGone, status, color, diffDays } = getCalculatedData(exam.date);
                            
                            if (editingExamId === exam.id && editExamForm) {
                                return (
                                    <tr key={exam.id} className="bg-blue-500/5">
                                        <td colSpan={2} className="p-4">
                                            <input value={editExamForm.name} onChange={e => setEditExamForm({...editExamForm, name: e.target.value})} className="bg-white dark:bg-black border border-blue-500 p-1 rounded w-full text-xs"/>
                                            <input type="date" value={editExamForm.date} onChange={e => setEditExamForm({...editExamForm, date: e.target.value})} className="mt-1 bg-white dark:bg-black border border-blue-500 p-1 rounded w-full text-xs"/>
                                        </td>
                                        <td colSpan={3} className="p-4 italic text-gray-500">Recalculating...</td>
                                        <td className="p-4 text-right">
                                            <button onClick={saveExamEdit} className="text-green-500 mr-2"><Save size={16}/></button>
                                            <button onClick={() => setEditingExamId(null)} className="text-gray-500"><X size={16}/></button>
                                        </td>
                                    </tr>
                                );
                            }

                            return (
                                <tr key={exam.id} className="group hover:bg-white dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-500 dark:text-gray-400">{exam.date}</td>
                                    <td className="p-4 font-bold text-gray-900 dark:text-white uppercase tracking-tighter">{exam.name}</td>
                                    <td className="p-4 text-center">
                                        <span className="font-black text-lg">{daysGone}</span>
                                        <span className="text-[10px] ml-1 opacity-50">{diffDays < 0 ? 'AGO' : 'LEFT'}</span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-black/5 dark:border-white/5 ${color}`}>
                                            {status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center font-bold text-gray-400">
                                        {yearsGone} <span className="text-[10px] font-normal">Years</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEditingExam(exam)} className="text-gray-400 hover:text-blue-500"><Edit3 size={14}/></button>
                                            <button onClick={() => handleDeleteExam(exam.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {sortedExams.length === 0 && <div className="p-8 text-center text-gray-500 italic">No events tracked. Initialize database.</div>}
            </div>
            <p className="text-[9px] text-gray-500 mt-3 font-mono uppercase tracking-widest text-center">EXPERT EVENT CALCULATION SERVICE // REAL-TIME DELTA SCANNING</p>
        </div>

        {/* STUDY JOURNAL */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <PenTool className="text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">Study Protocol Journal</h3>
            </div>
            <div className="bg-gray-50 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-800 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input placeholder="Subject" value={newLog.subject} onChange={(e) => setNewLog({...newLog, subject: e.target.value})} className="bg-white dark:bg-slate-900 border p-2 rounded text-sm outline-none focus:border-purple-500"/>
                    <input placeholder="Topic / Goal" value={newLog.topic} onChange={(e) => setNewLog({...newLog, topic: e.target.value})} className="bg-white dark:bg-slate-900 border p-2 rounded text-sm outline-none focus:border-purple-500 md:col-span-2"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <textarea placeholder="Feynman Summary (Explain simply)" value={newLog.summary} onChange={(e) => setNewLog({...newLog, summary: e.target.value})} className="h-20 bg-white dark:bg-slate-900 border p-2 rounded text-sm outline-none focus:border-purple-500 resize-none"/>
                    <textarea placeholder="Struggles / Distractions" value={newLog.distraction} onChange={(e) => setNewLog({...newLog, distraction: e.target.value})} className="h-20 bg-white dark:bg-slate-900 border p-2 rounded text-sm outline-none focus:border-purple-500 resize-none"/>
                </div>
                <button onClick={handleAddLog} className="w-full bg-purple-600 text-white font-bold py-2 rounded text-xs uppercase">Log Session</button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {studyLogs.map(log => (
                    <div key={log.id} className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 p-4 rounded-lg group">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-[10px] text-gray-500 font-mono">{log.date} • {log.timestamp}</span>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase">{log.subject}: {log.topic}</h4>
                            </div>
                            <button onClick={() => handleDeleteLog(log.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 italic mb-2">"{log.summary}"</p>
                        {log.distraction && <p className="text-[10px] text-red-500 font-bold uppercase">Pain Point: {log.distraction}</p>}
                    </div>
                ))}
            </div>
        </div>
    </div>
  )};

  const renderCareer = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="text-emerald-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white uppercase">AI-Resistant Job Tiers</h3>
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
                                  <span key={jIdx} className="text-[10px] bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-300 px-2 py-1 rounded border border-gray-300 dark:border-gray-700">{job}</span>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );

  const renderWisdom = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="text-blue-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase">5 Levels of Thinking</h3>
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
              { id: 'JOURNAL', icon: PenTool }, 
              { id: 'CAREER', icon: Briefcase },
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
          {activeTab === 'JOURNAL' && renderJournal()}
          {activeTab === 'CAREER' && renderCareer()}
          {activeTab === 'WISDOM' && renderWisdom()}
       </div>
    </div>
  );
};
