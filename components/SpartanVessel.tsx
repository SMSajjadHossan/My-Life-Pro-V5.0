import React, { useState, useEffect } from 'react';
import { Habit } from '../types';
import { SPARTAN_MASTER_CYCLE, HEALTH_KNOWLEDGE_BASE, SPARTAN_CHECKLIST_ITEMS } from '../constants';
import { Activity, Utensils, Zap, BookOpen, CheckSquare, Square, Dumbbell, ClipboardList, Droplet, Sun, Moon, Skull, Plus, Trash2, Save, Minus, RotateCcw, AlertCircle, Calendar, ChevronDown, ChevronUp, Dna, ShieldAlert, Clock, Bell } from 'lucide-react';

interface Props {
  habits: Habit[];
  toggleHabit: (id: string) => void;
  adjustHabit: (id: string, amount: number) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
}

export const SpartanVessel: React.FC<Props> = ({ habits, toggleHabit, adjustHabit, updateHabit }) => {
  // 1. Bio-Rhythm Logic
  const todayDate = new Date().getDate();
  const dayPlan = SPARTAN_MASTER_CYCLE.find(d => d.day === todayDate) || SPARTAN_MASTER_CYCLE[0];

  // 2. DAILY TRACKER STATE (Meals/Workouts/Water)
  // Key format: YYYY-MM-DD
  const todayKey = new Date().toISOString().split('T')[0];
  
  const [dailyTracker, setDailyTracker] = useState<Record<string, any>>(() => {
      return JSON.parse(localStorage.getItem('spartan_daily_tracker_v6') || '{}');
  });

  const [waterCount, setWaterCount] = useState<number>(() => {
      const todayData = dailyTracker[todayKey];
      return todayData?.water || 0;
  });

  // Sync Water to Persistence
  useEffect(() => {
      setDailyTracker(prev => ({
          ...prev,
          [todayKey]: { ...prev[todayKey], water: waterCount }
      }));
  }, [waterCount, todayKey]);

  // Sync Tracker to LocalStorage
  useEffect(() => {
      localStorage.setItem('spartan_daily_tracker_v6', JSON.stringify(dailyTracker));
  }, [dailyTracker]);

  const toggleDailyItem = (type: 'mealMorning' | 'mealNight' | 'workout', index?: number) => {
      setDailyTracker(prev => {
          const currentDay = prev[todayKey] || {};
          let newVal;
          
          if (type === 'workout' && index !== undefined) {
              const currentWorkouts = currentDay.workouts || [];
              const newWorkouts = [...currentWorkouts];
              if (newWorkouts.includes(index)) {
                  newVal = newWorkouts.filter(i => i !== index);
              } else {
                  newVal = [...newWorkouts, index];
              }
              return { ...prev, [todayKey]: { ...currentDay, workouts: newVal } };
          } else {
              newVal = !currentDay[type];
              return { ...prev, [todayKey]: { ...currentDay, [type]: newVal } };
          }
      });
  };

  const getDayStatus = () => dailyTracker[todayKey] || {};

  // 3. Dynamic Checklist Logic (Manual Add Feature)
  const [checklistItems, setChecklistItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('spartan_custom_checklist');
    return saved ? JSON.parse(saved) : SPARTAN_CHECKLIST_ITEMS;
  });
  const [newChecklistItem, setNewChecklistItem] = useState('');

  const [dailyCode, setDailyCode] = useState<Record<string, boolean>>(() => {
    return JSON.parse(localStorage.getItem('spartan_daily_code_v2') || '{}');
  });

  const toggleChecklist = (item: string) => {
    const newState = { ...dailyCode, [item]: !dailyCode[item] };
    setDailyCode(newState);
    localStorage.setItem('spartan_daily_code_v2', JSON.stringify(newState));
  };

  const addChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const updated = [...checklistItems, newChecklistItem.trim()];
    setChecklistItems(updated);
    localStorage.setItem('spartan_custom_checklist', JSON.stringify(updated));
    setNewChecklistItem('');
  };

  const removeChecklistItem = (itemToRemove: string) => {
    const updated = checklistItems.filter(item => item !== itemToRemove);
    setChecklistItems(updated);
    localStorage.setItem('spartan_custom_checklist', JSON.stringify(updated));
  };

  // 4. Dynamic Knowledge Base Logic (Manual Add Feature)
  const [knowledgeBase, setKnowledgeBase] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('spartan_custom_knowledge');
    return saved ? JSON.parse(saved) : HEALTH_KNOWLEDGE_BASE;
  });
  const [activeKnowledgeTab, setActiveKnowledgeTab] = useState<string | null>(null);
  
  // New Knowledge Input State
  const [newKnowledgeTitle, setNewKnowledgeTitle] = useState('');
  const [newKnowledgeContent, setNewKnowledgeContent] = useState('');
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);

  const addKnowledgeEntry = () => {
    if (!newKnowledgeTitle.trim() || !newKnowledgeContent.trim()) return;
    const updated = { ...knowledgeBase, [newKnowledgeTitle.trim()]: newKnowledgeContent.trim() };
    setKnowledgeBase(updated);
    localStorage.setItem('spartan_custom_knowledge', JSON.stringify(updated));
    setNewKnowledgeTitle('');
    setNewKnowledgeContent('');
    setShowAddKnowledge(false);
  };

  const deleteKnowledgeEntry = (title: string) => {
    const updated = { ...knowledgeBase };
    delete updated[title];
    setKnowledgeBase(updated);
    localStorage.setItem('spartan_custom_knowledge', JSON.stringify(updated));
    if (activeKnowledgeTab === title) setActiveKnowledgeTab(null);
  };

  // --- HABIT UI HELPERS ---
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);

  const getCalendarDays = () => {
    const days = [];
    const today = new Date();
    // Show last 28 days (4 weeks)
    for (let i = 27; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().split('T')[0]);
    }
    return days;
  };

  const handleReminderChange = (id: string, time: string) => {
      updateHabit(id, { reminderTime: time });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative font-sans">
      
      {/* HEADER */}
      <header className="flex justify-between items-center border-b dark:border-gray-800 border-gray-300 pb-4">
        <div>
           <h2 className="text-3xl font-black dark:text-gray-100 text-black uppercase tracking-tighter">Health Protocol</h2>
           <p className="text-xs text-spartan-red font-mono font-bold mt-1">ADVANCED FAT LOSS • 2 MEALS • HIGH PROTEIN</p>
        </div>
        <div className="flex gap-2">
            <span className={`px-3 py-1 border text-xs font-bold rounded uppercase flex items-center gap-1 bg-wealth-green/10 border-wealth-green text-wealth-green`}>
                <Activity size={12}/> DAY {dayPlan.day}
            </span>
        </div>
      </header>

      {/* SECTION 0: DEMON SLAYER (Advanced Bio-Cybernetic UI) */}
      <div className="bg-slate-950 border border-gray-800 rounded-xl overflow-hidden shadow-lg relative group">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 p-4 opacity-20"><Dna size={120} className="text-red-900"/></div>

        <div className="p-6 relative z-10">
            <div className="flex justify-between items-center mb-6">
                 <div>
                     <h3 className="text-xl font-black text-white flex items-center gap-2 uppercase tracking-widest">
                        <Skull className="text-spartan-red" /> Demon Slayer
                    </h3>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mt-1">Bio-Metric Control Panel v4.0</p>
                 </div>
                 <div className="flex items-center gap-2">
                     <span className="text-[10px] bg-red-900/20 text-red-500 px-2 py-1 rounded border border-red-900/50 uppercase font-bold animate-pulse">System Active</span>
                 </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {habits.filter(h => h.category === 'Health' || h.name.includes('No-Fap')).map(habit => {
                    const isCompletedToday = habit.lastCompleted === new Date().toISOString().split('T')[0];
                    const isExpanded = expandedHabitId === habit.id;
                    const maxStreak = 90; // Target
                    const progress = Math.min(100, (habit.streak / maxStreak) * 100);
                    
                    return (
                    <div 
                        key={habit.id}
                        className={`flex flex-col rounded-lg border transition-all overflow-hidden ${
                            isCompletedToday
                            ? 'bg-red-950/20 border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                            : 'bg-black border-gray-800'
                        }`}
                    >
                        {/* CARD HEADER */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className={`font-bold text-sm uppercase tracking-wider flex items-center gap-2 ${isCompletedToday ? 'text-red-400' : 'text-gray-300'}`}>
                                        {habit.name === 'No-Fap Protocol' ? <ShieldAlert size={14}/> : <Droplet size={14}/>}
                                        {habit.name}
                                    </span>
                                    <div className="flex items-center gap-1 text-[9px] text-gray-600 font-mono mt-1 uppercase">
                                        {habit.name === 'No-Fap Protocol' ? 'Testosterone Retention' : 'Cortisol Reduction'}
                                        {habit.reminderTime && <span className="flex items-center gap-1 ml-2 text-blue-500"><Bell size={8}/> {habit.reminderTime}</span>}
                                    </div>
                                </div>
                                
                                {/* DIGITAL STREAK COUNTER */}
                                <div className="text-right">
                                    <div className="flex items-baseline gap-1 justify-end">
                                        <span className="text-2xl font-black font-mono leading-none text-white">{habit.streak}</span>
                                        <span className="text-[9px] text-gray-500 uppercase">Days</span>
                                    </div>
                                </div>
                            </div>

                            {/* PROGRESS BAR */}
                            <div className="mb-4">
                                <div className="flex justify-between text-[9px] text-gray-600 uppercase font-bold mb-1">
                                    <span>Reboot Status</span>
                                    <span>{Math.round(progress)}% Optimized</span>
                                </div>
                                <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 ${isCompletedToday ? 'bg-red-600 shadow-[0_0_10px_#dc2626]' : 'bg-gray-700'}`} 
                                        style={{width: `${progress}%`}}
                                    ></div>
                                </div>
                            </div>

                            {/* ACTION ROW */}
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleHabit(habit.id)}
                                    className={`flex-1 py-3 rounded text-[10px] font-bold uppercase border flex items-center justify-center gap-2 transition-all tracking-widest ${
                                        isCompletedToday
                                        ? 'bg-red-600 border-red-600 text-black hover:bg-red-500'
                                        : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                                    }`}
                                >
                                    {isCompletedToday ? <CheckSquare size={14}/> : <Square size={14}/>}
                                    {isCompletedToday ? "Protocol Complete" : "Execute"}
                                </button>
                                
                                <button 
                                    onClick={() => setExpandedHabitId(isExpanded ? null : habit.id)}
                                    className={`px-3 border rounded border-gray-800 hover:bg-gray-800 text-gray-500 hover:text-white transition-colors ${isExpanded ? 'bg-gray-800 text-white' : ''}`}
                                >
                                    {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                </button>
                            </div>
                        </div>

                        {/* EXPANDED DETAILS */}
                        {isExpanded && (
                            <div className="bg-black/50 border-t border-gray-800 p-4 animate-in slide-in-from-top-2">
                                {/* HISTORY HEATMAP */}
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-bold uppercase text-gray-500 flex items-center gap-1">
                                            <Calendar size={10}/> 28-Day Scan
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {getCalendarDays().map(date => {
                                            const done = habit.history?.includes(date);
                                            const isToday = date === new Date().toISOString().split('T')[0];
                                            const d = new Date(date);
                                            return (
                                                <div 
                                                    key={date} 
                                                    className={`h-6 w-full rounded flex items-center justify-center text-[8px] font-mono border transition-all ${
                                                        done 
                                                        ? 'bg-green-900/40 border-green-800 text-green-400' 
                                                        : 'bg-gray-900/30 border-gray-800 text-gray-700'
                                                    } ${isToday ? 'ring-1 ring-white' : ''}`}
                                                    title={date}
                                                >
                                                    {d.getDate()}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* REMINDER SETTING */}
                                <div className="mb-4">
                                    <label className="text-[9px] font-bold uppercase text-gray-500 flex items-center gap-1 mb-1">
                                        <Clock size={10}/> Set Reminder
                                    </label>
                                    <input 
                                        type="time" 
                                        value={habit.reminderTime || ''}
                                        onChange={(e) => handleReminderChange(habit.id, e.target.value)}
                                        className="bg-gray-900 border border-gray-700 text-white text-xs p-1 rounded w-full outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* MANUAL ADJUST */}
                                <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                                    <span className="text-[9px] uppercase font-bold text-gray-600">Manual Override</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => adjustHabit(habit.id, -1)} className="p-1.5 bg-gray-900 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-500"><Minus size={10}/></button>
                                        <button onClick={() => adjustHabit(habit.id, 1)} className="p-1.5 bg-gray-900 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-500"><Plus size={10}/></button>
                                        {habit.name.includes("No-Fap") && (
                                            <button 
                                                onClick={() => { if(confirm("RELAPSE CONFIRMED? Resetting streak to 0.")) adjustHabit(habit.id, -habit.streak); }}
                                                className="ml-2 px-2 py-1 bg-red-900/30 border border-red-900 text-red-500 text-[9px] font-bold rounded uppercase hover:bg-red-900 hover:text-white"
                                            >
                                                Relapse
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )})}
            </div>
        </div>
      </div>

      {/* SECTION 1: 31-DAY CYCLE COMMAND CARD (INTERACTIVE v6.0) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: MEAL PLAN */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-0 rounded-lg overflow-hidden flex flex-col shadow-sm">
            <div className="bg-gray-100 dark:bg-black p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="dark:text-gray-200 text-gray-800 font-bold uppercase text-sm flex items-center gap-2">
                    <Utensils size={16} className="text-amber-500" /> Nutrition Deployment
                </h3>
                <div className="flex items-center gap-2">
                    {/* WATER TRACKER */}
                    <div className="flex items-center bg-blue-900/20 border border-blue-800 rounded px-2 py-0.5">
                        <button onClick={() => setWaterCount(Math.max(0, waterCount - 1))} className="text-blue-400 hover:text-white"><Minus size={10}/></button>
                        <span className="text-xs font-mono text-blue-300 mx-2">{waterCount}/8</span>
                        <button onClick={() => setWaterCount(waterCount + 1)} className="text-blue-400 hover:text-white"><Plus size={10}/></button>
                        <Droplet size={10} className="ml-1 text-blue-500 fill-blue-500"/>
                    </div>
                    <span className="text-xs font-mono text-gray-500">Day {dayPlan.day}</span>
                </div>
            </div>
            
            <div className="p-4 space-y-4 flex-1">
                {/* Morning */}
                <div className="flex gap-3 group cursor-pointer" onClick={() => toggleDailyItem('mealMorning')}>
                    <div className={`w-1 rounded-full transition-colors ${getDayStatus().mealMorning ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="text-xs text-amber-500 font-bold uppercase mb-1">Morning (8 AM)</p>
                            {getDayStatus().mealMorning && <CheckSquare size={14} className="text-green-500"/>}
                        </div>
                        <p className={`dark:text-white text-gray-900 font-bold text-sm ${getDayStatus().mealMorning ? 'line-through text-gray-500' : ''}`}>{dayPlan.morningMeal}</p>
                        <p className="text-xs text-gray-500 mt-1">Flavor: <span className="dark:text-white text-gray-700 bg-gray-100 dark:bg-gray-800 px-1 rounded">{dayPlan.morningFlavor}</span></p>
                    </div>
                </div>
                
                {/* Night */}
                <div className="flex gap-3 group cursor-pointer" onClick={() => toggleDailyItem('mealNight')}>
                    <div className={`w-1 rounded-full transition-colors ${getDayStatus().mealNight ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div className="flex-1">
                        <div className="flex justify-between">
                            <p className="text-xs text-blue-500 font-bold uppercase mb-1">Night (8 PM)</p>
                            {getDayStatus().mealNight && <CheckSquare size={14} className="text-green-500"/>}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`dark:text-white text-gray-900 font-bold text-sm ${getDayStatus().mealNight ? 'line-through text-gray-500' : ''}`}>{dayPlan.nightMeal}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border text-black ${dayPlan.carbSource === 'Rice' ? 'bg-white border-gray-300' : 'bg-yellow-100 border-yellow-300'}`}>
                                {dayPlan.carbSource.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Flavor: <span className="dark:text-white text-gray-700 bg-gray-100 dark:bg-gray-800 px-1 rounded">{dayPlan.nightFlavor}</span></p>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-950 p-2 text-center border-t border-gray-200 dark:border-gray-800">
                <p className="text-[10px] text-gray-500 uppercase">Target: ~1850 Kcal • 130g Protein</p>
            </div>
        </div>

        {/* RIGHT: GYM INTEL */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-0 rounded-lg overflow-hidden flex flex-col shadow-sm">
            <div className="bg-gray-100 dark:bg-black p-3 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                <h3 className="dark:text-gray-200 text-gray-800 font-bold uppercase text-sm flex items-center gap-2">
                    <Dumbbell size={16} className="text-spartan-red" /> Combat Readiness
                </h3>
                <span className="text-spartan-red font-black font-mono uppercase">{dayPlan.gymFocus}</span>
            </div>
            
            <div className="p-4 flex-1">
                <div className="mb-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-100 dark:bg-gray-900/50 p-2 rounded">
                    <Zap size={12} className="text-yellow-500"/>
                    <span>Cardio: <span className="dark:text-white text-gray-900 font-bold">{dayPlan.cardio}</span></span>
                </div>
                
                <div className="space-y-2">
                    {dayPlan.gymRoutine.map((exercise, idx) => {
                        const isDone = (getDayStatus().workouts || []).includes(idx);
                        return (
                        <div 
                            key={idx} 
                            onClick={() => toggleDailyItem('workout', idx)}
                            className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800/50 pb-1 last:border-0 cursor-pointer group hover:bg-white/5 p-1 rounded"
                        >
                            <span className={`text-sm transition-colors ${isDone ? 'dark:text-gray-500 text-gray-400 line-through' : 'dark:text-gray-200 text-gray-700'}`}>
                                {exercise.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold text-spartan-red bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded">
                                    {exercise.sets}
                                </span>
                                {isDone && <CheckSquare size={12} className="text-wealth-green"/>}
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 4: DAILY CHECKLIST (MANUAL ADD) */}
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
        <h3 className="text-sm font-bold dark:text-gray-200 text-gray-800 mb-4 uppercase flex items-center gap-2">
            <ClipboardList className="text-spartan-red" size={16}/> Daily Execution Code
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {checklistItems.map((item) => (
                <div key={item} className="flex items-center gap-2 group">
                    <button 
                        onClick={() => toggleChecklist(item)}
                        className={`flex-1 flex items-center gap-3 p-3 rounded border transition-all text-left ${
                            dailyCode[item] 
                            ? 'bg-wealth-green/10 border-wealth-green text-gray-900 dark:text-gray-100' 
                            : 'bg-white dark:bg-black border-gray-200 dark:border-gray-800 text-gray-500 hover:border-gray-400 dark:hover:border-gray-700'
                        }`}
                    >
                        {dailyCode[item] ? <CheckSquare size={16} className="text-wealth-green min-w-[16px]" /> : <Square size={16} className="min-w-[16px]" />}
                        <span className={`text-xs font-bold ${dailyCode[item] ? 'line-through opacity-70' : ''}`}>{item}</span>
                    </button>
                    {/* Delete button */}
                     <button onClick={() => removeChecklistItem(item)} className="p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
        </div>
        {/* ADD ITEM INPUT */}
        <div className="flex gap-2 mt-2">
            <input 
                type="text" 
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Add new daily habit..."
                className="flex-1 bg-gray-50 dark:bg-black border border-gray-300 dark:border-gray-700 text-xs p-2 rounded focus:border-wealth-green outline-none text-gray-900 dark:text-white"
            />
            <button 
                onClick={addChecklistItem}
                className="bg-gray-200 dark:bg-gray-800 hover:bg-wealth-green hover:text-white dark:text-gray-300 p-2 rounded"
            >
                <Plus size={16} />
            </button>
        </div>
      </div>

      {/* SECTION 5: KNOWLEDGE BASE EXPANSION (MANUAL ADD) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
             <h3 className="text-sm font-bold dark:text-gray-400 text-gray-600 uppercase">Knowledge Base</h3>
             <button 
                onClick={() => setShowAddKnowledge(!showAddKnowledge)}
                className="text-xs text-wealth-green font-bold uppercase flex items-center gap-1 hover:text-emerald-400"
             >
                <Plus size={12} /> Add New Wisdom
             </button>
        </div>

        {/* Add Knowledge Form */}
        {showAddKnowledge && (
            <div className="bg-gray-50 dark:bg-black p-4 rounded border border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2">
                <input 
                    type="text" 
                    placeholder="Title (e.g., Magnesium Benefits)" 
                    value={newKnowledgeTitle}
                    onChange={(e) => setNewKnowledgeTitle(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 p-2 rounded text-sm mb-2 outline-none focus:border-wealth-green text-gray-900 dark:text-white"
                />
                <textarea 
                    placeholder="Content (e.g., Helps with sleep...)" 
                    value={newKnowledgeContent}
                    onChange={(e) => setNewKnowledgeContent(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 p-2 rounded text-sm mb-2 outline-none focus:border-wealth-green h-24 text-gray-900 dark:text-white"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowAddKnowledge(false)} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1">Cancel</button>
                    <button onClick={addKnowledgeEntry} className="bg-wealth-green text-black text-xs font-bold px-4 py-2 rounded flex items-center gap-1 hover:bg-emerald-400">
                        <Save size={12} /> Save Entry
                    </button>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(knowledgeBase).map(([title, content]) => (
                <div 
                    key={title} 
                    className={`relative group cursor-pointer border p-4 rounded-lg transition-all shadow-sm ${activeKnowledgeTab === title ? 'bg-gray-100 dark:bg-gray-800 border-gold' : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600'}`}
                    onClick={() => setActiveKnowledgeTab(activeKnowledgeTab === title ? null : title)}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold uppercase ${activeKnowledgeTab === title ? 'text-amber-600 dark:text-gold' : 'text-gray-500 dark:text-gray-400'}`}>{title}</span>
                        <BookOpen size={14} className={activeKnowledgeTab === title ? 'text-amber-600 dark:text-gold' : 'text-gray-400 dark:text-gray-600'} />
                    </div>
                    {activeKnowledgeTab === title && (
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed animate-in fade-in">{content}</p>
                    )}
                    
                    {/* Delete Button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); deleteKnowledgeEntry(title); }}
                        className="absolute top-2 right-2 p-1 bg-red-900/20 text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-900/50"
                    >
                        <Trash2 size={10} />
                    </button>
                </div>
            ))}
        </div>
      </div>

    </div>
  );
};