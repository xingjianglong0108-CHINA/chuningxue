
import { VteScenario, VteRecommendation, PteRiskLevel, CrtSubtype } from "../types";

/**
 * 2025 PTE 专家共识：临床危险分层逻辑 (增强版)
 */
export const getPteStratification = (
  shock: boolean, 
  rvStrain: boolean, 
  troponin: boolean,
  ageCategory: string,
  systolicBP?: number,
  heartRate?: number,
  spo2?: number
): { level: PteRiskLevel; label: string; action: string; color: string; notes?: string } => {
  
  // 简易年龄血压阈值逻辑 (Pediatric Hypotension Definition)
  let isHypotensive = false;
  if (systolicBP) {
    if (ageCategory.includes('新生儿')) isHypotensive = systolicBP < 60;
    else if (ageCategory.includes('婴儿')) isHypotensive = systolicBP < 70;
    else if (ageCategory.includes('幼儿') || ageCategory.includes('学龄前')) isHypotensive = systolicBP < 75;
    else if (ageCategory.includes('学龄期')) isHypotensive = systolicBP < 80;
    else if (ageCategory.includes('青少年')) isHypotensive = systolicBP < 90;
  }

  const isHemodynamicallyUnstable = shock || isHypotensive;

  if (isHemodynamicallyUnstable) {
    return { 
      level: 'high', 
      label: '高危 (High Risk)', 
      action: '【紧急】血流动力学不稳定。立即启动系统溶栓 (rt-PA) 或外科取栓，加强呼吸循环支持。',
      color: 'red',
      notes: isHypotensive ? `检测到血压低于该年龄段阈值 (${systolicBP} mmHg)` : undefined
    };
  }

  // 中危分层进一步细化
  if (rvStrain && troponin) {
    return { 
      level: 'intermediate', 
      label: '中高危 (Intermediate-High)', 
      action: '【强化监测】血流动力学尚稳但心脏受累明显。首选抗凝，严密观察，随时准备补救性溶栓。',
      color: 'orange'
    };
  }
  
  if (rvStrain || troponin || (spo2 && spo2 < 90)) {
    return { 
      level: 'intermediate', 
      label: '中低危 (Intermediate-Low)', 
      action: '【常规抗凝】住院监测。首选 LMWH。若 SpO2 < 94% 建议予氧疗。',
      color: 'indigo',
      notes: (spo2 && spo2 < 90) ? "低氧血症可能提示肺通气灌注比例失调。" : undefined
    };
  }

  return { 
    level: 'low', 
    label: '低危 (Low Risk)', 
    action: '【常规抗凝】生命体征平稳，无心脏受累证据。可考虑早期序贯口服抗凝药。',
    color: 'blue'
  };
};

/**
 * 2024 CRT 专家建议：导管管理决策逻辑
 */
export const getCrtManagementLogic = (
  subtype: CrtSubtype, 
  isInfected: boolean, 
  isDysfunctional: boolean,
  isUnnecessary: boolean
): { advice: string; timing: string; type: 'remove' | 'keep' } => {
  if (isInfected || isDysfunctional || isUnnecessary) {
    return {
      advice: "明确建议移除 CVAD 导管。",
      timing: "移除前应进行 2-5 天的规范抗凝治疗，以预防移除过程中发生肺栓塞。",
      type: 'remove'
    };
  }
  if (subtype === 'fibrin_sheath' || subtype === 'intraluminal') {
    return {
      advice: "可考虑保留导管，加强抗凝治疗。",
      timing: "需每日评估管腔通畅度，并动态超声监测血栓是否演变为附壁血栓。",
      type: 'keep'
    };
  }
  return {
    advice: "权衡利弊后可尝试保留。需符合：有功能、无感染、规范抗凝。",
    timing: "抗凝 6 周后根据影像学复查结果决定后续时长。",
    type: 'keep'
  };
};

/**
 * 2025 抗凝药物剂量算法 (整合利伐沙班/达比加群)
 */
export const calculateDoacDose = (weight: number, ageCategory: string): { rivaroxaban: string; dabigatran: string; notes: string } => {
  let riva = "不建议/无数据";
  let dabi = "不建议/无数据";

  // 利伐沙班 (2025 共识表4)
  if (weight >= 2.6) {
    if (weight < 3) riva = "0.8 mg tid";
    else if (weight < 4) riva = "0.9 mg tid";
    else if (weight < 5) riva = "1.4 mg tid";
    else if (weight < 7) riva = "1.6 mg tid";
    else if (weight < 8) riva = "1.8 mg tid";
    else if (weight < 9) riva = "2.4 mg tid";
    else if (weight < 10) riva = "2.8 mg tid";
    else if (weight < 12) riva = "3.0 mg tid";
    else if (weight < 30) riva = "5.0 mg bid";
    else if (weight < 50) riva = "15.0 mg qd";
    else riva = "20.0 mg qd";
  }

  // 达比加群 (2025 共识表5) - 仅限 >= 8岁能吞咽胶囊者
  if (ageCategory.includes('12-18岁') || ageCategory.includes('学龄期')) {
    if (weight >= 11 && weight < 16) dabi = "75 mg bid";
    else if (weight < 26) dabi = "110 mg bid";
    else if (weight < 41) dabi = "150 mg bid";
    else if (weight < 61) dabi = "185 mg bid";
    else if (weight < 81) dabi = "220 mg bid";
    else if (weight >= 81) dabi = "260 mg bid";
  }

  return {
    rivaroxaban: riva,
    dabigatran: dabi,
    notes: "转换提示：需在至少 5-21 天的初始肝素/低分子肝素抗凝引导后再转换为 DOAC。"
  };
};

