import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Loader, ShieldAlert, Cpu, Zap, DollarSign, Briefcase, BookOpen, Skull, Flame } from 'lucide-react';
import { chatWithGeneral } from '../services/geminiService';
import { ChatMessage, FinancialState, Habit, UserProfile, Book } from '../types';

interface Props {
  financialData: FinancialState;
  habits: Habit[];
  profile: UserProfile;
  objectives: any[];
  books: Book[];
}

// Typing Effect Component for AI Messages
const TypewriterText = ({ text }: { text: string }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let i = 0;
        const speed = 8; // Faster response speed
        setDisplayedText('');
        setIsComplete(false);

        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                setIsComplete(true);
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text]);

    // Simple Markdown Renderer
    const renderContent = (content: string) => {
        return content.split('\n').map((line, i) => {
            const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
            if (linkMatch) {
                const before = line.substring(0, linkMatch.index);
                const after = line.substring((linkMatch.index || 0) + linkMatch[0].length);
                return (
                    <div key={i} className="min-h-[1.2em]">
                        {before}
                        <a href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300 font-bold transition-colors">
                            {linkMatch[1]}
                        </a>
                        {after}
                    </div>
                );
            }
            // Bold Handling
            if (line.includes('**')) {
                const parts = line.split('**');
                return (
                    <div key={i} className="min-h-[1.2em]">
                        {parts.map((part, idx) => 
                            idx % 2 === 1 ? <span key={idx} className="text-white font-bold">{part}</span> : part
                        )}
                    </div>
                );
            }
            return <div key={i} className="min-h-[1.2em]">{line}</div>;
        });
    };

    return (
        <div className="text-sm leading-relaxed font-mono">
            {renderContent(displayedText)}
            {!isComplete && <span className="inline-block w-2 h-4 bg-spartan-red ml-1 animate-pulse align-middle"></span>}
        </div>
    );
};

