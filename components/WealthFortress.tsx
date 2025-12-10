import React, { useState, useMemo, useEffect } from 'react';
import { FinancialState, BusinessEntity, Transaction, Asset, LoanLiability, MonthlyBudgetSnapshot, MoneyMindsetLog } from '../types';
import { INFLATION_RATE_BD, BUSINESS_STAGES, WEALTH_TIMELINE, SECRETS_OF_RICH_7, FLASH_CARDS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Bar, BarChart, PieChart, Pie, Cell, Legend, ReferenceLine } from 'recharts';
import { Activity, Crown, Building2, Rocket, Shield, Wallet, Save, Trash2, Edit3, LayoutDashboard, Plus, TrendingDown, AlertCircle, Settings, RefreshCw, X, ArrowUpRight, ArrowDownRight, TrendingUp, BookOpen, FileText, ClipboardList, Split, Landmark, Cloud, Upload, Download, HardDrive, DollarSign, Briefcase, Zap, Calculator, ArrowRight, Target, CheckCircle, Brain, Lock, Play, Pause, ChevronLeft, ChevronRight, Lightbulb, PiggyBank, GraduationCap, Scale, ListPlus } from 'lucide-react';

interface Props {
  data: FinancialState;
  updateData: (newData: FinancialState) => void;
}

// --- JOURNAL TYPES ---
interface JournalData {
    commitments: { id: string; name: string; details: string; completed: boolean }[];
    dailyProtocol: { id: string; task: string; completed: boolean }[];
    receivables: { id: string; name: string; status: 'PENDING' | 'RECEIVED' }[];
    directives: { id: string; title: string; desc: string }[];
}

const INITIAL_JOURNAL_DATA: JournalData = {
    commitments: [
        { id: '1', name: 'IDLC (Bkash)', details: 'Auto-Debit: 500 BDT', completed: true },
        { id: '2', name: 'Universal Pension', details: '500 BDT (10 Year Lock)', completed: false }
    ],
    dailyProtocol: [
        { id: '1', task: 'Daily Accounting', completed: false },
        { id: '2', task: 'Daily Learning', completed: false }
    ],
    receivables: [
        { id: '1', name: 'Mess Refund Money', status: 'PENDING' }
    ],
    directives: [
        { id: '1', title: 'Multiple Income', desc: 'One stream is too close to zero. Diversify or die.' },
        { id: '2', title: 'Live Like Poor', desc: 'Invest the surplus. Do not upgrade lifestyle until assets pay for it.' }
    ]
};

