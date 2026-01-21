
import React, { useState, useMemo } from 'react';
import { ScoreType, ScoreCalculation } from '../types';

// 年龄与平均动脉压(MAP)评分的映射关系 (Phoenix 2024)
const AGE_MAP_THRESHOLD: Record<string, any> = {
  '<1m': { p1: 30, p2: 17 },
  '1-11m': { p1: 38, p2: 25 },
  '1-<2y': { p1: 43, p2: 31 },
  '2-<5y': { p1: 44, p2: 32 },
  '5-<12y': { p1: 48, p2: 36 },
  '12-<18y': { p1: 51, p2: 38 }
};

const ScoringCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ScoreType>('BLEED_RISK');

  // --- SIC/DIC/PSS/pSOFA 状态 ---
  const [sicPlt, setSicPlt] = useState(150);
  const [sicPtRatio, setSicPtRatio] = useState(1.0);
  const [sicSofa, setSicSofa] = useState(0);
  const [sicLactate, setSicLactate] = useState(1.0);

  const [dicPlt, setDicPlt] = useState(150);
  const [dicDd, setDicDd] = useState<'normal' | 'moderate' | 'strong'>('normal');
  const [dicPtLong, setDicPtLong] = useState(0);
  const [dicFib, setDicFib] = useState(2.5);

  const [pSofaPf, setPSofaPf] = useState(450);
  const [pSofaPlt, setPSofaPlt] = useState(150);
  const [pSofaBili, setPSofaBili] = useState(15);
  const [pSofaMap, setPSofaMap] = useState(70);
  const [pSofaGcs, setPSofaGcs] = useState(15);

  const [phAgeGroup, setPhAgeGroup] = useState('2-<5y');
  const [phPf, setPhPf] = useState(450);
  const [phSf, setPhSf] = useState(350);
  const [phImv, setPhImv] = useState(false);
  const [phRespSupport, setPhRespSupport] = useState(false);
  const [phVasoCount, setPhVasoCount] = useState(0);
  const [phLactate, setPhLactate] = useState(1.0);
  const [phMap, setPhMap] = useState(70);
  const [phPlt, setPhPlt] = useState(150);
  const [phInr, setPhInr] = useState(1.0);
  const [phDd, setPhDd] = useState(0.5);
  const [phFib, setPhFib] = useState(250);
  const [phGcs, setPhGcs] = useState(15);
  const [phPupilsFixed, setPhPupilsFixed] = useState(false);

  // --- 出血风险评分状态 ---
  const [bleedSite, setBleedSite] = useState<'none' | 'skin' | 'mucosa' | 'internal' | 'critical'>('none');
  const [bleedVolume, setBleedVolume] = useState<'low' | 'med' | 'high'>('low');
  const [shockSigns, setShockSigns] = useState(false);
  const [bleedPt, setBleedPt] = useState(13);
  const [bleedAptt, setBleedAptt] = useState(30);
  const [bleedFib, setBleedFib] = useState(2.5);
  const [bleedPlt, setBleedPlt] = useState(200);
  const [bleedDd, setBleedDd] = useState(0.4);

  // --- 新增：血栓风险评分状态 ---
  const [vteCvc, setVteCvc] = useState(false); // 中心静脉导管
  const [vteSurgery, setVteSurgery] = useState(false); // 2h以上大手术
  const [vteImmobile, setVteImmobile] = useState(false); // 卧床 > 3天
  const [vteMalignancy, setVteMalignancy] = useState(false); // 恶性肿瘤
  const [vteHistory, setVteHistory] = useState(false); // 既往血栓史
  const [vteFamily, setVteFamily] = useState(false); // 家族血栓史
  const [vteInfection, setVteInfection] = useState(false); // 严重感染/脓毒症
  const [vteObesity, setVteObesity] = useState(false); // 肥胖
  const [vteEstrogen, setVteEstrogen] = useState(false); // 雌激素使用
  const [vteHighDd, setVteHighDd] = useState(false); // D-Dimer > 2x 正常上限

  // --- 各量表计算 ---
  const thrombosisCalc = useMemo((): ScoreCalculation => {
    let score = 0;
    const criteria = [];
    
    if (vteCvc) { score += 3; criteria.push({ label: '中心静脉导管 (CVC)', value: '有', score: 3 }); }
    if (vteHistory) { score += 3; criteria.push({ label: '个人血栓病史', value: '有', score: 3 }); }
    if (vteSurgery) { score += 2; criteria.push({ label: '大手术/严重创伤', value: '有', score: 2 }); }
    if (vteImmobile) { score += 2; criteria.push({ label: '长期卧床 (>3天)', value: '有', score: 2 }); }
    if (vteMalignancy) { score += 2; criteria.push({ label: '活动期恶性肿瘤', value: '有', score: 2 }); }
    if (vteFamily) { score += 1; criteria.push({ label: '一级亲属血栓史', value: '有', score: 1 }); }
    if (vteInfection) { score += 1; criteria.push({ label: '严重感染/炎症', value: '有', score: 1 }); }
    if (vteObesity) { score += 1; criteria.push({ label: '肥胖 (BMI > 95th)', value: '有', score: 1 }); }
    if (vteEstrogen) { score += 1; criteria.push({ label: '雌激素/口服避孕药', value: '有', score: 1 }); }
    if (vteHighDd) { score += 1; criteria.push({ label: 'D-Dimer 显著升高', value: '有', score: 1 }); }

    let result = '';
    if (score >= 5) result = '高危：强烈建议实施预防性抗凝 (如 LMWH)';
    else if (score >= 2) result = '中危：建议实施机械预防，视情况考虑药物预防';
    else result = '低危：常规动态随访，鼓励早期下床活动';

    return { id: 'THROMBOSIS', name: '儿童静脉血栓 (VTE) 风险评估', totalScore: score, result, criteria };
  }, [vteCvc, vteSurgery, vteImmobile, vteMalignancy, vteHistory, vteFamily, vteInfection, vteObesity, vteEstrogen, vteHighDd]);

  const bleedRiskCalc = useMemo((): ScoreCalculation => {
    let score = 0;
    const criteria = [];
    let siteScore = 0;
    if (bleedSite === 'critical') siteScore = 6;
    else if (bleedSite === 'internal') siteScore = 4;
    else if (bleedSite === 'mucosa') siteScore = 2;
    else if (bleedSite === 'skin') siteScore = 1;
    score += siteScore;
    criteria.push({ label: '出血部位严重度', value: bleedSite, score: siteScore });
    const volScore = bleedVolume === 'high' ? 4 : (bleedVolume === 'med' ? 2 : 0);
    score += volScore;
    criteria.push({ label: '估计出血量', value: bleedVolume, score: volScore });
    const shockScore = shockSigns ? 3 : 0;
    score += shockScore;
    criteria.push({ label: '休克指征/灌注不足', value: shockSigns ? '有' : '无', score: shockScore });
    const pS = bleedPlt < 20 ? 4 : (bleedPlt < 50 ? 2 : (bleedPlt < 100 ? 1 : 0));
    score += pS; criteria.push({ label: '血小板减低', value: bleedPlt, score: pS });
    const fS = bleedFib < 1.0 ? 3 : (bleedFib < 1.5 ? 1 : 0);
    score += fS; criteria.push({ label: '纤维蛋白原减低', value: bleedFib, score: fS });
    const tS = (bleedPt > 20 || bleedAptt > 60) ? 3 : ((bleedPt > 16 || bleedAptt > 45) ? 1 : 0);
    score += tS; criteria.push({ label: '凝血时间延长', value: `PT:${bleedPt}/APTT:${bleedAptt}`, score: tS });
    const dS = bleedDd > 4.0 ? 2 : (bleedDd > 1.0 ? 1 : 0);
    score += dS; criteria.push({ label: 'D-二聚体升高', value: bleedDd, score: dS });
    let result = '';
    if (score >= 12) result = '极高危：建议立即启动 MTP 并多学科干预';
    else if (score >= 8) result = '高危：需积极输注成分血及止血药物';
    else if (score >= 4) result = '中危：加强观察，按需补充凝血因子';
    else result = '低危：常规动态随访';
    return { id: 'BLEED_RISK', name: '儿童急性出血风险与严重度评分', totalScore: score, result, criteria };
  }, [bleedSite, bleedVolume, shockSigns, bleedPt, bleedAptt, bleedFib, bleedPlt, bleedDd]);

  const sicCalc = useMemo((): ScoreCalculation => {
    let score = 0;
    const criteria = [];
    const pS = sicPlt < 100 ? 2 : (sicPlt < 150 ? 1 : 0);
    score += pS; criteria.push({ label: '血小板 (×10^9/L)', value: sicPlt, score: pS });
    const prS = sicPtRatio > 1.4 ? 2 : (sicPtRatio > 1.2 ? 1 : 0);
    score += prS; criteria.push({ label: 'PT Ratio', value: sicPtRatio, score: prS });
    const sS = sicSofa >= 2 ? 2 : (sicSofa === 1 ? 1 : 0);
    score += sS; criteria.push({ label: 'SOFA (非凝血)', value: sicSofa, score: sS });
    const lS = sicLactate >= 2.0 ? 1 : 0;
    score += lS; criteria.push({ label: '乳酸 (mmol/L)', value: sicLactate, score: lS });
    return { id: 'SIC', name: 'SIC 评分 (2024共识)', totalScore: score, result: score >= 4 ? '符合 SIC 诊断' : '未达诊断', criteria };
  }, [sicPlt, sicPtRatio, sicSofa, sicLactate]);

  const dicCalc = useMemo((): ScoreCalculation => {
    let score = 0;
    const criteria = [];
    const pS = dicPlt < 50 ? 2 : (dicPlt < 100 ? 1 : 0);
    score += pS; criteria.push({ label: '血小板', value: dicPlt, score: pS });
    const dS = dicDd === 'strong' ? 3 : (dicDd === 'moderate' ? 2 : 0);
    score += dS; criteria.push({ label: 'D-Dimer 状态', value: dicDd, score: dS });
    const ptS = dicPtLong >= 6 ? 2 : (dicPtLong >= 3 ? 1 : 0);
    score += ptS; criteria.push({ label: 'PT 延长 (s)', value: dicPtLong, score: ptS });
    const fS = dicFib < 1.0 ? 1 : 0;
    score += fS; criteria.push({ label: '纤维蛋白原 (g/L)', value: dicFib, score: fS });
    return { id: 'DIC_ISTH', name: 'ISTH 显性 DIC 评分', totalScore: score, result: score >= 5 ? '显性 DIC' : '非显性 DIC', criteria };
  }, [dicPlt, dicDd, dicPtLong, dicFib]);

  const phoenixCalc = useMemo((): ScoreCalculation => {
    let score = 0;
    const criteria = [];
    let respS = 0;
    if (phImv) {
      if (phPf < 100 || phSf < 148) respS = 3; else if (phPf < 200 || phSf < 220) respS = 2; else respS = 1;
    } else if (phPf < 400 || (phRespSupport && phSf < 292)) {
      respS = 1;
    }
    score += respS; criteria.push({ label: '呼吸子项', value: phImv ? '有创通气' : '非有创', score: respS });
    const drugP = phVasoCount >= 2 ? 2 : (phVasoCount === 1 ? 1 : 0);
    const lacP = phLactate >= 11 ? 2 : (phLactate >= 5 ? 1 : 0);
    const mapTh = AGE_MAP_THRESHOLD[phAgeGroup] || { p1: 0, p2: 0 };
    const mapP = phMap < mapTh.p2 ? 2 : (phMap < mapTh.p1 ? 1 : 0);
    const cvsS = drugP + lacP + mapP;
    score += cvsS; criteria.push({ label: '循环子项', value: `药:${drugP} 乳:${lacP} 压:${mapP}`, score: cvsS });
    let cCount = 0;
    if (phPlt < 100) cCount++; if (phInr > 1.3) cCount++; if (phDd > 2.0) cCount++; if (phFib < 100) cCount++;
    const coagS = Math.min(2, cCount);
    score += coagS; criteria.push({ label: '凝血子项', value: `异常项:${cCount}`, score: coagS });
    const neuroS = phPupilsFixed ? 2 : (phGcs <= 10 ? 1 : 0);
    score += neuroS; criteria.push({ label: '神经子项', value: `GCS:${phGcs}`, score: neuroS });
    const finalResult = score >= 2 ? (cvsS >= 1 ? '确诊脓毒性休克' : '确诊脓毒症') : '暂不满足';
    return { id: 'PHOENIX', name: 'Phoenix 2024 PSS 评分', totalScore: score, result: finalResult, criteria };
  }, [phAgeGroup, phPf, phSf, phImv, phRespSupport, phVasoCount, phLactate, phMap, phPlt, phInr, phDd, phFib, phGcs, phPupilsFixed]);

  const pSofaCalc = useMemo((): ScoreCalculation => {
    let score = 0;
    const criteria = [];
    const rS = pSofaPf < 100 ? 4 : (pSofaPf < 200 ? 3 : (pSofaPf < 300 ? 2 : (pSofaPf < 400 ? 1 : 0)));
    score += rS; criteria.push({ label: '呼吸', value: pSofaPf, score: rS });
    const cS = pSofaPlt < 20 ? 4 : (pSofaPlt < 50 ? 3 : (pSofaPlt < 100 ? 2 : (pSofaPlt < 150 ? 1 : 0)));
    score += cS; criteria.push({ label: '凝血', value: pSofaPlt, score: cS });
    const lS = pSofaBili > 200 ? 4 : (pSofaBili > 100 ? 3 : (pSofaBili > 33 ? 2 : (pSofaBili > 20 ? 1 : 0)));
    score += lS; criteria.push({ label: '肝脏', value: pSofaBili, score: lS });
    const cvS = pSofaMap < 40 ? 4 : (pSofaMap < 50 ? 3 : (pSofaMap < 60 ? 2 : (pSofaMap < 70 ? 1 : 0)));
    score += cvS; criteria.push({ label: '循环', value: pSofaMap, score: cvS });
    const nS = pSofaGcs < 6 ? 4 : (pSofaGcs < 10 ? 3 : (pSofaGcs < 13 ? 2 : (pSofaGcs < 15 ? 1 : 0)));
    score += nS; criteria.push({ label: '神经', value: pSofaGcs, score: nS });
    return { id: 'pSOFA', name: '儿童 pSOFA 评分', totalScore: score, result: `总分: ${score}`, criteria };
  }, [pSofaPf, pSofaPlt, pSofaBili, pSofaMap, pSofaGcs]);

  const current = useMemo(() => {
    if (activeTab === 'SIC') return sicCalc;
    if (activeTab === 'DIC_ISTH') return dicCalc;
    if (activeTab === 'pSOFA') return pSofaCalc;
    if (activeTab === 'PHOENIX') return phoenixCalc;
    if (activeTab === 'THROMBOSIS') return thrombosisCalc;
    return bleedRiskCalc;
  }, [activeTab, sicCalc, dicCalc, pSofaCalc, phoenixCalc, bleedRiskCalc, thrombosisCalc]);

  const inputClass = "w-full bg-white/40 border border-white/20 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all";
  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1 block";

  return (
    <div className="space-y-6">
      {/* Tab 导航 */}
      <div className="flex bg-gray-100/50 p-1 rounded-2xl gap-1 overflow-x-auto no-scrollbar">
        {['BLEED_RISK', 'THROMBOSIS', 'SIC', 'DIC_ISTH', 'PHOENIX', 'pSOFA'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-2 px-3 text-[10px] md:text-xs font-bold rounded-xl transition-all whitespace-nowrap ${activeTab === t ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}>
            {t === 'PHOENIX' ? 'Phoenix 2024' : (t === 'BLEED_RISK' ? '出血风险' : (t === 'THROMBOSIS' ? '血栓风险' : t))}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6 max-h-[650px] overflow-y-auto pr-2 custom-scrollbar">
          {activeTab === 'THROMBOSIS' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 bg-white/30 rounded-2xl border border-white/40 space-y-4">
                <h4 className="text-xs font-bold text-gray-600 border-b border-gray-100 pb-2">基础风险因子 (Baseline)</h4>
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteCvc} onChange={e => setVteCvc(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">中心静脉导管 (CVC) - 最常见危险因子 (+3)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteHistory} onChange={e => setVteHistory(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">既往血栓病史 (个人) (+3)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteSurgery} onChange={e => setVteSurgery(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">近期大手术 / 严重多发伤 (+2)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteImmobile} onChange={e => setVteImmobile(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">卧床 / 制动 > 3天 (+2)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteMalignancy} onChange={e => setVteMalignancy(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">活动期恶性肿瘤 (+2)</span>
                  </label>
                </div>
              </div>

              <div className="p-4 bg-purple-50/30 rounded-2xl border border-purple-100/40 space-y-4">
                <h4 className="text-xs font-bold text-purple-600 border-b border-purple-100 pb-2">附加风险因子 (Additional)</h4>
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteInfection} onChange={e => setVteInfection(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">严重感染 / 脓毒症 / 自身免疫炎性疾病 (+1)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteObesity} onChange={e => setVteObesity(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">肥胖 (BMI > 同龄第 95 百分位) (+1)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteFamily} onChange={e => setVteFamily(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">家族血栓史 (一级亲属) (+1)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteEstrogen} onChange={e => setVteEstrogen(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">雌激素使用 (如青春期避孕药) (+1)</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg cursor-pointer hover:bg-white/60 transition-all">
                    <input type="checkbox" checked={vteHighDd} onChange={e => setVteHighDd(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">实验室：D-Dimer 显著升高 (>2x ULN) (+1)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'BLEED_RISK' && (
            <div className="space-y-6">
              <div className="p-4 bg-white/30 rounded-2xl border border-white/40 space-y-4">
                <h4 className="text-xs font-bold text-gray-600 border-b border-gray-100 pb-2">临床表现 (Clinical)</h4>
                <div>
                  <label className={labelClass}>出血部位严重度</label>
                  <select value={bleedSite} onChange={e => setBleedSite(e.target.value as any)} className={inputClass}>
                    <option value="none">无可见出血</option>
                    <option value="skin">皮肤/淤斑 (1分)</option>
                    <option value="mucosa">黏膜/牙龈/少量鼻出血 (2分)</option>
                    <option value="internal">脏器/肌肉/消化道出血 (4分)</option>
                    <option value="critical">颅内/中枢/致死性大出血 (6分)</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>估计出血量/速度</label>
                  <select value={bleedVolume} onChange={e => setBleedVolume(e.target.value as any)} className={inputClass}>
                    <option value="low">少量/渗血 (0分)</option>
                    <option value="med">中等/持续性出血 (2分)</option>
                    <option value="high">大出血/喷射性 (4分)</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="shock" checked={shockSigns} onChange={e => setShockSigns(e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                  <label htmlFor="shock" className="text-sm font-medium text-gray-700">休克指征/灌注不足 (心率快/低血压/少尿) (+3分)</label>
                </div>
              </div>
              <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/40 space-y-4">
                <h4 className="text-xs font-bold text-blue-600 border-b border-blue-100 pb-2">实验室检查 (Laboratory)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>PLT (×10^9/L)</label><input type="number" value={bleedPlt} onChange={e => setBleedPlt(Number(e.target.value))} className={inputClass} /></div>
                  <div><label className={labelClass}>FIB (g/L)</label><input type="number" step="0.1" value={bleedFib} onChange={e => setBleedFib(Number(e.target.value))} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>PT (s)</label><input type="number" value={bleedPt} onChange={e => setBleedPt(Number(e.target.value))} className={inputClass} /></div>
                  <div><label className={labelClass}>APTT (s)</label><input type="number" value={bleedAptt} onChange={e => setBleedAptt(Number(e.target.value))} className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>D-Dimer (mg/L)</label><input type="number" step="0.1" value={bleedDd} onChange={e => setBleedDd(Number(e.target.value))} className={inputClass} /></div>
              </div>
            </div>
          )}

          {activeTab === 'SIC' && (
            <div className="space-y-4">
              <div><label className={labelClass}>血小板计数</label><input type="number" value={sicPlt} onChange={e => setSicPlt(Number(e.target.value))} className={inputClass} /></div>
              <div><label className={labelClass}>PT Ratio</label><input type="number" step="0.1" value={sicPtRatio} onChange={e => setSicPtRatio(Number(e.target.value))} className={inputClass} /></div>
              <div><label className={labelClass}>SOFA (非凝血)</label><input type="number" value={sicSofa} onChange={e => setSicSofa(Number(e.target.value))} className={inputClass} /></div>
              <div><label className={labelClass}>乳酸 (mmol/L)</label><input type="number" step="0.1" value={sicLactate} onChange={e => setSicLactate(Number(e.target.value))} className={inputClass} /></div>
            </div>
          )}
          {activeTab === 'DIC_ISTH' && (
            <div className="space-y-4">
              <div><label className={labelClass}>血小板</label><input type="number" value={dicPlt} onChange={e => setDicPlt(Number(e.target.value))} className={inputClass} /></div>
              <div><label className={labelClass}>D-Dimer 状态</label><select value={dicDd} onChange={e => setDicDd(e.target.value as any)} className={inputClass}><option value="normal">正常 (0)</option><option value="moderate">中度升高 (2)</option><option value="strong">显著升高 (3)</option></select></div>
              <div><label className={labelClass}>PT 延长 (s)</label><input type="number" value={dicPtLong} onChange={e => setDicPtLong(Number(e.target.value))} className={inputClass} /></div>
              <div><label className={labelClass}>FIB (g/L)</label><input type="number" step="0.1" value={dicFib} onChange={e => setDicFib(Number(e.target.value))} className={inputClass} /></div>
            </div>
          )}
          {activeTab === 'PHOENIX' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/30 rounded-2xl space-y-3">
                <label className={labelClass}>年龄分层</label>
                <select value={phAgeGroup} onChange={e => setPhAgeGroup(e.target.value)} className={inputClass}><option value="<1m">&lt;1m</option><option value="1-11m">1-11m</option><option value="1-<2y">1-2y</option><option value="2-<5y">2-5y</option><option value="5-<12y">5-12y</option><option value="12-<18y">12-18y</option></select>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>P/F 比值</label><input type="number" value={phPf} onChange={e => setPhPf(Number(e.target.value))} className={inputClass} /></div>
                  <div><label className={labelClass}>S/F 比值</label><input type="number" value={phSf} onChange={e => setPhSf(Number(e.target.value))} className={inputClass} /></div>
                </div>
                <div className="flex gap-4"><label className="flex items-center space-x-1 text-[10px] cursor-pointer"><input type="checkbox" checked={phImv} onChange={e => setPhImv(e.target.checked)} /><span>有创通气</span></label><label className="flex items-center space-x-1 text-[10px] cursor-pointer"><input type="checkbox" checked={phRespSupport} onChange={e => setPhRespSupport(e.target.checked)} /><span>任何支持</span></label></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>血管活性药品种</label><input type="number" value={phVasoCount} onChange={e => setPhVasoCount(Number(e.target.value))} className={inputClass} /></div>
                  <div><label className={labelClass}>乳酸 (mmol/L)</label><input type="number" step="0.1" value={phLactate} onChange={e => setPhLactate(Number(e.target.value))} className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>MAP (mmHg)</label><input type="number" value={phMap} onChange={e => setPhMap(Number(e.target.value))} className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>PLT (×10^3/µL)</label><input type="number" value={phPlt} onChange={e => setPhPlt(Number(e.target.value))} className={inputClass} /></div>
                  <div><label className={labelClass}>INR</label><input type="number" step="0.1" value={phInr} onChange={e => setPhInr(Number(e.target.value))} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>GCS</label><input type="number" value={phGcs} onChange={e => setPhGcs(Number(e.target.value))} className={inputClass} /></div>
                  <div className="flex items-end pb-2"><label className="flex items-center space-x-1 text-[10px] cursor-pointer"><input type="checkbox" checked={phPupilsFixed} onChange={e => setPhPupilsFixed(e.target.checked)} /><span>双侧瞳孔固定</span></label></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="glass rounded-3xl p-6 border-white/40 shadow-xl sticky top-0">
          <div className="flex justify-between items-start mb-6">
            <div><h3 className="font-bold text-gray-800 text-lg leading-tight">{current.name}</h3><p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Algorithm Result</p></div>
            <div className="text-right"><span className="text-4xl font-black text-blue-600">{current.totalScore}</span><span className="text-gray-400 text-xs ml-1">分</span></div>
          </div>
          <div className="space-y-4 mb-8">
            {current.criteria.map((c, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <span className="text-gray-500 font-medium">{c.label}</span>
                <span className={`font-black ${c.score > 0 ? 'text-orange-500' : 'text-gray-300'}`}>{c.score > 0 ? `+${c.score}` : '0'}</span>
              </div>
            ))}
          </div>
          <div className={`p-5 rounded-2xl text-center shadow-lg border-2 transition-all ${current.totalScore >= (activeTab === 'BLEED_RISK' ? 8 : (activeTab === 'PHOENIX' ? 2 : (activeTab === 'SIC' ? 4 : (activeTab === 'THROMBOSIS' ? 5 : 5)))) ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60">Smart Decision</div>
            <div className="text-base font-black leading-tight">{current.result}</div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-[10px] text-blue-700 leading-relaxed">
            <h5 className="font-bold mb-1">决策辅助提示：</h5>
            <ul className="list-disc ml-4 space-y-1">
              {activeTab === 'THROMBOSIS' && (
                <>
                  <li>若评分 ≥ 5：提示静脉血栓高风险。建议评估抗凝禁忌，早期考虑 LMWH。</li>
                  <li>若存在 CVC 且评分高：应密切监测置管侧肢体肿胀、皮肤颜色。</li>
                  <li>D-Dimer 升高在儿童 VTE 中灵敏度较高，但特异度不足，需结合临床。</li>
                </>
              )}
              {activeTab === 'BLEED_RISK' && (
                <>
                  <li>若评分 ≥ 8：提示显著出血风险。首选补充凝血因子（FFP 15ml/kg，冷沉淀 1.5U/10kg）。</li>
                  <li>若评分 ≥ 12：提示危及生命的活动性大出血。启动 MTP，评估手术/介入干预。</li>
                  <li>常规：TXA 可用于外科或创伤性大出血，但 DIC 患儿需权衡血栓风险。</li>
                </>
              )}
              {activeTab !== 'BLEED_RISK' && activeTab !== 'THROMBOSIS' && (
                <>
                  <li>若 PLT/FIB 正常但常规凝血极度延长，首选考虑“灭鼠剂”中毒。</li>
                  <li>{activeTab === 'PHOENIX' ? 'Phoenix 评分 ≥ 2 即可诊断脓毒症。' : '当前量表侧重凝血消耗/激活评估。'}</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringCenter;
