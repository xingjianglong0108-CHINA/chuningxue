
import React from 'react';
import { AnalysisResult, CoagData } from '../types';
import { PEDIATRIC_REF_RANGES } from '../constants';

interface Props {
  result: AnalysisResult;
  data: CoagData;
}

const AnalysisDisplay: React.FC<Props> = ({ result, data }) => {
  const hasPriorityAdvice = result.treatmentAdvice.some(a => a.includes("【引用") || a.includes("【核心") || a.includes("关键"));

  const hasTegData = data.tegR || data.tegK || data.tegAngle || data.tegMa || data.tegLy30;

  const getStatusColor = (val: number, range: { min?: number; max?: number }) => {
    if (range.min !== undefined && val < range.min) return 'text-blue-600';
    if (range.max !== undefined && val > range.max) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`glass rounded-3xl p-8 shadow-2xl border-t-4 ${hasPriorityAdvice ? 'border-t-orange-500' : 'border-t-blue-500'}`}>
        <div className="mb-6 flex justify-between items-start">
          <div>
            <span className={`${hasPriorityAdvice ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'} px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider`}>
              {hasPriorityAdvice ? '共识库核心建议' : '本地专家分析结论'}
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mt-2 leading-tight">{result.diagnosticImpression}</h2>
          </div>
          <div className="bg-gray-100 text-gray-400 px-2 py-1 rounded-lg border border-gray-200 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414L8.586 10l-6.293 6.293a1 1 0 101.414 1.414L10 11.414l6.293 6.293a1 1 0 001.414-1.414L11.414 10l6.293-6.293a1 1 0 00-1.414-1.414L10 8.586 3.707 2.293z" clipRule="evenodd"/></svg>
            <span className="text-[9px] font-black uppercase">Offline Mode</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* 分析依据 */}
          <section>
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
              <span className={`w-1 h-6 ${hasPriorityAdvice ? 'bg-orange-400' : 'bg-blue-400'} rounded-full mr-2`}></span>
              病理生理推导依据
            </h3>
            <div className="text-gray-600 leading-relaxed bg-white/30 p-5 rounded-2xl border border-white/40 shadow-inner">
              {result.reasoning}
            </div>
          </section>

          {/* TEG 数据展示 */}
          {hasTegData && (
            <section className="bg-white/40 rounded-3xl p-6 border border-white/60 shadow-inner">
              <h3 className="text-sm font-black text-gray-500 uppercase mb-4 flex items-center tracking-widest">
                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                血栓弹力图 (TEG) 黏弹性评估
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'R (min)', value: data.tegR, range: PEDIATRIC_REF_RANGES.TEG_R, desc: '凝血因子活性' },
                  { label: 'K (min)', value: data.tegK, range: PEDIATRIC_REF_RANGES.TEG_K, desc: '纤维蛋白形成' },
                  { label: 'α-Angle', value: data.tegAngle, range: PEDIATRIC_REF_RANGES.TEG_ANGLE, desc: '速率' },
                  { label: 'MA (mm)', value: data.tegMa, range: PEDIATRIC_REF_RANGES.TEG_MA, desc: '血小板强度' },
                  { label: 'LY30 (%)', value: data.tegLy30, range: PEDIATRIC_REF_RANGES.TEG_LY30, desc: '纤溶稳定性' }
                ].map((teg, i) => (
                  <div key={i} className="bg-white/50 p-3 rounded-2xl border border-white/20 text-center">
                    <div className="text-[10px] font-black text-gray-400 uppercase">{teg.label}</div>
                    <div className={`text-xl font-black my-1 ${teg.value ? getStatusColor(Number(teg.value), teg.range) : 'text-gray-300'}`}>
                      {teg.value || '--'}
                    </div>
                    <div className="text-[8px] font-bold text-gray-400">Ref: {teg.range.min || 0}-{teg.range.max}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 治疗建议与后续流程 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className={`${hasPriorityAdvice ? 'bg-orange-50/60 border-orange-100' : 'bg-green-50/50 border-green-100'} p-6 rounded-2xl border shadow-sm`}>
              <h3 className={`${hasPriorityAdvice ? 'text-orange-800' : 'text-green-800'} font-bold mb-3 flex items-center text-sm uppercase tracking-wider`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                共识库建议条文
              </h3>
              <ul className="space-y-3">
                {result.treatmentAdvice.map((item, idx) => (
                  <li key={idx} className={`text-sm ${item.includes("【") ? 'font-black text-gray-800' : 'text-gray-700'} flex items-start`}>
                    <span className={`mr-2 mt-1 w-1.5 h-1.5 rounded-full ${hasPriorityAdvice ? 'bg-orange-500' : 'bg-green-500'}`}></span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 shadow-sm">
              <h3 className="text-purple-800 font-bold mb-3 flex items-center text-sm uppercase tracking-wider">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                后续鉴别诊断流程
              </h3>
              <ul className="space-y-2">
                {result.furtherTests.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 font-bold flex items-start">
                    <span className="mr-2 text-purple-500">▶</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* 参考文档 */}
          <section className="mt-4 pt-4 border-t border-white/20">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">共识匹配来源</h4>
            <div className="flex flex-wrap gap-2">
              {result.referenceDocs.map((doc, idx) => (
                <span key={idx} className="bg-white/40 text-gray-500 px-3 py-1 rounded-full text-[10px] border border-white/30 font-bold italic">
                  Ref: {doc}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
