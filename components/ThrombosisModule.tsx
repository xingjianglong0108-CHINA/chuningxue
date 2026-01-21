
import React, { useState } from 'react';
import { VteScenario, PteRiskLevel, CrtSubtype } from '../types';
import { getVteRecommendation, calculateDoacDose, getPteStratification, getCrtManagementLogic } from '../services/vteEngine';

const ThrombosisModule: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<VteScenario | null>(null);
  const [weight, setWeight] = useState<number | ''>('');
  const [ageCategory, setAgeCategory] = useState('学龄期 (6-12岁)');

  // PTE 专项状态
  const [pteShock, setPteShock] = useState(false);
  const [pteStrain, setPteStrain] = useState(false);
  const [pteTrop, setPteTrop] = useState(false);
  const [pteSBP, setPteSBP] = useState<number | ''>('');
  const [pteHR, setPteHR] = useState<number | ''>('');
  const [pteSpO2, setPteSpO2] = useState<number | ''>('');

  // CRT 专项状态
  const [crtSub, setCrtSub] = useState<CrtSubtype>('dvt');
  const [crtInf, setCrtInf] = useState(false);
  const [crtDys, setCrtDys] = useState(false);
  const [crtUnn, setCrtUnn] = useState(false);

  const scenarioList: { id: VteScenario; label: string; icon: string; docs: string }[] = [
    { id: 'pte', label: '肺栓塞 (PTE)', icon: '🫁', docs: '2025 专家共识' },
    { id: 'crt', label: '导管血栓 (CRT)', icon: '💉', docs: '2024 专家建议' },
    { id: 'csvt', label: '脑窦血栓', icon: '🧠', docs: 'ASH 2024' },
    { id: 'unprovoked', label: '非诱发性 VTE', icon: '❓', docs: 'ASH 2024' },
    { id: 'rat', label: '右房血栓', icon: '❤️', docs: '2024 建议' },
    { id: 'rvt', label: '肾静脉血栓', icon: '🧪', docs: '2025 建议' },
    { id: 'pvt', label: '门静脉血栓', icon: '🧬', docs: '2024 建议' },
    { id: 'svt', label: '浅静脉血栓', icon: '🩸', docs: '2024 建议' }
  ];

  const rec = activeScenario ? getVteRecommendation(activeScenario) : null;
  const doacResult = weight ? calculateDoacDose(Number(weight), ageCategory) : null;
  
  const pteStatus = getPteStratification(
    pteShock, 
    pteStrain, 
    pteTrop, 
    ageCategory, 
    pteSBP !== '' ? Number(pteSBP) : undefined,
    pteHR !== '' ? Number(pteHR) : undefined,
    pteSpO2 !== '' ? Number(pteSpO2) : undefined
  );

  const crtLogic = getCrtManagementLogic(crtSub, crtInf, crtDys, crtUnn);

  const checkboxClass = (active: boolean) => `p-3 rounded-xl border flex items-center space-x-2 cursor-pointer transition-all ${active ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-white/60 text-gray-600 border-gray-100 hover:bg-white'}`;
  const inputClass = "w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all";

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 顶部场景选择 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {scenarioList.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(s.id)}
            className={`p-4 rounded-3xl border transition-all flex flex-col items-center text-center space-y-1 ${activeScenario === s.id ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl scale-105' : 'bg-white/40 border-white/20 text-gray-700 hover:bg-white/60'}`}
          >
            <span className="text-2xl mb-1">{s.icon}</span>
            <span className="text-xs font-black">{s.label}</span>
            <span className="text-[8px] opacity-60 font-bold uppercase">{s.docs}</span>
          </button>
        ))}
      </div>

      {activeScenario && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：精细诊断评估 */}
          <div className="lg:col-span-2 space-y-6">
            {/* PTE 分层工具 */}
            {activeScenario === 'pte' && (
              <div className="glass rounded-3xl p-6 shadow-xl border-l-8 border-l-red-500 bg-white/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-gray-800 uppercase tracking-wider flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>
                    PTE 临床分层评估 (2025版)
                  </h4>
                  <span className="text-[10px] font-black text-red-400 animate-pulse">※ 优先评估生命体征</span>
                </div>

                {/* 生命体征输入 - 核心补充 */}
                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                     <label className="text-[9px] font-black text-red-400 uppercase mb-1 block">收缩压 (SBP mmHg)</label>
                     <input type="number" value={pteSBP} onChange={e => setPteSBP(e.target.value === '' ? '' : Number(e.target.value))} className={inputClass} placeholder="输入数值..." />
                   </div>
                   <div>
                     <label className="text-[9px] font-black text-red-400 uppercase mb-1 block">心率 (HR bpm)</label>
                     <input type="number" value={pteHR} onChange={e => setPteHR(e.target.value === '' ? '' : Number(e.target.value))} className={inputClass} placeholder="输入数值..." />
                   </div>
                   <div>
                     <label className="text-[9px] font-black text-red-400 uppercase mb-1 block">血氧饱和度 (SpO2 %)</label>
                     <input type="number" value={pteSpO2} onChange={e => setPteSpO2(e.target.value === '' ? '' : Number(e.target.value))} className={inputClass} placeholder="输入数值..." />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <label className={checkboxClass(pteShock)}>
                    <input type="checkbox" checked={pteShock} onChange={e => setPteShock(e.target.checked)} className="hidden" />
                    <span className="text-[10px] font-black uppercase">临床休克/器官灌注不足</span>
                  </label>
                  <label className={checkboxClass(pteStrain)}>
                    <input type="checkbox" checked={pteStrain} onChange={e => setPteStrain(e.target.checked)} className="hidden" />
                    <span className="text-[10px] font-black uppercase">RV 心室受累 (超声)</span>
                  </label>
                  <label className={checkboxClass(pteTrop)}>
                    <input type="checkbox" checked={pteTrop} onChange={e => setPteTrop(e.target.checked)} className="hidden" />
                    <span className="text-[10px] font-black uppercase">心肌损伤标志物 (+)</span>
                  </label>
                </div>

                <div className={`p-5 rounded-2xl border-2 shadow-sm transition-all ${pteStatus.color === 'red' ? 'bg-red-50 border-red-200 text-red-800' : (pteStatus.color === 'orange' ? 'bg-orange-50 border-orange-200 text-orange-800' : (pteStatus.color === 'indigo' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' : 'bg-blue-50 border-blue-200 text-blue-800'))}`}>
                  <div className="text-[10px] font-black uppercase opacity-60 mb-1 tracking-tighter">Diagnostic Conclusion</div>
                  <div className="text-xl font-black mb-1">{pteStatus.label}</div>
                  <div className="text-xs font-bold leading-relaxed">{pteStatus.action}</div>
                  {pteStatus.notes && (
                    <div className="mt-2 text-[9px] font-black uppercase italic bg-white/40 px-2 py-1 rounded inline-block">
                      Note: {pteStatus.notes}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CRT 导管逻辑 */}
            {activeScenario === 'crt' && (
              <div className="glass rounded-3xl p-6 shadow-xl border-l-8 border-l-indigo-500 bg-white/50">
                <h4 className="font-black text-gray-800 mb-4 uppercase tracking-wider flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>
                  CRT 血栓分型与导管处置 (2024 建议)
                </h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">血栓形态评估</label>
                      <select value={crtSub} onChange={e => setCrtSub(e.target.value as any)} className="w-full bg-white/80 border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none">
                        <option value="fibrin_sheath">单纯纤维蛋白鞘 (Fibrin Sheath)</option>
                        <option value="intraluminal">腔内血栓 (Intraluminal Clot)</option>
                        <option value="mural">附壁血栓 (Mural Thrombus)</option>
                        <option value="dvt">导管相关肢体 DVT</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <label className={`flex items-center space-x-2 text-xs p-2 rounded-xl transition-all ${crtInf ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                        <input type="checkbox" checked={crtInf} onChange={e => setCrtInf(e.target.checked)} className="w-4 h-4" />
                        <span className="font-black uppercase">伴有导管相关感染 (CRBSI)</span>
                      </label>
                      <label className={`flex items-center space-x-2 text-xs p-2 rounded-xl transition-all ${crtDys ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                        <input type="checkbox" checked={crtDys} onChange={e => setCrtDys(e.target.checked)} className="w-4 h-4" />
                        <span className="font-black uppercase">导管完全失去通畅功能</span>
                      </label>
                    </div>
                  </div>
                  <div className={`p-5 rounded-2xl border-2 transition-all ${crtLogic.type === 'remove' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-indigo-50 border-indigo-200 text-indigo-800'}`}>
                    <div className="text-lg font-black mb-1">{crtLogic.advice}</div>
                    <div className="text-xs font-bold leading-relaxed">{crtLogic.timing}</div>
                    {crtLogic.type === 'remove' && (
                      <div className="mt-3 p-3 bg-white/40 rounded-xl border border-red-100 flex items-center">
                        <span className="text-[10px] font-black text-red-600 mr-2 uppercase tracking-tighter animate-pulse italic">Recommendation:</span>
                        <span className="text-[10px] font-black leading-tight">移除前预抗凝：LMWH (依诺肝素) 1.0mg/kg q12h</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 核心建议卡片 */}
            <div className="glass rounded-3xl p-8 shadow-2xl border-t-4 border-t-indigo-600 bg-white/80">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${rec?.strength === 'Strong' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {rec?.strength} Recommendation
                  </span>
                  <h3 className="text-2xl font-black text-gray-800 mt-2">{rec?.scenarioName}</h3>
                </div>
              </div>
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-8">
                <p className="text-lg font-black text-indigo-900 leading-relaxed">{rec?.recommendation}</p>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></span>专家备注 (Key Remarks)
                  </h4>
                  <p className="text-sm text-gray-600 italic font-medium leading-relaxed bg-white/40 p-4 rounded-2xl border border-gray-50">{rec?.remarks}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/60 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-2">一线药物选择</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec?.medicationOptions.map((opt, i) => (
                        <span key={i} className="bg-indigo-50 px-2 py-1 rounded text-[10px] font-black text-indigo-700 shadow-sm border border-indigo-100">{opt}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-white/60 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h4 className="text-[10px] font-black text-green-400 uppercase mb-2">2025 监测靶值</h4>
                    <ul className="text-[10px] font-black text-gray-500 space-y-1">
                      {rec?.monitoringTargets?.map((t, i) => <li key={i}>• {t}</li>) || <li>• 参照抗凝监测规范</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：DOAC 剂量与监测红线 */}
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 shadow-xl border border-white/40 bg-indigo-50/30">
              <div className="text-center border-b border-indigo-100 pb-4 mb-6">
                <h4 className="text-lg font-black text-gray-800">抗凝/溶栓计算引擎</h4>
                <p className="text-[10px] text-gray-400 font-black uppercase">Precision Dosing (2025)</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">患儿年龄段</label>
                  <select value={ageCategory} onChange={e => setAgeCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold">
                    <option>新生儿 (0-28天)</option>
                    <option>婴儿 (29天-1岁)</option>
                    <option>学龄期 (6-12岁)</option>
                    <option>青少年 (12-18岁)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">体重 (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {doacResult && (
                <div className="space-y-3 animate-fade-in">
                  <div className="p-4 bg-white rounded-2xl shadow-inner border border-indigo-100">
                    <span className="text-[8px] font-black text-indigo-400 uppercase">利伐沙班 (Rivaroxaban)</span>
                    <p className="text-xl font-black text-indigo-700 leading-tight">{doacResult.rivaroxaban}</p>
                    <p className="text-[8px] text-gray-400 font-bold mt-1 leading-none italic">※ 2025 共识建议：随餐服用</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-inner border border-purple-100">
                    <span className="text-[8px] font-black text-purple-400 uppercase">达比加群 (Dabigatran)</span>
                    <p className="text-xl font-black text-purple-700 leading-tight">{doacResult.dabigatran}</p>
                    <p className="text-[8px] text-gray-400 font-bold mt-1 leading-none italic">※ 仅限胶囊剂型计算</p>
                  </div>
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white text-[9px] font-bold leading-relaxed shadow-lg">
                    {doacResult.notes}
                  </div>
                </div>
              )}
              
              <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border-2 border-dashed border-yellow-200">
                <h5 className="text-[10px] font-black text-yellow-800 uppercase flex items-center mb-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2v-3a1 1 0 00-1-1H9a1 1 0 100 2v3a1 1 0 001 1h1z" clipRule="evenodd"/></svg>
                  2025 治疗安全红线 (Red Lines)
                </h5>
                <ul className="text-[9px] font-black text-yellow-700 space-y-2 leading-snug uppercase tracking-tight">
                  <li className="flex items-start"><span className="mr-1 mt-0.5">•</span>溶栓前提：Plt 必须 > 100 × 10⁹/L</li>
                  <li className="flex items-start"><span className="mr-1 mt-0.5">•</span>溶栓前提：Fib 必须 > 1.0 g/L</li>
                  <li className="flex items-start"><span className="mr-1 mt-0.5">•</span>PTE 高危泵入方案：rt-PA 0.5mg/kg/h</li>
                  <li className="flex items-start"><span className="mr-1 mt-0.5">•</span>抗凝逆转：UFH 过量首选鱼精蛋白</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThrombosisModule;