export const WealthFortress: React.FC<Props> = ({ data, updateData }) => {
  const [activeTab, setActiveTab] = useState<'COMMAND' | 'JOURNAL' | 'PORTFOLIO' | 'OFFENSE' | 'FIRE' | 'AUDIT' | 'BLUEPRINT'>('COMMAND');
  const [fireChartMode, setFireChartMode] = useState<'WEALTH' | 'VELOCITY'>('WEALTH');

  // --- GOOGLE DRIVE SYNC STATE ---
  const [showSync, setShowSync] = useState(false);
  const [syncState, setSyncState] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [syncMsg, setSyncMsg] = useState('');
  const [gdriveClientId, setGdriveClientId] = useState(() => localStorage.getItem('gdrive_client_id') || '');
  const [tokenClient, setTokenClient] = useState<any>(null);

  // --- REALITY JOURNAL STATE (DYNAMIC) ---
  const [journalData, setJournalData] = useState<JournalData>(() => {
      const saved = localStorage.getItem('wealth_journal_data_v2');
      return saved ? JSON.parse(saved) : INITIAL_JOURNAL_DATA;
  });

  // Local state for adding new items
  const [newCommitment, setNewCommitment] = useState({ name: '', details: '' });
  const [newProtocol, setNewProtocol] = useState('');
  const [newReceivable, setNewReceivable] = useState('');
  const [newDirective, setNewDirective] = useState({ title: '', desc: '' });
  const [showAddForms, setShowAddForms] = useState<Record<string, boolean>>({});

  useEffect(() => {
      localStorage.setItem('wealth_journal_data_v2', JSON.stringify(journalData));
  }, [journalData]);

  // --- JOURNAL HANDLERS ---
  const toggleCommitment = (id: string) => {
      setJournalData(prev => ({
          ...prev, commitments: prev.commitments.map(c => c.id === id ? { ...c, completed: !c.completed } : c)
      }));
  };
  const addCommitment = () => {
      if (!newCommitment.name) return;
      setJournalData(prev => ({
          ...prev, commitments: [...prev.commitments, { id: Date.now().toString(), name: newCommitment.name, details: newCommitment.details, completed: false }]
      }));
      setNewCommitment({ name: '', details: '' });
  };
  const deleteCommitment = (id: string) => setJournalData(prev => ({ ...prev, commitments: prev.commitments.filter(c => c.id !== id) }));

  const toggleProtocol = (id: string) => {
      setJournalData(prev => ({
          ...prev, dailyProtocol: prev.dailyProtocol.map(p => p.id === id ? { ...p, completed: !p.completed } : p)
      }));
  };
  const addProtocol = () => {
      if (!newProtocol) return;
      setJournalData(prev => ({
          ...prev, dailyProtocol: [...prev.dailyProtocol, { id: Date.now().toString(), task: newProtocol, completed: false }]
      }));
      setNewProtocol('');
  };
  const deleteProtocol = (id: string) => setJournalData(prev => ({ ...prev, dailyProtocol: prev.dailyProtocol.filter(p => p.id !== id) }));

  const toggleReceivable = (id: string) => {
      setJournalData(prev => ({
          ...prev, receivables: prev.receivables.map(r => r.id === id ? { ...r, status: r.status === 'PENDING' ? 'RECEIVED' : 'PENDING' } : r)
      }));
  };
  const addReceivable = () => {
      if (!newReceivable) return;
      setJournalData(prev => ({
          ...prev, receivables: [...prev.receivables, { id: Date.now().toString(), name: newReceivable, status: 'PENDING' }]
      }));
      setNewReceivable('');
  };
  const deleteReceivable = (id: string) => setJournalData(prev => ({ ...prev, receivables: prev.receivables.filter(r => r.id !== id) }));

  const addDirective = () => {
      if (!newDirective.title) return;
      setJournalData(prev => ({
          ...prev, directives: [...prev.directives, { id: Date.now().toString(), title: newDirective.title, desc: newDirective.desc }]
      }));
      setNewDirective({ title: '', desc: '' });
  };
  const deleteDirective = (id: string) => setJournalData(prev => ({ ...prev, directives: prev.directives.filter(d => d.id !== id) }));

  const toggleAddForm = (key: string) => setShowAddForms(prev => ({...prev, [key]: !prev[key]}));

  // --- 1. EXPERT METRICS ENGINE ---
  const metrics = useMemo(() => {
    const safeAssets = data?.assets || [];
    const safeLoans = data?.loans || [];
    const safeBiz = data?.businesses || [];
    const safeTx = data?.transactions || [];
    const safeLogs = data?.mindsetLogs || [];

    const totalAssets = safeAssets.reduce((acc, curr) => acc + (curr?.value || 0), 0);
    const totalDebt = safeLoans.reduce((acc, curr) => acc + (curr?.amount || 0), 0);
    const businessValuation = safeBiz.reduce((acc, curr) => acc + (curr?.valuation || 0), 0);
    
    const liquidCash = (data?.bankA || 0) + (data?.bankB || 0) + (data?.bankC || 0);
    const grossNetWorth = totalAssets + liquidCash + businessValuation;
    const realNetWorth = grossNetWorth - totalDebt;

    // Inflation Impact Calculation
    const dailyInflationLoss = (liquidCash * INFLATION_RATE_BD) / 365;

    // Monthly Flow
    const currentMonth = new Date().toISOString().slice(0, 7);
    const thisMonthTx = safeTx.filter(t => t?.date?.startsWith(currentMonth));
    const income = thisMonthTx.filter(t => t.category === 'Income').reduce((a, t) => a + (t.amount || 0), 0);
    const expenses = thisMonthTx.filter(t => t.category !== 'Income').reduce((a, t) => a + Math.abs(t.amount || 0), 0);
    
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const burnRate = expenses > 0 ? expenses : 15000; 
    const runway = burnRate > 0 ? liquidCash / burnRate : 0;

    const weightedRoiSum = safeAssets.reduce((acc, curr) => acc + (curr.value * (curr.roi || 0)), 0);
    const weightedAvgRoi = totalAssets > 0 ? weightedRoiSum / totalAssets : 0;

    const totalGuiltFreeSpent = safeLogs.reduce((acc, curr) => acc + (curr.guiltFreeSpent || 0), 0);
    const guiltFreeBudget = income * 0.10; 

    return { totalAssets, totalDebt, businessValuation, liquidCash, realNetWorth, grossNetWorth, income, expenses, savingsRate, burnRate, runway, weightedAvgRoi, guiltFreeBudget, totalGuiltFreeSpent, dailyInflationLoss };
  }, [data]);

  // --- 2. STATE MANAGEMENT ---
  const [txForm, setTxForm] = useState<{
    id?: string;
    date: string;
    type: 'Income' | 'Expense';
    amount: string;
    desc: string;
    category: string;
    bank: 'A' | 'B' | 'C';
    autoDistribute: boolean;
  }>({ 
      date: new Date().toISOString().split('T')[0], 
      type: 'Expense', 
      amount: '', 
      desc: '', 
      category: 'Needs', 
      bank: 'C',
      autoDistribute: true 
  });
  
  const [isEditingTx, setIsEditingTx] = useState(false);
  const [assetForm, setAssetForm] = useState<{ id?: string; name: string; value: string; type: string; roi: string }>({ name: '', value: '', type: 'Stock', roi: '' });
  const [isEditingAsset, setIsEditingAsset] = useState(false);
  const [loanForm, setLoanForm] = useState<{ id?: string; purpose: string; amount: string; interest: string; emi: string }>({ purpose: '', amount: '', interest: '', emi: '' });
  const [isEditingLoan, setIsEditingLoan] = useState(false);
  const [bizForm, setBizForm] = useState<{ id?: string; name: string; revenue: string; valuation: string; stage: number }>({ name: '', revenue: '', valuation: '', stage: 1 });
  const [isEditingBiz, setIsEditingBiz] = useState(false);
  const [snapshotForm, setSnapshotForm] = useState<{ id?: string; month: string; income: string; dependents: string; essential: string; nonEssential: string; notes: string; }>({ month: new Date().toISOString().slice(0, 7), income: '', dependents: '0', essential: '', nonEssential: '', notes: '' });
  const [isEditingSnapshot, setIsEditingSnapshot] = useState(false);
  const [journalForm, setJournalForm] = useState<MoneyMindsetLog>({ id: '', date: new Date().toISOString().split('T')[0], patternProblem: '', identifyTrigger: '', solveAction: '', guiltFreeSpent: 0, notes: '' });
  const [fireInputs, setFireInputs] = useState({ monthlySip: '5000', lumpsum: '100000', inflation: '8.5', returnRate: '12', target: '10000000', years: '15' });
  const [showReconcile, setShowReconcile] = useState(false);
  const [reconcileValues, setReconcileValues] = useState({ A: '', B: '', C: '' });

  // --- 3. SYNC HANDLERS ---
  useEffect(() => { localStorage.setItem('gdrive_client_id', gdriveClientId); }, [gdriveClientId]);

  const initGapi = () => {
      if (!(window as any).google || !(window as any).gapi) {
          setSyncMsg("System Error: Google API Scripts Missing.");
          setSyncState('ERROR');
          return;
      }
      setSyncState('SYNCING');
      setSyncMsg("Handshaking with Google Cloud...");
      try {
          (window as any).gapi.load('client', async () => {
              await (window as any).gapi.client.init({ discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"] });
              const client = (window as any).google.accounts.oauth2.initTokenClient({
                  client_id: gdriveClientId,
                  scope: 'https://www.googleapis.com/auth/drive.file',
                  callback: '',
              });
              setTokenClient(client);
              setSyncState('SUCCESS');
              setSyncMsg("Uplink Established. Ready for Authentication.");
          });
      } catch (e) {
          setSyncState('ERROR');
          setSyncMsg("Init Failed. Verify Client ID.");
      }
  };

  const handleFinancialSync = (mode: 'PUSH' | 'PULL') => {
      if (!tokenClient) { initGapi(); return; }
      setSyncState('SYNCING');
      setSyncMsg(mode === 'PUSH' ? "Encrypting Ledger & Uploading..." : "Locating Ledger in Cloud...");

      tokenClient.callback = async (resp: any) => {
          if (resp.error) { setSyncState('ERROR'); setSyncMsg(`Auth Failed: ${resp.error}`); return; }
          try {
              const fileName = 'mylife_financial_core.json';
              const q = `name = '${fileName}' and trashed = false`;
              const listResp = await (window as any).gapi.client.drive.files.list({ q, fields: 'files(id, name)' });
              const files = listResp.result.files;

              if (mode === 'PUSH') {
                  const content = JSON.stringify(data, null, 2);
                  const file = new Blob([content], { type: 'application/json' });
                  const metadata = { name: fileName, mimeType: 'application/json' };
                  const accessToken = (window as any).gapi.client.getToken().access_token;
                  const form = new FormData();
                  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
                  form.append('file', file);
                  
                  let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
                  let method = 'POST';
                  if (files.length > 0) {
                      url = `https://www.googleapis.com/upload/drive/v3/files/${files[0].id}?uploadType=multipart`;
                      method = 'PATCH';
                  }
                  await fetch(url, { method: method, headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }), body: form });
                  setSyncState('SUCCESS');
                  setSyncMsg("Ledger Secured in Vault (Drive).");
              } else {
                  if (files.length === 0) { setSyncState('ERROR'); setSyncMsg("No Ledger Found."); return; }
                  const fileId = files[0].id;
                  const fileResp = await (window as any).gapi.client.drive.files.get({ fileId, alt: 'media' });
                  const remoteData = fileResp.result;
                  if (remoteData && remoteData.bankA !== undefined) {
                      if(confirm(`Overwrite Local Ledger with Cloud Data?\nCloud Cash: ৳${(remoteData.bankA+remoteData.bankB+remoteData.bankC).toLocaleString()}`)) {
                          updateData(remoteData);
                          setSyncState('SUCCESS');
                          setSyncMsg("Ledger Restored Successfully.");
                      } else { setSyncState('IDLE'); setSyncMsg("Restore Cancelled."); }
                  } else { setSyncState('ERROR'); setSyncMsg("Corrupt Data Stream."); }
              }
          } catch (e: any) { setSyncState('ERROR'); setSyncMsg(`Sync Error: ${e.message || e}`); }
      };
      (window as any).gapi.client.getToken() === null ? tokenClient.requestAccessToken({ prompt: 'consent' }) : tokenClient.requestAccessToken({ prompt: '' });
  };

  // --- 4. TRANSACTION LOGIC ---
  const handleSaveTransaction = () => {
    if (!txForm.amount || !txForm.desc) return;
    const amountVal = parseFloat(txForm.amount);
    
    let currentData = { ...data };
    
    // Reverse logic if editing
    if (isEditingTx && txForm.id) {
        currentData = reverseTransactionImpact(currentData, txForm.id);
        currentData.transactions = (currentData.transactions || []).filter(t => t.id !== txForm.id);
    }

    const newTx: Transaction = {
        id: txForm.id || Date.now().toString(),
        date: txForm.date,
        description: txForm.desc,
        amount: txForm.type === 'Income' ? amountVal : -amountVal,
        category: txForm.type === 'Income' ? 'Income' : txForm.category as any,
        bank: txForm.type === 'Income' ? 'A' : txForm.bank,
        paymentMethod: 'Manual',
        subcategory: txForm.autoDistribute ? 'Auto-Split' : 'Manual'
    };

    // AUTOMATIC DISTRIBUTION
    if (txForm.type === 'Income') {
        if (txForm.autoDistribute) {
            const wealthAmt = amountVal * 0.20;
            const survivalAmt = amountVal * 0.80;
            currentData.bankB = (currentData.bankB || 0) + wealthAmt;
            currentData.bankC = (currentData.bankC || 0) + survivalAmt;
        } else {
            currentData.bankA = (currentData.bankA || 0) + amountVal;
        }
    } else {
        if (txForm.bank === 'A') currentData.bankA = (currentData.bankA || 0) - amountVal;
        if (txForm.bank === 'B') currentData.bankB = (currentData.bankB || 0) - amountVal;
        if (txForm.bank === 'C') currentData.bankC = (currentData.bankC || 0) - amountVal;
    }

    updateData({ ...currentData, transactions: [newTx, ...(currentData.transactions || [])] });
    setTxForm({ ...txForm, amount: '', desc: '', id: undefined });
    setIsEditingTx(false);
  };

  const handleDeleteTransaction = (id: string) => {
      if(!confirm("DELETE RECORD? Balances will be reverted.")) return;
      const reversedData = reverseTransactionImpact(data, id);
      updateData({ ...reversedData, transactions: (reversedData.transactions || []).filter(t => t.id !== id) });
  };

  const reverseTransactionImpact = (state: FinancialState, txId: string): FinancialState => {
      const tx = (state.transactions || []).find(t => t.id === txId);
      if (!tx) return state;
      const newState = { ...state };
      const absAmount = Math.abs(tx.amount);
      
      if (tx.category === 'Income') {
          if (tx.subcategory === 'Auto-Split') {
              newState.bankB = (newState.bankB || 0) - (absAmount * 0.20);
              newState.bankC = (newState.bankC || 0) - (absAmount * 0.80);
          } else {
              newState.bankA = (newState.bankA || 0) - absAmount;
          }
      } else {
          if (tx.bank === 'A') newState.bankA = (newState.bankA || 0) + absAmount;
          if (tx.bank === 'B') newState.bankB = (newState.bankB || 0) + absAmount;
          if (tx.bank === 'C') newState.bankC = (newState.bankC || 0) + absAmount;
      }
      return newState;
  };

  const startEditTx = (tx: Transaction) => {
      setTxForm({ id: tx.id, date: tx.date, type: tx.amount > 0 ? 'Income' : 'Expense', amount: Math.abs(tx.amount).toString(), desc: tx.description, category: tx.category, bank: tx.bank, autoDistribute: tx.subcategory === 'Auto-Split' });
      setIsEditingTx(true);
      const element = document.getElementById('transaction-form');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  // --- ASSET/LOAN LOGIC (Condensed for brevity) ---
  const handleSaveAsset = () => { if (!assetForm.name) return; const newAsset: Asset = { id: assetForm.id || Date.now().toString(), name: assetForm.name, value: parseFloat(assetForm.value) || 0, type: assetForm.type as any, roi: parseFloat(assetForm.roi) || 0 }; updateData({ ...data, assets: isEditingAsset ? data.assets.map(a => a.id === assetForm.id ? newAsset : a) : [...data.assets, newAsset] }); setAssetForm({ name: '', value: '', type: 'Stock', roi: '' }); setIsEditingAsset(false); };
  const handleDeleteAsset = (id: string) => updateData({ ...data, assets: data.assets.filter(a => a.id !== id) });
  const startEditAsset = (a: Asset) => { setAssetForm({ id: a.id, name: a.name, value: a.value.toString(), type: a.type, roi: a.roi.toString() }); setIsEditingAsset(true); };

  const handleSaveLoan = () => { if (!loanForm.purpose) return; const newLoan: LoanLiability = { id: loanForm.id || Date.now().toString(), purpose: loanForm.purpose, amount: parseFloat(loanForm.amount) || 0, interestRate: parseFloat(loanForm.interest) || 0, monthlyEMI: parseFloat(loanForm.emi) || 0, remainingMonths: 0 }; updateData({ ...data, loans: isEditingLoan ? data.loans.map(l => l.id === loanForm.id ? newLoan : l) : [...data.loans, newLoan] }); setLoanForm({ purpose: '', amount: '', interest: '', emi: '' }); setIsEditingLoan(false); };
  const handleDeleteLoan = (id: string) => updateData({ ...data, loans: data.loans.filter(l => l.id !== id) });
  const startEditLoan = (l: LoanLiability) => { setLoanForm({ id: l.id, purpose: l.purpose, amount: l.amount.toString(), interest: l.interestRate.toString(), emi: l.monthlyEMI.toString() }); setIsEditingLoan(true); };

  const handleSaveBusiness = () => { if (!bizForm.name) return; const newBiz: BusinessEntity = { id: bizForm.id || Date.now().toString(), name: bizForm.name, type: 'Product', stage: bizForm.stage as any, monthlyRevenue: parseFloat(bizForm.revenue) || 0, valuation: parseFloat(bizForm.valuation) || 0, growthRate: 10 }; updateData({ ...data, businesses: isEditingBiz ? data.businesses.map(b => b.id === bizForm.id ? newBiz : b) : [...data.businesses, newBiz] }); setBizForm({ name: '', revenue: '', valuation: '', stage: 1 }); setIsEditingBiz(false); };
  const handleDeleteBusiness = (id: string) => updateData({ ...data, businesses: data.businesses.filter(b => b.id !== id) });
  const startEditBusiness = (b: BusinessEntity) => { setBizForm({ id: b.id, name: b.name, revenue: b.monthlyRevenue.toString(), valuation: b.valuation.toString(), stage: b.stage }); setIsEditingBiz(true); };

  const handleSaveSnapshot = () => { if (!snapshotForm.income) return; const newSnap = { id: snapshotForm.id || Date.now().toString(), month: snapshotForm.month, income: parseFloat(snapshotForm.income) || 0, dependents: parseInt(snapshotForm.dependents) || 0, essentialExpenses: parseFloat(snapshotForm.essential) || 0, nonEssentialExpenses: parseFloat(snapshotForm.nonEssential) || 0, notes: snapshotForm.notes }; updateData({ ...data, budgetSnapshots: isEditingSnapshot ? data.budgetSnapshots.map(s => s.id === snapshotForm.id ? newSnap : s) : [...data.budgetSnapshots, newSnap].sort((a,b) => b.month.localeCompare(a.month)) }); setSnapshotForm({ month: '', income: '', dependents: '0', essential: '', nonEssential: '', notes: '' }); setIsEditingSnapshot(false); };
  const handleDeleteSnapshot = (id: string) => updateData({ ...data, budgetSnapshots: data.budgetSnapshots.filter(s => s.id !== id) });
  const startEditSnapshot = (s: MonthlyBudgetSnapshot) => { setSnapshotForm({ id: s.id, month: s.month, income: s.income.toString(), dependents: s.dependents.toString(), essential: s.essentialExpenses.toString(), nonEssential: s.nonEssentialExpenses.toString(), notes: s.notes }); setIsEditingSnapshot(true); };

  const handleSaveJournal = () => { updateData({ ...data, mindsetLogs: [{ ...journalForm, id: Date.now().toString() }, ...(data.mindsetLogs || [])] }); setJournalForm({ id: '', date: '', patternProblem: '', identifyTrigger: '', solveAction: '', guiltFreeSpent: 0, notes: '' }); };
  const handleDeleteJournal = (id: string) => updateData({ ...data, mindsetLogs: data.mindsetLogs.filter(l => l.id !== id) });

  const handleReconcile = () => {
      const newA = reconcileValues.A !== '' ? parseFloat(reconcileValues.A) : data.bankA;
      const newB = reconcileValues.B !== '' ? parseFloat(reconcileValues.B) : data.bankB;
      const newC = reconcileValues.C !== '' ? parseFloat(reconcileValues.C) : data.bankC;
      updateData({ ...data, bankA: newA, bankB: newB, bankC: newC });
      setShowReconcile(false);
      setReconcileValues({ A: '', B: '', C: '' });
  };

  const getFinancialClass = (ppi: number) => {
      if (ppi < 5000) return { label: "Extreme Poor", color: "text-red-600" };
      if (ppi < 15000) return { label: "Poor", color: "text-orange-500" };
      if (ppi < 40000) return { label: "Middle Class", color: "text-blue-400" };
      return { label: "Wealthy", color: "text-gold" };
  };

  if (!data) return <div className="p-10 text-center text-gray-500 animate-pulse">Initializing Core Systems...</div>;

  const renderCommandCenter = () => (
    <div className="space-y-6 animate-in fade-in">
        {/* CFO INSIGHTS DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-4 rounded-lg relative overflow-hidden group hover:border-gold/50 transition-colors">
                <div className="absolute top-0 right-0 p-2 opacity-10"><Crown size={48} className="text-white"/></div>
                <p className="text-[10px] text-gold uppercase font-bold tracking-wider">Real Net Worth</p>
                <p className="text-2xl font-display font-black text-white mt-1 text-glow-gold">৳ {(metrics.realNetWorth / 1000).toFixed(1)}k</p>
                <div className="h-1 bg-gray-800 rounded-full mt-2 w-full overflow-hidden">
                    <div className="h-full bg-gold shadow-[0_0_10px_#FFD700] transition-all duration-1000 ease-out" style={{width: `${Math.min(100, metrics.realNetWorth/10000)}%`}}></div>
                </div>
            </div>
            
            <div className="glass-panel p-4 rounded-lg hover:bg-white/5 transition-colors">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider flex items-center gap-1">
                    <TrendingDown size={10} className="text-red-500"/> Inflation Decay
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                    <p className="text-2xl font-mono font-bold text-spartan-red">
                        -৳{metrics.dailyInflationLoss.toFixed(1)}
                    </p>
                    <span className="text-xs text-gray-500 font-mono">/ Day</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Cash loses value daily. Invest.</p>
            </div>

            <div className="glass-panel p-4 rounded-lg hover:bg-white/5 transition-colors">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Savings Rate</p>
                <div className="flex items-baseline gap-1 mt-1">
                    <p className={`text-2xl font-mono font-bold ${metrics.savingsRate >= 20 ? 'text-wealth-green' : 'text-orange-500'}`}>
                        {metrics.savingsRate.toFixed(0)}%
                    </p>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Target: 20%+</p>
            </div>

            <div className="glass-panel p-4 rounded-lg cursor-pointer hover:border-blue-500 transition-colors group" onClick={() => setShowReconcile(true)}>
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">Liquid Cash</p>
                        <p className="text-xl font-mono font-bold text-white mt-1 group-hover:text-blue-200 transition-colors">৳ {metrics.liquidCash.toLocaleString()}</p>
                    </div>
                    <Settings size={14} className="text-gray-600 group-hover:text-blue-400 transition-colors group-hover:rotate-90 duration-500"/>
                </div>
                <div className="flex gap-1 mt-3">
                    <div className="h-1 bg-gray-700 rounded-full flex-1" title="Bank A"></div>
                    <div className="h-1 bg-wealth-green rounded-full flex-[2]" title="Bank B"></div>
                    <div className="h-1 bg-spartan-red rounded-full flex-[3]" title="Bank C"></div>
                </div>
            </div>
        </div>

        {/* BANK BALANCES (Breakdown) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* BANK A */}
             <div className="glass-panel p-4 rounded-lg flex justify-between items-center group hover:bg-white/5 transition-all active:scale-95 duration-200 cursor-pointer" onClick={() => setShowReconcile(true)}>
                <div>
                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Bank A (Inflow Hub)</span>
                    <p className="text-xl font-mono text-white">৳ {(data.bankA || 0).toLocaleString()}</p>
                </div>
                <div className="p-2 bg-gray-900 rounded border border-gray-800 group-hover:border-gray-600"><Wallet size={16} className="text-gray-500"/></div>
             </div>
             {/* BANK B */}
             <div className="glass-panel p-4 rounded-lg flex justify-between items-center border border-wealth-green/20 hover:border-wealth-green/50 transition-all active:scale-95 duration-200 cursor-pointer" onClick={() => setShowReconcile(true)}>
                <div>
                    <span className="text-[10px] text-wealth-green font-bold uppercase block mb-1">Bank B (Wealth)</span>
                    <p className="text-xl font-mono text-white">৳ {(data.bankB || 0).toLocaleString()}</p>
                </div>
                <div className="p-2 bg-green-900/20 rounded border border-green-900/50"><Crown size={16} className="text-wealth-green"/></div>
             </div>
             {/* BANK C */}
             <div className="glass-panel p-4 rounded-lg flex justify-between items-center border border-spartan-red/20 hover:border-spartan-red/50 transition-all active:scale-95 duration-200 cursor-pointer" onClick={() => setShowReconcile(true)}>
                <div>
                    <span className="text-[10px] text-spartan-red font-bold uppercase block mb-1">Bank C (Survival)</span>
                    <p className="text-xl font-mono text-white">৳ {(data.bankC || 0).toLocaleString()}</p>
                </div>
                <div className="p-2 bg-red-900/20 rounded border border-red-900/50"><Shield size={16} className="text-spartan-red"/></div>
             </div>
        </div>

        {/* SMART INPUT FORM (TITANIUM EDITION) */}
        <div id="transaction-form" className={`glass-panel p-6 rounded-xl transition-all duration-300 ${isEditingTx ? 'border-blue-500 bg-blue-900/10' : 'border-white/10'}`}>
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Activity className={isEditingTx ? "text-blue-500" : "text-wealth-green"} />
                    <h3 className="text-xl font-display font-bold text-white uppercase">{isEditingTx ? "Editing Record..." : "Transaction Protocol"}</h3>
                </div>
                {isEditingTx && (
                    <button 
                        onClick={() => {setIsEditingTx(false); setTxForm({date: new Date().toISOString().split('T')[0], type:'Expense', amount:'', desc:'', category:'Needs', bank:'C', autoDistribute: true})}} 
                        className="text-xs bg-red-900/30 text-red-500 px-3 py-1 rounded border border-red-900 hover:bg-red-900/50"
                    >
                        Cancel
                    </button>
                )}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    {/* TOGGLE */}
                    <div className="flex bg-black p-1 rounded border border-gray-800">
                        <button onClick={() => setTxForm({...txForm, type: 'Income'})} className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-all ${txForm.type === 'Income' ? 'bg-wealth-green text-black shadow-[0_0_10px_#00E676]' : 'text-gray-500 hover:text-white'}`}>Income</button>
                        <button onClick={() => setTxForm({...txForm, type: 'Expense'})} className={`flex-1 py-2 text-xs font-bold uppercase rounded transition-all ${txForm.type === 'Expense' ? 'bg-red-600 text-white shadow-[0_0_10px_#DC2626]' : 'text-gray-500 hover:text-white'}`}>Expense</button>
                    </div>

                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            placeholder="Amount" 
                            value={txForm.amount}
                            onChange={e => setTxForm({...txForm, amount: e.target.value})}
                            className="w-1/3 bg-black border border-gray-700 rounded p-3 text-white font-mono text-lg focus:border-blue-500 outline-none placeholder-gray-700 transition-colors focus:shadow-inner"
                        />
                        <input 
                            type="text" 
                            placeholder="Description (e.g. Salary, Rent)" 
                            value={txForm.desc}
                            onChange={e => setTxForm({...txForm, desc: e.target.value})}
                            className="flex-1 bg-black border border-gray-700 rounded p-3 text-white text-sm focus:border-blue-500 outline-none placeholder-gray-700 transition-colors focus:shadow-inner"
                        />
                    </div>
                    
                    <div className="flex gap-2">
                         <div className="relative w-1/3">
                            <input 
                                type="date" 
                                value={txForm.date}
                                onChange={e => setTxForm({...txForm, date: e.target.value})}
                                className="w-full bg-black border border-gray-700 rounded p-2 text-gray-400 text-xs font-mono focus:border-blue-500 outline-none transition-colors"
                            />
                        </div>
                        {txForm.type === 'Expense' && (
                            <>
                                <select 
                                    value={txForm.category}
                                    onChange={e => setTxForm({...txForm, category: e.target.value})}
                                    className="flex-1 bg-black border border-gray-700 rounded p-2 text-gray-300 text-xs outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option>Needs</option><option>Wants</option><option>Investment</option><option>Debt</option>
                                </select>
                                <select 
                                    value={txForm.bank}
                                    onChange={e => setTxForm({...txForm, bank: e.target.value as any})}
                                    className="flex-1 bg-black border border-gray-700 rounded p-2 text-gray-300 text-xs outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="C">Bank C (Survival)</option>
                                    <option value="B">Bank B (Wealth)</option>
                                    <option value="A">Bank A (Inflow)</option>
                                </select>
                            </>
                        )}
                        {txForm.type === 'Income' && (
                             <div 
                                onClick={() => setTxForm(prev => ({...prev, autoDistribute: !prev.autoDistribute}))}
                                className={`flex-1 flex items-center justify-center gap-2 border rounded cursor-pointer select-none transition-colors ${txForm.autoDistribute ? 'bg-blue-900/30 border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(41,121,255,0.3)]' : 'bg-black border-gray-700 text-gray-500'}`}
                             >
                                 <Split size={14} />
                                 <span className="text-[10px] font-bold uppercase">Auto-Split</span>
                             </div>
                        )}
                    </div>

                    <button onClick={handleSaveTransaction} className={`w-full py-4 rounded text-xs font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.01] active:scale-[0.99] ${txForm.type === 'Income' ? 'bg-wealth-green hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]' : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]'}`}>
                        {isEditingTx ? "Update Ledger Record" : txForm.type === 'Income' ? "Inject Capital" : "Log Expense"}
                    </button>
                </div>

                {/* VISUALIZER: THE MONEY FLOW */}
                <div className="bg-black/50 border border-gray-800 p-4 rounded-lg flex flex-col justify-center relative overflow-hidden transition-all hover:border-gray-600">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-4 text-center pb-2 border-b border-gray-800">
                        Simulation Engine
                    </p>
                    {txForm.amount ? (
                        <div className="space-y-4 relative z-10 animate-in fade-in">
                            {txForm.type === 'Income' ? (
                                txForm.autoDistribute ? (
                                    <>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400">Total Inflow</span>
                                            <span className="text-white font-mono font-bold">৳ {parseFloat(txForm.amount).toLocaleString()}</span>
                                        </div>
                                        {/* Visualization Lines */}
                                        <div className="flex gap-2 h-16">
                                            <div className="w-1/5 bg-wealth-green/20 border border-wealth-green/50 rounded flex flex-col items-center justify-center relative animate-slide-up" style={{animationDelay: '0.1s'}}>
                                                <span className="text-[10px] text-wealth-green font-bold">20%</span>
                                                <div className="absolute -bottom-6 text-[10px] text-gray-500 font-bold">Wealth</div>
                                            </div>
                                            <div className="w-4/5 bg-spartan-red/20 border border-spartan-red/50 rounded flex flex-col items-center justify-center relative animate-slide-up" style={{animationDelay: '0.2s'}}>
                                                <span className="text-[10px] text-spartan-red font-bold">80%</span>
                                                <div className="absolute -bottom-6 text-[10px] text-gray-500 font-bold">Survival</div>
                                            </div>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <p className="text-[10px] text-wealth-green uppercase">To Bank B</p>
                                                <p className="text-lg font-mono text-white">৳ {(parseFloat(txForm.amount)*0.2).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-spartan-red uppercase">To Bank C</p>
                                                <p className="text-lg font-mono text-white">৳ {(parseFloat(txForm.amount)*0.8).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8 animate-in fade-in">
                                        <p className="text-white font-mono text-lg">৳ {parseFloat(txForm.amount).toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 mt-2">→ Bank A (Pending Distribution)</p>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-8 animate-in fade-in">
                                    <p className="text-red-500 text-2xl font-mono font-bold">- ৳ {parseFloat(txForm.amount).toLocaleString()}</p>
                                    <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Deducted from Bank {txForm.bank}</p>
                                </div>
                            )}
                        </div>
                    ) : ( 
                        <div className="flex flex-col items-center justify-center h-40 text-gray-700">
                            <Calculator size={32} className="mb-2 opacity-50"/>
                            <p className="text-xs italic">Awaiting Input Data...</p>
                        </div> 
                    )}
                    {/* Background decoration */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                </div>
             </div>
        </div>

        {/* LEDGER TABLE */}
        <div className="glass-panel rounded-lg overflow-hidden">
             <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-black/20">
                <h3 className="text-sm font-bold text-white uppercase">Ledger History</h3>
                <span className="text-[10px] text-gray-500 uppercase">{(data.transactions || []).length} Records</span>
             </div>
             <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-xs text-gray-400">
                    <thead className="bg-black text-gray-500 uppercase font-bold sticky top-0 shadow-sm z-10 backdrop-blur-sm">
                        <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Route</th>
                            <th className="p-3 text-right">Amount</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {(data.transactions || []).map((tx) => (
                            <tr 
                                key={tx.id} 
                                className={`transition-colors group hover:bg-white/5 ${isEditingTx && txForm.id === tx.id ? 'bg-blue-900/20 border-l-2 border-blue-500' : ''}`}
                            >
                                <td className="p-3 font-mono text-gray-500">{tx.date}</td>
                                <td className="p-3 text-white font-medium">{tx.description}</td>
                                <td className="p-3"><span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${tx.category === 'Income' ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>{tx.category}</span></td>
                                <td className="p-3 text-gray-500 flex items-center gap-1">
                                    {tx.category === 'Income' && tx.subcategory === 'Auto-Split' ? <Split size={12}/> : <ArrowRight size={12}/>}
                                    {tx.category === 'Income' && tx.subcategory === 'Auto-Split' ? 'Auto-Split' : `Bank ${tx.bank}`}
                                </td>
                                <td className={`p-3 text-right font-mono font-bold ${tx.amount > 0 ? 'text-wealth-green' : 'text-gray-300'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditTx(tx)} className="text-blue-500 hover:text-blue-400"><Edit3 size={14}/></button>
                                        <button onClick={() => handleDeleteTransaction(tx.id)} className="text-gray-500 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>

        {/* RECONCILIATION MODAL */}
        {showReconcile && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
                <div className="bg-slate-900 border border-gray-700 p-6 rounded-lg w-96 shadow-2xl relative">
                    <button onClick={() => setShowReconcile(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={16}/></button>
                    <h3 className="text-sm font-bold text-white uppercase mb-4 flex items-center gap-2"><RefreshCw size={14} className="text-blue-500"/> System Override</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase">Bank A (Actual)</label>
                            <input type="number" placeholder={data.bankA.toString()} value={reconcileValues.A} onChange={e => setReconcileValues({...reconcileValues, A: e.target.value})} className="w-full bg-black border border-gray-700 text-white p-2 rounded mt-1"/>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase">Bank B (Actual)</label>
                            <input type="number" placeholder={data.bankB.toString()} value={reconcileValues.B} onChange={e => setReconcileValues({...reconcileValues, B: e.target.value})} className="w-full bg-black border border-gray-700 text-white p-2 rounded mt-1"/>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase">Bank C (Actual)</label>
                            <input type="number" placeholder={data.bankC.toString()} value={reconcileValues.C} onChange={e => setReconcileValues({...reconcileValues, C: e.target.value})} className="w-full bg-black border border-gray-700 text-white p-2 rounded mt-1"/>
                        </div>
                        <button onClick={handleReconcile} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded text-xs uppercase mt-2">Force Update</button>
                    </div>
                </div>
            </div>
        )}

        {/* SYNC MODAL */}
        {showSync && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
                <div className="bg-slate-950 border border-blue-500/50 rounded-xl w-full max-w-lg shadow-2xl relative">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div><h3 className="text-xl font-black text-white uppercase flex items-center gap-2"><Cloud className="text-blue-500" /> Ledger Cloud Uplink</h3><p className="text-xs text-blue-400 font-mono mt-1">SECURE FINANCIAL DATA TRANSFER</p></div>
                            <button onClick={() => setShowSync(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
                        </div>
                        <div className="bg-black border border-gray-800 rounded p-4 mb-6 text-center">
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">UPLINK STATUS</p>
                            <p className={`text-sm font-mono font-bold ${syncState === 'SUCCESS' ? 'text-green-500' : syncState === 'ERROR' ? 'text-red-500' : syncState === 'SYNCING' ? 'text-yellow-500' : 'text-gray-300'}`}>{syncState === 'SYNCING' ? 'TRANSMITTING ENCRYPTED LEDGER...' : syncMsg || 'STANDBY'}</p>
                        </div>
                        <div className="mb-4">
                            <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Google Client ID</label>
                            <div className="flex gap-2">
                                <input type="text" value={gdriveClientId} onChange={(e) => setGdriveClientId(e.target.value)} placeholder="OAuth 2.0 Client ID" className="flex-1 bg-black border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-blue-500"/>
                                <button onClick={initGapi} className="bg-blue-900/20 text-blue-400 border border-blue-900 px-3 rounded hover:bg-blue-900/40"><RefreshCw size={14}/></button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleFinancialSync('PUSH')} disabled={!gdriveClientId} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded font-bold uppercase text-xs flex items-center justify-center gap-2"><Upload size={14}/> Push Backup</button>
                            <button onClick={() => handleFinancialSync('PULL')} disabled={!gdriveClientId} className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white py-3 rounded font-bold uppercase text-xs flex items-center justify-center gap-2 border border-gray-700"><Download size={14}/> Restore Data</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );

  const renderPortfolio = () => (
      <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* ASSETS COLUMN */}
               <div className="space-y-4">
                   <div className="glass-panel p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                                <Crown className="text-gold"/> Assets
                                <span className="ml-2 text-xs font-mono text-wealth-green bg-green-900/30 px-2 py-1 rounded border border-green-900">
                                    Avg ROI: {(metrics.weightedAvgRoi).toFixed(1)}%
                                </span>
                             </h3>
                             {isEditingAsset && <button onClick={() => {setIsEditingAsset(false); setAssetForm({name:'', value:'', type:'Stock', roi: ''})}} className="text-xs text-red-500 hover:text-red-400">Cancel</button>}
                        </div>
                        <div className="space-y-2">
                            <input value={assetForm.name} onChange={e => setAssetForm({...assetForm, name: e.target.value})} placeholder="Asset Name" className="w-full bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-gold"/>
                            <div className="flex gap-2">
                                <select value={assetForm.type} onChange={e => setAssetForm({...assetForm, type: e.target.value})} className="flex-1 bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none">
                                    <option>Stock</option><option>Land</option><option>Gold</option><option>Crypto</option><option>FDR</option>
                                </select>
                                <input type="number" value={assetForm.value} onChange={e => setAssetForm({...assetForm, value: e.target.value})} placeholder="Value" className="flex-1 bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-gold"/>
                                <input type="number" value={assetForm.roi} onChange={e => setAssetForm({...assetForm, roi: e.target.value})} placeholder="ROI %" className="w-20 bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-gold"/>
                            </div>
                            <button onClick={handleSaveAsset} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 rounded uppercase text-xs shadow-lg shadow-amber-500/20">{isEditingAsset ? "Update Asset" : "Add Asset"}</button>
                        </div>
                   </div>

                   <div className="glass-panel rounded-lg overflow-hidden">
                        {(data.assets || []).map(asset => (
                            <div key={asset.id} className="p-4 flex justify-between items-center group hover:bg-white/5 border-b border-gray-800 last:border-0 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-900/20 rounded border border-green-900/50"><ArrowUpRight size={16} className="text-wealth-green"/></div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{asset.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">{asset.type} • <span className="text-wealth-green">{asset.roi}% ROI</span></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-white font-mono font-bold">৳ {asset.value.toLocaleString()}</p>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditAsset(asset)} className="text-gray-400 hover:text-blue-500"><Edit3 size={14}/></button>
                                        <button onClick={() => handleDeleteAsset(asset.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                   </div>
               </div>

               {/* LIABILITIES COLUMN */}
               <div className="space-y-4">
                   <div className="glass-panel p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2"><AlertCircle className="text-spartan-red"/> Liabilities</h3>
                             {isEditingLoan && <button onClick={() => {setIsEditingLoan(false); setLoanForm({purpose:'', amount:'', interest:'', emi:''})}} className="text-xs text-red-500 hover:text-red-400">Cancel</button>}
                        </div>
                        <div className="space-y-2">
                            <input value={loanForm.purpose} onChange={e => setLoanForm({...loanForm, purpose: e.target.value})} placeholder="Loan Purpose" className="w-full bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-red-500"/>
                            <div className="flex gap-2">
                                <input type="number" value={loanForm.amount} onChange={e => setLoanForm({...loanForm, amount: e.target.value})} placeholder="Amount Left" className="flex-1 bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-red-500"/>
                                <input type="number" value={loanForm.interest} onChange={e => setLoanForm({...loanForm, interest: e.target.value})} placeholder="Int %" className="w-20 bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-red-500"/>
                            </div>
                            <input type="number" value={loanForm.emi} onChange={e => setLoanForm({...loanForm, emi: e.target.value})} placeholder="Monthly EMI" className="w-full bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-red-500"/>
                            <button onClick={handleSaveLoan} className="w-full bg-spartan-red hover:bg-red-500 text-white font-bold py-2 rounded uppercase text-xs shadow-lg shadow-red-600/20">{isEditingLoan ? "Update Liability" : "Add Liability"}</button>
                        </div>
                   </div>

                   <div className="glass-panel rounded-lg overflow-hidden">
                        {(data.loans || []).map(loan => (
                            <div key={loan.id} className="p-4 flex justify-between items-center group hover:bg-white/5 border-b border-gray-800 last:border-0 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-900/20 rounded border border-red-900/50"><ArrowDownRight size={16} className="text-spartan-red"/></div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{loan.purpose}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">{loan.interestRate}% Interest • EMI: {loan.monthlyEMI}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-spartan-red font-mono font-bold">- ৳ {loan.amount.toLocaleString()}</p>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditLoan(loan)} className="text-gray-400 hover:text-blue-500"><Edit3 size={14}/></button>
                                        <button onClick={() => handleDeleteLoan(loan.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(data.loans || []).length === 0 && <p className="text-center p-4 text-xs text-gray-500 italic">No active liabilities. Freedom is close.</p>}
                   </div>
               </div>
          </div>
      </div>
  );

  const renderBlueprint = () => (
    <div className="space-y-6 animate-in fade-in">
        {/* HERO CARD */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 border border-wealth-green/30 p-8 rounded-lg relative overflow-hidden shadow-lg hover:shadow-emerald-900/20 transition-shadow">
            <div className="relative z-10">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Wealth Building Blueprint</h2>
                <p className="text-sm font-mono text-emerald-400">STRATEGY • MINDSET • EXECUTION</p>
                <div className="mt-6 flex flex-col md:flex-row gap-6">
                    <div className="bg-black/50 p-4 rounded border border-gray-700">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Concept: Asset (সম্পদ)</p>
                        <p className="text-sm text-gray-200">Assets put money in your pocket. Examples: Cash, Land, Gold, Stocks.</p>
                    </div>
                    <div className="bg-black/50 p-4 rounded border border-gray-700">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Concept: Net Worth (নেট ওয়ার্থ)</p>
                        <p className="text-sm text-gray-200">Total Assets - Total Liabilities. Focus on growing this, not just income.</p>
                    </div>
                </div>
            </div>
            <Crown size={200} className="absolute -bottom-10 -right-10 text-wealth-green/5 opacity-50 pointer-events-none"/>
        </div>

        {/* 2. WEALTH TIMELINE & 7 SECRETS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Target className="text-gold" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase">Wealth Timeline</h3>
                </div>
                <div className="space-y-4">
                    {WEALTH_TIMELINE.map((t, i) => (
                        <div key={i} className="flex gap-4 group">
                            <div className="w-16 text-right font-mono text-amber-600 dark:text-gold font-bold group-hover:scale-110 transition-transform">{t.age}</div>
                            <div className="flex-1 pb-4 border-l border-gray-300 dark:border-gray-700 pl-4 relative">
                                <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-amber-600 dark:bg-gold group-hover:shadow-[0_0_10px_#FFD700] transition-shadow"></div>
                                <p className="text-gray-900 dark:text-white font-bold text-xs uppercase mb-1">{t.focus}</p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-snug">{t.action}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="text-blue-500" />
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase">7 Secrets of the Rich</h3>
                </div>
                <ul className="space-y-3">
                    {SECRETS_OF_RICH_7.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2 hover:bg-white/5 p-2 rounded transition-colors">
                            <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0"/>
                            <span>{s}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
  );

  const renderJournal = () => (
      <div className="space-y-6 animate-in fade-in">
          {/* REALITY CHECKLIST BOARD */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 1. MONTHLY COMMITMENTS */}
              <div className="glass-panel p-6 rounded-lg border border-wealth-green/30">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                          <PiggyBank className="text-wealth-green"/>
                          <h3 className="text-lg font-bold text-white uppercase">Monthly Commitments</h3>
                      </div>
                      <button onClick={() => toggleAddForm('commitments')} className="text-gray-500 hover:text-white"><Plus size={16}/></button>
                  </div>
                  
                  <div className="space-y-3">
                      {journalData.commitments.map(c => (
                          <div key={c.id} className="flex justify-between items-center p-3 bg-black/40 rounded border border-gray-800 group hover:border-gray-600 transition-colors">
                              <div>
                                  <p className="text-sm font-bold text-gray-200">{c.name}</p>
                                  <p className="text-[10px] text-gray-500">{c.details}</p>
                              </div>
                              <div className="flex gap-2 items-center">
                                <button onClick={() => deleteCommitment(c.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                                <button onClick={() => toggleCommitment(c.id)} className={`p-1.5 rounded ${c.completed ? 'bg-wealth-green text-black' : 'bg-gray-800 text-gray-500'}`}>
                                    {c.completed ? <CheckCircle size={16}/> : <X size={16}/>}
                                </button>
                              </div>
                          </div>
                      ))}
                  </div>

                  {showAddForms['commitments'] && (
                      <div className="mt-4 p-3 bg-black/60 rounded border border-gray-700 animate-in fade-in">
                          <input placeholder="Name (e.g. IDLC)" value={newCommitment.name} onChange={e => setNewCommitment({...newCommitment, name: e.target.value})} className="w-full bg-slate-900 border border-gray-700 rounded p-1 text-xs text-white mb-2"/>
                          <input placeholder="Details (e.g. 500 BDT)" value={newCommitment.details} onChange={e => setNewCommitment({...newCommitment, details: e.target.value})} className="w-full bg-slate-900 border border-gray-700 rounded p-1 text-xs text-white mb-2"/>
                          <button onClick={addCommitment} className="w-full bg-wealth-green text-black text-xs font-bold py-1 rounded">Add Commitment</button>
                      </div>
                  )}
                  <p className="text-[10px] text-gray-500 mt-4 italic text-center">"Important not add every month - Auto Execute"</p>
              </div>

              {/* 2. RECEIVABLES & DAILY DISCIPLINE */}
              <div className="glass-panel p-6 rounded-lg border border-blue-500/30">
                  <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                          <ClipboardList className="text-blue-500"/>
                          <h3 className="text-lg font-bold text-white uppercase">Daily Protocol</h3>
                      </div>
                      <button onClick={() => toggleAddForm('protocol')} className="text-gray-500 hover:text-white"><Plus size={16}/></button>
                  </div>
                  
                  {/* Daily Habits */}
                  <div className="space-y-3 mb-6">
                      {journalData.dailyProtocol.map((p, idx) => (
                          <div key={p.id} className="flex justify-between items-center group">
                              <div onClick={() => toggleProtocol(p.id)} className={`flex-1 flex items-center gap-3 p-2 rounded cursor-pointer select-none transition-colors ${p.completed ? 'bg-blue-900/20 text-blue-300' : 'hover:bg-white/5 text-gray-400'}`}>
                                  {p.completed ? <CheckCircle size={16}/> : <div className="w-4 h-4 rounded-full border border-gray-600"></div>}
                                  <span className="text-xs font-bold uppercase">{idx + 1}. {p.task}</span>
                              </div>
                              <button onClick={() => deleteProtocol(p.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 px-2"><Trash2 size={12}/></button>
                          </div>
                      ))}
                  </div>

                  {showAddForms['protocol'] && (
                      <div className="mb-4 flex gap-2">
                          <input placeholder="New Task..." value={newProtocol} onChange={e => setNewProtocol(e.target.value)} className="flex-1 bg-slate-900 border border-gray-700 rounded p-1 text-xs text-white"/>
                          <button onClick={addProtocol} className="bg-blue-600 text-white px-2 rounded"><Plus size={14}/></button>
                      </div>
                  )}

                  <div className="border-t border-gray-700 pt-4">
                      <div className="flex justify-between items-center mb-2">
                          <p className="text-[10px] text-gray-500 uppercase font-bold">Receivables</p>
                          <button onClick={() => toggleAddForm('receivables')} className="text-gray-500 hover:text-white"><Plus size={12}/></button>
                      </div>
                      <div className="space-y-2">
                          {journalData.receivables.map(r => (
                              <div key={r.id} className="flex justify-between items-center p-2 bg-red-900/10 border border-red-900/30 rounded group">
                                  <span className="text-xs text-gray-300">{r.name}</span>
                                  <div className="flex gap-2 items-center">
                                      <button onClick={() => deleteReceivable(r.id)} className="text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                                      <button onClick={() => toggleReceivable(r.id)} className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${r.status === 'RECEIVED' ? 'bg-green-600 text-white' : 'bg-red-900 text-red-200'}`}>
                                          {r.status}
                                      </button>
                                  </div>
                              </div>
                          ))}
                      </div>
                      {showAddForms['receivables'] && (
                          <div className="mt-2 flex gap-2">
                              <input placeholder="Name..." value={newReceivable} onChange={e => setNewReceivable(e.target.value)} className="flex-1 bg-slate-900 border border-gray-700 rounded p-1 text-xs text-white"/>
                              <button onClick={addReceivable} className="bg-red-600 text-white px-2 rounded"><Plus size={14}/></button>
                          </div>
                      )}
                  </div>
              </div>

              {/* 3. WEALTH RULES CARD */}
              <div className="glass-panel p-6 rounded-lg border border-gold/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Scale size={100} className="text-gold"/></div>
                  <div className="relative z-10">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-white uppercase flex items-center gap-2"><Crown className="text-gold"/> Core Directive</h3>
                          <button onClick={() => toggleAddForm('directives')} className="text-gray-500 hover:text-white"><Plus size={16}/></button>
                      </div>
                      
                      <ul className="space-y-4">
                          {journalData.directives.map((d, idx) => (
                              <li key={d.id} className="flex gap-3 group relative">
                                  <div className={`min-w-[4px] h-full rounded-full ${idx % 2 === 0 ? 'bg-gold' : 'bg-gray-500'}`}></div>
                                  <div>
                                      <p className={`text-sm font-bold uppercase ${idx % 2 === 0 ? 'text-gold' : 'text-gray-300'}`}>{idx + 1}. {d.title}</p>
                                      <p className="text-[10px] text-gray-400">{d.desc}</p>
                                  </div>
                                  <button onClick={() => deleteDirective(d.id)} className="absolute top-0 right-0 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                              </li>
                          ))}
                      </ul>

                      {showAddForms['directives'] && (
                          <div className="mt-4 p-3 bg-black/60 rounded border border-gray-700 animate-in fade-in">
                              <input placeholder="Title..." value={newDirective.title} onChange={e => setNewDirective({...newDirective, title: e.target.value})} className="w-full bg-slate-900 border border-gray-700 rounded p-1 text-xs text-white mb-2"/>
                              <textarea placeholder="Description..." value={newDirective.desc} onChange={e => setNewDirective({...newDirective, desc: e.target.value})} className="w-full bg-slate-900 border border-gray-700 rounded p-1 text-xs text-white mb-2 h-16"/>
                              <button onClick={addDirective} className="w-full bg-gold text-black text-xs font-bold py-1 rounded">Add Rule</button>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* GUILT FREE VAULT TRACKER */}
          <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 relative z-10">
                  <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                      <Wallet className="text-pink-500" /> Guilt-Free Vault
                  </h3>
                  <span className="text-[10px] bg-pink-900/20 text-pink-400 px-2 py-1 rounded border border-pink-900 font-bold">10% OF INCOME</span>
              </div>
              
              <div className="relative z-10">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span>Spent on Self-Care: <span className="text-white font-mono font-bold">৳ {metrics.totalGuiltFreeSpent.toLocaleString()}</span></span>
                      <span>Budget: <span className="text-pink-500 font-mono font-bold">৳ {metrics.guiltFreeBudget.toLocaleString()}</span></span>
                  </div>
                  <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-pink-500 transition-all duration-1000 shadow-[0_0_10px_#ec4899] ease-out" 
                        style={{width: `${Math.min(100, (metrics.totalGuiltFreeSpent / (metrics.guiltFreeBudget || 1)) * 100)}%`}}
                      ></div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2">
                      Treat yourself. You are the farmer, your body/mind is the horse. Keep the horse happy.
                  </p>
              </div>
              <Wallet size={150} className="absolute -bottom-10 -right-10 text-pink-500/10 opacity-50 pointer-events-none"/>
          </div>

          {/* PATTERN RECOGNITION LOG */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Form */}
              <div className="lg:col-span-1 glass-panel p-6 rounded-lg h-fit">
                  <h3 className="text-sm font-bold text-gray-300 uppercase mb-4 flex items-center gap-2">
                      <Brain size={16}/> Log Mental Pattern
                  </h3>
                  <div className="space-y-3">
                      <div>
                          <label className="text-[10px] text-gray-500 uppercase font-bold">Date</label>
                          <input type="date" value={journalForm.date} onChange={e => setJournalForm({...journalForm, date: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white text-xs outline-none focus:border-blue-500"/>
                      </div>
                      <div>
                          <label className="text-[10px] text-gray-500 uppercase font-bold">Pattern / Problem</label>
                          <input placeholder="e.g., Impulse Buy, Fear" value={journalForm.patternProblem} onChange={e => setJournalForm({...journalForm, patternProblem: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white text-xs outline-none focus:border-blue-500"/>
                      </div>
                      <div>
                          <label className="text-[10px] text-gray-500 uppercase font-bold">Identify Trigger</label>
                          <input placeholder="Why? (e.g. Saw friend buy it)" value={journalForm.identifyTrigger} onChange={e => setJournalForm({...journalForm, identifyTrigger: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white text-xs outline-none focus:border-blue-500"/>
                      </div>
                      <div>
                          <label className="text-[10px] text-gray-500 uppercase font-bold">Solve Action</label>
                          <input placeholder="What did you do?" value={journalForm.solveAction} onChange={e => setJournalForm({...journalForm, solveAction: e.target.value})} className="w-full bg-black border border-gray-700 rounded p-2 text-white text-xs outline-none focus:border-blue-500"/>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                          <div>
                              <label className="text-[10px] text-pink-500 uppercase font-bold">Guilt-Free Spent</label>
                              <input type="number" placeholder="0" value={journalForm.guiltFreeSpent} onChange={e => setJournalForm({...journalForm, guiltFreeSpent: parseFloat(e.target.value) || 0})} className="w-full bg-black border border-pink-900/50 rounded p-2 text-white text-xs outline-none focus:border-pink-500"/>
                          </div>
                      </div>
                      <button onClick={handleSaveJournal} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded uppercase text-xs mt-2 transition-transform active:scale-95">Log Pattern</button>
                  </div>
              </div>

              {/* Log List */}
              <div className="lg:col-span-2 bg-black border border-gray-800 rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-800 bg-slate-900/50">
                      <h3 className="text-sm font-bold text-white uppercase">Behavioral Finance Log</h3>
                  </div>
                  <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                      <table className="w-full text-left text-xs text-gray-400">
                          <thead className="bg-slate-900 text-gray-500 uppercase font-bold sticky top-0 shadow-sm">
                              <tr>
                                  <th className="p-3">Date</th>
                                  <th className="p-3">Pattern</th>
                                  <th className="p-3">Trigger</th>
                                  <th className="p-3">Action</th>
                                  <th className="p-3 text-right text-pink-500">Self-Care</th>
                                  <th className="p-3 text-right"></th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                              {(data.mindsetLogs || []).map((log) => (
                                  <tr key={log.id} className="hover:bg-slate-900/30 group">
                                      <td className="p-3 font-mono">{log.date}</td>
                                      <td className="p-3 font-bold text-red-400">{log.patternProblem}</td>
                                      <td className="p-3">{log.identifyTrigger}</td>
                                      <td className="p-3 text-green-400">{log.solveAction}</td>
                                      <td className="p-3 text-right font-mono text-pink-500 font-bold">{log.guiltFreeSpent > 0 ? `৳ ${log.guiltFreeSpent}` : '-'}</td>
                                      <td className="p-3 text-right">
                                          <button onClick={() => handleDeleteJournal(log.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={12}/></button>
                                      </td>
                                  </tr>
                              ))}
                              {(data.mindsetLogs || []).length === 0 && (
                                  <tr><td colSpan={6} className="p-6 text-center italic text-gray-600">No patterns logged yet. Observe your mind.</td></tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderFire = () => {
    const monthlySip = parseFloat(fireInputs.monthlySip) || 0;
    const lumpsum = parseFloat(fireInputs.lumpsum) || 0;
    const years = parseInt(fireInputs.years) || 1;
    const annualReturn = parseFloat(fireInputs.returnRate) || 0;
    const annualInflation = parseFloat(fireInputs.inflation) || 0;
    const targetRealWealth = parseFloat(fireInputs.target) || 0;

    const months = years * 12;
    const monthlyReturnRate = (annualReturn / 100) / 12;
    
    const projectionData = [];
    let currentNominal = 0;
    let totalInvested = 0;

    for (let m = 1; m <= months; m++) {
        let investmentThisMonth = monthlySip;
        if (m === 2) investmentThisMonth += lumpsum;

        const opening = currentNominal;
        const interest = (opening + investmentThisMonth) * monthlyReturnRate;
        const closing = opening + investmentThisMonth + interest;
        
        currentNominal = closing;
        totalInvested += investmentThisMonth;

        const yearsPassed = m / 12;
        const inflationFactor = Math.pow(1 + (annualInflation/100), yearsPassed);
        const realWealth = currentNominal / inflationFactor;

        if (m % 12 === 0 || m === months) {
            projectionData.push({
                year: (m / 12).toFixed(1),
                month: m,
                invested: Math.round(totalInvested),
                nominal: Math.round(currentNominal),
                real: Math.round(realWealth),
                inflationFactor: inflationFactor.toFixed(2),
                monthlyInterest: Math.round(interest),
                monthlyContribution: Math.round(investmentThisMonth)
            });
        }
    }

    return (
    <div className="space-y-6 animate-in fade-in">
        <div className="glass-panel p-6 rounded-lg">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                        <Rocket className="text-gold"/> Wealth Projection Engine
                    </h3>
                    <span className="text-xs font-mono text-gray-500">YEARS: {years} • TARGET: ৳{(targetRealWealth/100000).toFixed(1)}L (Real)</span>
                </div>
                <div className="flex bg-black p-1 rounded border border-gray-800">
                    <button 
                        onClick={() => setFireChartMode('WEALTH')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${fireChartMode === 'WEALTH' ? 'bg-slate-800 text-white shadow' : 'text-gray-500'}`}
                    >
                        Wealth View
                    </button>
                    <button 
                        onClick={() => setFireChartMode('VELOCITY')}
                        className={`px-3 py-1 text-[10px] font-bold uppercase rounded ${fireChartMode === 'VELOCITY' ? 'bg-slate-800 text-white shadow' : 'text-gray-500'}`}
                    >
                        Velocity View
                    </button>
                </div>
             </div>
             
             {/* INPUTS GRID */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                 <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Monthly SIP</label>
                    <input value={fireInputs.monthlySip} onChange={e => setFireInputs({...fireInputs, monthlySip: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-800 font-mono focus:border-gold outline-none"/>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Lumpsum (Mo 2)</label>
                    <input value={fireInputs.lumpsum} onChange={e => setFireInputs({...fireInputs, lumpsum: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-800 font-mono focus:border-gold outline-none"/>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Return (%)</label>
                    <input value={fireInputs.returnRate} onChange={e => setFireInputs({...fireInputs, returnRate: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-800 font-mono focus:border-gold outline-none"/>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Inflation (%)</label>
                    <input value={fireInputs.inflation} onChange={e => setFireInputs({...fireInputs, inflation: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-800 text-red-400 font-bold focus:border-red-500 outline-none"/>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Target (Real)</label>
                    <input value={fireInputs.target} onChange={e => setFireInputs({...fireInputs, target: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-800 font-mono focus:border-gold outline-none"/>
                 </div>
                 <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold">Duration (Yrs)</label>
                    <input value={fireInputs.years} onChange={e => setFireInputs({...fireInputs, years: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-800 font-mono focus:border-gold outline-none"/>
                 </div>
             </div>

             {/* CHART SECTION */}
             <div className="bg-black border border-gray-800 p-4 rounded-lg h-72 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    {fireChartMode === 'WEALTH' ? (
                        <AreaChart data={projectionData}>
                            <defs>
                                <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" stroke="#555" tick={{fontSize: 10}} label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }}/>
                            <YAxis stroke="#555" tick={{fontSize: 10}} tickFormatter={v => `${(v/100000).toFixed(0)}L`}/>
                            <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#333', borderRadius: '8px'}} formatter={(v: number) => `৳ ${v.toLocaleString()}`}/>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                            <ReferenceLine y={targetRealWealth} label="Target Real" stroke="red" strokeDasharray="3 3" />
                            
                            <Area type="monotone" dataKey="nominal" stroke="#F59E0B" fillOpacity={1} fill="url(#colorNominal)" name="Nominal Wealth (Bank Balance)" animationDuration={1500}/>
                            <Area type="monotone" dataKey="real" stroke="#10B981" fillOpacity={1} fill="url(#colorReal)" name="Real Wealth (Purchasing Power)" animationDuration={1500}/>
                            <Legend />
                        </AreaChart>
                    ) : (
                        <BarChart data={projectionData}>
                            <XAxis dataKey="year" stroke="#555" tick={{fontSize: 10}} />
                            <YAxis stroke="#555" tick={{fontSize: 10}} tickFormatter={v => `৳${v}`} />
                            <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#333', borderRadius: '8px'}} formatter={(v: number) => `৳ ${v.toLocaleString()}`}/>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444"/>
                            <Legend />
                            <Bar dataKey="monthlyContribution" name="Monthly Investment" fill="#3B82F6" stackId="a" animationDuration={1500} />
                            <Bar dataKey="monthlyInterest" name="Monthly Growth" fill="#10B981" stackId="a" animationDuration={1500} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
             </div>
        </div>
    </div>
  )};

  const renderOffense = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BUSINESS FORM */}
            <div className="glass-panel p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                        <Building2 className="text-blue-500"/> Business Builder
                     </h3>
                     {isEditingBiz && <button onClick={() => {setIsEditingBiz(false); setBizForm({name:'', revenue:'', valuation:'', stage:1})}} className="text-xs text-red-500">Cancel</button>}
                </div>
                
                <div className="space-y-3">
                    <input value={bizForm.name} onChange={e => setBizForm({...bizForm, name: e.target.value})} placeholder="Venture Name" className="w-full bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-blue-500"/>
                    <div className="flex gap-2">
                        <input type="number" value={bizForm.revenue} onChange={e => setBizForm({...bizForm, revenue: e.target.value})} placeholder="Monthly Rev" className="w-1/2 bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-blue-500"/>
                        <input type="number" value={bizForm.valuation} onChange={e => setBizForm({...bizForm, valuation: e.target.value})} placeholder="Valuation" className="w-1/2 bg-black border border-gray-700 text-white text-sm p-3 rounded outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase mb-1">Growth Stage</p>
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => (
                                <button key={s} onClick={() => setBizForm({...bizForm, stage: s})} className={`flex-1 py-2 text-xs font-bold rounded border ${bizForm.stage === s ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-800 text-gray-500 hover:bg-gray-800'}`}>{s}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleSaveBusiness} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded text-xs uppercase tracking-widest mt-2 shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">
                        {isEditingBiz ? "Update Venture" : "Launch Venture"}
                    </button>
                </div>
            </div>

            {/* VENTURE LIST */}
            <div className="space-y-3">
                {(data.businesses || []).map(biz => (
                    <div key={biz.id} className="bg-black border border-gray-800 p-4 rounded-lg group relative hover:border-blue-500 transition-all hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-white text-lg">{biz.name}</h4>
                                <p className="text-xs text-blue-500 uppercase font-bold">Stage {biz.stage}: {BUSINESS_STAGES[biz.stage-1]?.goal}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-mono text-white font-bold">৳ {biz.valuation.toLocaleString()}</p>
                                <p className="text-[10px] text-gray-500 uppercase">Valuation</p>
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-800 flex justify-between items-center">
                            <p className="text-xs text-gray-500">Monthly Rev: <span className="text-wealth-green font-mono">৳ {biz.monthlyRevenue.toLocaleString()}</span></p>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => startEditBusiness(biz)} className="text-gray-400 hover:text-blue-500"><Edit3 size={14}/></button>
                                <button onClick={() => handleDeleteBusiness(biz.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    </div>
                ))}
                {(data.businesses || []).length === 0 && (
                    <div className="h-full flex items-center justify-center border border-dashed border-gray-800 rounded-lg text-gray-500 text-xs italic">
                        No active ventures. Start building.
                    </div>
                )}
            </div>
        </div>
    </div>
  );

  const renderAudit = () => {
    const snapshots = [...(data.budgetSnapshots || [])].sort((a,b) => b.month.localeCompare(a.month));
    const sortedSnapshots = [...(data.budgetSnapshots || [])].sort((a, b) => a.month.localeCompare(b.month));
    const auditChartData = sortedSnapshots.map(s => ({
        month: s.month,
        income: s.income,
        expense: s.essentialExpenses + s.nonEssentialExpenses,
        savings: s.income - (s.essentialExpenses + s.nonEssentialExpenses)
    }));

    return (
    <div className="space-y-6 animate-in fade-in">
        {/* INPUT FORM */}
        <div className="glass-panel p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-white uppercase flex items-center gap-2">
                    <ClipboardList className="text-blue-500"/> Monthly Audit Record
                 </h3>
                 {isEditingSnapshot && <button onClick={() => {setIsEditingSnapshot(false); setSnapshotForm({month: new Date().toISOString().slice(0, 7), income: '', dependents: '0', essential: '', nonEssential: '', notes: ''})}} className="text-xs text-red-500">Cancel</button>}
            </div>

            <div className="space-y-4">
                <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Month</label>
                        <input type="month" value={snapshotForm.month} onChange={e => setSnapshotForm({...snapshotForm, month: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-700 outline-none focus:border-blue-500"/>
                     </div>
                     <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Income</label>
                        <input type="number" value={snapshotForm.income} onChange={e => setSnapshotForm({...snapshotForm, income: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-700 outline-none focus:border-blue-500"/>
                     </div>
                     <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Dependents</label>
                        <input type="number" value={snapshotForm.dependents} onChange={e => setSnapshotForm({...snapshotForm, dependents: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-700 outline-none focus:border-blue-500"/>
                     </div>
                </div>
                <div className="flex gap-4">
                     <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Essential Exp</label>
                        <input type="number" value={snapshotForm.essential} onChange={e => setSnapshotForm({...snapshotForm, essential: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-700 outline-none focus:border-blue-500"/>
                     </div>
                     <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Non-Essential Exp</label>
                        <input type="number" value={snapshotForm.nonEssential} onChange={e => setSnapshotForm({...snapshotForm, nonEssential: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-700 outline-none focus:border-blue-500"/>
                     </div>
                     <div className="flex-1">
                        <label className="text-[10px] text-gray-500 uppercase font-bold">Notes</label>
                        <input type="text" value={snapshotForm.notes} onChange={e => setSnapshotForm({...snapshotForm, notes: e.target.value})} className="w-full bg-black text-white p-2 rounded mt-1 border border-gray-700 outline-none focus:border-blue-500"/>
                     </div>
                </div>
                <button onClick={handleSaveSnapshot} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded text-xs uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-transform">
                    {isEditingSnapshot ? "Update Snapshot" : "Log Month"}
                </button>
            </div>
        </div>

        {/* AUDIT TABLE */}
        <div className="glass-panel rounded-lg overflow-hidden">
             <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-bold text-white uppercase">Historical Performance</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-400">
                    <thead className="bg-slate-900 text-gray-500 uppercase font-bold">
                        <tr>
                            <th className="p-3">Month</th>
                            <th className="p-3 text-right">Income</th>
                            <th className="p-3 text-center">People</th>
                            <th className="p-3 text-right">PPI / Class</th>
                            <th className="p-3 text-right">Expenses</th>
                            <th className="p-3 text-right">Savings</th>
                            <th className="p-3">Notes</th>
                            <th className="p-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {snapshots.map((s, index) => {
                            const totalPeople = (s.dependents || 0) + 1;
                            const ppi = s.income / totalPeople;
                            const totalExp = (s.essentialExpenses || 0) + (s.nonEssentialExpenses || 0);
                            const savings = s.income - totalExp;
                            const financialClass = getFinancialClass(ppi);
                            const prev = snapshots[index + 1];
                            const incomeTrend = prev ? (s.income >= prev.income ? 'UP' : 'DOWN') : 'FLAT';
                            const expenseTrend = prev ? ((totalExp <= (prev.essentialExpenses + prev.nonEssentialExpenses)) ? 'BETTER' : 'WORSE') : 'FLAT';
                            const savingsTrend = prev ? (savings >= (prev.income - (prev.essentialExpenses + prev.nonEssentialExpenses)) ? 'UP' : 'DOWN') : 'FLAT';

                            return (
                            <tr key={s.id} className="hover:bg-slate-900/50 group transition-colors">
                                <td className="p-3 font-mono text-white">{s.month}</td>
                                <td className="p-3 text-right font-mono text-white">
                                    <div className="flex items-center justify-end gap-1">
                                        {incomeTrend === 'UP' && <TrendingUp size={12} className="text-green-500"/>}
                                        {incomeTrend === 'DOWN' && <TrendingDown size={12} className="text-red-500"/>}
                                        {s.income.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-3 text-center">{totalPeople}</td>
                                <td className="p-3 text-right">
                                    <div className="flex flex-col items-end">
                                        <span className="font-mono text-white">৳ {Math.round(ppi).toLocaleString()}</span>
                                        <span className={`text-[9px] uppercase font-bold ${financialClass.color}`}>{financialClass.label}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-right font-mono">
                                    <div className="flex items-center justify-end gap-1">
                                        {expenseTrend === 'BETTER' && <TrendingDown size={12} className="text-green-500"/>}
                                        {expenseTrend === 'WORSE' && <TrendingUp size={12} className="text-red-500"/>}
                                        {totalExp.toLocaleString()}
                                    </div>
                                    <span className="text-[9px] text-gray-500 block">{s.essentialExpenses} Ess • {s.nonEssentialExpenses} Non</span>
                                </td>
                                <td className={`p-3 text-right font-mono font-bold ${savings > 0 ? 'text-wealth-green' : 'text-red-500'}`}>
                                    <div className="flex items-center justify-end gap-1">
                                         {savingsTrend === 'UP' && <TrendingUp size={12} className="text-green-500"/>}
                                         {savingsTrend === 'DOWN' && <TrendingDown size={12} className="text-red-500"/>}
                                         {savings.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-3 truncate max-w-[150px]">{s.notes}</td>
                                <td className="p-3 text-right">
                                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => startEditSnapshot(s)} className="text-blue-500 hover:text-blue-400"><Edit3 size={14}/></button>
                                        <button onClick={() => handleDeleteSnapshot(s.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                </td>
                            </tr>
                        )})}
                        {snapshots.length === 0 && <tr className="text-center"><td colSpan={8} className="p-6 italic">No monthly audits found.</td></tr>}
                    </tbody>
                </table>
             </div>
        </div>
    </div>
  )};

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-800 pb-4 gap-4">
        <div>
           <h2 className="text-3xl font-black text-wealth-green uppercase tracking-tighter flex items-center gap-3">
             <Landmark size={32} /> Wealth Fortress <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded border border-gray-800 align-middle ml-2">TITANIUM</span>
           </h2>
           <p className="text-xs text-gray-400 font-mono mt-1">EXPERT LEDGER • REAL-TIME INFLATION {INFLATION_RATE_BD * 100}% • AUTO-DISTRIBUTION ONLINE</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <button onClick={() => setShowSync(true)} className="px-3 py-2 rounded text-xs font-bold uppercase flex items-center gap-1 bg-slate-900 text-blue-400 border border-blue-900/50 hover:bg-blue-900/20 hover:border-blue-500 transition-all shadow-[0_0_10px_rgba(41,121,255,0.2)]">
                <Cloud size={14}/> Uplink
            </button>
            {[
                {id: 'COMMAND', icon: LayoutDashboard, label: 'Command Center'},
                {id: 'JOURNAL', icon: Brain, label: 'Journal'}, 
                {id: 'BLUEPRINT', icon: BookOpen, label: 'Blueprint'},
                {id: 'FIRE', icon: Rocket, label: 'Projection'},
                {id: 'OFFENSE', icon: Building2, label: 'Business'},
                {id: 'PORTFOLIO', icon: Crown, label: 'Assets & Liabilities'},
                {id: 'AUDIT', icon: FileText, label: 'Audit'},
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded text-xs font-bold uppercase transition-all active:scale-95 ${
                        activeTab === tab.id 
                        ? 'bg-amber-400 text-black shadow-[0_0_15px_#FBBF24]' 
                        : 'bg-slate-900 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-400'
                    }`}
                >
                    <tab.icon size={14} /> {tab.label}
                </button>
            ))}
        </div>
      </header>

      {/* SYNC MODAL */}
      {showSync && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
              <div className="bg-slate-950 border border-blue-500/50 rounded-xl w-full max-w-lg shadow-2xl relative">
                  <div className="p-6">
                      <div className="flex justify-between items-start mb-6">
                          <div><h3 className="text-xl font-black text-white uppercase flex items-center gap-2"><Cloud className="text-blue-500" /> Ledger Cloud Uplink</h3><p className="text-xs text-blue-400 font-mono mt-1">SECURE FINANCIAL DATA TRANSFER</p></div>
                          <button onClick={() => setShowSync(false)} className="text-gray-500 hover:text-white"><X size={24}/></button>
                      </div>
                      <div className="bg-black border border-gray-800 rounded p-4 mb-6 text-center">
                          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">UPLINK STATUS</p>
                          <p className={`text-sm font-mono font-bold ${syncState === 'SUCCESS' ? 'text-green-500' : syncState === 'ERROR' ? 'text-red-500' : syncState === 'SYNCING' ? 'text-yellow-500' : 'text-gray-300'}`}>{syncState === 'SYNCING' ? 'TRANSMITTING ENCRYPTED LEDGER...' : syncMsg || 'STANDBY'}</p>
                      </div>
                      <div className="mb-4">
                          <label className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Google Client ID</label>
                          <div className="flex gap-2">
                              <input type="text" value={gdriveClientId} onChange={(e) => setGdriveClientId(e.target.value)} placeholder="OAuth 2.0 Client ID" className="flex-1 bg-black border border-gray-700 rounded p-2 text-xs text-white outline-none focus:border-blue-500"/>
                              <button onClick={initGapi} className="bg-blue-900/20 text-blue-400 border border-blue-900 px-3 rounded hover:bg-blue-900/40"><RefreshCw size={14}/></button>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                          <button onClick={() => handleFinancialSync('PUSH')} disabled={!gdriveClientId} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-3 rounded font-bold uppercase text-xs flex items-center justify-center gap-2"><Upload size={14}/> Push Backup</button>
                          <button onClick={() => handleFinancialSync('PULL')} disabled={!gdriveClientId} className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white py-3 rounded font-bold uppercase text-xs flex items-center justify-center gap-2 border border-gray-700"><Download size={14}/> Restore Data</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {activeTab === 'COMMAND' && renderCommandCenter()}
      {activeTab === 'BLUEPRINT' && renderBlueprint()}
      {activeTab === 'OFFENSE' && renderOffense()}
      {activeTab === 'PORTFOLIO' && renderPortfolio()}
      {activeTab === 'AUDIT' && renderAudit()}
      {activeTab === 'FIRE' && renderFire()}
      {activeTab === 'JOURNAL' && renderJournal()}

    </div>
  );
};