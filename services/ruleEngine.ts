
import { CoagData, AnalysisResult, HemostaticGuide } from "../types";
import { PEDIATRIC_REF_RANGES } from "../constants";

const TXA_GUIDE: HemostaticGuide = {
  drugName: "氨甲环酸 (Tranexamic Acid, TXA)",
  indications: ["创伤相关大出血", "手术期失血控制", "纤溶亢进型 DIC"],
  contraindications: ["活动性血栓", "严重肾衰竭", "既往癫痫史"],
  dosage: "首剂: 10-15 mg/kg (最大 1g) IV。维持: 5-10 mg/kg/h。",
  monitoring: ["血栓征象", "尿量", "惊厥监测"]
};

/**
 * 本地专家推理引擎 - 基于 2024/2025 共识文档逻辑
 * 替代网络 AI 功能，确保护理数据的私密性与本地可用性
 */
export const analyzeCoagulation = (data: CoagData): AnalysisResult => {
  const pt = parseFloat(data.pt.toString()) || 0;
  const inr = parseFloat(data.inr?.toString() || "0") || 0;
  const aptt = parseFloat(data.aptt.toString()) || 0;
  const fib = parseFloat(data.fib.toString()) || 0;
  const tt = parseFloat(data.tt.toString()) || 0;
  const plt = parseFloat(data.plt.toString()) || 0;
  const dd = parseFloat(data.dd.toString()) || 0;
  const at3 = parseFloat(data.at3?.toString() || "100") || 100;
  
  // TEG 参数
  const tegR = parseFloat(data.tegR?.toString() || "0") || 0;
  const tegMa = parseFloat(data.tegMa?.toString() || "0") || 0;
  const tegLy30 = parseFloat(data.tegLy30?.toString() || "0") || 0;

  const isPtLong = pt > PEDIATRIC_REF_RANGES.PT.max || inr > PEDIATRIC_REF_RANGES.INR.max;
  const isApttLong = aptt > PEDIATRIC_REF_RANGES.APTT.max;
  const isPltLow = plt > 0 && plt < PEDIATRIC_REF_RANGES.PLT.min;
  const isTtLong = tt > PEDIATRIC_REF_RANGES.TT.max;
  const isAt3Low = at3 < PEDIATRIC_REF_RANGES.AT3.min;

  let result: AnalysisResult = {
    diagnosticImpression: "待分析",
    reasoning: "",
    treatmentAdvice: [],
    furtherTests: [],
    referenceDocs: [
      "《儿童静脉血栓栓塞症诊断与抗凝治疗专家共识 (2025修订)》",
      "《脓毒症相关性凝血病诊疗共识 (2024)》"
    ]
  };

  const symptomsStr = (data.diseaseName + " " + data.symptoms).toLowerCase();
  const hasSevereBleeding = symptomsStr.includes("出血") || symptomsStr.includes("瘀斑");

  // --- 逻辑分支 A: 肝功能衰竭模型 (Liver Failure Logic) ---
  if (data.isLiverFailure) {
    result.diagnosticImpression = "肝源性凝血功能障碍 (Liver-related Coagulopathy)";
    result.reasoning = "患儿标记为肝衰竭。在 2025 共识中，肝源性 INR 升高不代表出血风险绝对升高，因为抗凝蛋白 (AT-III, Protein C) 亦同步下降，处于“再平衡”状态。";
    result.treatmentAdvice.push("【引用-2025共识】不建议仅根据 INR 升高预防性输注 FFP，除非伴有活动性出血或手术前准备。");
    result.treatmentAdvice.push("若 FIB < 1.0g/L，建议补充冷沉淀。");
    result.furtherTests = ["凝血因子 V 活性测定 (评估合成储备)", "TEG 评估再平衡状态"];
    if (isAt3Low) result.treatmentAdvice.push("AT-III < 60% 时，肝素抗凝可能耐药，建议选用直接凝血酶抑制剂。");
    return result;
  }

  // --- 逻辑分支 B: 脓毒症/DIC 模型 (SIC/DIC Logic) ---
  if (data.isSepsis) {
    if (isPltLow || (pt > 16) || dd > 3.0) {
      result.diagnosticImpression = "脓毒症相关凝血障碍 (疑似 SIC/DIC)";
      result.reasoning = "符合 2024 SIC 评分核心特征。微血栓形成与凝血因子消耗共存。";
      result.treatmentAdvice.push("【核心】首要控制原发感染。");
      result.treatmentAdvice.push("【抗凝决策】若无活动性出血且 Plt > 30, 可考虑预防性使用 LMWH。");
      result.furtherTests = ["动态监测 D-Dimer 变化曲线", "计算 ISTH DIC 评分"];
      return result;
    }
  }

  // --- 逻辑分支 C: 单纯 APTT 延长模型 ---
  if (isApttLong && !isPtLong && !isPltLow) {
    result.diagnosticImpression = "单纯性内源性途径异常";
    result.reasoning = "APTT 显著延长。需区分是因子缺乏（如血友病）还是循环抗凝物质（如狼疮抗凝物）。";
    result.treatmentAdvice.push("【决策】完善 APTT 纠正试验 (Mixing Test)。");
    result.furtherTests = ["APTT 混合试验", "因子 VIII, IX, XI 活性测定", "狼疮抗凝物监测"];
    return result;
  }

  // --- 逻辑分支 D: TEG 数据驱动模型 ---
  if (tegLy30 > 3) {
    result.diagnosticImpression = "高纤溶状态 (Hyperfibrinolysis)";
    result.reasoning = "TEG-LY30 > 3% 表明血块在 30 分钟内发生显著崩解，提示纤溶亢进。";
    result.treatmentAdvice.push("【止血】建议启动 TXA (氨甲环酸) 治疗方案。");
    result.hemostaticGuide = TXA_GUIDE;
    return result;
  }

  // 默认分析
  result.diagnosticImpression = "指标部分异常/未见典型综合征模式";
  result.reasoning = "根据内置共识库匹配，当前数值不符合典型 DIC 或 SIC 模式。建议结合临床表现进一步观察。";
  result.treatmentAdvice.push("动态复查凝血六项。");
  return result;
};
