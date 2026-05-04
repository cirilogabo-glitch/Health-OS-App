import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  CheckCircle2, Circle, Camera, TrendingDown, 
  Activity, Scale, Zap, AlertCircle, RefreshCw 
} from 'lucide-react';

const API_URL = "https://script.google.com/macros/s/AKfycbyGlisGgRC3iWeKFeUFj12t-vBKIKjQlUdXVMX67eHFbX9_LTZZ3MsyMcGyqm5kdVxbWw/exec";

const ROUTINE_ITEMS = [
  { id: 'rybelsus', time: '06:00', label: 'Rybelsus 1.5mg', subtext: '120ml water, stay upright', icon: '💊', kcal: 0, pro: 0 },
  { id: 'b12', time: '07:00', label: 'B12 Sublingual', subtext: 'Active Methylcobalamin', icon: '⚡', kcal: 0, pro: 0 },
  { id: 'lmnt', time: '11:00', label: 'LMNT + 10g Collagen', subtext: 'Electrolytes + Peptides', icon: '💧', kcal: 40, pro: 10 },
  { id: 'huel', time: '13:00', label: 'Huel Black + 10g Collagen', subtext: 'Fuel + Multi Essentials', icon: '🥤', kcal: 440, pro: 50 },
  { id: 'dinner', time: '17:30', label: 'Dinner (Lean Protein)', subtext: 'Check Green List', icon: '🍽️', kcal: 0, pro: 0 },
  { id: 'magnesium', time: '21:00', label: 'Magnesium Glycinate', subtext: 'Calm & Recovery', icon: '🌙', kcal: 0, pro: 0 },
];

const TARGETS = { kcal: 1300, pro: 140 };

function App() {
  const [activeTab, setActiveTab] = useState('routine');
  const [dailyStatus, setDailyStatus] = useState(new Array(6).fill(false));
  const [weight, setWeight] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setDailyStatus(data.checks || []);
      setWeight(data.latestWeight || 0);
      setLoading(false);
    } catch (e) { console.error(e); setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleItem = async (id, index) => {
    const newStatus = [...dailyStatus];
    newStatus[index] = !newStatus[index];
    setDailyStatus(newStatus);
    await fetch(API_URL, { method: 'POST', body: JSON.stringify({ id, value: newStatus[index] }) });
  };

  const totals = ROUTINE_ITEMS.reduce((acc, item, i) => {
    if (dailyStatus[i]) { acc.kcal += item.kcal; acc.pro += item.pro; }
    return acc;
  }, { kcal: 0, pro: 0 });

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-black">HEALTH OS LOADING...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24 font-sans">
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">{activeTab}</h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Protocol 2026 • Accelerated</p>
      </header>

      {activeTab === 'routine' ? (
        <main className="px-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Energy</span>
              <div className="text-xl font-black italic">{totals.kcal} <span className="text-[10px] not-italic text-slate-600">/ {TARGETS.kcal}</span></div>
            </div>
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protein</span>
              <div className="text-xl font-black italic">{totals.pro}g <span className="text-[10px] not-italic text-slate-600">/ {TARGETS.pro}g</span></div>
            </div>
          </div>

          {ROUTINE_ITEMS.map((item, i) => (
            <button key={item.id} onClick={() => toggleItem(item.id, i)} className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${dailyStatus[i] ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-900 border-slate-800'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${dailyStatus[i] ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>{item.icon}</div>
              <div className="text-left flex-1">
                <div className="text-[10px] font-black text-blue-500 uppercase">{item.time}</div>
                <div className="font-bold text-sm">{item.label}</div>
                <div className="text-[10px] text-slate-500 font-medium">{item.subtext}</div>
              </div>
              {dailyStatus[i] ? <CheckCircle2 className="text-emerald-500" size={20} /> : <Circle className="text-slate-800" size={20} />}
            </button>
          ))}
          
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex gap-3">
            <AlertCircle className="text-amber-500 shrink-0" size={18} />
            <p className="text-[10px] text-amber-200/70 font-medium leading-tight">
              Stay upright for 60 mins after Rybelsus. Target: 125-140g protein daily[cite: 1].
            </p>
          </div>
        </main>
      ) : (
        <main className="px-6 text-center pt-10">
          <div className="bg-slate-900 rounded-full w-56 h-56 mx-auto flex flex-col items-center justify-center border-4 border-blue-500/10 shadow-2xl">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Weight Log</span>
            <div className="text-6xl font-black italic">{weight}</div>
            <span className="text-sm font-bold text-slate-500">KG</span>
          </div>
          <p className="mt-8 text-slate-500 text-xs font-black uppercase tracking-widest">Goal: 69.0 KG[cite: 3]</p>
        </main>
      )}

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-slate-950/90 backdrop-blur-xl border-t border-slate-900 flex justify-around items-center px-12">
        <button onClick={() => setActiveTab('routine')} className={activeTab === 'routine' ? 'text-blue-500' : 'text-slate-700'}>
          <CheckCircle2 size={28} strokeWidth={3} />
        </button>
        <button onClick={() => setActiveTab('performance')} className={activeTab === 'performance' ? 'text-blue-500' : 'text-slate-700'}>
          <Scale size={28} strokeWidth={3} />
        </button>
      </nav>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
