const form = document.getElementById("proposal-form");
const statusEl = document.getElementById("proposal-status");
const deckTitleEl = document.getElementById("deck-title");
const deckMetaEl = document.getElementById("deck-meta");
const slidesPreviewEl = document.getElementById("slides-preview");
const generateButton = document.getElementById("generate-proposal");
const confirmButton = document.getElementById("confirm-generation");
const exportButton = document.getElementById("export-ppt");
const include3DInput = document.getElementById("include-3d");
const threeDFieldsEl = document.getElementById("three-d-fields");
const threeDReferenceInput = document.getElementById("three-d-reference");
const keyVisualReferenceInput = document.getElementById("key-visual-reference");
const venueMapReferenceInput = document.getElementById("venue-map-reference");
const generateImagesInput = document.getElementById("generate-images");
const generateBuildPlanInput = document.getElementById("generate-build-plan");
const generateRunbookPlanInput = document.getElementById("generate-runbook-plan");
const templatePresetSelect = document.getElementById("template-preset");
const presetSummaryEl = document.getElementById("preset-summary");
const activityAccountSelect = document.getElementById("activity-account");
const activityPromptSummaryEl = document.getElementById("activity-prompt-summary");
const workflowStageEl = document.getElementById("workflow-stage");
const draftReviewEl = document.getElementById("draft-review");
const draftTemplateEl = document.getElementById("draft-template");
const draftSummaryEl = document.getElementById("draft-summary");
const draftVisualsEl = document.getElementById("draft-visuals");
const progressPanelEl = document.getElementById("generation-progress");
const progressLabelEl = document.getElementById("progress-label");
const progressPercentEl = document.getElementById("progress-percent");
const progressFillEl = document.getElementById("progress-fill");
const progressDetailEl = document.getElementById("progress-detail");

const PROPOSAL_SECTIONS = ["策划思路", "活动概览", "环节介绍", "活动宣传"];
const JOB_POLL_INTERVAL_MS = 10000;

const TEMPLATE_PRESETS = {
  strategy: {
    name: "策略咨询型",
    summary: "适合招商、竞标、品牌路演，先给结论，再拆策略、路径和效果。",
    structure: "封面 / 项目理解 / 核心策略 / 创意路径 / 执行闭环 / 预算效果",
    visual: "强标题、低装饰、关键数字和大留白，强调专业判断。",
    promptCue: "使用策略咨询型 PPT 模板，结论先行、结构清晰、视觉克制，突出商业判断和可落地路径。",
  },
  brand: {
    name: "品牌发布型",
    summary: "适合新品发布、年度峰会、招商大会，用情绪递进和传播口号拉开声量。",
    structure: "封面大图 / 品牌洞察 / 主题宣言 / 亮点爆破 / 传播设计 / 现场转化",
    visual: "大图封面、沉浸式色块、短句标题，突出品牌势能。",
    promptCue: "使用品牌发布型 PPT 模板，强调情绪张力、大图叙事、传播口号和品牌高级感。",
  },
  commerce: {
    name: "商业快闪型",
    summary: "适合商超美陈、快闪店、DP 点和市集活动，突出动线、打卡和人流转化。",
    structure: "流量入口 / 动线规划 / 打卡装置 / 互动机制 / 传播裂变 / 商业转化",
    visual: "高饱和局部点缀、空间轴测感、现场动线卡片，强调可拍可逛。",
    promptCue: "使用商业快闪型 PPT 模板，突出空间动线、打卡视觉、商业转化和社交传播。",
  },
  enterprise: {
    name: "稳重政企型",
    summary: "适合政企会议、企业年会、答谢会，强调规范、秩序、风险控制和执行稳定。",
    structure: "项目背景 / 仪式流程 / 区域规划 / 物料设备 / 人员分工 / 应急保障",
    visual: "稳重色面、清晰表格、流程图和执行清单，减少夸张装饰。",
    promptCue: "使用稳重政企型 PPT 模板，版式规范、语言可靠，突出流程秩序、执行保障和风险控制。",
  },
};

