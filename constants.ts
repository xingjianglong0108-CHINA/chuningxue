
// Reference ranges for pediatric coagulation parameters based on 2024-2025 guidelines.
export const PEDIATRIC_REF_RANGES = {
  PT: { min: 11, max: 14, unit: "s" },
  INR: { min: 0.8, max: 1.2, unit: "" },
  APTT: { min: 25, max: 35, unit: "s" },
  FIB: { min: 2.0, max: 4.0, unit: "g/L" },
  TT: { min: 14, max: 21, unit: "s" },
  PLT: { min: 150, max: 450, unit: "10^9/L" },
  DD: { min: 0, max: 0.5, unit: "mg/L FEU" },
  AT3: { min: 80, max: 120, unit: "%" },
  ALT: { min: 0, max: 40, unit: "U/L" },
  AST: { min: 0, max: 40, unit: "U/L" },
  LACTATE: { min: 0.5, max: 2.0, unit: "mmol/L" },
  // TEG (Kaolin 激活)
  TEG_R: { min: 4, max: 8, unit: "min" },
  TEG_K: { min: 1, max: 3, unit: "min" },
  TEG_ANGLE: { min: 55, max: 78, unit: "deg" },
  TEG_MA: { min: 51, max: 69, unit: "mm" },
  TEG_LY30: { min: 0, max: 3, unit: "%" }
};

export const MIXING_TEST_CUTOFF = 0.15; // Rosner Index > 15%

export const COMMON_DISEASES = [
  "脓毒症性凝血病 (SIC)",
  "弥散性血管内凝血 (DIC)",
  "血友病 A/B",
  "血管性血友病 (vWD)",
  "血小板无力症 (Glanzmann)",
  "巨大血小板综合征 (BSS)",
  "MYH9 相关疾病",
  "免疫性血小板减少症 (ITP)",
  "Wiskott-Aldrich 综合征 (WAS)",
  "维生素 K 缺乏性出血 (VKDB)",
  "抗凝血类灭鼠剂中毒",
  "严重多发伤",
  "肝功能衰竭"
];
