
import React, { useState } from 'react';
// Correcting the import to use the available calculateDoacDose function from vteEngine.
import { calculateDoacDose } from '../services/vteEngine';

interface GuideItem {
  id: string;
  name: string;
  type: 'drug' | 'component' | 'doac' | 'thrombolytic';
  indications: string[];
  contraindications: string[];
  dosage: string;
  weightBasedDose: number; 
  unit: string;
  maxDose?: number;
  monitoring: string[];
  notes: string;
}

const GUIDES: GuideItem[] = [
  {
    id: 'ufh',
    name: '普通肝素 (UFH)',
    type: 'drug',
    indications: ['急性血栓初始治疗 (高出血风险者)', '高危 PTE (溶栓桥接)', '体外循环'],
    contraindications: ['严重活动性出血', '严重血小板减少', '既往 HIT 史'],
    dosage: '负荷量 75 IU/kg; 维持量 20-28 IU/(kg·h)。',
    weightBasedDose: 20, 
    unit: 'IU/(kg·h)',
    monitoring: ['APTT (目标正常值1.5-2.5倍)', '抗-Xa (0.35-0.70 U/mL)', '血小板计数 (警惕 HIT)'],
    notes: '2025共识：APTT 是 UFH 监测的基础。若过量导致大出血，鱼精蛋白中和比例为 1mg : 100U 肝素。'
  },
  {
    id: 'enoxaparin',
    name: '依诺肝素 (Enoxaparin)',
    type: 'drug',
    indications: ['儿童 VTE 首选抗凝', 'CRT 初始治疗', '预防术后血栓'],
    contraindications: ['严重肾功能不全 (eGFR < 30)', '严重出血', '依诺肝素过敏'],
    dosage: '年龄 > 2月: 1.0 mg/kg q12h (SC)。',
    weightBasedDose: 1,
    unit: 'mg/kg',
    monitoring: ['抗-Xa 峰浓度 (注射后4-6h, 目标 0.5-1.0 IU/mL)', '肾功能'],
    notes: '2025共识：临床最常用的传统抗凝药。需随体重增长每月复查抗-Xa 活性并调整剂量。'
  },
  {
    id: 'rtpa',
    name: '重组组织型纤溶酶原激活剂 (rt-PA)',
    type: 'thrombolytic',
    indications: ['高危 PTE (伴休克/心脏骤停)', '危及生命的动脉血栓', '严重双侧 RVT'],
    contraindications: ['近期(3周内)重大手术/创伤', '颅内出血史', '严重未纠正的凝血障碍'],
    dosage: '0.5 mg/(kg·h) 泵入 6h (总量不超 3mg/kg 或 100mg)。',
    weightBasedDose: 0.5,
    unit: 'mg/(kg·h)',
    maxDose: 100,
    monitoring: ['Fib (需 > 1.0 g/L)', 'Plt (需 > 100 x 10^9/L)', '严密神经系统体征'],
    notes: '2025共识：溶栓期间 UFH 输注速度建议下调 50%。新生儿使用 rt-PA 建议补充 FFP (10-20ml/kg)。'
  },
  {
    id: 'rivaroxaban',
    name: '利伐沙班 (Rivaroxaban)',
    type: 'doac',
    indications: ['VTE 维持治疗 (完成初始 5-21d 抗凝后)', '预防 VTE 复发'],
    contraindications: [' eGFR < 30 ml/min', '活动性出血', '严重肝功能损害'],
    dosage: '基于体重分层给药 (见血栓模块计算器)。',
    weightBasedDose: 0, 
    unit: 'mg',
    monitoring: ['血红蛋白 (评估隐匿性失血)', '肾功能', '用药依从性'],
    notes: '2024 ASH建议：利伐沙班应随餐服用。目前缺乏对于体质极弱或吸收障碍患儿的生物利用度数据。'
  }
];