const TEMPLATE_PRESETS_V2 = {
  "premium-business": {
    name: "高端商务",
    summary: "适合正式竞标、企业会议、地产/建筑开放日和高预算甲方路演，强调专业可信、执行稳定和高级质感。",
    structure: "封面 / 项目理解 / 策略判断 / 方案规划 / 舞美美陈 / 预算与效果",
    visual: "低饱和商务色、细线分割、大留白、关键数字和高级舞美现场感。",
    reference: "参考 gbif/ppt-template、SUSE/presentation-template、pptx-automizer 的机构汇报和模板化生成思路。",
    promptCue: "采用高端商务 PPT 风格：克制、可信、有甲方汇报感，突出专业判断、预算秩序、执行保障和高质感舞美落地。",
  },
  "creative-ceremony": {
    name: "创意盛典",
    summary: "适合美业峰会、品牌沙龙、年会晚宴、校园活动和商业快闪，强调情绪张力、仪式感和社交传播。",
    structure: "情绪封面 / 主题爆点 / 仪式流程 / 打卡装置 / 舞台氛围 / 传播裂变",
    visual: "大图冲击、斜切色块、强标题短句、舞台灯光和可拍可传播的现场画面。",
    reference: "参考 reveal.js 的演示节奏、SUSE 模板系统和高识别度发布会版式。",
    promptCue: "采用创意盛典 PPT 风格：画面有现场感和传播性，强调主题爆点、仪式流程、打卡视觉、情绪递进和朋友圈传播素材。",
  },
  "argument-logic": {
    name: "观点论证",
    summary: "适合招商会、私域会销、工程发布会和策略型竞标提案，强调观点、逻辑链和转化路径。",
    structure: "核心观点 / 机会洞察 / 策略闭环 / 路径拆解 / 证据与转化 / 执行验证",
    visual: "一句话观点页、三段论卡片、路径图、数据/证据块，减少装饰，增强说服力。",
    reference: "参考 gbif/ppt-template 的报告结构和 pptx-automizer 的结构化生成方式。",
    promptCue: "采用观点论证 PPT 风格：每页先给判断，再给原因和执行动作；突出策略闭环、成交逻辑、传播链路和可验证结果。",
  },
  "brand-launch": {
    name: "品牌发布",
    summary: "适合新品发布、品牌峰会、招商大会和商场主题季，强调品牌资产、传播口号和沉浸式视觉统一。",
    structure: "品牌洞察 / 主题宣言 / 主视觉系统 / 现场体验 / 宣发物料 / 转化闭环",
    visual: "品牌宣言封面、沉浸式大图、统一视觉系统、媒介传播物料延展。",
    reference: "参考 gbif/ppt-template 的品牌规范化输出和 reveal.js 的章节化演示表达。",
    promptCue: "采用品牌发布 PPT 风格：从品牌洞察进入主题宣言，用统一视觉语言串联舞美、美陈、宣发物料和现场转化。",
  },
};

const TEMPLATE_ALIASES = {
  strategy: "argument-logic",
  brand: "brand-launch",
  commerce: "creative-ceremony",
  enterprise: "premium-business",
};