export const WarRoom: React.FC<Props> = ({ financialData, habits, profile, objectives, books }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('war_room_chat');
    return saved ? JSON.parse(saved) : [{
        id: 'init',
        role: 'ai',
        content: "Commander. The War Room is online. I have access to Global Intel (Search) and your Internal Database. State your objective.",
        timestamp: new Date().toISOString()
    }];
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    localStorage.setItem('war_room_chat', JSON.stringify(messages));
  }, [messages, isLoading]);

  // Handle External Triggers (Omnibar / Audit)
  useEffect(() => {
      const pendingAudit = localStorage.getItem('pending_audit');
      const pendingTrigger = localStorage.getItem('pending_ai_trigger');

      if (pendingAudit === 'true') {
          localStorage.removeItem('pending_audit');
          handleSend("EXECUTE_LIFE_AUDIT_PROTOCOL_ALPHA");
      } else if (pendingTrigger === 'true') {
          localStorage.removeItem('pending_ai_trigger');
          const currentHistory = JSON.parse(localStorage.getItem('war_room_chat') || '[]');
          const lastMsg = currentHistory[currentHistory.length - 1];
          if (lastMsg && lastMsg.role === 'user') {
              setMessages(currentHistory);
              triggerAIResponse(lastMsg.content, currentHistory);
          }
      }
  }, []);

  const triggerAIResponse = async (text: string, currentMessages: ChatMessage[]) => {
      setIsLoading(true);
      // Prepare Context
      const liquidCash = financialData.bankA + financialData.bankB + financialData.bankC;
      const assets = financialData.assets.reduce((a, b) => a + b.value, 0);
      const appState = {
          financial: { liquidCash, netWorth: liquidCash + assets },
          habits: habits,
          goals: objectives.slice(0, 5),
          books: books.filter(b => b.status === 'Completed'),
          user: { 
              rank: profile.rank, 
              level: profile.level,
              missionStatement: profile.missionStatement
          }
      };

      const responseText = await chatWithGeneral(text, appState);
      
      const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: responseText || "Signal Jammed.",
          timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
  };

  const handleSend = async (manualText?: string) => {
    const textToSend = manualText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: textToSend,
        timestamp: new Date().toISOString()
    };
    
    // Optimistic Update
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    
    await triggerAIResponse(textToSend, newHistory);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  const clearChat = () => {
      if(confirm("Purge classified logs?")) {
          setMessages([{
            id: 'init',
            role: 'ai',
            content: "Logs purged. Ready for new orders.",
            timestamp: new Date().toISOString()
          }]);
      }
  };

  const QuickCommand = ({ icon: Icon, label, query, color }: any) => (
      <button 
        onClick={() => handleSend(query)}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 bg-slate-900 border border-gray-700 hover:border-${color} rounded-lg text-[10px] uppercase font-bold text-gray-400 hover:text-white transition-all disabled:opacity-50 min-w-max hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95`}
      >
          <Icon size={12} className={`text-${color}`}/> {label}
      </button>
  );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in duration-500 glass-panel">
        
        {/* HEADER */}
        <div className="bg-slate-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-spartan-red via-purple-600 to-blue-600 animate-scan"></div>
            <div className="flex items-center gap-3 relative z-10">
                <div className="p-2 bg-spartan-red/10 border border-spartan-red/30 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                    <Cpu size={20} className="text-spartan-red" />
                </div>
                <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                        The War Room
                        <span className="text-[10px] bg-green-900/30 text-green-500 px-2 py-0.5 rounded border border-green-900 shadow-[0_0_10px_rgba(0,230,118,0.2)]">CONNECTED</span>
                    </h2>
                    <p className="text-xs text-gray-500 font-mono">MENTOR MODE • SEARCH ENABLED • CONTEXT AWARE</p>
                </div>
            </div>
            <button onClick={clearChat} className="text-xs text-gray-600 hover:text-red-500 font-mono uppercase font-bold flex items-center gap-1 transition-colors px-3 py-1 rounded hover:bg-red-950/30">
                <ShieldAlert size={12}/> Purge Logs
            </button>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 custom-scrollbar">
            {messages.map((msg, index) => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-slide-up`}>
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0 shadow-lg ${msg.role === 'ai' ? 'bg-slate-900 border-gray-700' : 'bg-blue-900/20 border-blue-800'}`}>
                        {msg.role === 'ai' ? <Bot size={20} className="text-spartan-red"/> : <User size={20} className="text-blue-400"/>}
                    </div>

                    {/* Bubble */}
                    <div className={`max-w-[85%] rounded-xl p-5 border shadow-xl ${msg.role === 'ai' ? 'bg-slate-900/90 border-gray-800 text-gray-200 rounded-tl-none' : 'bg-blue-900/20 border-blue-900/50 text-white rounded-tr-none'}`}>
                        <div className="flex justify-between items-center mb-2 pb-2 border-b border-white/5">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${msg.role === 'ai' ? 'text-spartan-red' : 'text-blue-500'}`}>
                                {msg.role === 'ai' ? 'The General' : 'Commander'}
                            </span>
                            <span className="text-[9px] text-gray-600 font-mono">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        
                        {/* Only use typewriter for the LATEST AI message to avoid re-typing old history */}
                        {msg.role === 'ai' && index === messages.length - 1 && isLoading === false ? (
                            <TypewriterText text={msg.content} />
                        ) : (
                            <div className="text-sm leading-relaxed whitespace-pre-wrap font-mono">
                                {/* Static Renderer for History / User */}
                                {msg.content.split('\n').map((line, i) => {
                                    const linkMatch = line.match(/\[(.*?)\]\((.*?)\)/);
                                    if (linkMatch) {
                                        const before = line.substring(0, linkMatch.index);
                                        const after = line.substring((linkMatch.index || 0) + linkMatch[0].length);
                                        return (
                                            <div key={i}>
                                                {before}
                                                <a href={linkMatch[2]} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300 font-bold">
                                                    {linkMatch[1]}
                                                </a>
                                                {after}
                                            </div>
                                        );
                                    }
                                    if (line.includes('**')) {
                                        const parts = line.split('**');
                                        return (
                                            <div key={i} className="min-h-[1em]">
                                                {parts.map((part, idx) => 
                                                    idx % 2 === 1 ? <span key={idx} className="text-white font-bold">{part}</span> : part
                                                )}
                                            </div>
                                        );
                                    }
                                    return <div key={i} className="min-h-[1em]">{line}</div>;
                                })}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex gap-4 animate-pulse">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center border bg-slate-900 border-gray-700 shadow-lg">
                        <Loader size={20} className="text-spartan-red animate-spin"/>
                    </div>
                    <div className="bg-slate-900/50 border border-gray-800 rounded-lg p-4 flex items-center gap-3 rounded-tl-none">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-spartan-red rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-spartan-red rounded-full animate-bounce animation-delay-200"></span>
                            <span className="w-2 h-2 bg-spartan-red rounded-full animate-bounce animation-delay-400"></span>
                        </div>
                        <span className="text-xs text-gray-500 font-mono uppercase tracking-widest">Decryption in progress...</span>
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>

        {/* QUICK COMMANDS */}
        <div className="bg-black/80 backdrop-blur border-t border-gray-800 p-3 flex gap-3 overflow-x-auto no-scrollbar">
            <QuickCommand icon={Skull} label="Relapse Protocol" query="I just relapsed/failed a protocol. Give me an immediate recovery plan. Be harsh." color="spartan-red" />
            <QuickCommand icon={DollarSign} label="Financial Audit" query="Audit my finances based on my current cash and assets. Give me a strategy to reach 1 Million BDT. Be ruthless." color="wealth-green" />
            <QuickCommand icon={Briefcase} label="Career Roadmap" query="Create a career roadmap for me based on high-income skills suitable for Bangladesh context. Search for current demand." color="blue-500" />
            <QuickCommand icon={Flame} label="Motivation" query="I feel lazy and unmotivated. Wake me up." color="orange-500" />
            <QuickCommand icon={BookOpen} label="Apply Knowledge" query="Based on the books I've completed, what specific mental model should I apply to my current top goal?" color="purple-500" />
        </div>

        {/* INPUT AREA */}
        <div className="p-4 bg-slate-900 border-t border-gray-800 relative">
            <div className="relative flex items-center gap-2 group">
                <Terminal size={18} className="absolute left-4 text-gray-500 group-focus-within:text-spartan-red transition-colors"/>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter command or tactical query..."
                    className="w-full bg-black border border-gray-700 text-white pl-10 pr-12 py-4 rounded-xl focus:border-spartan-red outline-none font-mono text-sm transition-all shadow-inner focus:shadow-[0_0_15px_rgba(220,38,38,0.1)]"
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bg-spartan-red hover:bg-red-600 text-white p-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_10px_rgba(220,38,38,0.5)] active:scale-95"
                >
                    <Send size={18} />
                </button>
            </div>
            <p className="text-[9px] text-gray-600 mt-2 text-center font-mono uppercase tracking-widest opacity-70">
                SECURE CHANNEL ESTABLISHED // AI MODE: GENERAL // LATENCY: 12ms
            </p>
        </div>
    </div>
  );
};