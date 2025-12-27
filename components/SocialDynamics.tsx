
import React, { useState } from 'react';
import { Users, Eye, Mic, Heart, AlertCircle, CheckCircle, Shield, Award, TrendingUp, TrendingDown, Terminal, X, Zap } from 'lucide-react';

export const SocialDynamics: React.FC = () => {
  const [masculinityScore, setMasculinityScore] = useState(100);
  const [auditLogs, setAuditLogs] = useState<{id: string, text: string, change: number, date: string}[]>([]);
  const [validationSeek, setValidationSeek] = useState<boolean | null>(null);
  const [eyeContact, setEyeContact] = useState<boolean | null>(null);
  const [auditComplete, setAuditComplete] = useState(false);

  const handleAudit = () => {
    let penalty = 0;
    let desc = "Audit Complete: ";
    if (validationSeek === true) { penalty += 15; desc += "Validation seeking detected (-15). "; }
    if (eyeContact === false) { penalty += 10; desc += "Weak eye contact (-10). "; }
    if (penalty === 0) desc = "Elite Frame Maintained (+5 bonus).";

    const change = penalty > 0 ? -penalty : 5;
    setMasculinityScore(prev => Math.min(100, Math.max(0, prev + change)));
    setAuditLogs([{id: Date.now().toString(), text: desc, change, date: new Date().toISOString()}, ...auditLogs]);
    setAuditComplete(true);
  };

  const resetAudit = () => {
    setValidationSeek(null);
    setEyeContact(null);
    setAuditComplete(false);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-7xl mx-auto pb-40">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-8 gap-6">
        <div>
            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic text-glow-purple flex items-center gap-4">
                <div className="p-3 bg-cyber-purple text-white rounded-2xl shadow-[0_0_20px_rgba(213,0,249,0.3)]"><Users size={28}/></div>
                Social <span className="text-cyber-purple">Forensics</span>
            </h2>
            <p className="text-[10px] text-gray-500 font-mono mt-3 uppercase tracking-[0.5em] font-black">Reputation Management v4.2</p>
        </div>
        <div className="bg-black/60 border border-white/5 p-6 rounded-[2rem] flex items-center gap-10 shadow-2xl">
             <div className="text-center">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Reputation Score</p>
                <p className={`text-4xl font-mono font-black ${masculinityScore < 80 ? 'text-spartan-red' : 'text-wealth-green'}`}>
                    {masculinityScore}<span className="text-sm">/100</span>
                </p>
             </div>
             <div className="w-px h-12 bg-white/5"></div>
             <div className="text-center">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Social Tier</p>
                <p className="text-xl font-black text-white uppercase tracking-tighter">{masculinityScore > 90 ? 'SOVEREIGN' : 'TITANIUM'}</p>
             </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            {/* AUDIT MODULE */}
            <div className="glass-panel p-10 rounded-[3rem] border border-white/5 bg-black/40 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12 transition-transform duration-1000"><Shield size={200} className="text-cyber-purple" /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-spartan-red/10 text-spartan-red rounded-2xl"><AlertCircle size={24}/></div>
                        <h3 className="text-xl font-black text-white uppercase italic">Post-Interaction Audit</h3>
                    </div>
                    
                    {!auditComplete ? (
                        <div className="space-y-8">
                            <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                                <p className="text-sm font-bold text-gray-200 mb-6 uppercase tracking-wider">01. Neural Triage: Did you seek validation or attention?</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setValidationSeek(true)} className={`py-4 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${validationSeek === true ? 'bg-spartan-red border-spartan-red text-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}>Weakness (Yes)</button>
                                    <button onClick={() => setValidationSeek(false)} className={`py-4 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${validationSeek === false ? 'bg-wealth-green border-wealth-green text-black shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}>Stoic (No)</button>
                                </div>
                            </div>
                             <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                                <p className="text-sm font-bold text-gray-200 mb-6 uppercase tracking-wider">02. Optical Frame: Did you maintain aggressive eye contact?</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setEyeContact(true)} className={`py-4 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${eyeContact === true ? 'bg-wealth-green border-wealth-green text-black shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}>Dominance (Yes)</button>
                                    <button onClick={() => setEyeContact(false)} className={`py-4 rounded-2xl border-2 transition-all font-black uppercase text-[10px] tracking-widest ${eyeContact === false ? 'bg-spartan-red border-spartan-red text-white shadow-xl' : 'bg-white/5 border-white/5 text-gray-500'}`}>Submission (No)</button>
                                </div>
                            </div>
                            <button onClick={handleAudit} disabled={validationSeek === null || eyeContact === null} className="w-full py-6 bg-cyber-purple text-white font-black uppercase tracking-[0.4em] rounded-[2rem] shadow-3xl hover:scale-[1.01] transition-all disabled:opacity-20">Log Forensic Audit</button>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-black/60 rounded-[3rem] border border-cyber-purple/20 animate-in zoom-in-95">
                            <div className="w-20 h-20 bg-cyber-purple/10 text-cyber-purple rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(213,0,249,0.2)]"><CheckCircle size={40}/></div>
                            <p className="text-2xl font-display font-black text-white uppercase italic mb-2">Audit Processed</p>
                            <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-10">Neural Vectors Updated in Sovereign Ledger</p>
                            <button onClick={resetAudit} className="px-12 py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-110 transition-all shadow-xl">Start New Audit</button>
                        </div>
                    )}
                </div>
            </div>

            {/* PROTOCOLS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-[2.5rem] bg-black/40 border border-white/5 flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-6 flex items-center gap-3"><Eye size={16} className="text-blue-500"/> Subliminal Dominance</h4>
                        <div className="space-y-3">
                            {['Maintain 70/30 eye contact ratio.', 'Never look down during a transition.', 'Speak in a chest-resonant frequency.', 'Use slow, deliberate movements.'].map(p => (
                                <div key={p} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl text-[11px] font-bold text-gray-300">{p}</div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] bg-black/40 border border-white/5">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-6 flex items-center gap-3"><Heart size={16} className="text-spartan-red"/> Family Protocol</h4>
                    <div className="bg-spartan-red/5 border border-spartan-red/20 p-6 rounded-3xl text-center">
                        <p className="text-lg font-black text-white italic mb-2">"Babar hok aday koro."</p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest">Priority 0: Financial Duty to Parents</p>
                        <div className="mt-8 p-4 bg-black rounded-2xl flex justify-between items-center border border-white/5">
                            <span className="text-[10px] font-black text-gray-500 uppercase">Last Contact</span>
                            <span className="text-xs font-mono font-black text-white">48h Ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* LOGS SIDEBAR */}
        <div className="space-y-8">
            <div className="glass-panel p-8 rounded-[3rem] bg-black/40 border border-white/5 h-full">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/5 text-gray-500 rounded-2xl"><Terminal size={20}/></div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Audit History</h3>
                </div>
                <div className="space-y-4">
                    {auditLogs.length === 0 ? (
                        <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl opacity-20"><p className="text-[10px] font-mono italic">No logs in buffer.</p></div>
                    ) : (
                        auditLogs.map(log => (
                            <div key={log.id} className="p-5 bg-black/60 border border-white/5 rounded-2xl relative overflow-hidden group">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${log.change > 0 ? 'bg-wealth-green' : 'bg-spartan-red'}`}></div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[9px] font-mono text-gray-600">{new Date(log.date).toLocaleTimeString()}</span>
                                    <span className={`text-[9px] font-black uppercase ${log.change > 0 ? 'text-wealth-green' : 'text-spartan-red'}`}>
                                        {log.change > 0 ? '+' : ''}{log.change}
                                    </span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-300 leading-tight">{log.text}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