const ACTIVITY_PROMPT_PRESETS = {
  beauty: {
    name: "美业大健康微商活动号",
    clientIndustry: "美业大健康品牌",
    themeDirection: "年度品牌招商峰会",
    eventObjective: "提升品牌势能，完成招商转化，增强私域客户信任，并通过现场内容形成朋友圈传播。",
    themeOptions: ["年度品牌招商峰会", "美业私域会销沙龙", "品牌代理商大会", "新品体验发布会"],
    objectOptions: ["品牌代理商、意向加盟客户、私域核心客户、行业达人", "高净值女性客户、门店合伙人、渠道负责人", "品牌会员、体验官、社群主理人"],
    formOptions: ["品牌招商峰会 + 产品体验 + 签约转化", "私域沙龙 + 专家分享 + 现场成交", "产品体验会 + 达人打卡 + 代理商洽谈"],
    activityExecution: "前期完成主题视觉、邀约物料、现场搭建图和执行排期；活动当天完成签到接待、舞台控场、产品体验、签约转化和摄影摄像记录；活动后输出复盘素材和二次传播内容。",
    strategy: "品牌势能提升、代理商信任建立、招商转化成交、私域裂变传播。",
    route: "信任建立 → 情绪调动 → 产品价值证明 → 成交转化 → 私域复购。",
    visuals: "高端峰会主舞台、产品体验区、签约仪式区、达人打卡区、成交洽谈区。",
  },
  campus: {
    name: "校园活动号",
    clientIndustry: "高校 / 校园品牌 / 校企合作单位",
    themeDirection: "开学季校园社团嘉年华",
    eventObjective: "激活校园人群参与，提升社团与品牌曝光，形成学生自传播内容，并保障现场秩序与安全。",
    themeOptions: ["开学季校园社团嘉年华", "毕业季青春市集", "校园音乐节", "校企互动体验日"],
    objectOptions: ["在校学生、社团成员、校园达人、校企合作人群", "毕业生、辅导员、校友代表、学生家长", "学生社群、品牌体验用户、校园媒体"],
    formOptions: ["校园市集 + 社团展演 + 互动打卡", "舞台演出 + 社群任务 + 青春留影", "校企展区 + 互动体验 + 公益服务"],
    activityExecution: "前期联动社团与校方确认场地、动线、志愿者和安全预案；活动当天按分区完成引导、互动、演出、打卡和秩序维护；活动后整理校园传播素材和社群复盘数据。",
    strategy: "校园情绪唤醒、学生参与、社群传播、组织文化沉淀。",
    route: "入口吸引 → 互动参与 → 内容共创 → 社交传播 → 记忆留存。",
    visuals: "校园主舞台、社团市集、互动游戏区、青春打卡装置、校企展示区。",
  },
  construction: {
    name: "建筑行业活动号",
    clientIndustry: "建筑工程 / 地产开发 / 工程建设单位",
    themeDirection: "样板工地开放日暨工程实力发布会",
    eventObjective: "展示工程实力、项目进度和安全管理能力，增强客户与合作方信任，提升项目品牌专业度。",
    themeOptions: ["样板工地开放日暨工程实力发布会", "地产项目开放日", "建筑工程成果观摩会", "建筑展会品牌发布会"],
    objectOptions: ["业主代表、合作方、媒体、行业专家", "政府/园区代表、工程客户、供应链伙伴", "地产客户、渠道机构、项目管理团队"],
    formOptions: ["项目参观 + 工程讲解 + 成果展示", "开放日接待 + 沙盘展示 + 洽谈转化", "展会展陈 + 技术讲解 + 商务会谈"],
    activityExecution: "前期完成参观路线、安全导视、展陈物料和讲解口径；活动当天完成签到接待、分批参观、技术讲解、商务洽谈和安全巡检；活动后沉淀工程展示素材和客户跟进清单。",
    strategy: "专业可信、工程实力可视化、样板展示、客户信任建立。",
    route: "专业迎宾 → 工程展示 → 样板参观 → 技术讲解 → 合作转化。",
    visuals: "项目形象门头、工程成果展区、建筑模型、安全导视、商务洽谈区。",
  },
  mall: {
    name: "商超美陈号",
    clientIndustry: "城市购物中心 / 商业综合体 / 零售品牌",
    themeDirection: "节日主题商场美陈快闪活动",
    eventObjective: "提升商场节日客流，制造社交打卡传播，联动商户促活消费，并形成可持续宣发素材。",
    themeOptions: ["节日主题商场美陈快闪活动", "商场中庭沉浸式打卡展", "品牌快闪店开业活动", "商业空间主题市集"],
    objectOptions: ["亲子家庭、年轻情侣、周边社区客群、商场会员", "年轻消费者、小红书用户、城市白领、品牌粉丝", "商户会员、亲子客群、节日消费人群"],
    formOptions: ["中庭美陈 + DP打卡 + 商户联动", "快闪店 + 互动体验 + 社交传播", "主题市集 + 装置打卡 + 消费券转化"],
    activityExecution: "前期完成主题装置深化、商户联动机制、动线导视和宣发物料；活动当天完成搭建验收、互动运营、客流引导、拍摄记录和商户转化；活动后输出打卡素材、传播数据和复盘建议。",
    strategy: "客流吸引、打卡传播、空间美陈、商户联动和商业转化。",
    route: "入口吸睛 → 中庭爆点 → DP 打卡 → 互动停留 → 商户联动 → 社交传播。",
    visuals: "商场中庭主装置、入口门头、DP 打卡点、互动体验区、商户联动市集。",
  },
  enterprise: {
    name: "企业年会团建号",
    clientIndustry: "企业客户 / 集团公司 / 品牌机构",
    themeDirection: "年度企业盛典暨员工答谢晚宴",
    eventObjective: "呈现年度成果，增强员工荣誉感和组织凝聚力，提升企业品牌形象，并沉淀年会传播素材。",
    themeOptions: ["年度企业盛典暨员工答谢晚宴", "企业周年庆典", "新品发布会暨客户答谢会", "团队团建主题晚宴"],
    objectOptions: ["企业员工、管理层、合作伙伴、客户代表", "核心客户、渠道伙伴、媒体嘉宾、企业员工", "部门团队、优秀员工、业务合作方"],
    formOptions: ["年会晚宴 + 颁奖仪式 + 节目互动", "品牌发布 + 客户答谢 + 商务晚宴", "团建互动 + 荣誉表彰 + 合影留念"],
    activityExecution: "前期完成流程脚本、节目统筹、舞美搭建、设备联调和嘉宾动线；活动当天完成签到、控场、颁奖、节目、抽奖和晚宴服务；活动后输出照片直播、视频回顾和企业传播素材。",
    strategy: "组织文化表达、仪式感、员工参与、品牌形象和稳定执行。",
    route: "入场仪式 → 年度回顾 → 荣誉表彰 → 高光节目 → 晚宴互动 → 品牌留影。",
    visuals: "年会主舞台、签到留影区、颁奖区、晚宴区、互动抽奖区、设备控台。",
  },
};

let currentProposal = null;
let draftProposal = null;
let lastDraftInput = null;
let workflowState = "idle";

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function getChecked(id) {
  return Boolean(document.getElementById(id)?.checked);
}