export const getVteRecommendation = (scenario: VteScenario): VteRecommendation => {
  const recommendations: Record<VteScenario, VteRecommendation> = {
    'pte': {
      scenarioName: "儿童肺血栓栓塞症 (PTE)",
      strength: "Strong",
      evidence: "Low",
      recommendation: "需根据生命体征立即分层。高危者首选系统溶栓，非高危者首选抗凝。",
      remarks: "2025共识强调：D-Dimer ≥ 5mg/L 有助于肺炎支原体感染患儿并发 PTE 的诊断。",
      medicationOptions: ["rt-PA (溶栓)", "UFH (高危桥接)", "LMWH (低中危首选)"],
      monitoringTargets: ["APTT (维持1.5-2.5倍)", "Fib (> 1.0 g/L)", "右心压降 (超声)"]
    },
    'crt': {
      scenarioName: "导管相关性血栓 (CRT)",
      strength: "Strong",
      evidence: "Moderate",
      recommendation: "初始抗凝 2-5 天后再决定移除。导管无功能/感染/无需使用是强制移除指征。",
      remarks: "2024建议：对于仍需通路的患儿，可在抗凝下动态监测 7d。若血栓无进展且导管有功能，可保留。",
      medicationOptions: ["LMWH (1.0mg/kg q12h)", "利伐沙班"],
      monitoringTargets: ["置管侧肢体周径", "多普勒超声 (每周)"]
    },
    'csvt': {
      scenarioName: "脑窦静脉血栓 (CSVT)",
      strength: "Conditional",
      evidence: "Low",
      recommendation: "单纯抗凝优于溶栓后抗凝。需区分由于静脉回流受阻导致的“淤血性出血”。",
      remarks: "对于存在颅内大出血风险者，建议首选半衰期短的 UFH，便于随时撤药或逆转。",
      medicationOptions: ["UFH", "LMWH", "达比加群 (恢复期)"]
    },
    'rat': {
      scenarioName: "右房血栓 (RAT)",
      strength: "Conditional",
      evidence: "Very Low",
      recommendation: "高危特征（>2cm, 跨瓣, 引起血流动力学不稳定）建议抗凝，否则建议观察。",
      remarks: "需每日床旁超声，警惕血栓脱落导致肺栓塞。",
      medicationOptions: ["抗凝治疗", "外科取栓 (若溶栓禁忌)"]
    },
    'rvt': {
      scenarioName: "新生儿肾静脉血栓 (RVT)",
      strength: "Strong",
      evidence: "Low",
      recommendation: "首选抗凝预防肾萎缩。仅双侧累及且导致无尿/肾衰时考虑溶栓。",
      remarks: "2025抗凝共识：建议初始使用低剂量 LMWH 缓慢滴定。",
      medicationOptions: ["LMWH (低剂量滴定)"]
    },
    'pvt': {
      scenarioName: "门静脉血栓 (PVT)",
      strength: "Conditional",
      evidence: "Low",
      recommendation: "闭塞性血栓应抗凝。抗凝目标是预防食管静脉曲张和门脉高压相关并发症。",
      remarks: "需定期胃镜监测曲张状态，评估抗凝与出血风险平衡。",
      medicationOptions: ["LMWH (首选)"]
    },
    'svt': {
      scenarioName: "浅静脉血栓 (SVT)",
      strength: "Conditional",
      evidence: "Low",
      recommendation: "下肢受累建议抗凝 45 天。上肢置管相关且无进展者建议不抗凝。",
      remarks: "2024建议：应警惕下肢 SVT 蔓延至隐股静脉交界处，从而导致典型 DVT。",
      medicationOptions: ["阿司匹林 (轻症)", "预防量 LMWH (下肢受累)"]
    },
    'unprovoked': {
      scenarioName: "非诱发性 (自发性) VTE",
      strength: "Strong",
      evidence: "Moderate",
      recommendation: "建议抗凝 6-12 个月，而非无限期。需在停药前完善易栓症全面评估。",
      remarks: "若 D-Dimer 停药 1 个月后再次转阳，复发风险极高，应考虑二级预防。",
      medicationOptions: ["利伐沙班 (维持期)", "华法林"]
    }
  };
  return recommendations[scenario];
};
