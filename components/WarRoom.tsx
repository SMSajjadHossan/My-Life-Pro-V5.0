
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Terminal, Cpu, Zap, Globe, Command, Trash2, Mic, MicOff, PhoneCall, Radio, ExternalLink } from 'lucide-react';
import { chatWithGeneral } from '../services/geminiService';
import { ChatMessage, FinancialState, Habit, UserProfile, Book } from '../types';

interface Props {
  financialData: FinancialState;
  habits: Habit[];
  profile: UserProfile;
  objectives: any[];
  books: Book[];
}

export const WarRoom: React.FC<Props> = ({ financialData, habits, profile, objectives, books }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('war_room_chat_v10');
    return saved ? JSON.parse(saved) : [{
        id: 'init',
        role: 'ai',
        content: "Commander. Context bridge established. General v10 is monitoring all data vectors. State your directive.",
        timestamp: new Date().toISOString()
    }];
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('war_room_chat_v10', JSON.stringify(messages));
  }, [messages, isLoading]);

  const handleSend = async (manualText?: string) => {
    const textToSend = manualText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: textToSend,
        timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const liquidCash = (Number(financialData.bankA) || 0) + (Number(financialData.bankB) || 0) + (Number(financialData.bankC) || 0);
    const assetsVal = (financialData.assets || []).reduce((a, b) => a + (Number(b.value) || 0), 0);
    const appState = {
        financial: { liquidCash, netWorth: liquidCash + assetsVal, compounded: financialData.totalCompoundedThisSession },
        habits, goals: objectives.slice(0, 5), books,
        user: { rank: profile.rank, level: profile.level, systemicRisk: profile.systemicRisk, retentionDay: profile.retentionDay }
    };

    try {
        const aiResponse = await chatWithGeneral(textToSend, appState);
        const aiMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: typeof aiResponse === 'string' ? aiResponse : aiResponse.text,
            sources: typeof aiResponse === 'object' ? aiResponse.sources : [],
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        setMessages(prev => [...prev, { id: 'err', role: 'ai', content: "Tactical Error: Link Interrupted.", timestamp: new Date().toISOString() }]);
    }
    setIsLoading(false);
  };

  const toggleLiveLink = () => {
    if (!isLiveActive) {
        alert("Establishing Neural Audio Link via Gemini Live API... [Simulated Connection]");
        setIsLiveActive(true);
    } else {
        setIsLiveActive(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col glass-panel rounded-[3rem] overflow-hidden border border-white/5 relative bg-black/20 shadow-4xl">
        <div className="bg-black/80 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center relative z-10 shadow-2xl">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-spartan-red/10 border border-spartan-red/30 rounded-2xl animate-pulse"><Cpu size={18} className="text-spartan-red" /></div>
                <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-[0.3em] italic">Tactical Intelligence v10</h2>
                    <p className="text-[8px] text-gray-500 font-mono uppercase tracking-widest mt-1">Grounding: ENABLED • {isLiveActive ? 'VOICE LINK: ACTIVE' : 'TEXT ONLY MODE'}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
              {isLiveActive && <div className="flex gap-1 mr-4 animate-pulse"><Radio className="text-wealth-green" size={14} /><span className="text-[8px] font-black text-wealth-green uppercase tracking-widest">TRANSMITTING</span></div>}
              <button onClick={toggleLiveLink} className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isLiveActive ? 'bg-spartan-red text-white shadow-xl shadow-red-900/40' : 'bg-white/5 text-gray-500 hover:text-white border border-white/10'}`}>
                  {isLiveActive ? <><PhoneCall size={14}/> Close Link</> : <><Mic size={14}/> Open Live Link</>}
              </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar relative z-10 scroll-smooth">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2`}>
                    <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center border flex-shrink-0 shadow-lg ${msg.role === 'ai' ? 'bg-slate-900 border-spartan-red/30' : 'bg-electric-blue/10 border-electric-blue/30'}`}>
                        {msg.role === 'ai' ? <Bot size={22} className="text-spartan-red"/> : <User size={22} className="text-electric-blue"/>}
                    </div>
                    <div className={`max-w-[85%] md:max-w-[70%] space-y-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`rounded-3xl p-6 border ${msg.role === 'ai' ? 'bg-black/60 border-white/5 text-gray-300' : 'bg-electric-blue/10 border-electric-blue/20 text-white shadow-2xl'}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap font-mono tracking-tight">{msg.content}</p>
                            
                            {/* FIXED: Added rendering for search grounding sources as required by guidelines */}
                            {msg.role === 'ai' && msg.sources && msg.sources.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                        <Globe size={12}/> GROUNDING_SOURCES
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map((src, i) => (
                                            <a 
                                                key={i} 
                                                href={src.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-[9px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2 transition-all text-blue-400 group/link"
                                            >
                                                {src.title} <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"/>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-6 animate-pulse">
                    <div className="w-12 h-12 bg-slate-900 rounded-[1.2rem]"></div>
                    <div className="space-y-3 w-2/3">
                        <div className="h-4 bg-slate-900 rounded-full w-full"></div>
                        <div className="h-4 bg-slate-900 rounded-full w-5/6"></div>
                    </div>
                </div>
            )}
            <div ref={scrollRef} />
        </div>

        <div className="p-8 bg-black/80 backdrop-blur-xl border-t border-white/5 relative z-10 space-y-6">
            <div className="relative flex items-center gap-4">
                <Command size={18} className="absolute left-5 text-gray-600"/>
                <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="ENTER COMMAND DIRECTIVE..."
                    className="w-full bg-black border border-white/10 text-white pl-14 pr-16 py-5 rounded-[1.5rem] focus:border-spartan-red outline-none font-mono text-xs transition-all shadow-inner"
                />
                <button 
                    onClick={() => handleSend()}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-3 bg-spartan-red hover:bg-red-600 text-white p-4 rounded-2xl transition-all shadow-xl active:scale-95 disabled:opacity-20"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};