function getConditionalValue(selectId, inputId) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  if (!select) {
    return input?.value?.trim() || "";
  }
  if (select.value === CUSTOM_OPTION_VALUE) {
    return input?.value?.trim() || "";
  }
  return select.value.trim();
}

function syncThreeDFields() {
  if (!include3DInput || !threeDFieldsEl) {
    return;
  }

  const enabled = include3DInput.checked;
  threeDFieldsEl.hidden = !enabled;
  if (!enabled && threeDReferenceInput) {
    threeDReferenceInput.value = "";
  }
}

function getSelectedActivityPrompt() {
  const presetId = activityAccountSelect?.value || "beauty";
  return {
    id: presetId,
    ...(ACTIVITY_PROMPT_PRESETS[presetId] || ACTIVITY_PROMPT_PRESETS.beauty),
  };
}

function updateActivityPromptSummary() {
  if (!activityPromptSummaryEl) {
    return;
  }

  const preset = getSelectedActivityPrompt();
  activityPromptSummaryEl.innerHTML = `
    <strong>${escapeHtml(preset.name)}</strong>
  `;
}

const CUSTOM_OPTION_VALUE = "__custom__";

function syncConditionalSelect(selectId, inputId) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  if (!select || !input) {
    return;
  }

  if (select.value === CUSTOM_OPTION_VALUE) {
    input.hidden = false;
    input.focus();
    return;
  }

  input.value = select.value;
  input.hidden = true;
}

