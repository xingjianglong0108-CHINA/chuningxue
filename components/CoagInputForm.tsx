
import React, { useState } from 'react';
import { CoagData } from '../types';
import { PEDIATRIC_REF_RANGES, COMMON_DISEASES } from '../constants';

interface Props {
  data: CoagData;
  setData: React.Dispatch<React.SetStateAction<CoagData>>;
  onAnalyze: () => void;
  loading: boolean;
}

const CoagInputForm: React.FC<Props> = ({ data, setData, onAnalyze, loading }) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'teg'>('basic');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setData(prev => ({ ...prev, [name]: checked }));
    } else {
      setData(prev => ({ ...prev, [name]: value }));
    }
  };

  const inputClass = "w-full bg-white/50 border border-white/20 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-sm font-semibold";
  const labelClass = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1 flex justify-between items-end";
  const hintClass = "text-[9px] text-blue-400 font-normal normal-case italic";

  const toggleClass = (active: boolean) => `flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${active ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`;

  return (
    <div className="glass rounded-3xl p-6 shadow-xl space-y-6">
      {/* 头部：基础背景 */}
      <div className="space-y-4 border-b border-white/20 pb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-gray-800">临床背景评估 (Clinical Context)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>年龄分层 <span className={hintClass}>Age Stratification</span></label>
            <select name="age" value={data.age} onChange={handleChange} className={inputClass}>
              <option>新生儿 (0-28天)</option>
              <option>婴儿 (29天-1岁)</option>
              <option>幼儿 (1-3岁)</option>
              <option>学龄前 (3-6岁)</option>
              <option>学龄期 (6-12岁)</option>
              <option>青少年 (12-18岁)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>疑诊方向 <span className={hintClass}>Primary Suspicion</span></label>
            <input type="text" name="diseaseName" value={data.diseaseName} onChange={handleChange} list="disease-list" placeholder="搜索共识疾病..." className={inputClass} />
            <datalist id="disease-list">
              {COMMON_DISEASES.map((d, i) => <option key={i} value={d} />)}
            </datalist>
          </div>
        </div>

        {/* 临床高危快速标记 */}
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
          <label className="text-[9px] font-black text-blue-400 uppercase mb-3 block">关键临床场景标记 (离线推导因子)</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              { id: 'isSepsis', label: '脓毒症', icon: '🦠' },
              { id: 'isTbi', label: '颅脑外伤', icon: '🧠' },
              { id: 'isCvc', label: '中心静脉置管', icon: '💉' },
              { id: 'isMajorSurgery', label: '大手术', icon: '✂️' },
              { id: 'isLiverFailure', label: '肝功能衰竭', icon: '🧪' }
            ].map(item => (
              <label key={item.id} className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${data[item.id as keyof CoagData] ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-white border-gray-100 text-gray-600 hover:border-blue-200'}`}>
                <input type="checkbox" name={item.id} checked={!!data[item.id as keyof CoagData]} onChange={handleChange} className="hidden" />
                <span className="text-lg mb-1">{item.icon}</span>
                <span className="text-[10px] font-black whitespace-nowrap">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 实验室指标页签 */}
      <div className="flex bg-gray-100/50 p-1 rounded-xl">
        <button onClick={() => setActiveTab('basic')} className={toggleClass(activeTab === 'basic')}>基础六项</button>
        <button onClick={() => setActiveTab('advanced')} className={toggleClass(activeTab === 'advanced')}>特殊/形态</button>
        <button onClick={() => setActiveTab('teg')} className={toggleClass(activeTab === 'teg')}>血栓弹力图 (TEG)</button>
      </div>

      <div className="min-h-[280px]">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in">
            <div className="space-y-1">
              <label className={labelClass}>PT (s) <span className={hintClass}>Ref: 11-14</span></label>
              <input type="number" name="pt" value={data.pt} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>INR <span className={hintClass}>Ref: 0.8-1.2</span></label>
              <input type="number" step="0.01" name="inr" value={data.inr || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>APTT (s) <span className={hintClass}>Ref: 25-35</span></label>
              <input type="number" name="aptt" value={data.aptt} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>FIB (g/L) <span className={hintClass}>Ref: 2.0-4.0</span></label>
              <input type="number" step="0.1" name="fib" value={data.fib} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>TT (s) <span className={hintClass}>Ref: 14-21</span></label>
              <input type="number" name="tt" value={data.tt} onChange={handleChange} placeholder="凝血酶时间" className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>PLT (10^9/L) <span className={hintClass}>Ref: 150-450</span></label>
              <input type="number" name="plt" value={data.plt} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>D-Dimer (mg/L) <span className={hintClass}>Ref: &lt;0.5</span></label>
              <input type="number" step="0.01" name="dd" value={data.dd} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>AT-Ⅲ (%) <span className={hintClass}>Ref: 80-120</span></label>
              <input type="number" name="at3" value={data.at3 || ''} onChange={handleChange} placeholder="抗凝血酶Ⅲ活性" className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>乳酸 (mmol/L) <span className={hintClass}>Ref: &lt;2.0</span></label>
              <input type="number" step="0.1" name="lactate" value={data.lactate || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>ALT (U/L) <span className={hintClass}>Ref: &lt;40</span></label>
              <input type="number" name="alt" value={data.alt || ''} onChange={handleChange} className={inputClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>AST (U/L) <span className={hintClass}>Ref: &lt;40</span></label>
              <input type="number" name="ast" value={data.ast || ''} onChange={handleChange} className={inputClass} />
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>血小板形态 <span className={hintClass}>Peripheral Smear</span></label>
                <select name="pltMorphology" value={data.pltMorphology} onChange={handleChange} className={inputClass}>
                  <option value="unknown">未观察/不详</option>
                  <option value="normal">正常</option>
                  <option value="large">巨大血小板 (疑 BSS/MYH9)</option>
                  <option value="small">小血小板 (疑 WAS)</option>
                  <option value="clumping">血小板聚集/成堆 (伪性减少?)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>功能检测 (PFA/LTA)</label>
                <input type="text" name="pfa100" value={data.pfa100 || ''} onChange={handleChange} placeholder="如：ADP 延长, Epi 正常" className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className={labelClass}>SOFA 评分 (器官功能)</label>
                  <input type="number" name="sofaScore" value={data.sofaScore || ''} onChange={handleChange} placeholder="请输入 SOFA 分值" className={inputClass} />
               </div>
               <div>
                  <label className={labelClass}>抗凝药物暴露史</label>
                  <select name="anticoagulantUse" value={data.anticoagulantUse} onChange={handleChange} className={inputClass}>
                    <option value="none">无相关暴露</option>
                    <option value="heparin">肝素/低分子肝素</option>
                    <option value="warfarin">华法林</option>
                    <option value="doac">DOAC (利伐沙班等)</option>
                  </select>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'teg' && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
              <p className="text-[10px] text-orange-600 font-bold mb-3 italic">提示：TEG 提供全血黏弹性评估，对大出血/术中决策至关重要。</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-1">
                  <label className={labelClass}>R (min) <span className={hintClass}>因子</span></label>
                  <input type="number" step="0.1" name="tegR" value={data.tegR || ''} onChange={handleChange} placeholder="4-8" className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>K (min) <span className={hintClass}>纤溶原</span></label>
                  <input type="number" step="0.1" name="tegK" value={data.tegK || ''} onChange={handleChange} placeholder="1-3" className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Angle (deg) <span className={hintClass}>速率</span></label>
                  <input type="number" name="tegAngle" value={data.tegAngle || ''} onChange={handleChange} placeholder="55-78" className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>MA (mm) <span className={hintClass}>PLT强度</span></label>
                  <input type="number" name="tegMa" value={data.tegMa || ''} onChange={handleChange} placeholder="51-69" className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>LY30 (%) <span className={hintClass}>纤溶</span></label>
                  <input type="number" step="0.1" name="tegLy30" value={data.tegLy30 || ''} onChange={handleChange} placeholder="<3" className={inputClass} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/20">
        <label className={labelClass}>临床描述 (专家共识库匹配关键描述词)</label>
        <textarea name="symptoms" value={data.symptoms} onChange={handleChange} placeholder="描述出血情况：例如出生即有皮肤瘀斑、关节出血..." rows={3} className={`${inputClass} resize-none`} />
      </div>

      <button
        onClick={onAnalyze}
        disabled={loading}
        className={`w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'ios-gradient hover:shadow-2xl hover:-translate-y-0.5'}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>正在匹配本地共识指南逻辑...</span>
          </>
        ) : (
          <span>启动本地专家共识库分析</span>
        )}
      </button>
      <div className="text-center">
        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">⚠️ 离线模式：所有分析均在本地执行，不上传医疗数据</span>
      </div>
    </div>
  );
};

export default CoagInputForm;
