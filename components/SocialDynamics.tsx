import React, { useState } from 'react';
import { Users, Eye, Mic, Heart, AlertCircle, CheckCircle } from 'lucide-react';

export const SocialDynamics: React.FC = () => {
  const [masculinityScore, setMasculinityScore] = useState(100);
  const [validationSeek, setValidationSeek] = useState<boolean | null>(null);
  const [eyeContact, setEyeContact] = useState<boolean | null>(null);
  const [auditComplete, setAuditComplete] = useState(false);

  const handleAudit = () => {
    let penalty = 0;
    if (validationSeek === true) penalty += 10;
    if (eyeContact === false) penalty += 5;
    
    setMasculinityScore(prev => Math.max(0, prev - penalty));
    setAuditComplete(true);
  };

  const resetAudit = () => {
    setValidationSeek(null);
    setEyeContact(null);
    setAuditComplete(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <header className="flex justify-between items-center border-b border-gray-800 pb-4">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
          Social Dynamics
        </h2>
        <div className="text-right">
             <p className="text-xs text-gray-400 font-mono">MASCULINITY SCORE</p>
             <p className={`text-2xl font-bold font-mono ${masculinityScore < 80 ? 'text-spartan-red' : 'text-wealth-green'}`}>
                {masculinityScore}/100
             </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-gray-800 p-6 rounded-lg">
             <h3 className="text-xl font-bold text-gray-200 uppercase mb-4">High Value Protocol</h3>
             <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-black rounded border border-gray-800">
                    <Eye className="text-blue-500" />
                    <div>
                        <p className="font-bold text-gray-300">Eye Contact</p>
                        <p className="text-xs text-gray-500">Maintain dominance. Don't look down.</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4 p-4 bg-black rounded border border-gray-800">
                    <Mic className="text-purple-500" />
                    <div>
                        <p className="font-bold text-gray-300">Deep Voice</p>
                        <p className="text-xs text-gray-500">Slow down. Remove filler words.</p>
                    </div>
                </div>
             </div>
        </div>

        <div className="bg-slate-900 border border-gray-800 p-6 rounded-lg">
             <h3 className="text-xl font-bold text-gray-200 uppercase mb-4">Family Protocol</h3>
             <div className="bg-emerald-900/20 border border-emerald-900 p-4 rounded mb-4">
                <p className="text-emerald-500 font-bold uppercase text-sm mb-1">Motto: Babar hok aday koro</p>
                <p className="text-gray-400 text-xs">Separate budget allocated for parents.</p>
             </div>
             <div className="bg-black p-4 rounded text-center">
                <Heart className="mx-auto text-spartan-red mb-2" size={32} />
                <p className="text-gray-300 font-bold">Call Mother</p>
                <p className="text-xs text-gray-500">Last call: 2 days ago</p>
             </div>
        </div>

        {/* Social Audit Interactive Module */}
        <div className="col-span-1 md:col-span-2 bg-slate-900 border border-spartan-red/30 p-6 rounded-lg">
             <div className="flex items-center gap-2 mb-6">
                <AlertCircle className="text-spartan-red" />
                <h3 className="text-xl font-bold text-gray-200 uppercase">Post-Interaction Audit</h3>
            </div>
            
            {!auditComplete ? (
                <div className="space-y-6">
                    <div>
                        <p className="text-gray-300 mb-2 font-bold">1. Did you seek validation from others?</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setValidationSeek(true)}
                                className={`px-4 py-2 rounded border ${validationSeek === true ? 'bg-red-600 text-white border-red-600' : 'border-gray-700 text-gray-400'}`}
                            >
                                Yes (Weakness)
                            </button>
                            <button 
                                onClick={() => setValidationSeek(false)}
                                className={`px-4 py-2 rounded border ${validationSeek === false ? 'bg-green-600 text-white border-green-600' : 'border-gray-700 text-gray-400'}`}
                            >
                                No (Stoic)
                            </button>
                        </div>
                    </div>
                     <div>
                        <p className="text-gray-300 mb-2 font-bold">2. Did you maintain strong eye contact?</p>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => setEyeContact(true)}
                                className={`px-4 py-2 rounded border ${eyeContact === true ? 'bg-green-600 text-white border-green-600' : 'border-gray-700 text-gray-400'}`}
                            >
                                Yes (Dominance)
                            </button>
                            <button 
                                onClick={() => setEyeContact(false)}
                                className={`px-4 py-2 rounded border ${eyeContact === false ? 'bg-red-600 text-white border-red-600' : 'border-gray-700 text-gray-400'}`}
                            >
                                No (Submission)
                            </button>
                        </div>
                    </div>
                    <button 
                        onClick={handleAudit}
                        disabled={validationSeek === null || eyeContact === null}
                        className="w-full bg-spartan-red text-white font-bold py-3 rounded disabled:opacity-50"
                    >
                        Log Audit
                    </button>
                </div>
            ) : (
                <div className="text-center py-6 animate-in fade-in">
                    <CheckCircle className="mx-auto text-gray-500 mb-2" size={48} />
                    <p className="text-xl font-bold text-white mb-2">Audit Logged.</p>
                    <p className="text-gray-400 text-sm">
                        {validationSeek ? "You lost points for seeking validation. Silence is power." : "Good. You maintained frame."}
                    </p>
                    <button onClick={resetAudit} className="mt-4 text-sm text-spartan-red underline">New Audit</button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