function fillConditionalSelect(selectId, inputId, options, defaultValue) {
  const select = document.getElementById(selectId);
  const input = document.getElementById(inputId);
  if (!select || !input) {
    return;
  }

  const values = Array.isArray(options) && options.length ? options : [defaultValue].filter(Boolean);
  select.innerHTML = [
    ...values.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`),
    `<option value="${CUSTOM_OPTION_VALUE}">其他</option>`,
  ].join("");
  select.value = values.includes(defaultValue) ? defaultValue : values[0] || CUSTOM_OPTION_VALUE;
  input.value = select.value === CUSTOM_OPTION_VALUE ? defaultValue || "" : select.value;
  syncConditionalSelect(selectId, inputId);
}

function applyActivityDefaults() {
  const preset = getSelectedActivityPrompt();
  const fieldMap = {
    "client-industry": preset.clientIndustry,
    "event-title": preset.themeDirection,
    "event-subtitle": `${preset.name}活动策划与落地执行方案`,
    "event-objective": preset.eventObjective,
    "execution-flow": preset.activityExecution,
  };

  Object.entries(fieldMap).forEach(([id, value]) => {
    const field = document.getElementById(id);
    if (field && value) {
      field.value = value;
    }
  });

  fillConditionalSelect("activity-theme-option", "theme-direction", preset.themeOptions, preset.themeDirection);
  fillConditionalSelect("activity-object-option", "target-audience", preset.objectOptions, preset.objectOptions?.[0]);
  fillConditionalSelect("activity-form-option", "activity-form", preset.formOptions, preset.formOptions?.[0]);
}

function handleActivityAccountChange() {
  applyActivityDefaults();
  updateActivityPromptSummary();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("3D 参考图读取失败。"));
    reader.readAsDataURL(file);
  });
}

async function readOptionalImageFile(input, label) {
  if (!input?.files?.[0]) {
    return null;
  }
  const file = input.files[0];
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    label,
    dataUrl: await readFileAsDataUrl(file),
  };
}

function buildActivityExecutionSummary() {
  const parts = [
    ["一天执行流程", getValue("execution-flow")],
    ["演出/环节节点", getValue("execution-program")],
    ["拍摄安排", getValue("execution-shooting")],
    ["人员/运营安排", getValue("execution-operation")],
  ].filter(([, value]) => value);
  return parts.map(([label, value]) => `${label}：${value}`).join("；");
}

function getSelectedPreset() {
  const rawPresetId = templatePresetSelect.value || "premium-business";
  const presetId = TEMPLATE_ALIASES[rawPresetId] || rawPresetId;
  return {
    id: presetId,
    ...TEMPLATE_PRESETS_V2[presetId],
  };
}

function hydrateTemplateSelect() {
  if (!templatePresetSelect) {
    return;
  }

  templatePresetSelect.innerHTML = Object.entries(TEMPLATE_PRESETS_V2)
    .map(([id, preset]) => `<option value="${id}">${preset.name}</option>`)
    .join("");
  templatePresetSelect.value = "premium-business";
}

function refreshWorkflowCopy() {
  const imageLabel = generateImagesInput?.closest("label")?.querySelector("span");
  if (imageLabel) {
    imageLabel.textContent = "完整 PPT 生成全部配图";
  }

  if (workflowStageEl) {
    workflowStageEl.textContent = "先草稿，后完整 PPT。";
  }
}

function updateTemplateSummary() {
  const preset = getSelectedPreset();
  presetSummaryEl.innerHTML = `
    <strong>${escapeHtml(preset.name)}</strong>
  `;
}

function buildReviewedDraftSummary(proposal) {
  if (!proposal) {
    return null;
  }

  return {
    title: proposal.title || "",
    theme: proposal.theme || "",
    slogan: proposal.slogan || "",
    styleRationale: proposal.styleRationale || "",
    coreVisualSlides: selectDraftSlides(proposal).map((slide) => ({
      page: slide.page,
      title: slide.title || "",
      coreMessage: slide.coreMessage || "",
      imagePrompt: slide.imagePrompt || slide.threeDPrompt || "",
    })),
  };
}

async function getInput(workflowStage = "full", reviewedDraft = null) {
  const include3D = getChecked("include-3d");
  const selectedPreset = getSelectedPreset();
  const selectedActivityPrompt = getSelectedActivityPrompt();
  const keyVisualReferenceImage = await readOptionalImageFile(keyVisualReferenceInput, "活动主KV/主视觉图");
  const venueMapReferenceImage = await readOptionalImageFile(venueMapReferenceInput, "场地图/场地平面图");
  let threeDReferenceImage = null;

  if (include3D && threeDReferenceInput?.files?.[0]) {
    const file = threeDReferenceInput.files[0];
    threeDReferenceImage = {
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: await readFileAsDataUrl(file),
    };
  }

  if (include3D && !threeDReferenceImage && lastDraftInput?.threeD?.referenceImage) {
    threeDReferenceImage = lastDraftInput.threeD.referenceImage;
  }

  return {
    workflow: {
      stage: workflowStage,
      draftImageCount: 3,
      instruction:
        workflowStage === "draft"
          ? "先生成用于人工审阅的草稿预览，完整输出 13 页以上四章节结构，优先让 3 页核心视觉设置 VISUAL_PRIORITY: true，并围绕所选 PPT 模板控制结构和画面。"
          : "基于已确认的草稿方向生成完整 13-16 页四章节提案，保持模板风格、主题方向和核心视觉一致。",
      reviewedDraft: buildReviewedDraftSummary(reviewedDraft),
    },
    templatePreset: {
      id: selectedPreset.id,
      name: selectedPreset.name,
      summary: selectedPreset.summary,
      structure: selectedPreset.structure,
      visual: selectedPreset.visual,
      promptCue: selectedPreset.promptCue,
    },
    activityPromptPreset: selectedActivityPrompt,
    activityAccount: getValue("activity-account"),
    clientIndustry: getValue("client-industry"),
    eventTitle: getValue("event-title"),
    eventSubtitle: getValue("event-subtitle"),
    themeDirection: getValue("event-title") || getValue("theme-direction"),
    themeOption: getValue("theme-direction"),
    keyVisual: {
      enabled: Boolean(keyVisualReferenceImage),
      referenceImage: keyVisualReferenceImage,
    },
    eventObjective: getValue("event-objective"),
    eventTime: getValue("event-time"),
    eventLocation: getValue("event-location"),
    activityForm: getValue("activity-form"),
    activityExecution: buildActivityExecutionSummary(),
    executionModules: {
      flow: getValue("execution-flow"),
      program: getValue("execution-program"),
      shooting: getValue("execution-shooting"),
      operation: getValue("execution-operation"),
    },
    budgetRange: getValue("budget-range"),
    targetAudience: getValue("target-audience"),
    headcount: getValue("headcount"),
    venueType: getValue("venue-type"),
    venueMap: {
      enabled: Boolean(venueMapReferenceImage),
      referenceImage: venueMapReferenceImage,
    },
    needStage: getValue("need-stage"),
    needDisplay: getValue("need-display"),
    needPromotion: getValue("need-promotion"),
    proposalStyle: getConditionalValue("proposal-style", "proposal-style-custom"),
    companyCapability: getValue("company-capability"),
    extraRequirements: getValue("extra-requirements"),
    outputOptions: {
      generateAllImages: getChecked("generate-images"),
      includeBuildPlan: getChecked("generate-build-plan"),
      includeRunbookPlan: getChecked("generate-runbook-plan"),
    },
    threeD: {
      enabled: include3D,
      brief: getValue("three-d-brief"),
      referenceImage: threeDReferenceImage,
    },
  };
}

function setStatus(text, type = "") {
  statusEl.textContent = text;
  statusEl.className = "status-pill";
  if (type) {
    statusEl.classList.add(type);
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function setProgress(progress, message, label = "生成进度") {
  const safeProgress = Math.max(0, Math.min(100, Number(progress) || 0));
  if (progressPanelEl) {
    progressPanelEl.hidden = false;
  }
  if (progressLabelEl) {
    progressLabelEl.textContent = label;
  }
  if (progressPercentEl) {
    progressPercentEl.textContent = `${Math.round(safeProgress)}%`;
  }
  if (progressFillEl) {
    progressFillEl.style.width = `${safeProgress}%`;
  }
  if (progressDetailEl) {
    progressDetailEl.textContent = message || "生成任务进行中。";
  }
}

function resetProgress(label = "生成进度") {
  setProgress(0, "等待任务启动。", label);
}

async function pollProposalJob(jobId, label) {
  let job = null;
  while (true) {
    await wait(JOB_POLL_INTERVAL_MS);
    const response = await fetch(`/api/proposal-job?id=${encodeURIComponent(jobId)}&t=${Date.now()}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "生成进度查询失败。");
    }

    job = payload.job;
    setProgress(job.progress, job.message, label);
    if (job.status === "done") {
      return job.result;
    }
    if (job.status === "error") {
      throw new Error(job.error || job.message || "生成失败。");
    }
  }
}

