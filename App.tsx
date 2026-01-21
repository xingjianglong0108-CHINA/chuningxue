
import React, { useState } from 'react';
import { CoagData, AnalysisResult } from './types';
import { analyzeCoagulation } from './services/ruleEngine';
import CoagInputForm from './components/CoagInputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import ReferencePanel from './components/ReferencePanel';
import ScoringCenter from './components/ScoringCenter';
import MedicationGuide from './components/MedicationGuide';
import ThrombosisModule from './components/ThrombosisModule';
import MonitoringStandards from './components/MonitoringStandards';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'analysis' | 'scoring' | 'medication' | 'thrombosis' | 'monitoring'>('analysis');
  const [data, setData] = useState<CoagData>({
    pt: '',
    aptt: '',
    fib: '',
    tt: '',
    plt: '',
    dd: '',
    alt: '',
    ast: '',
    anticoagulantUse: 'none',
    sofaScore: '',
    age: '幼儿 (1-3岁)',
    diseaseName: '',
    symptoms: '',
    pltMorphology: 'unknown',
    pfa100: '',
    bleedingTime: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    setLoading(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const analysis = analyzeCoagulation(data);
        setResult(analysis);
        window.scrollTo({ top: 400, behavior: 'smooth' });
      } catch (err) {
        setError('分析过程出错，请检查输入数值。');
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <header className="sticky top-0 z-50 mb-8 pt-4">
        <div className="glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-xl gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl ios-gradient flex items-center justify-center text-white shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-gradient-primary leading-tight">儿童出凝血异常辅助决策</h1>
              <p className="text-[10px] font-black text-gradient-subtitle tracking-[0.2em] uppercase mt-0.5">By Jefflong</p>
            </div>
          </div>
          
          <nav className="flex bg-gray-100/50 p-1 rounded-xl overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveView('analysis')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeView === 'analysis' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              分析决策
            </button>
            <button 
              onClick={() => setActiveView('thrombosis')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeView === 'thrombosis' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              血栓管理
            </button>
            <button 
              onClick={() => setActiveView('monitoring')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeView === 'monitoring' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              监测规范
            </button>
            <button 
              onClick={() => setActiveView('scoring')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeView === 'scoring' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              评分工具
            </button>
            <button 
              onClick={() => setActiveView('medication')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${activeView === 'medication' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              剂量方案
            </button>
          </nav>
        </div>
      </header>

      <main className="space-y-6">
        {activeView === 'analysis' && (
          <>
            <CoagInputForm data={data} setData={setData} onAnalyze={handleAnalyze} loading={loading} />
            {error && <div className="p-4 bg-red-100 text-red-700 rounded-2xl">{error}</div>}
            {result && <AnalysisDisplay result={result} data={data} />}
            <ReferencePanel />
          </>
        )}
        {activeView === 'thrombosis' && <ThrombosisModule />}
        {activeView === 'monitoring' && <MonitoringStandards />}
        {activeView === 'scoring' && <ScoringCenter />}
        {activeView === 'medication' && <MedicationGuide />}
      </main>

      <footer className="mt-12 pb-12 text-center text-gray-400 text-sm">
        <p className="font-bold">© 2024-2025 儿童出凝血异常辅助决策系统</p>
        <p className="text-[10px] mt-1 italic">指南版本：2025 儿童抗凝药物治疗共识 | 2024 ASH VTE Guidelines</p>
        <p className="text-[9px] mt-2 font-black text-gradient-subtitle tracking-widest uppercase opacity-70">Design by Jefflong</p>
      </footer>
    </div>
  );
};

export default App;
