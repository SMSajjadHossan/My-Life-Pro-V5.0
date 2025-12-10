import React, { useState, useEffect } from 'react';
import { Book, Plus, Brain, Sparkles, ChevronDown, ChevronUp, Search, X, Zap, DollarSign, Dumbbell, Target, Upload, FileText, Youtube, Image as ImageIcon, Save, Edit2, FileType, Pencil, Loader, CheckCircle, Lightbulb, Play, AlertTriangle, Crosshair, ArrowRight, Library, Scroll, Table, Music, FileSpreadsheet, Cloud, Download, RefreshCw, Settings, HardDrive, Trash2 } from 'lucide-react';
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
  const [scanFileBase64, setScanFileBase64] = useState<string | null>(null);
  const [scanFileType, setScanFileType] = useState<string>(''); // Mime type
  const [scanFileName, setScanFileName] = useState<string>('');
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState(''); // For loading animation
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

  // --- DATA CORE (SYNC) STATE ---
  const [showDataCore, setShowDataCore] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  // --- HANDLERS ---

  const handleDownloadBackup = () => {
      const content = JSON.stringify(books, null, 2);
      const blob = new Blob([content], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `neural_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setSyncMsg("Local Backup Generated.");
  };

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

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const parsed = JSON.parse(event.target?.result as string);
              if (Array.isArray(parsed)) {
                  if(confirm(`Restore ${parsed.length} books? Current data will be replaced.`)) {
                      setBooks(parsed);
                      setSyncMsg("System Restored Successfully.");
                  }
              } else {
                  alert("Invalid Format");
              }
          } catch(e) {
              alert("Corrupt File");
          }
      };
      reader.readAsText(file);
  };

  // ... (Scan Logic and Other Handlers remain same) ...
  const simulateScanStages = () => {
      const stages = [
          "Initializing Neural Handshake...",
          "Detecting Media Type (Video/Song/Doc)...",
          "Fetching Script & Lyrics (Exact Source)...",
          "Analyzing Raw Emotion & Meaning...",
          "Translating (Jemon Ashe Temon)...",
          "Generating Executive Brief...",
          "Compiling Excel-Format Data..."
      ];
      let i = 0;
      setScanStage(stages[0]);
      const interval = setInterval(() => {
          i++;
          if (i < stages.length) setScanStage(stages[i]);
          else clearInterval(interval);
      }, 1000); 
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
        scanMode === 'FILE' ? scanFileType : 'text/plain'
    );
    
    clearInterval(stageInterval);

    try {
        let cleanJson = resultJson;
        // Strip markdown if present
        if (cleanJson.includes("```json")) {
            cleanJson = cleanJson.replace(/```json/g, "").replace(/```/g, "");
        } else if (cleanJson.includes("```")) {
            cleanJson = cleanJson.replace(/```/g, "");
        }

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
        
        const generatedTitle = parsed.title || (scanMode === 'FILE' ? scanFileName : (scanInputText.substring(0, 30) || "Scanned Content"));
        setScanResultTitle(generatedTitle);
        setScanSummary(parsed.summary || "");
        setScannedNotes(newNotes);
    } catch (e) {
        alert("Neural Decode Failed. The AI response was not valid JSON. Please try again.");
        console.error("JSON Parse Error", e, resultJson);
    }
    setIsScanning(false);
    setScanStage('');
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
            <button onClick={() => setShowDataCore(true)} className="px-3 py-2 rounded text-xs font-bold uppercase flex items-center gap-1 bg-slate-900 text-blue-400 border border-blue-900/50 hover:bg-blue-900/20 hover:border-blue-500 transition-all shadow-[0_0_10px_rgba(41,121,255,0.2)]">
                <Cloud size={14}/> Data Core
            </button>
            <button onClick={() => setActiveTab('LIBRARY')} className={`px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 transition-all ${activeTab === 'LIBRARY' ? 'bg-white text-black' : 'bg-slate-900 text-gray-400 hover:text-white'}`}><Library size={14} /> Library</button>
            <button onClick={() => setActiveTab('CODEX')} className={`px-4 py-2 rounded text-xs font-bold uppercase flex items-center gap-2 transition-all ${activeTab === 'CODEX' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-gray-400 hover:text-white'}`}><Scroll size={14} /> The Codex</button>
        </div>
      </header>

      {/* DATA CORE MODAL */}
      {showDataCore && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-slate-950 border border-blue-500/50 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                  <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                          <div>
                              <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                  <Cloud className="text-blue-500" /> Data Core Uplink
                              </h3>
                              <p className="text-xs text-blue-400 font-mono mt-1">SECURE SYNCHRONIZATION PROTOCOL</p>
                          </div>
                          <button onClick={() => setShowDataCore(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
                      </div>

                      {/* Status Display */}
                      <div className="bg-black border border-gray-800 rounded p-4 mb-6 text-center">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">LOCAL STATUS</p>
                          <p className={`text-sm font-mono font-bold ${syncMsg ? 'text-green-500' : 'text-gray-300'}`}>
                              {syncMsg || 'SYSTEM READY'}
                          </p>
                      </div>

                      {/* ACTIONS */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          {/* Local Backup */}
                          <div className="col-span-2 p-3 bg-slate-900/50 border border-gray-700 rounded flex justify-between items-center">
                              <div>
                                  <p className="text-white font-bold text-sm flex items-center gap-2"><HardDrive size={14}/> Titanium Backup</p>
                                  <p className="text-[10px] text-gray-500">Save complete JSON to device</p>
                              </div>
                              <button onClick={handleDownloadBackup} className="bg-white text-black px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-gray-200">
                                  Download
                              </button>
                          </div>

                          <div className="col-span-2 p-3 bg-slate-900/50 border border-gray-700 rounded flex justify-between items-center">
                              <div>
                                  <p className="text-white font-bold text-sm flex items-center gap-2"><Upload size={14}/> Restore Data</p>
                                  <p className="text-[10px] text-gray-500">Load JSON backup</p>
                              </div>
                              <label className="bg-gray-800 text-white px-3 py-1.5 rounded text-xs font-bold uppercase hover:bg-gray-700 cursor-pointer border border-gray-600">
                                  Select File
                                  <input type="file" onChange={handleRestoreBackup} className="hidden" accept=".json"/>
                              </label>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'CODEX' ? renderCodex() : (
      <>
        {/* --- EXPERT NEURAL SCANNER --- */}
        <div className="bg-gradient-to-br from-slate-900 to-purple-950/20 border border-purple-500/30 p-6 rounded-lg relative overflow-hidden shadow-lg shadow-purple-900/10">
            
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="text-purple-400 animate-pulse" />
                <h3 className="text-xl font-bold text-white uppercase">Neural Scanner (Super Expert)</h3>
            </div>

            {/* Scanner Tabs */}
            <div className="flex gap-2 mb-4">
                <button onClick={() => setScanMode('TEXT')} className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all ${scanMode === 'TEXT' ? 'bg-purple-600 text-white' : 'bg-black border border-gray-700 text-gray-400'}`}><Youtube size={14}/> YouTube / Text</button>
                <button onClick={() => setScanMode('FILE')} className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase transition-all ${scanMode === 'FILE' ? 'bg-purple-600 text-white' : 'bg-black border border-gray-700 text-gray-400'}`}><Upload size={14}/> File</button>
            </div>

            {/* Input Area */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    {scanMode === 'TEXT' ? (
                        <textarea 
                            value={scanInputText}
                            onChange={(e) => setScanInputText(e.target.value)}
                            placeholder="Paste YouTube Link (Song/Talk) or Text here. The AI will extract exact Script/Lyrics and translate line-by-line (Jemon Ashe Temon)."
                            className="w-full h-32 bg-black/80 border border-gray-700 p-3 text-white rounded focus:border-purple-500 outline-none font-mono text-xs"
                        />
                    ) : (
                        <div className="border-2 border-dashed border-gray-700 rounded h-32 flex flex-col items-center justify-center bg-black/50 hover:border-purple-500 transition-colors relative group">
                            {scanFileBase64 ? (
                                <div className="text-center p-4">
                                    {scanFileType.includes('image') ? <div className="relative h-20 w-full mb-2"><img src={scanFileBase64} alt="Preview" className="h-full w-full object-contain opacity-70" /></div> : <FileType size={48} className="mx-auto text-purple-400 mb-2" />}
                                    <p className="text-xs font-bold text-white">{scanFileName}</p>
                                </div>
                            ) : (
                                <div className="text-center pointer-events-none"><Upload className="mx-auto text-gray-500 mb-2" /><p className="text-xs text-gray-500">Drop File</p></div>
                            )}
                            <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    )}
                    
                    {/* SCANNING OVERLAY */}
                    {isScanning && (
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center rounded z-10">
                            <Loader className="animate-spin text-purple-500 mb-2" size={32} />
                            <p className="text-purple-400 font-mono font-bold text-xs uppercase animate-pulse">{scanStage}</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 justify-end">
                    <button 
                        onClick={executeNeuralScan}
                        disabled={isScanning}
                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded uppercase text-xs tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 h-12 w-full md:w-auto shadow-lg shadow-purple-900/50"
                    >
                        {isScanning ? <Brain className="animate-spin"/> : <Zap size={16}/>}
                        {isScanning ? "PROCESSING..." : "DEEP SCAN"}
                    </button>
                    {scanMode === 'FILE' && scanFileName && <button onClick={resetScanner} className="text-[10px] text-gray-500 hover:text-red-500 uppercase font-bold">Clear File</button>}
                </div>
            </div>

            {/* Scan Results (Buffer) */}
            {scannedNotes.length > 0 && (
                <div className="mt-6 bg-black/80 border border-purple-500/30 p-4 rounded-lg animate-in slide-in-from-top-4">
                    <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="text-green-500" size={16}/>
                            <h4 className="text-sm font-bold text-purple-400 uppercase">Extraction Complete</h4>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={createBookFromScan} className="text-xs bg-wealth-green text-black px-4 py-2 rounded font-bold uppercase hover:bg-emerald-400 flex items-center gap-1"><Save size={14}/> Create New Entry</button>
                            <button onClick={resetScanner} className="text-gray-500 hover:text-white"><X size={14}/></button>
                        </div>
                    </div>

                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Entry Title (Editable)</label>
                            <div className="flex items-center gap-2">
                                <input value={scanResultTitle} onChange={(e) => setScanResultTitle(e.target.value)} className="flex-1 bg-slate-900 border border-purple-500/50 p-2 text-white font-bold rounded focus:border-purple-500 outline-none" />
                                <Pencil size={14} className="text-gray-500" />
                            </div>
                        </div>
                        {/* Executive Brief Editor */}
                        {(scanSummary || isEditingSummary) && (
                            <div className="bg-purple-900/10 border border-purple-900/50 rounded-lg relative overflow-hidden flex flex-col max-h-96 group">
                                <div className="absolute top-0 right-0 p-2 opacity-20 pointer-events-none"><Brain size={48} className="text-purple-500"/></div>
                                <div className="flex items-center justify-between p-4 border-b border-purple-900/30 bg-purple-900/20">
                                    <div className="flex items-center gap-2">
                                        <Brain size={16} className="text-purple-400" />
                                        <h4 className="text-xs font-bold text-purple-200 uppercase">Executive Brief (SITREP)</h4>
                                    </div>
                                    <button onClick={() => {
                                        if (isEditingSummary) setScanSummary(tempSummary);
                                        else setTempSummary(scanSummary);
                                        setIsEditingSummary(!isEditingSummary);
                                    }} className="text-xs text-purple-400 hover:text-white uppercase font-bold">
                                        {isEditingSummary ? 'Save Brief' : 'Edit Brief'}
                                    </button>
                                </div>
                                <div className="p-4 overflow-y-auto custom-scrollbar">
                                    {isEditingSummary ? (
                                        <textarea 
                                            value={tempSummary}
                                            onChange={(e) => setTempSummary(e.target.value)}
                                            className="w-full h-40 bg-black/50 border border-purple-500/50 text-white p-2 rounded text-sm font-mono outline-none"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-300 italic leading-relaxed whitespace-pre-line">"{scanSummary}"</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* EXCEL-LIKE DATA GRID (EDITABLE) */}
                    <div className="flex justify-between items-center mb-2 px-2">
                        <div className="flex items-center gap-2">
                            <FileSpreadsheet size={16} className="text-green-500"/>
                            <span className="text-xs text-gray-400 uppercase font-bold">Data Matrix View (Editable)</span>
                        </div>
                        <button onClick={addManualScannedNote} className="text-[10px] bg-blue-600/20 text-blue-400 border border-blue-600 px-2 py-1 rounded font-bold uppercase hover:bg-blue-600 hover:text-white transition-all">+ Add Row</button>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead className="bg-slate-900 text-gray-400 font-bold uppercase tracking-wider border-b border-gray-600">
                                <tr>
                                    <th className="p-3 border-r border-gray-700 w-[23%]"><Table size={14} className="inline mr-1 mb-0.5"/> Concept</th>
                                    <th className="p-3 border-r border-gray-700 w-[23%]"><AlertTriangle size={14} className="inline mr-1 mb-0.5 text-red-500"/> Problem</th>
                                    <th className="p-3 border-r border-gray-700 w-[23%] bg-green-900/20 text-green-400"><Crosshair size={14} className="inline mr-1 mb-0.5"/> Action</th>
                                    <th className="p-3 border-r border-gray-700 w-[23%]"><Lightbulb size={14} className="inline mr-1 mb-0.5 text-yellow-500"/> Example</th>
                                    <th className="p-3 w-[8%] text-center">Cmd</th>
                                </tr>
                            </thead>
                            <tbody className="bg-black/50 text-gray-300 font-mono">
                                {scannedNotes.map((note, idx) => (
                                    <tr key={note.id || idx} className={`border-b border-gray-800 last:border-0 ${scannerEditingId === note.id ? 'bg-blue-900/10' : 'hover:bg-slate-900/50'}`}>
                                        {scannerEditingId === note.id ? (
                                            <>
                                                <td className="p-2 border-r border-gray-700 align-top">
                                                    <textarea value={scannerEditContent?.concept} onChange={e => setScannerEditContent(prev => prev ? {...prev, concept: e.target.value} : null)} className="w-full bg-slate-950 border border-blue-500 rounded p-1 text-white text-xs h-20 outline-none resize-none" />
                                                </td>
                                                <td className="p-2 border-r border-gray-700 align-top">
                                                    <textarea value={scannerEditContent?.problem} onChange={e => setScannerEditContent(prev => prev ? {...prev, problem: e.target.value} : null)} className="w-full bg-slate-950 border border-red-500 rounded p-1 text-white text-xs h-20 outline-none resize-none" />
                                                </td>
                                                <td className="p-2 border-r border-gray-700 align-top">
                                                    <textarea value={scannerEditContent?.action} onChange={e => setScannerEditContent(prev => prev ? {...prev, action: e.target.value} : null)} className="w-full bg-slate-950 border border-green-500 rounded p-1 text-white text-xs h-20 outline-none resize-none" />
                                                </td>
                                                <td className="p-2 border-r border-gray-700 align-top">
                                                    <textarea value={scannerEditContent?.example} onChange={e => setScannerEditContent(prev => prev ? {...prev, example: e.target.value} : null)} className="w-full bg-slate-950 border border-yellow-500 rounded p-1 text-white text-xs h-20 outline-none resize-none" />
                                                </td>
                                                <td className="p-2 align-middle text-center">
                                                    <div className="flex flex-col gap-2">
                                                        <button onClick={saveScannedNoteEdit} className="text-green-500 hover:text-white bg-green-900/20 p-1.5 rounded"><Save size={14}/></button>
                                                        <button onClick={() => setScannerEditingId(null)} className="text-red-500 hover:text-white bg-red-900/20 p-1.5 rounded"><X size={14}/></button>
                                                    </div>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="p-3 border-r border-gray-700 align-top whitespace-pre-line leading-relaxed border-l-4 border-l-purple-500/0 hover:border-l-purple-500 transition-all">
                                                    {note.concept}
                                                </td>
                                                <td className="p-3 border-r border-gray-700 align-top text-red-300 whitespace-pre-line leading-relaxed bg-red-950/10">
                                                    {note.problem || "-"}
                                                </td>
                                                <td className="p-3 border-r border-gray-700 align-top bg-green-900/10 text-green-300 font-bold whitespace-pre-line leading-relaxed">
                                                    {note.action}
                                                </td>
                                                <td className="p-3 border-r border-gray-700 align-top text-yellow-200/80 italic whitespace-pre-line leading-relaxed bg-yellow-900/5">
                                                    {note.example || "-"}
                                                </td>
                                                <td className="p-2 align-top text-center">
                                                    <div className="flex flex-col gap-2 opacity-0 hover:opacity-100 transition-opacity">
                                                        <button onClick={() => startEditingScannedNote(note)} className="text-blue-500 hover:text-blue-300 bg-blue-900/20 p-1.5 rounded w-full flex justify-center"><Edit2 size={12}/></button>
                                                    </div>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-xs text-gray-500 mb-2 font-bold uppercase">Or append to existing topic:</p>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {books.slice(0, 5).map(b => (
                                <button key={b.id} onClick={() => saveScannedNotesToBook(b.id)} className="bg-gray-800 text-gray-300 text-[10px] px-3 py-2 rounded border border-gray-700 hover:border-purple-500 hover:text-white whitespace-nowrap transition-colors">
                                    {b.title.substring(0, 20)}...
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
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