async function startProposalJob(input, options) {
  resetProgress(options.label);
  const response = await fetch("/api/generate-proposal-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      input,
      stage: options.stage,
      generateImages: options.generateImages,
    }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "生成任务启动失败。");
  }

  const job = payload.job;
  setProgress(job.progress, job.message, options.label);
  return pollProposalJob(job.id, options.label);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSlideImageSrc(slide) {
  const threeDImageSrc =
    slide.threeDImageUrl || (slide.threeDImageBase64 ? `data:image/png;base64,${slide.threeDImageBase64}` : "");
  return threeDImageSrc || (slide.imageBase64 ? `data:image/png;base64,${slide.imageBase64}` : "") || slide.imageUrl || "";
}

function getSlidePromptText(slide) {
  return slide.threeDFileUrl
    ? `3D模型文件：${slide.threeDFileUrl}`
    : slide.threeDImageError || slide.imageError || slide.threeDPrompt || slide.imagePrompt || "生成后展示概念图或提示词。";
}

function getSceneImages(slide) {
  return Array.isArray(slide.sceneImages) ? slide.sceneImages.filter((item) => item?.imageUrl || item?.imageBase64) : [];
}

function getScenePrompts(slide) {
  return Array.isArray(slide.scenePrompts) ? slide.scenePrompts.filter(Boolean) : [];
}

function getSceneImageSrc(sceneImage) {
  return sceneImage?.imageUrl || (sceneImage?.imageBase64 ? `data:image/png;base64,${sceneImage.imageBase64}` : "");
}

function hasThreeDContent(slide) {
  return Boolean(
    slide.threeDImageUrl ||
      slide.threeDImageBase64 ||
      slide.threeDFileUrl ||
      slide.threeDPrompt ||
      slide.threeDStatus
  );
}

