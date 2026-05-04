import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Camera, Zap, Activity, Scale, AlertCircle, Clock } from 'lucide-react';

const ROUTINE_ITEMS = [
  { id: 'rybelsus', time: '06:00', label: 'Rybelsus 1.5mg', icon: '💊', macros: { kcal: 0, pro: 0 } },
  { id: 'b12', time: '07:00', label: 'B12 Sublingual', icon: '⚡', macros: { kcal: 0, pro: 0 } },
  { id: 'lmnt', time: '11:00', label: 'LMNT + Collagen', icon: '💧', macros: { kcal: 40, pro: 10 } },
  { id: 'huel', time: '13:00', label: 'Huel + Collagen', icon: '🥤', macros: { kcal: 440, pro: 50 } },
  { id: 'dinner', time: '17:30', label: 'Dinner (Lean)', icon: '🍽️', macros: null },
  { id: 'magnesium', time: '21:00', label: 'Magnesium', icon: '🌙', macros: { kcal: 0, pro: 0 } },
];

const TARGETS = { kcal: 1300, pro: 140 };

const App = () => {
  const [activeTab, setActiveTab] = useState('routine');
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleItem = (id) => {
    setDailyData(prev => ({ ...prev, [id]: !prev[id] }));
    // API Call to Google Sheet would go here
  };

  const totals = ROUTINE_ITEMS.reduce((acc, item) => {
    if (dailyData[item.id] && item.macros) {
      acc.kcal += item.macros.kcal;
      acc.pro += item.macros.pro;
    }
    return acc;
  }, { kcal: 0, pro: 0 });

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-100 font-sans pb-24 overflow-hidden">
      {/* Slim Header */}
      <header className="p-5 pt-8 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-black tracking-tighter italic">HEALTH OS</h1>
          <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Protocol 2026 • Accelerated</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</p>
        </div>
      </header>

      {/* Condensed Progress Section */}
      <section className="px-5 mb-6 grid grid-cols-2 gap-2">
        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl">
          <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 mb-1">
            <span>Energy</span>
            <span className={totals.kcal > TARGETS.kcal ? "text-red-400" : "text-blue-400"}>{totals.kcal}/{TARGETS.kcal}</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(totals.kcal/TARGETS.kcal)*100}%` }} />
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-2xl">
          <div className="flex justify-between text-[9px] font-black uppercase text-slate-500 mb-1">
            <span>Protein</span>
            <span className="text-emerald-400">{totals.pro}g/{TARGETS.pro}g</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(totals.pro/TARGETS.pro)*100}%` }} />
          </div>
        </div>
      </section>

      {/* Optimized List */}
      <section className="px-5 space-y-1.5">
        {ROUTINE_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
              dailyData[item.id] ? 'bg-emerald-500/5 border-emerald-500/20 shadow-none' : 'bg-slate-900/40 border-slate-800 shadow-sm'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${dailyData[item.id] ? 'bg-emerald-500/20' : 'bg-slate-800'}`}>
              {item.icon}
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black italic ${dailyData[item.id] ? 'text-emerald-500' : 'text-blue-500'}`}>{item.time}</span>
                <h3 className={`text-sm font-bold ${dailyData[item.id] ? 'text-slate-500' : 'text-white'}`}>{item.label}</h3>
              </div>
            </div>
            {dailyData[item.id] ? <CheckCircle2 className="text-emerald-500" size={18} /> : <Circle className="text-slate-800" size={18} />}
          </button>
        ))}
      </section>

      {/* Floating Action Button for Dinner Photo */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-blue-600 rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform z-40 border-4 border-slate-950">
        <Camera size={24} />
      </button>

      {/* Navigation */}
      <nav className="fixed bottom-0 inset-x-0 h-20 bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 flex justify-around items-center px-10 pb-4">
        <button onClick={() => setActiveTab('routine')} className={activeTab === 'routine' ? "text-blue-500" : "text-slate-600"}><Clock size={22} /></button>
        <button onClick={() => setActiveTab('weight')} className={activeTab === 'weight' ? "text-blue-500" : "text-slate-600"}><Scale size={22} /></button>
      </nav>
    </div>
  );
};

export default App;
