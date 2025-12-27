
import React, { useState } from 'react';
import { Book as BookType, NeuralNote } from '../types';
import { processNeuralInput } from '../services/geminiService';
import { THE_CODEX } from '../constants';
import { 
  Library, Scroll, Cpu, ShieldCheck, X, Brain, DollarSign, Zap, Dumbbell, Target, Info
} from 'lucide-react';

interface Props {
  books: BookType[];
  setBooks: (books: BookType[]) => void;
}

export const KnowledgeVault: React.FC<Props> = ({ books, setBooks }) => {
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'CODEX' | 'SCANNER'>('LIBRARY');
  const [activeChapterId, setActiveChapterId] = useState<string>(THE_CODEX[0].id);
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [showMasteredOnly, setShowMasteredOnly] = useState(false);
  
  // SCANNER STATE
  const [scanMode, setScanMode] = useState<'TEXT' | 'FILE'>('TEXT');
  const [scanInputText, setScanInputText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedNotes, setScannedNotes] = useState<NeuralNote[]>([]);
  const [scanResultTitle, setScanResultTitle] = useState('');

  const executeNeuralScan = async () => {
    if (!scanInputText) return;
    setIsScanning(true);
    const resultJson = await processNeuralInput(scanInputText, null, 'text/plain');
    try {
        const cleanJson = resultJson.match(/\{[\s\S]*\}/)?.[0] || resultJson;
        const parsed = JSON.parse(cleanJson);
        const newNotes = (parsed.notes || []).map((n: any) => ({
            id: Math.random().toString(), 
            concept: n.concept,
            action: n.action,
            problem: n.problem,
            iconCategory: n.iconCategory || 'MIND',
            isMastered: false, 
            timestamp: new Date().toISOString()
        }));
        setScanResultTitle(parsed.title || "Extraction Report");
        setScannedNotes(newNotes);
    } catch (e) { 
        console.error("Parse Error:", e);
        alert("Neural Matrix generation failed. Retrying triage..."); 
    }
    setIsScanning(false);
  };

  const toggleMastery = (bookId: string, noteId: string) => {
    setBooks(books.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          neuralNotes: b.neuralNotes.map(n => n.id === noteId ? { ...n, isMastered: !n.isMastered } : n)
        };
      }
      return b;
    }));
  };

  const commitToVault = () => {
    if (scannedNotes.length === 0) return;
    const newBook: BookType = {
        id: Date.now().toString(), 
        title: scanResultTitle, 
        author: "Neural Extraction",
        status: "Completed", 
        neuralNotes: scannedNotes, 
        rating: 5
    };
    setBooks([newBook, ...books]);
    setScannedNotes([]);
    setScanResultTitle('');
    setActiveTab('LIBRARY');
  };

  const getIcon = (category: string) => {
    switch(category) {
        case 'MONEY': return <DollarSign className="text-wealth-green" size={20} />;
        case 'POWER': return <Zap className="text-yellow-500" size={20} />;
        case 'HEALTH': return <Dumbbell className="text-spartan-red" size={20} />;
        case 'SKILL': return <Target className="text-blue-500" size={20} />;
        default: return <Brain className="text-purple-500" size={20} />;
    }
  };

  return (
    <div className="space-y-10 animate-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-8 gap-6">
        <div>
          <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">Knowledge <span className="text-cyber-purple">Vault</span></h2>
          <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase tracking-widest font-bold">SOVEREIGN LEDGER v4.1</p>
        </div>
        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
            {['LIBRARY', 'CODEX', 'SCANNER'].map(t => (
              <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-widest ${activeTab === t ? 'bg-cyber-purple text-white shadow-xl' : 'text-gray-500 hover:text-white'}`}>{t}</button>
            ))}
        </div>
      </header>

      {activeTab === 'LIBRARY' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Active Intelligence Matrix</h3>
               <button onClick={() => setShowMasteredOnly(!showMasteredOnly)} className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border transition-all ${showMasteredOnly ? 'bg-wealth-green border-wealth-green text-black' : 'border-white/5 text-gray-500 hover:text-white'}`}>
                 {showMasteredOnly ? 'Showing Mastered' : 'Show Mastered Only'}
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.map(book => (
                    <div key={book.id} onClick={() => setActiveBookId(activeBookId === book.id ? null : book.id)} className={`glass-panel p-8 rounded-[2.5rem] border transition-all cursor-pointer group h-full flex flex-col justify-between ${activeBookId === book.id ? 'border-cyber-purple bg-cyber-purple/10' : 'border-white/5 bg-black/40 hover:border-cyber-purple/50'}`}>
                        <div>
                          <div className="flex justify-between items-start mb-6">
                            <Library className={`text-gray-600 group-hover:text-cyber-purple transition-colors ${activeBookId === book.id ? 'text-cyber-purple' : ''}`} size={32}/>
                            <div className="flex flex-col items-end">
                              <span className="text-[8px] font-black uppercase text-gray-500">{book.status}</span>
                              <span className="text-[10px] font-mono font-black text-white">{book.neuralNotes.length} Vectors</span>
                            </div>
                          </div>
                          <h4 className="text-xl font-display font-black text-white uppercase italic tracking-tighter leading-tight">{book.title}</h4>
                          <p className="text-[10px] text-gray-500 font-mono mt-2 uppercase">{book.author}</p>
                        </div>
                    </div>
                ))}
            </div>

            {activeBookId && (
              <div className="mt-12 space-y-8 animate-in slide-in-from-top-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">{books.find(b => b.id === activeBookId)?.title} Deep Analysis</h3>
                    <button onClick={() => setActiveBookId(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-all"><X size={20}/></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {books.find(b => b.id === activeBookId)?.neuralNotes
                        .filter(n => !showMasteredOnly || n.isMastered)
                        .map(note => (
                          <div key={note.id} className={`glass-panel p-6 rounded-[2.5rem] border transition-all ${note.isMastered ? 'border-wealth-green/30 bg-wealth-green/5' : 'border-white/5 bg-black/40 hover:border-white/10 shadow-lg'}`}>
                              <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">{getIcon(note.iconCategory)}</div>
                                    <h5 className="text-sm font-black text-white uppercase tracking-tight">{note.concept}</h5>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); toggleMastery(activeBookId, note.id); }} className={`p-2.5 rounded-xl transition-all shadow-xl ${note.isMastered ? 'bg-wealth-green text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                                      <ShieldCheck size={18}/>
                                  </button>
                              </div>
                              <p className="text-xs text-gray-400 mb-6 italic leading-relaxed">"{note.problem}"</p>
                              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 text-[11px] font-bold text-wealth-green shadow-inner">
                                  COMMAND: {note.action}
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
            )}
        </div>
      )}

      {activeTab === 'SCANNER' && (
          <div className="space-y-12 max-w-4xl mx-auto">
            <div className="glass-panel rounded-[3rem] border border-white/5 bg-black/60 p-10 space-y-8 shadow-4xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5"><Cpu size={200} className="text-cyber-purple"/></div>
                <div className="flex justify-between items-center relative z-10">
                    <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-4"><Cpu className="text-cyber-purple"/> NEURAL SCANNER v10.2</h3>
                    <div className="flex gap-4">
                        <button onClick={() => setScanMode('TEXT')} className={`text-[9px] font-black uppercase tracking-widest transition-all ${scanMode === 'TEXT' ? 'text-white underline underline-offset-8' : 'text-gray-600'}`}>Text Only</button>
                        <button disabled className={`text-[9px] font-black uppercase tracking-widest text-gray-800 cursor-not-allowed`}>Visual Sync (Pro)</button>
                    </div>
                </div>
                <textarea 
                    value={scanInputText} onChange={e => setScanInputText(e.target.value)}
                    placeholder="PASTE INTEL (CHAPTERS, ARTICLES, OR RAW DATA)..."
                    className="w-full h-56 bg-black/40 border border-white/10 rounded-[2rem] p-8 text-white font-mono text-sm focus:border-cyber-purple outline-none transition-all resize-none shadow-inner"
                />
                <button onClick={executeNeuralScan} disabled={isScanning || !scanInputText} className="w-full py-6 bg-cyber-purple text-white font-black uppercase tracking-[0.4em] rounded-[2rem] text-xs shadow-2xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-20 relative z-10">
                    {isScanning ? "Processing Neural Links..." : "Engage Extraction Protocol"}
                </button>
            </div>

            {scannedNotes.length > 0 && (
                <div className="space-y-8 animate-in slide-in-from-bottom-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{scanResultTitle}</h4>
                        <button onClick={commitToVault} className="px-10 py-4 bg-wealth-green text-black font-black uppercase tracking-widest text-[10px] rounded-[1.5rem] hover:scale-105 transition-all shadow-2xl shadow-green-900/40">Authorize Vault Commitment</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {scannedNotes.map((note, idx) => (
                            <div key={idx} className="glass-panel p-6 rounded-[2.5rem] border border-white/5 bg-black/40 hover:border-white/20 transition-all">
                                <h5 className="text-sm font-black text-white uppercase tracking-tight mb-3">{note.concept}</h5>
                                <p className="text-xs text-gray-500 mb-6 leading-relaxed italic">"{note.problem}"</p>
                                <div className="p-4 bg-cyber-purple/5 border border-cyber-purple/20 rounded-2xl text-[10px] font-mono text-cyber-purple font-bold">Protocol: {note.action}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
      )}

      {activeTab === 'CODEX' && (
          <div className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-black/40 min-h-[600px] shadow-3xl">
              <div className="flex flex-col lg:flex-row gap-12 h-full">
                  <div className="w-full lg:w-1/4 space-y-3">
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-6">Archive Chapters</p>
                      {THE_CODEX.map(c => (
                          <button 
                            key={c.id} 
                            onClick={() => setActiveChapterId(c.id)} 
                            className={`w-full p-5 rounded-2xl text-[10px] font-black uppercase text-left transition-all border ${activeChapterId === c.id ? 'bg-cyber-purple border-cyber-purple text-white shadow-xl translate-x-2' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}
                          >
                            {c.title}
                          </button>
                      ))}
                  </div>
                  <div className="flex-1 space-y-8">
                      <div className="border-b border-white/5 pb-6">
                          <h3 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter mb-2">{THE_CODEX.find(c => c.id === activeChapterId)?.title}</h3>
                          <p className="text-xs text-gray-500 italic font-mono uppercase tracking-widest">{THE_CODEX.find(c => c.id === activeChapterId)?.description}</p>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                          {THE_CODEX.find(c => c.id === activeChapterId)?.content[0].points.map((p, i) => (
                              <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-[2rem] text-xs text-gray-300 font-medium leading-relaxed hover:border-cyber-purple/30 transition-all flex items-start gap-5 shadow-inner">
                                  <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full mt-1.5 flex-shrink-0"></div>
                                  <p>{p}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
