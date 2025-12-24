
import React, { useState, useEffect, useRef } from 'react';
import { Book, Plus, Brain, Sparkles, ChevronDown, ChevronUp, Search, X, Zap, DollarSign, Dumbbell, Target, Upload, FileText, Youtube, Image as ImageIcon, Save, Edit2, FileType, Pencil, Loader, CheckCircle, Lightbulb, Play, AlertTriangle, Crosshair, ArrowRight, Library, Scroll, Table, Music, FileSpreadsheet, Cloud, Download, RefreshCw, Settings, HardDrive, Trash2, Globe, Terminal, Cpu, Layers, Maximize2, Clipboard } from 'lucide-react';
import { Book as BookType, NeuralNote } from '../types';
import { processNeuralInput } from '../services/geminiService';
import { THE_CODEX } from '../constants';

interface Props {
  books: BookType[];
  setBooks: (books: BookType[]) => void;
}

export const KnowledgeVault: React.FC<Props> = ({ books, setBooks }) => {
  const [activeTab, setActiveTab] = useState<'LIBRARY' | 'CODEX'>('LIBRARY');
  const [activeChapterId, setActiveChapterId] = useState<string>(THE_CODEX[0].id);

  // --- LIBRARY STATE ---
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'Reading' | 'To Read' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // --- NEURAL SCANNER STATE ---
  const [scanMode, setScanMode] = useState<'TEXT' | 'FILE'>('TEXT');
  const [scanInputText, setScanInputText] = useState('');
  const [scanContext, setScanContext] = useState(''); // NEW: Title/Context
  const [scanFileBase64, setScanFileBase64] = useState<string | null>(null);
  const [scanFileType, setScanFileType] = useState<string>(''); // Mime type
  const [scanFileName, setScanFileName] = useState<string>('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(''); // For loading animation
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [scannedNotes, setScannedNotes] = useState<NeuralNote[]>([]);
  const [scanResultTitle, setScanResultTitle] = useState('');
  const [scanSummary, setScanSummary] = useState(''); // Executive Brief

  // --- SCANNER EDITING STATE ---
  const [scannerEditingId, setScannerEditingId] = useState<string | null>(null);
  const [scannerEditContent, setScannerEditContent] = useState<NeuralNote | null>(null);
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [tempSummary, setTempSummary] = useState('');

  // --- LIBRARY EDITING STATE ---
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<{concept: string, action: string, problem: string, example: string} | null>(null);
  
  // --- BOOK RENAMING STATE ---
  const [renamingBookId, setRenamingBookId] = useState<string | null>(null);
  const [renameTitleContent, setRenameTitleContent] = useState('');

  // --- MANUAL NOTE ADDING STATE ---
  const [addingNoteBookId, setAddingNoteBookId] = useState<string | null>(null);
  const [newNoteForm, setNewNoteForm] = useState<{concept: string, action: string, problem: string, example: string, category: string}>({concept: '', action: '', problem: '', example: '', category: 'MIND'});

  // --- HANDLERS ---

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanFileName(file.name);
      setScanFileType(file.type); 
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanFileBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = async () => {
      try {
          const text = await navigator.clipboard.readText();
          setScanInputText(text);
      } catch (err) {
          console.error('Failed to read clipboard contents: ', err);
      }
  };

  const simulateScanStages = () => {
      const stages = [
          "📡 ESTABLISHING SECURE UPLINK...",
          "🔍 SEARCHING GLOBAL INTELLIGENCE GRID...",
          "🧬 DECODING SEMANTIC STRUCTURE...",
          "⚖️ ANALYZING TRUTH VECTORS...",
          "🌍 TRANSLATING TO NATIVE CONTEXT...",
          "📊 COMPILING TACTICAL MATRIX...",
          "✅ PROTOCOL COMPLETE."
      ];
      let i = 0;
      setTerminalLogs([]);
      setScanStage(stages[0]);
      const interval = setInterval(() => {
          if (i < stages.length) {
              setTerminalLogs(prev => [...prev, stages[i]]);
              setScanStage(stages[i]);
              i++;
          } else {
              clearInterval(interval);
          }
      }, 800); 
      return interval;
  };

  const executeNeuralScan = async () => {
    if ((scanMode === 'TEXT' && !scanInputText) || (scanMode === 'FILE' && !scanFileBase64)) return;
    
    setIsScanning(true);
    const stageInterval = simulateScanStages();
    
    // Pass raw base64 and explicit mime type
    const resultJson = await processNeuralInput(
        scanInputText, 
        scanMode === 'FILE' ? scanFileBase64 : null, 
        scanMode === 'FILE' ? scanFileType : 'text/plain',
        scanContext
    );
    
    clearInterval(stageInterval);

    try {
        // Robust JSON Parsing: Find first '{' and last '}'
        const jsonMatch = resultJson.match(/\{[\s\S]*\}/);
        const cleanJson = jsonMatch ? jsonMatch[0] : resultJson;

        const parsed = JSON.parse(cleanJson);
        const newNotes: NeuralNote[] = parsed.notes.map((n: any) => ({
            id: Date.now().toString() + Math.random(),
            concept: n.concept,
            action: n.action,
            problem: n.problem || '',
            example: n.example || '',
            iconCategory: n.iconCategory || 'MIND',
            sourceType: scanMode === 'FILE' ? (scanFileType.includes('pdf') ? 'BOOK' : 'IMAGE') : (scanInputText.includes('youtube') ? 'YOUTUBE' : 'TEXT'),
            timestamp: new Date().toISOString()
        }));
        
        const generatedTitle = parsed.title || (scanMode === 'FILE' ? scanFileName : (scanContext || scanInputText.substring(0, 30) || "Scanned Content"));
        setScanResultTitle(generatedTitle);
        setScanSummary(parsed.summary || "");
        setScannedNotes(newNotes);
    } catch (e) {
        // Fallback for plain text responses (like "I am sorry...")
        console.warn("JSON Parse Error, falling back to raw text", e);
        setScanResultTitle("System Report (Raw Output)");
        setScanSummary(resultJson); // Put the raw text here
        setScannedNotes([{
            id: Date.now().toString(),
            concept: "System Notification",
            action: "Review the raw output summary above.",
            problem: "Structured data extraction failed.",
            example: "The AI might have returned a conversational response instead of JSON.",
            iconCategory: 'MIND',
            sourceType: 'TEXT',
            timestamp: new Date().toISOString()
        }]);
    }
    setIsScanning(false);
    setScanStage('');
    setTerminalLogs([]);
  };

  const handleExportToExcel = () => {
    if (scannedNotes.length === 0) return;

    // Define CSV Headers
    const headers = ["Concept / Key Point", "Root Problem (Why)", "Action Protocol (Do This)", "Evidence / Example", "Category"];
    
    // Map data to CSV rows, handling quotes properly for Excel
    const csvRows = [
        headers.join(','), // Header row
        ...scannedNotes.map(note => {
            const row = [
                note.concept,
                note.problem,
                note.action,
                note.example,
                note.iconCategory
            ].map(field => {
                // Escape double quotes by doubling them, then wrap field in quotes
                const stringField = String(field || '');
                return `"${stringField.replace(/"/g, '""')}"`;
            });
            return row.join(',');
        })
    ].join('\n');

    // Create Blob with BOM (Byte Order Mark) for Excel UTF-8 compatibility
    const blob = new Blob(["\uFEFF" + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Naming the file .csv so Excel opens it automatically
    link.download = `NEURAL_SCAN_EXPORT_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveScannedNotesToBook = (bookId: string) => {
    setBooks(books.map(b => {
        if(b.id === bookId) {
            const notesToAdd = [...scannedNotes];
            if (scanSummary) {
                notesToAdd.unshift({
                    id: Date.now().toString() + "summary",
                    concept: "FULL BRIEF (BILINGUAL SITREP)",
                    action: "Review full summary.",
                    problem: "Information overload",
                    example: scanSummary,
                    iconCategory: 'MIND',
                    sourceType: 'TEXT',
                    timestamp: new Date().toISOString()
                });
            }
            return { ...b, neuralNotes: [...notesToAdd, ...b.neuralNotes] };
        }
        return b;
    }));
    resetScanner();
  };

  const createBookFromScan = () => {
    if (scannedNotes.length === 0) return;
    const finalNotes = [...scannedNotes];
    if (scanSummary) {
        finalNotes.unshift({
            id: Date.now().toString() + "summary",
            concept: "FULL BRIEF (BILINGUAL SITREP)",
            action: "Review full summary.",
            problem: "Information overload",
            example: scanSummary,
            iconCategory: 'MIND',
            sourceType: 'TEXT',
            timestamp: new Date().toISOString()
        });
    }
    const newBook: BookType = {
        id: Date.now().toString(),
        title: scanResultTitle,
        author: "Neural Scanner",
        status: "Completed",
        neuralNotes: finalNotes,
        rating: 5
    };
    setBooks([newBook, ...books]);
    resetScanner();
  };
  
  const resetScanner = () => {
    setScannedNotes([]);
    setScanResultTitle('');
    setScanSummary('');
    setScanInputText('');
    setScanContext('');
    setScanFileBase64(null);
    setScanFileName('');
    setScanFileType('');
  };

  // --- SCANNER EDITING HANDLERS ---
  const startEditingScannedNote = (note: NeuralNote) => {
    setScannerEditingId(note.id);
    setScannerEditContent({...note});
  };

  const saveScannedNoteEdit = () => {
    if (!scannerEditContent) return;
    setScannedNotes(prev => prev.map(n => n.id === scannerEditContent.id ? scannerEditContent : n));
    setScannerEditingId(null);
    setScannerEditContent(null);
  };

  const addManualScannedNote = () => {
      const newNote: NeuralNote = {
          id: Date.now().toString() + Math.random(),
          concept: "",
          action: "",
          problem: "",
          example: "",
          iconCategory: 'MIND',
          sourceType: 'TEXT',
          timestamp: new Date().toISOString()
      };
      setScannedNotes([...scannedNotes, newNote]);
      startEditingScannedNote(newNote); // Auto-start editing
  };

  // --- BOOK NOTE HANDLERS ---
  const startEditing = (note: NeuralNote) => {
    setEditingNoteId(note.id);
    setEditContent({ concept: note.concept, action: note.action, problem: note.problem || '', example: note.example || '' });
  };

  const saveEdit = (bookId: string, noteId: string) => {
    if (!editContent) return;
    setBooks(books.map(b => b.id === bookId ? {
        ...b, neuralNotes: b.neuralNotes.map(n => n.id === noteId ? { ...n, ...editContent } : n)
    } : b));
    setEditingNoteId(null);
    setEditContent(null);
  };

  const startAddingNote = (bookId: string) => { setAddingNoteBookId(bookId); setNewNoteForm({concept: '', action: '', problem: '', example: '', category: 'MIND'}); };
  const cancelAddingNote = () => { setAddingNoteBookId(null); setNewNoteForm({concept: '', action: '', problem: '', example: '', category: 'MIND'}); };
  
  const saveManualNote = () => {
    if (!addingNoteBookId || !newNoteForm.concept) return;
    const newNote: NeuralNote = {
        id: Date.now().toString(), ...newNoteForm, iconCategory: newNoteForm.category as any, sourceType: 'BOOK', timestamp: new Date().toISOString()
    };
    setBooks(books.map(b => b.id === addingNoteBookId ? { ...b, neuralNotes: [newNote, ...b.neuralNotes] } : b));
    cancelAddingNote();
  };

  const startRenamingBook = (book: BookType, e: React.MouseEvent) => { e.stopPropagation(); setRenamingBookId(book.id); setRenameTitleContent(book.title); };
  const saveBookRename = (bookId: string) => { if (!renameTitleContent.trim()) return; setBooks(books.map(b => b.id === bookId ? { ...b, title: renameTitleContent } : b)); setRenamingBookId(null); };
  
  // --- DELETE BOOK HANDLER ---
  const handleDeleteBook = (id: string) => {
      if (confirm("Are you sure you want to delete this ENTIRE book and all its insights? This cannot be undone.")) {
          setBooks(books.filter(b => b.id !== id));
      }
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

  const filteredBooks = books.filter(book => {
    if (filter !== 'All' && book.status !== filter) return false;
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return book.title.toLowerCase().includes(lowerQuery) || book.author.toLowerCase().includes(lowerQuery) || book.neuralNotes?.some(n => n.concept.toLowerCase().includes(lowerQuery));
  });

  const renderCodex = () => {
    const activeChapter = THE_CODEX.find(c => c.id === activeChapterId) || THE_CODEX[0];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 space-y-2">
           {THE_CODEX.map(chapter => (
             <button
                key={chapter.id}
                onClick={() => setActiveChapterId(chapter.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${activeChapterId === chapter.id ? 'bg-purple-900/20 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-900 border-gray-800 text-gray-400 hover:bg-slate-800 hover:text-gray-200'}`}
             >
                <h4 className={`text-sm font-bold uppercase mb-1 ${activeChapterId === chapter.id ? 'text-purple-400' : ''}`}>{chapter.title}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-2">{chapter.description}</p>
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-900 border border-gray-800 p-6 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Scroll size={120} className="text-purple-500"/></div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{activeChapter.title}</h3>
                    <p className="text-sm text-purple-400 font-mono font-bold uppercase">{activeChapter.description}</p>
                </div>
            </div>

            <div className="space-y-4">
                {activeChapter.content.map((section, idx) => (
                    <div key={idx} className="bg-black/40 border border-gray-800 p-6 rounded-lg hover:border-gray-600 transition-colors">
                        <h4 className="text-lg font-bold text-white uppercase mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            {section.sectionTitle}
                        </h4>
                        <ul className="space-y-3">
                            {section.points.map((point, pIdx) => (
                                <li key={pIdx} className="text-sm text-gray-300 leading-relaxed flex items-start gap-3">
                                    <span className="text-purple-500 font-bold mt-1">›</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      {/* HEADER */}
      <header className="flex justify-between items-center border-b border-gray-800 pb-4">
        <div>
           <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Knowledge Vault</h2>
           <p className="text-xs text-purple-400 font-mono font-bold mt-1">NEURAL UPGRADE PROTOCOL • SUPER EXPERT MODE</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setActiveTab('LIBRARY')} className={`px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 transition-all ${activeTab === 'LIBRARY' ? 'bg-white text-black' : 'bg-slate-900 text-gray-400 hover:text-white'}`}><Library size={14} /> Library</button>
            <button onClick={() => setActiveTab('CODEX')} className={`px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 transition-all ${activeTab === 'CODEX' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-gray-400 hover:text-white'}`}><Scroll size={14} /> The Codex</button>
        </div>
      </header>

      {activeTab === 'CODEX' ? renderCodex() : (
      <>
        {/* --- EXPERT NEURAL SCANNER (TERMINAL UPGRADE) --- */}
        <div className="bg-slate-950 border border-purple-500/20 rounded-xl overflow-hidden shadow-2xl relative group">
            {/* Terminal Decoration */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Header */}
            <div className="bg-black/50 border-b border-purple-900/30 p-4 flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-900/20 rounded border border-purple-500/30 animate-pulse">
                        <Terminal size={18} className="text-purple-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                            Neural Scanner <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-mono">FORENSIC v9.0</span>
                        </h3>
                        <p className="text-[10px] text-gray-500 font-mono tracking-wide">SHADOW-NET SEARCH ENABLED • DEEP SEMANTIC EXTRACTION</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-purple-500 border border-purple-900 px-2 py-1 rounded bg-purple-900/10 flex items-center gap-1">
                        <Globe size={10}/> GLOBAL INTEL
                    </span>
                </div>
            </div>

            <div className="p-6 relative z-10 space-y-6">
                
                {/* 1. CONFIGURATION STRIP */}
                <div className="flex flex-wrap gap-4 items-center bg-purple-900/5 p-3 rounded border border-purple-900/20">
                    <div className="flex bg-black p-1 rounded border border-gray-800">
                        <button onClick={() => setScanMode('TEXT')} className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all ${scanMode === 'TEXT' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-500 hover:text-white'}`}><Youtube size={14}/> URL / Text</button>
                        <button onClick={() => setScanMode('FILE')} className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all ${scanMode === 'FILE' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-gray-500 hover:text-white'}`}><Upload size={14}/> File Uplink</button>
                    </div>
                    <div className="h-8 w-[1px] bg-purple-900/30"></div>
                    <div className="flex-1">
                        <input 
                            value={scanContext}
                            onChange={(e) => setScanContext(e.target.value)}
                            placeholder="SET TARGET CONTEXT (e.g. 'Extract Investment Rules' or 'Analyze for Bias')"
                            className="w-full bg-black border border-gray-800 text-white text-xs font-mono p-2.5 rounded focus:border-purple-500 outline-none placeholder-gray-600"
                        />
                    </div>
                </div>

                {/* 2. MAIN INPUT TERMINAL */}
                <div className="relative group">
                    {scanMode === 'TEXT' ? (
                        <>
                            <textarea 
                                value={scanInputText}
                                onChange={(e) => setScanInputText(e.target.value)}
                                placeholder="> PASTE TARGET URL OR RAW INTEL HERE..."
                                className="w-full h-40 bg-black border border-gray-800 p-4 text-green-400 font-mono text-xs rounded-lg focus:border-purple-500 outline-none resize-none leading-relaxed shadow-inner"
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button onClick={() => setScanInputText('')} className="text-[10px] text-gray-500 hover:text-red-500 uppercase font-bold bg-black/80 px-2 py-1 rounded border border-gray-800">Clear</button>
                                <button onClick={handlePaste} className="text-[10px] text-purple-400 hover:text-white uppercase font-bold bg-purple-900/20 px-3 py-1 rounded border border-purple-500/30 flex items-center gap-1 hover:bg-purple-900/40"><Clipboard size={12}/> Paste</button>
                            </div>
                        </>
                    ) : (
                        <div className="border-2 border-dashed border-gray-800 rounded-lg h-40 flex flex-col items-center justify-center bg-black/50 hover:border-purple-500 transition-all relative group cursor-pointer overflow-hidden">
                            <div className="absolute inset-0 bg-purple-900/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {scanFileBase64 ? (
                                <div className="text-center p-4 relative z-10">
                                    {scanFileType.includes('image') ? (
                                        <div className="h-24 w-full flex justify-center mb-2"><img src={scanFileBase64} alt="Preview" className="h-full object-contain rounded border border-gray-700 shadow-lg" /></div>
                                    ) : (
                                        <FileType size={48} className="mx-auto text-purple-400 mb-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                    )}
                                    <p className="text-xs font-bold text-white font-mono">{scanFileName}</p>
                                    <button onClick={(e) => {e.stopPropagation(); resetScanner();}} className="mt-2 text-[10px] text-red-500 hover:text-red-400 underline">Remove File</button>
                                </div>
                            ) : (
                                <div className="text-center pointer-events-none relative z-10">
                                    <Upload className="mx-auto text-gray-600 mb-3 group-hover:text-purple-400 transition-colors" size={32} />
                                    <p className="text-xs text-gray-400 font-bold uppercase">Drop Secure File Here</p>
                                    <p className="text-[10px] text-gray-600 font-mono mt-1">PDF • IMG • TXT • AUDIO</p>
                                </div>
                            )}
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    )}
                    
                    {/* SCANNING TERMINAL OVERLAY */}
                    {isScanning && (
                        <div className="absolute inset-0 bg-black/95 rounded-lg z-20 border border-purple-500 flex flex-col p-6 font-mono shadow-2xl">
                            <div className="flex items-center gap-2 mb-4 border-b border-purple-900/50 pb-2">
                                <Loader className="animate-spin text-purple-500" size={16} />
                                <span className="text-purple-500 font-bold text-xs uppercase animate-pulse">System Processing...</span>
                            </div>
                            <div className="flex-1 overflow-hidden flex flex-col justify-end space-y-1">
                                {terminalLogs.map((log, i) => (
                                    <p key={i} className="text-[10px] text-green-500/80 font-bold">
                                        <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                        {log}
                                    </p>
                                ))}
                                <p className="text-xs text-green-400 font-bold animate-pulse mt-2">> {scanStage}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. EXECUTE BUTTON */}
                <button 
                    onClick={executeNeuralScan}
                    disabled={isScanning || (!scanInputText && !scanFileBase64)}
                    className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-lg uppercase text-sm tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center justify-center gap-3 border border-purple-400/20"
                >
                    {isScanning ? <Cpu className="animate-spin"/> : <Zap size={20} className="text-yellow-300 fill-yellow-300"/>}
                    {isScanning ? "NEURAL BRIDGE ACTIVE..." : "INITIATE DEEP SCAN"}
                </button>

                {/* 4. RESULTS BUFFER */}
                {scannedNotes.length > 0 && (
                    <div className="mt-8 border-t-2 border-purple-900/50 pt-6 animate-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="text-green-500" size={20}/>
                                <div>
                                    <h4 className="text-lg font-black text-white uppercase tracking-tighter">Mission Report</h4>
                                    <p className="text-[10px] text-green-500 font-mono">INTELLIGENCE ACQUIRED</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={handleExportToExcel} className="text-xs bg-blue-600 text-white px-3 py-2 rounded font-bold uppercase hover:bg-blue-500 flex items-center gap-2 shadow-lg shadow-blue-900/20"><FileSpreadsheet size={14}/> Export Data</button>
                                <button onClick={createBookFromScan} className="text-xs bg-wealth-green text-black px-4 py-2 rounded font-bold uppercase hover:bg-emerald-400 flex items-center gap-2 shadow-lg shadow-green-900/20"><Save size={14}/> Save to Archive</button>
                                <button onClick={resetScanner} className="text-xs bg-gray-800 text-gray-400 px-3 py-2 rounded font-bold uppercase hover:text-white flex items-center gap-1"><Trash2 size={14}/> Discard</button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* TITLE & BRIEF */}
                            <div className="bg-purple-900/10 border border-purple-500/30 rounded-lg overflow-hidden">
                                <div className="p-3 bg-purple-900/20 border-b border-purple-500/20 flex justify-between items-center">
                                    <input value={scanResultTitle} onChange={(e) => setScanResultTitle(e.target.value)} className="bg-transparent text-purple-200 font-bold text-sm w-full outline-none placeholder-purple-700" placeholder="ENTER REPORT TITLE..." />
                                    <Edit2 size={12} className="text-purple-500"/>
                                </div>
                                <div className="p-4 relative group">
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => {
                                            if (isEditingSummary) setScanSummary(tempSummary);
                                            else setTempSummary(scanSummary);
                                            setIsEditingSummary(!isEditingSummary);
                                        }} className="text-[10px] text-purple-400 uppercase font-bold border border-purple-500/30 px-2 py-1 rounded hover:bg-purple-500 hover:text-white">
                                            {isEditingSummary ? 'Save Brief' : 'Edit Brief'}
                                        </button>
                                    </div>
                                    {isEditingSummary ? (
                                        <textarea 
                                            value={tempSummary}
                                            onChange={(e) => setTempSummary(e.target.value)}
                                            className="w-full h-40 bg-black/50 border border-purple-500/30 text-gray-300 p-3 rounded text-xs font-mono outline-none leading-relaxed"
                                        />
                                    ) : (
                                        <p className="text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-line border-l-2 border-purple-500 pl-3">
                                            {scanSummary || "No executive brief generated."}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* DATA MATRIX */}
                            <div className="overflow-hidden rounded-lg border border-gray-800">
                                <div className="bg-gray-900 p-2 flex justify-between items-center border-b border-gray-800">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Table size={12}/> Data Matrix</span>
                                    <button onClick={addManualScannedNote} className="text-[10px] text-blue-400 hover:text-white font-bold uppercase">+ Add Vector</button>
                                </div>
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-black text-gray-500 font-bold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-3 border-r border-gray-800 w-[5%] text-center">#</th>
                                            <th className="p-3 border-r border-gray-800 w-[20%]">Key Point / Concept</th>
                                            <th className="p-3 border-r border-gray-800 w-[25%] text-red-400">Root Problem (Why?)</th>
                                            <th className="p-3 border-r border-gray-800 w-[25%] text-green-500">Action (Do This)</th>
                                            <th className="p-3 w-[25%] text-yellow-600">Evidence / Context</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-slate-900/30 divide-y divide-gray-800 text-gray-300 font-mono">
                                        {scannedNotes.map((note, idx) => (
                                            <tr key={note.id || idx} className="hover:bg-purple-900/10 transition-colors group">
                                                <td className="p-3 text-center text-gray-600 border-r border-gray-800">{idx + 1}</td>
                                                <td className="p-3 border-r border-gray-800 align-top relative">
                                                    {scannerEditingId === note.id ? (
                                                        <textarea value={scannerEditContent?.concept} onChange={e => setScannerEditContent(prev => prev ? {...prev, concept: e.target.value} : null)} className="w-full h-20 bg-black border border-blue-500 p-1 rounded text-white text-xs outline-none" />
                                                    ) : (
                                                        <>
                                                            <div className="whitespace-pre-wrap leading-relaxed text-gray-200 font-medium">{note.concept}</div>
                                                            <button onClick={() => startEditingScannedNote(note)} className="absolute top-2 right-2 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={10}/></button>
                                                        </>
                                                    )}
                                                </td>
                                                <td className="p-3 border-r border-gray-800 align-top text-red-300/90 bg-red-950/10">
                                                    {scannerEditingId === note.id ? (
                                                        <textarea value={scannerEditContent?.problem} onChange={e => setScannerEditContent(prev => prev ? {...prev, problem: e.target.value} : null)} className="w-full h-20 bg-black border border-red-500 p-1 rounded text-white text-xs outline-none" />
                                                    ) : (
                                                        <div className="whitespace-pre-wrap leading-relaxed">{note.problem || "-"}</div>
                                                    )}
                                                </td>
                                                <td className="p-3 border-r border-gray-800 align-top text-green-400 font-bold bg-green-950/10">
                                                    {scannerEditingId === note.id ? (
                                                        <textarea value={scannerEditContent?.action} onChange={e => setScannerEditContent(prev => prev ? {...prev, action: e.target.value} : null)} className="w-full h-20 bg-black border border-green-500 p-1 rounded text-white text-xs outline-none" />
                                                    ) : (
                                                        <div className="whitespace-pre-wrap leading-relaxed">{note.action}</div>
                                                    )}
                                                </td>
                                                <td className="p-3 align-top text-yellow-200/70 italic relative bg-yellow-950/5">
                                                    {scannerEditingId === note.id ? (
                                                        <>
                                                            <textarea value={scannerEditContent?.example} onChange={e => setScannerEditContent(prev => prev ? {...prev, example: e.target.value} : null)} className="w-full h-20 bg-black border border-yellow-500 p-1 rounded text-white text-xs outline-none mb-2" />
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={saveScannedNoteEdit} className="bg-green-600 text-white px-2 py-1 rounded text-[10px] uppercase font-bold">Save</button>
                                                                <button onClick={() => setScannerEditingId(null)} className="bg-red-600 text-white px-2 py-1 rounded text-[10px] uppercase font-bold">Cancel</button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="whitespace-pre-wrap leading-relaxed">{note.example || "-"}</div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* QUICK APPEND */}
                            <div className="pt-4 border-t border-gray-800">
                                <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase">Quick Append To Library:</p>
                                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                    {books.slice(0, 5).map(b => (
                                        <button key={b.id} onClick={() => saveScannedNotesToBook(b.id)} className="bg-gray-900 text-gray-400 text-[10px] px-3 py-2 rounded border border-gray-800 hover:border-purple-500 hover:text-white whitespace-nowrap transition-colors flex items-center gap-1">
                                            <Book size={10}/> {b.title.substring(0, 20)}...
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* --- LIBRARY SECTION --- */}
        <div className="flex flex-col md:flex-row gap-4 border-b border-gray-800 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {['All', 'Reading', 'To Read', 'Completed'].map(f => (
                    <button key={f} onClick={() => setFilter(f as any)} className={`px-4 py-2 rounded text-xs font-bold uppercase transition-colors whitespace-nowrap ${filter === f ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}>{f}</button>
                ))}
            </div>
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input type="text" placeholder="Search database..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-slate-900 border border-gray-800 rounded pl-10 pr-4 py-2 text-sm text-white focus:border-purple-500 outline-none" />
            </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {filteredBooks.map(book => (
                <div key={book.id} className="bg-slate-900 border border-gray-800 rounded-lg overflow-hidden transition-all hover:border-gray-700">
                    <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${book.status === 'Reading' ? 'bg-blue-900/20 text-blue-500' : book.status === 'Completed' ? 'bg-green-900/20 text-green-500' : 'bg-gray-800 text-gray-500'}`}><Book size={24} /></div>
                            <div className="flex-1">
                                {renamingBookId === book.id ? (
                                    <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                                        <input value={renameTitleContent} onChange={(e) => setRenameTitleContent(e.target.value)} className="bg-black border border-purple-500 text-white font-bold px-2 py-1 rounded outline-none w-full md:w-auto" autoFocus />
                                        <button onClick={() => saveBookRename(book.id)} className="text-green-500 hover:text-green-400 bg-green-900/20 p-1 rounded"><Save size={16}/></button>
                                        <button onClick={() => setRenamingBookId(null)} className="text-red-500 hover:text-red-400 bg-red-900/20 p-1 rounded"><X size={16}/></button>
                                    </div>
                                ) : (
                                    <div className="group flex items-center gap-2">
                                        <h4 className="text-lg font-bold text-white leading-tight cursor-pointer hover:text-purple-400 transition-colors" onClick={() => setActiveBookId(activeBookId === book.id ? null : book.id)}>{book.title}</h4>
                                        <button onClick={(e) => startRenamingBook(book, e)} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-white transition-opacity"><Pencil size={12} /></button>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1 uppercase font-mono">{book.author}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-gray-500 font-mono hidden md:inline">{book.neuralNotes?.length || 0} Insights</span>
                            
                            {/* NEW DELETE BUTTON */}
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteBook(book.id); }}
                                className="p-2 hover:bg-red-900/20 text-gray-600 hover:text-red-500 rounded transition-colors"
                                title="Delete Book"
                            >
                                <Trash2 size={16}/>
                            </button>

                            <button onClick={() => setActiveBookId(activeBookId === book.id ? null : book.id)} className="p-2 hover:bg-gray-800 rounded text-gray-400">
                                {activeBookId === book.id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                            </button>
                        </div>
                    </div>

                    {activeBookId === book.id && (
                        <div className="p-6 border-t border-gray-800 bg-slate-900">
                            <div className="mb-4">
                                {addingNoteBookId === book.id ? (
                                    <div className="bg-black border border-purple-500/50 p-4 rounded-lg animate-in fade-in">
                                        <h4 className="text-xs font-bold text-purple-400 uppercase mb-2">New Neural Note</h4>
                                        <div className="space-y-3">
                                            <input placeholder="Core Concept (The Rule)" value={newNoteForm.concept} onChange={(e) => setNewNoteForm({...newNoteForm, concept: e.target.value})} className="w-full bg-slate-900 border border-gray-700 p-2 text-white text-sm rounded outline-none focus:border-purple-500" />
                                            <input placeholder="Target Problem (The Pain)" value={newNoteForm.problem} onChange={(e) => setNewNoteForm({...newNoteForm, problem: e.target.value})} className="w-full bg-slate-900 border border-gray-700 p-2 text-white text-sm rounded outline-none focus:border-red-500" />
                                            <input placeholder="Execution Protocol (The Action)" value={newNoteForm.action} onChange={(e) => setNewNoteForm({...newNoteForm, action: e.target.value})} className="w-full bg-slate-900 border border-gray-700 p-2 text-white text-sm rounded outline-none focus:border-green-500" />
                                            <input placeholder="Real Life Example (The Proof)" value={newNoteForm.example} onChange={(e) => setNewNoteForm({...newNoteForm, example: e.target.value})} className="w-full bg-slate-900 border border-gray-700 p-2 text-white text-sm rounded outline-none focus:border-yellow-500" />
                                            <div className="flex gap-2">
                                                <select value={newNoteForm.category} onChange={(e) => setNewNoteForm({...newNoteForm, category: e.target.value})} className="bg-slate-900 border border-gray-700 p-2 text-white text-xs rounded outline-none">
                                                    <option value="MIND">Mind</option><option value="MONEY">Money</option><option value="POWER">Power</option><option value="HEALTH">Health</option><option value="SKILL">Skill</option>
                                                </select>
                                                <button onClick={saveManualNote} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded">Save Note</button>
                                                <button onClick={cancelAddingNote} className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-4 rounded">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => startAddingNote(book.id)} className="w-full py-2 border-2 border-dashed border-gray-800 rounded-lg text-xs font-bold text-gray-500 hover:border-purple-500 hover:text-purple-400 transition-colors flex items-center justify-center gap-2"><Plus size={14} /> Add Manual Note</button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {(book.neuralNotes || []).length === 0 && <p className="text-xs text-gray-600 italic">No neural data available.</p>}
                                {(book.neuralNotes || []).map((note, idx) => (
                                    <div key={note.id || idx} className="bg-black border border-gray-800 p-4 rounded-lg relative group transition-all hover:border-gray-600">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center gap-2"><div className="p-2 bg-slate-900 rounded-full border border-gray-800">{getIcon(note.iconCategory)}</div><div className="h-full w-[1px] bg-gray-800"></div></div>
                                            <div className="flex-1">
                                                {editingNoteId === note.id ? (
                                                    <div className="space-y-2">
                                                        <input value={editContent?.concept} onChange={(e) => setEditContent(prev => prev ? {...prev, concept: e.target.value} : null)} className="w-full bg-slate-900 border border-purple-500 p-2 text-white text-sm rounded" placeholder="Concept" />
                                                        <input value={editContent?.problem} onChange={(e) => setEditContent(prev => prev ? {...prev, problem: e.target.value} : null)} className="w-full bg-slate-900 border border-red-500 p-2 text-white text-sm rounded" placeholder="Target Problem" />
                                                        <input value={editContent?.action} onChange={(e) => setEditContent(prev => prev ? {...prev, action: e.target.value} : null)} className="w-full bg-slate-900 border border-green-500 p-2 text-white text-sm rounded" placeholder="Protocol" />
                                                        <input value={editContent?.example} onChange={(e) => setEditContent(prev => prev ? {...prev, example: e.target.value} : null)} className="w-full bg-slate-900 border border-yellow-500 p-2 text-white text-sm rounded" placeholder="Example" />
                                                        <div className="flex gap-2"><button onClick={() => saveEdit(book.id, note.id)} className="text-xs bg-wealth-green text-black px-3 py-1 rounded font-bold">Save</button><button onClick={() => setEditingNoteId(null)} className="text-xs text-gray-500 px-3 py-1">Cancel</button></div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="mb-3"><p className="text-xs text-gray-500 uppercase font-bold mb-1">Concept</p><p className="text-sm text-gray-200 font-medium leading-relaxed tracking-wide whitespace-pre-line">{note.concept}</p></div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div className="bg-red-900/10 border border-red-900/30 p-3 rounded h-full"><div className="flex items-center gap-2 mb-1"><AlertTriangle size={12} className="text-red-500" /><p className="text-[10px] text-red-400 uppercase font-bold">Context / Pain</p></div><p className="text-xs text-red-200 leading-snug whitespace-pre-line">{note.problem || "Generic Issue"}</p></div>
                                                            {note.example ? <div className="bg-yellow-900/10 border border-yellow-900/30 p-3 rounded h-full"><div className="flex items-center gap-2 mb-1"><Lightbulb size={12} className="text-yellow-500" /><p className="text-[10px] text-yellow-500 uppercase font-bold">Source Quote</p></div><p className="text-xs text-gray-300 italic leading-snug whitespace-pre-line">"{note.example}"</p></div> : <div className="bg-slate-900/50 border border-gray-800 p-3 rounded h-full flex items-center justify-center"><p className="text-[10px] text-gray-600 italic">No example provided.</p></div>}
                                                        </div>
                                                        <div className="mt-3 bg-green-900/10 border border-green-900/30 p-3 rounded"><div className="flex items-center gap-2 mb-2"><Crosshair size={12} className="text-green-500" /><p className="text-[10px] text-green-400 uppercase font-bold">Action Protocol</p></div><p className="text-xs text-green-100 leading-snug font-medium mb-3 whitespace-pre-line">{note.action}</p><button className="w-full py-2 bg-green-600 hover:bg-green-500 text-black font-bold rounded text-[10px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 transition-all transform hover:scale-[1.01] active:scale-[0.99]"><Zap size={12} fill="black" /> EXECUTE ACTION</button></div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEditing(note)} className="p-1.5 hover:bg-blue-900/30 text-gray-500 hover:text-blue-400 rounded"><Edit2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {filteredBooks.length === 0 && <p className="text-center text-gray-500 text-sm mt-8 italic">No books found matching your criteria.</p>}
        </div>
      </>
      )}
    </div>
  );
};