function renderSlideCard(slide, options = {}) {
  const imageSrc = getSlideImageSrc(slide);
  const promptText = getSlidePromptText(slide);
  const hasThreeD = hasThreeDContent(slide);
  const sceneImages = getSceneImages(slide);
  const scenePrompts = getScenePrompts(slide);
  const body = Array.isArray(slide.body) ? slide.body : [];
  const bodyItems = options.compact ? body.slice(0, 3) : body;

  return `
    <article class="slide-card${options.compact ? " draft-slide-card" : ""}">
      <div>
        <div class="slide-index">
          <span>PAGE ${String(slide.page || "").padStart(2, "0")}</span>
          ${slide.section ? `<span class="section-chip">${escapeHtml(slide.section)}</span>` : ""}
        </div>
        <h3>${escapeHtml(slide.title)}</h3>
        ${hasThreeD ? `<div class="slide-badge">3D 美陈参考${slide.threeDStatus ? ` · ${escapeHtml(slide.threeDStatus)}` : ""}</div>` : ""}
        <div class="slide-core">${escapeHtml(slide.coreMessage)}</div>
        <ul>
          ${bodyItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
        ${
          options.compact
            ? `<div class="slide-note">视觉提示：${escapeHtml(promptText)}</div>`
            : `
              <div class="slide-note">执行说明：${escapeHtml(slide.executionNotes || "按现场情况细化执行。")}</div>
              <div class="slide-note">版式建议：${escapeHtml(slide.layoutHint || "图文左右结构。")}</div>
              ${hasThreeD ? `<div class="slide-note">3D 说明：${escapeHtml(slide.threeDPrompt || "用于包装与空间效果展示。")}</div>` : ""}
              ${
                slide.threeDFileUrl
                  ? `<div class="slide-note">3D 文件：<a href="${escapeHtml(slide.threeDFileUrl)}" target="_blank" rel="noreferrer">打开 / 下载</a></div>`
                  : ""
              }
            `
        }
      </div>
      <div class="slide-visual">
        ${
          imageSrc
            ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(slide.title)}" />`
            : `<div class="prompt-box">${escapeHtml(promptText)}</div>`
        }
        ${
          !options.compact && (sceneImages.length || scenePrompts.length)
            ? `
              <div class="scene-gallery">
                ${
                  sceneImages.length
                    ? sceneImages
                        .map((sceneImage, index) => {
                          const src = getSceneImageSrc(sceneImage);
                          return src
                            ? `<img src="${escapeHtml(src)}" alt="${escapeHtml(slide.title)} 场景图 ${index + 1}" />`
                            : "";
                        })
                        .join("")
                    : scenePrompts
                        .slice(0, 4)
                        .map((prompt) => `<div class="scene-prompt">${escapeHtml(prompt)}</div>`)
                        .join("")
                }
              </div>
            `
            : ""
        }
      </div>
    </article>
  `;
}

function renderSlidesBySection(slides, options = {}) {
  const list = Array.isArray(slides) ? slides : [];
  const rendered = new Set();
  const groups = PROPOSAL_SECTIONS.map((section) => {
    const sectionSlides = list.filter((slide, index) => {
      const belongs = (slide.section || "") === section;
      if (belongs) {
        rendered.add(index);
      }
      return belongs;
    });
    if (!sectionSlides.length) {
      return "";
    }
    return `
      <section class="slide-section-group">
        <div class="section-label">${escapeHtml(section)} · ${sectionSlides.length} 页</div>
        ${sectionSlides.map((slide) => renderSlideCard(slide, options)).join("")}
      </section>
    `;
  }).join("");

  const ungrouped = list.filter((_, index) => !rendered.has(index));
  if (!ungrouped.length) {
    return groups;
  }

  return `${groups}
    <section class="slide-section-group">
      <div class="section-label">未归类 · ${ungrouped.length} 页</div>
      ${ungrouped.map((slide) => renderSlideCard(slide, options)).join("")}
    </section>
  `;
}

function selectDraftSlides(proposal) {
  const slides = Array.isArray(proposal?.slides) ? proposal.slides : [];
  const picked = [];
  const seen = new Set();
  const addSlide = (slide) => {
    const key = `${slide.page || ""}-${slide.title || ""}`;
    if (!seen.has(key)) {
      seen.add(key);
      picked.push(slide);
    }
  };

  slides.filter((slide) => getSlideImageSrc(slide)).forEach(addSlide);
  slides.filter((slide) => slide.visualPriority).forEach(addSlide);
  slides.filter((slide) => [1, 4, 8, 10].includes(slide.page)).forEach(addSlide);
  slides.forEach(addSlide);

  return picked.slice(0, 3);
}

function renderDraftProposal(proposal, templatePreset) {
  draftProposal = proposal;
  currentProposal = null;
  deckTitleEl.textContent = proposal.title || "草稿预览";
  deckMetaEl.textContent = `${proposal.theme || "主题待确认"} ${proposal.slogan ? "｜" + proposal.slogan : ""}`;
  draftReviewEl.hidden = false;
  draftTemplateEl.textContent = templatePreset?.name || "已选模板";
  draftSummaryEl.textContent = proposal.styleRationale || templatePreset?.summary || "请检查主题、结构和核心视觉方向。";

  const draftSlides = selectDraftSlides(proposal);
  draftVisualsEl.innerHTML = draftSlides.length
    ? draftSlides.map((slide) => renderSlideCard(slide, { compact: true })).join("")
    : `<div class="empty-state">接口已返回草稿，但没有可展示的视觉页。请重新生成草稿。</div>`;
  slidesPreviewEl.innerHTML = `
    <div class="section-label">完整草稿页：3 张核心图 + 其余页面 Prompt 占位</div>
    ${renderSlidesBySection(proposal.slides || [])}
  `;
}

function renderProposal(proposal) {
  currentProposal = proposal;
  draftReviewEl.hidden = true;
  deckTitleEl.textContent = proposal.title || "活动方案";
  deckMetaEl.textContent = `${proposal.theme || ""} ${proposal.slogan ? "｜" + proposal.slogan : ""}`;
  slidesPreviewEl.innerHTML = renderSlidesBySection(proposal.slides || []);
}

function setWorkflowState(nextState) {
  workflowState = nextState;
  const busy = ["draft-loading", "full-loading", "export-loading"].includes(workflowState);

  generateButton.disabled = busy;
  confirmButton.disabled = busy || !draftProposal || workflowState === "full-ready";
  exportButton.disabled = busy || !currentProposal;
  generateImagesInput.disabled = busy;
  generateBuildPlanInput.disabled = busy;
  generateRunbookPlanInput.disabled = busy;
  templatePresetSelect.disabled = busy;

  generateButton.textContent = workflowState === "draft-loading" ? "生成中..." : "生成草稿";
  confirmButton.textContent = workflowState === "full-loading" ? "生成中..." : "生成完整 PPT";
  exportButton.textContent = workflowState === "export-loading" ? "导出中..." : "导出 PPT";
}

async function generateDraftPreview() {
  draftProposal = null;
  currentProposal = null;
  lastDraftInput = null;
  draftReviewEl.hidden = true;
  draftVisualsEl.innerHTML = "";
  slidesPreviewEl.innerHTML = "";
  deckTitleEl.textContent = "正在生成草稿...";
  deckMetaEl.textContent = "生成草稿中。";
  workflowStageEl.textContent = "草稿生成中。";
  setStatus("生成草稿中", "loading");
  setWorkflowState("draft-loading");

  try {
    const input = await getInput("draft");
    lastDraftInput = input;
    const payload = await startProposalJob(input, {
      stage: "preview",
      generateImages: true,
      label: "草稿生成进度",
    });

    renderDraftProposal(payload.proposal, input.templatePreset);
    setStatus("草稿待确认", "success");
    workflowStageEl.textContent = "确认后生成完整 PPT。";
    setWorkflowState("draft-ready");
  } catch (error) {
    setStatus("草稿失败", "error");
    deckTitleEl.textContent = "草稿生成失败";
    deckMetaEl.textContent = String(error.message || error);
    workflowStageEl.textContent = "请调整后重试。";
    setWorkflowState("idle");
  }
}

async function generateFullProposal() {
  if (!draftProposal || !lastDraftInput) {
    window.alert("请先生成并检查草稿预览。");
    return;
  }

  currentProposal = null;
  slidesPreviewEl.innerHTML = "";
  deckTitleEl.textContent = "正在生成完整方案...";
  deckMetaEl.textContent = "生成完整 PPT 中。";
  workflowStageEl.textContent = "完整 PPT 生成中。";
  const shouldGenerateImageJob =
    getChecked("generate-images") || getChecked("generate-build-plan") || getChecked("generate-runbook-plan");
  setStatus(shouldGenerateImageJob ? "生成 PPT 和图片中" : "生成 PPT 中", "loading");
  setWorkflowState("full-loading");

  try {
    const input = await getInput("full", draftProposal);
    const payload = await startProposalJob(input, {
      stage: "final",
      generateImages: shouldGenerateImageJob,
      label: "正式稿生成进度",
    });

    renderProposal(payload.proposal);
    setStatus("完整方案已生成", "success");
    workflowStageEl.textContent = "可导出 PPT。";
    setWorkflowState("full-ready");
  } catch (error) {
    setStatus("完整生成失败", "error");
    deckTitleEl.textContent = "完整方案生成失败";
    deckMetaEl.textContent = String(error.message || error);
    workflowStageEl.textContent = "可重试。";
    setWorkflowState(draftProposal ? "draft-ready" : "idle");
  }
}

async function exportPpt() {
  if (!currentProposal) {
    window.alert("请先确认草稿并生成完整方案。");
    return;
  }

  setWorkflowState("export-loading");
  setStatus("导出 PPT 中", "loading");

  try {
    const response = await fetch("/api/export-ppt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proposal: currentProposal }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || "PPT 导出失败。");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProposal.title || "活动方案"}.pptx`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 300);
    setStatus("PPT 已导出", "success");
  } catch (error) {
    setStatus("导出失败", "error");
    window.alert(String(error.message || error));
  } finally {
    setWorkflowState(currentProposal ? "full-ready" : "idle");
  }
}

