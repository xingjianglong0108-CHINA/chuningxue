
import React from 'react';

const MonitoringStandards: React.FC = () => {
  const standards = [
    {
      drug: '普通肝素 (UFH)',
      metric: 'APTT / Anti-Xa',
      target: 'APTT: 正常值 1.5-2.5倍\nAnti-Xa: 0.35-0.70 U/mL',
      timing: '起始治疗后 4-6h\n或调整剂量后 4-6h',
      frequency: '达标前 Q4-6h\n达标后 Q24h',
      adjustment: 'Anti-Xa < 0.35: 增加 10% 维持速\nAnti-Xa > 0.70: 停药 1h 后减速 10%',
      color: 'blue'
    },
    {
      drug: '低分子肝素 (LMWH)',
      metric: 'Anti-Xa (峰值)',
      target: '治疗量: 0.5-1.0 U/mL\n预防量: 0.2-0.4 U/mL',
      timing: '给药后 4-6 小时采样\n(稳态需在第 3 剂后)',
      frequency: '起始 2-3 天一次\n达标后 每月一次',
      adjustment: 'Anti-Xa < 0.5: 增加 25% 剂量\nAnti-Xa > 1.0: 停药 3-12h 后减量 20%',
      color: 'indigo'
    },
    {
      drug: '华法林 (Warfarin)',
      metric: 'INR',
      target: '目标: 2.0 - 3.0\n(机械瓣需更高)',
      timing: '每日早晨固定时间采样\n(与服药间隔一致)',
      frequency: '起始 每日监测\n达标后 每 2-4 周一次',
      adjustment: 'INR < 2.0: 增加周总量的 10-15%\nINR > 3.5: 停服 1 剂后减量 10-15%',
      color: 'orange'
    },
    {
      drug: '利伐沙班 (DOAC)',
      metric: '肾功能 / Hb',
      target: '无需常规凝血监测\n需定期监测 eGFR',
      timing: '基线及定期评估',
      frequency: 'eGFR > 60: 每 6-12 个月\neGFR 30-60: 每 3 个月',
      adjustment: 'eGFR < 30: 建议改用肝素类\neGFR 30-50: 减量 25-50%',
      color: 'emerald'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 核心靶值看板 */}
      <section className="glass rounded-3xl p-6 shadow-xl border-t-4 border-t-blue-600">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-xl text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-800">儿童抗凝监测规范 (2025版)</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Pediatric Anticoagulation Targets</p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-6 md:mx-0">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">药物</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">首选指标</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">目标靶值</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">采样时机</th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase">调整参考</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {standards.map((s, idx) => (
                <tr key={idx} className="hover:bg-white/40 transition-colors">
                  <td className="px-4 py-4">
                    <span className={`text-xs font-black text-${s.color}-600`}>{s.drug}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs font-bold text-gray-700">{s.metric}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[11px] font-black text-gray-800 whitespace-pre-line leading-relaxed">{s.target}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[10px] font-medium text-gray-500 leading-snug">{s.timing}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-[10px] font-bold text-gray-600 bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">{s.adjustment}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HIT 监测专项建议 */}
        <section className="glass rounded-3xl p-6 shadow-lg border-l-8 border-l-red-500">
          <h3 className="text-sm font-black text-red-600 uppercase mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            HIT 监测预警 (肝素诱导)
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 rounded-xl border border-red-100">
              <p className="text-[11px] font-black text-red-800">预警指标：血小板计数动态下降 &gt; 50% 或 &lt; 100 × 10⁹/L</p>
            </div>
            <ul className="text-[11px] font-bold text-gray-600 space-y-2 leading-relaxed">
              <li>• UFH 暴露者：建议在第 4-14 天每 2-3 天复查血小板。</li>
              <li>• LMWH 暴露者：仅对于心血管大手术患儿需关注，风险极低。</li>
              <li>• 怀疑 HIT 时：应立即停止肝素，改用阿加曲班或达那肝素。</li>
            </ul>
          </div>
        </section>

        {/* 出血监测红线 */}
        <section className="glass rounded-3xl p-6 shadow-lg border-l-8 border-l-orange-500">
          <h3 className="text-sm font-black text-orange-600 uppercase mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            出血风险实时监测建议
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-orange-50 rounded-xl border border-orange-100 text-center">
                <span className="text-[10px] font-black text-orange-400 block">血红蛋白 (Hb)</span>
                <span className="text-xs font-black text-orange-800">下降 &gt; 20g/L</span>
              </div>
              <div className="p-2 bg-orange-50 rounded-xl border border-orange-100 text-center">
                <span className="text-[10px] font-black text-orange-400 block">抗凝靶值 (Anti-Xa)</span>
                <span className="text-xs font-black text-orange-800">&gt; 1.2 U/mL</span>
              </div>
            </div>
            <p className="text-[10px] font-medium text-gray-500 leading-relaxed italic">
              ※ 2025共识：若发生大出血，立即启动鱼精蛋白中和 (1mg : 100U UFH)。针对 LMWH，鱼精蛋白仅能部分中和 (约 60%)。
            </p>
          </div>
        </section>
      </div>

      {/* 抗-Xa 监测频率决策图 */}
      <section className="glass rounded-3xl p-6 shadow-xl bg-blue-50/20 border border-blue-100/30">
        <h3 className="text-xs font-black text-blue-800 uppercase mb-4 tracking-widest">监测频率临床决策流 (2025)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative p-4 bg-white/60 rounded-2xl border border-blue-100 text-center">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded-full">STEP 1</div>
            <p className="text-[10px] font-black text-gray-800 mt-2">起始/调量期</p>
            <p className="text-[9px] font-bold text-blue-500 mt-1">每 24-48 小时</p>
          </div>
          <div className="relative p-4 bg-white/60 rounded-2xl border border-blue-100 text-center">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-indigo-600 text-white text-[8px] font-black rounded-full">STEP 2</div>
            <p className="text-[10px] font-black text-gray-800 mt-2">靶值稳定期</p>
            <p className="text-[9px] font-bold text-indigo-500 mt-1">每 1-2 周</p>
          </div>
          <div className="relative p-4 bg-white/60 rounded-2xl border border-blue-100 text-center">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-600 text-white text-[8px] font-black rounded-full">STEP 3</div>
            <p className="text-[10px] font-black text-gray-800 mt-2">长期维持期</p>
            <p className="text-[9px] font-bold text-green-500 mt-1">每 1-3 个月</p>
          </div>
        </div>
        <p className="text-[9px] text-gray-400 mt-4 text-center font-bold">
          ※ 特殊情况：新生儿、体重增长较快或肾功能受损患儿需加密监测。
        </p>
      </section>
    </div>
  );
};

export default MonitoringStandards;
