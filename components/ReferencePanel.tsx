
import React from 'react';
import { PEDIATRIC_REF_RANGES } from '../constants';

const ReferencePanel: React.FC = () => {
  return (
    <div className="glass rounded-3xl p-6 shadow-xl border border-white/10">
      <h3 className="text-gray-800 font-semibold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2v-3a1 1 0 00-1-1H9a1 1 0 100 2v3a1 1 0 001 1h1z" clipRule="evenodd" />
        </svg>
        儿童凝血指标参考值 (常规建议值)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 text-sm">
        <div className="bg-white/20 p-3 rounded-xl">
          <span className="text-gray-500 block text-xs">PT (凝血酶原时间)</span>
          <span className="font-bold text-gray-800">{PEDIATRIC_REF_RANGES.PT.min}-{PEDIATRIC_REF_RANGES.PT.max} {PEDIATRIC_REF_RANGES.PT.unit}</span>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <span className="text-gray-500 block text-xs">APTT (活化部分凝血活酶时间)</span>
          <span className="font-bold text-gray-800">{PEDIATRIC_REF_RANGES.APTT.min}-{PEDIATRIC_REF_RANGES.APTT.max} {PEDIATRIC_REF_RANGES.APTT.unit}</span>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <span className="text-gray-500 block text-xs">FIB (纤维蛋白原)</span>
          <span className="font-bold text-gray-800">{PEDIATRIC_REF_RANGES.FIB.min}-{PEDIATRIC_REF_RANGES.FIB.max} {PEDIATRIC_REF_RANGES.FIB.unit}</span>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <span className="text-gray-500 block text-xs">TT (凝血酶时间)</span>
          <span className="font-bold text-gray-800">{PEDIATRIC_REF_RANGES.TT.min}-{PEDIATRIC_REF_RANGES.TT.unit}</span>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <span className="text-gray-500 block text-xs">PLT (血小板)</span>
          <span className="font-bold text-gray-800">{PEDIATRIC_REF_RANGES.PLT.min}-{PEDIATRIC_REF_RANGES.PLT.max} {PEDIATRIC_REF_RANGES.PLT.unit}</span>
        </div>
        <div className="bg-white/20 p-3 rounded-xl">
          <span className="text-gray-500 block text-xs">D-Dimer (D-二聚体)</span>
          <span className="font-bold text-gray-800">&lt; {PEDIATRIC_REF_RANGES.DD.max} {PEDIATRIC_REF_RANGES.DD.unit}</span>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-4 leading-tight italic">
        注：不同年龄段及不同实验室试剂参考范围存在差异，以上数值仅供一般性参考。分析时应以具体实验室提供的正常值为准。
      </p>
    </div>
  );
};

export default ReferencePanel;