generateButton.addEventListener("click", generateDraftPreview);
confirmButton.addEventListener("click", generateFullProposal);
exportButton.addEventListener("click", exportPpt);
templatePresetSelect.addEventListener("change", updateTemplateSummary);
activityAccountSelect?.addEventListener("change", handleActivityAccountChange);
include3DInput?.addEventListener("change", syncThreeDFields);
document.getElementById("activity-theme-option")?.addEventListener("change", () => {
  syncConditionalSelect("activity-theme-option", "theme-direction");
  const eventTitle = document.getElementById("event-title");
  if (eventTitle) {
    eventTitle.value = getValue("theme-direction");
  }
});
document.getElementById("activity-object-option")?.addEventListener("change", () => {
  syncConditionalSelect("activity-object-option", "target-audience");
});
document.getElementById("activity-form-option")?.addEventListener("change", () => {
  syncConditionalSelect("activity-form-option", "activity-form");
});
document.getElementById("proposal-style")?.addEventListener("change", () => {
  syncConditionalSelect("proposal-style", "proposal-style-custom");
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateDraftPreview();
});

hydrateTemplateSelect();
refreshWorkflowCopy();
applyActivityDefaults();
syncThreeDFields();
syncConditionalSelect("proposal-style", "proposal-style-custom");
updateTemplateSummary();
updateActivityPromptSummary();
setWorkflowState("idle");
