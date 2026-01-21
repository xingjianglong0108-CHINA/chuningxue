
export interface CoagData {
  pt: number | string;
  aptt: number | string;
  fib: number | string;
  tt: number | string;
  inr?: number | string;
  at3?: number | string;
  plt: number | string;
  dd: number | string;
  // 血栓弹力图 (TEG/ROTEM)
  tegR?: number | string;
  tegK?: number | string;
  tegAngle?: number | string;
  tegMa?: number | string;
  tegLy30?: number | string;
  
  alt?: number | string;
  ast?: number | string;
  lactate?: number | string;
  anticoagulantUse: string;
  ptMixImmediate?: number | string;
  ptMixIncubated?: number | string;
  apttMixImmediate?: number | string;
  apttMixIncubated?: number | string;
  sofaScore?: number | string;
  age: string;
  diseaseName: string;
  symptoms: string;
  pltMorphology: 'normal' | 'large' | 'small' | 'clumping' | 'unknown';
  pfa100?: string;
  bleedingTime?: number | string;
  
  // 临床高危标记
  isSepsis?: boolean;
  isTbi?: boolean;
  isCvc?: boolean;
  isMajorSurgery?: boolean;
  isLiverFailure?: boolean;
}

export interface HemostaticGuide {
  drugName: string;
  indications: string[];
  contraindications: string[];
  dosage: string;
  monitoring: string[];
}

export interface AnalysisResult {
  diagnosticImpression: string;
  reasoning: string;
  treatmentAdvice: string[];
  furtherTests: string[];
  referenceDocs: string[];
  hemostaticGuide?: HemostaticGuide;
}

export type ScoreType = 'SIC' | 'DIC_ISTH' | 'pSOFA' | 'PHOENIX' | 'BLEED_RISK' | 'THROMBOSIS';

export interface ScoreCalculation {
  id: ScoreType;
  name: string;
  totalScore: number;
  result: string;
  criteria: {
    label: string;
    value: string | number;
    score: number;
  }[];
}

// --- 儿童血栓专项扩展 ---
export type VteScenario = 'pte' | 'crt' | 'csvt' | 'rat' | 'rvt' | 'pvt' | 'svt' | 'unprovoked';

export type PteRiskLevel = 'high' | 'intermediate' | 'low';
export type CrtSubtype = 'fibrin_sheath' | 'intraluminal' | 'mural' | 'dvt';

export interface VteRecommendation {
  scenarioName: string;
  strength: 'Strong' | 'Conditional';
  evidence: 'High' | 'Moderate' | 'Low' | 'Very Low';
  recommendation: string;
  remarks: string;
  medicationOptions: string[];
  monitoringTargets?: string[];
}