const MedicationGuide: React.FC = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [selectedId, setSelectedId] = useState<string>(GUIDES[0].id);
  const [activeFilter, setActiveFilter] = useState<'all' | 'drug' | 'doac' | 'thrombolytic'>('all');

  const selectedItem = GUIDES.find(d => d.id === selectedId)!;
  
  const getCalculatedDisplay = () => {
    if (!weight) return "--";
    if (selectedItem.id === 'rivaroxaban') return "见计算引擎";
    const val = Math.min(Number(weight) * selectedItem.weightBasedDose, selectedItem.maxDose || Infinity);
    return val.toFixed(1);
  };

  const filteredGuides = GUIDES.filter(g => activeFilter === 'all' || (activeFilter === 'drug' && g.type === 'drug') || g.type === activeFilter);

  const cardClass = "bg-white/60 p-5 rounded-2xl border border-white/40 shadow-sm group hover:shadow-md transition-shadow";
  const titleClass = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 顶部计算卡片 */}
      <section className="glass rounded-3xl p-6 shadow-xl border-t-4 border-t-indigo-600 bg-white/50">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-tight">抗凝与溶栓给药工作台</h2>
            <p className="text-[10px] text-gray-500 font-black tracking-tight">基于 2025 儿童抗凝共识 / ASH 2024 指南</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-indigo-400 uppercase mb-1">患儿体重 (kg)</label>
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="0.0"
                className="w-full bg-white border-2 border-indigo-100 rounded-2xl px-4 py-3 text-xl font-black text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-indigo-400 uppercase mb-1">选择制剂</label>
              <select 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full bg-white border border-indigo-100 rounded-2xl px-4 py-3 text-sm font-black focus:outline-none"
              >
                {GUIDES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-inner border border-indigo-50 text-center min-h-[160px] relative overflow-hidden">
             {selectedItem.type === 'thrombolytic' && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>}
             <span className="text-[10px] font-black text-indigo-300 uppercase mb-2 tracking-widest">Calculated Result</span>
             <div className="flex items-baseline space-x-1">
               <span className={`leading-none font-black text-indigo-600 tracking-tighter ${selectedItem.id === 'rivaroxaban' ? 'text-2xl' : 'text-5xl'}`}>
                 {getCalculatedDisplay()}
               </span>
               {selectedItem.id !== 'rivaroxaban' && weight !== '' && <span className="text-indigo-300 font-black text-lg uppercase">{selectedItem.unit}</span>}
             </div>
             {selectedItem.id === 'rtpa' && <p className="text-[8px] text-red-500 font-black mt-3 border-t border-red-50 pt-2 animate-bounce">※ 需在 PICU/NICU 严密监测下使用</p>}
          </div>
        </div>
      </section>

      {/* 药物过滤器 */}
      <div className="flex justify-center space-x-2">
        {(['all', 'drug', 'doac', 'thrombolytic'] as const).map(f => (
          <button 
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all tracking-wider ${activeFilter === f ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/60 text-indigo-400 hover:bg-white'}`}
          >
            {f === 'all' ? '全部' : (f === 'drug' ? '肝素/传统' : (f === 'doac' ? 'DOACs' : '溶栓药物'))}
          </button>
        ))}
      </div>

      {/* 指南列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {filteredGuides.map(item => (
          <div key={item.id} className="glass rounded-3xl p-6 shadow-xl border border-white/30 flex flex-col h-full hover:shadow-2xl transition-all group relative overflow-hidden">
            {item.type === 'thrombolytic' && <div className="absolute top-0 right-0 p-2 bg-red-100 text-red-600 text-[8px] font-black rounded-bl-xl">HIGH ALERT</div>}
            <div className="mb-4 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-black text-gray-800 leading-tight group-hover:text-indigo-600 transition-colors uppercase">{item.name}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.type === 'doac' ? 'bg-blue-100 text-blue-600' : (item.type === 'thrombolytic' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600')}`}>
                  {item.type}
                </span>
              </div>
            </div>
            <div className="space-y-4 flex-grow">
              <div className={cardClass}>
                <h4 className={titleClass}><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-1"></span>2025 监测核心</h4>
                <ul className="text-[11px] font-bold text-gray-600 space-y-1 pl-1">
                  {item.monitoring.map((m, i) => <li key={i} className="flex items-center italic">▹ {m}</li>)}
                </ul>
              </div>
              <div className="bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100">
                <h4 className={`${titleClass} text-indigo-600`}><span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>专家共识 (Remarks)</h4>
                <p className="text-[11px] font-black text-indigo-900 leading-relaxed italic">{item.notes}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicationGuide;
