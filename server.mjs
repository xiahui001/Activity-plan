import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number.parseInt(process.env.PORT || "3000", 10);
const ARK_API_KEY = process.env.ARK_API_KEY;
const ARK_BASE_URL = process.env.ARK_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3";
const ARK_TEXT_MODEL = process.env.ARK_TEXT_MODEL || "doubao-seed-1-6-260615";
const ARK_IMAGE_MODEL = process.env.ARK_IMAGE_MODEL || "doubao-seedream-5-0-260128";
const ARK_3D_MODEL = process.env.ARK_3D_MODEL || "doubao-seed3d-2-0-260328";
const ARK_3D_CREATE_ENDPOINT =
  process.env.ARK_3D_CREATE_ENDPOINT || process.env.ARK_3D_ENDPOINT || `${ARK_BASE_URL}/contents/generations/tasks`;
const ARK_3D_QUERY_ENDPOINT = process.env.ARK_3D_QUERY_ENDPOINT || `${ARK_BASE_URL}/contents/generations/tasks`;
const ARK_3D_FILE_FORMAT = process.env.ARK_3D_FILE_FORMAT || "glb";
const ARK_3D_SUBDIVISION = process.env.ARK_3D_SUBDIVISION || "medium";
const ARK_3D_POLL_TIMEOUT_MS = Number.parseInt(process.env.ARK_3D_POLL_TIMEOUT_MS || "180000", 10);
const ARK_3D_POLL_INTERVAL_MS = Number.parseInt(process.env.ARK_3D_POLL_INTERVAL_MS || "8000", 10);
const BUNDLED_NODE_MODULES =
  process.env.NODE_PATH ||
  "C:\\Users\\Mia\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules";

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const TEMPLATE_PRESETS = [
  {
    id: "premium-business",
    name: "高端商务",
    description: "适合竞标汇报、企业会议、地产/建筑开放日和高预算甲方路演，强调专业可信、执行稳定和高级质感。",
    bestFor: ["建筑行业活动号", "企业年会团建号", "正式竞标汇报", "高预算品牌会议"],
    palette: {
      bg: "F7F2EA",
      surface: "FFFFFF",
      deep: "18212F",
      muted: "667085",
      accent: "B98535",
      accent2: "263A59",
      soft: "EFE7DA",
      line: "D8C7AA",
    },
    layoutHints: ["大留白与细分割线", "结论先行", "数字化证据", "低饱和商务摄影"],
    promptCue:
      "采用高端商务 PPT 风格：克制、可信、有甲方汇报感，版面留白充分，重点突出专业判断、预算秩序、执行保障和高质感舞美落地。",
    referenceLabels: ["gbif/ppt-template", "SUSE/presentation-template", "singerla/pptx-automizer"],
  },
  {
    id: "creative-ceremony",
    name: "创意盛典",
    description: "适合美业峰会、品牌沙龙、年会晚宴、校园活动和商业快闪，强调情绪张力、仪式感和社交传播。",
    bestFor: ["美业大健康微商活动号", "校园活动号", "企业年会晚宴", "商超快闪活动"],
    palette: {
      bg: "FFF6EA",
      surface: "FFFFFF",
      deep: "25140F",
      muted: "7C5F55",
      accent: "F05A28",
      accent2: "FFB000",
      soft: "FFE6C7",
      line: "FFD0A3",
    },
    layoutHints: ["大图冲击", "斜切色块", "强标题短句", "打卡装置和舞台氛围"],
    promptCue:
      "采用创意盛典 PPT 风格：画面更有现场感和传播性，强调主题爆点、仪式流程、打卡视觉、情绪递进和朋友圈传播素材。",
    referenceLabels: ["reveal.js", "SUSE/presentation-template", "LaunchCode slide-template"],
  },
  {
    id: "argument-logic",
    name: "观点论证",
    description: "适合招商会、私域会销、工程发布会和需要说服甲方的策略型提案，强调观点、逻辑链和转化路径。",
    bestFor: ["招商会", "私域会销", "工程发布会", "策略型竞标提案"],
    palette: {
      bg: "F4F7FB",
      surface: "FFFFFF",
      deep: "101828",
      muted: "667085",
      accent: "2563EB",
      accent2: "0F766E",
      soft: "EAF1FF",
      line: "D9E2F2",
    },
    layoutHints: ["一句话观点页", "三段论卡片", "路径图", "数据/证据块"],
    promptCue:
      "采用观点论证 PPT 风格：每页先给判断，再给原因和执行动作；减少空泛口号，突出策略闭环、成交逻辑、传播链路和可验证结果。",
    referenceLabels: ["gbif/ppt-template", "pptx-automizer", "SUSE/presentation-template"],
  },
  {
    id: "brand-launch",
    name: "品牌发布",
    description: "适合新品发布、品牌峰会、招商大会和商场主题季，强调品牌资产、传播口号和沉浸式视觉统一。",
    bestFor: ["新品发布会", "品牌峰会", "商场节日美陈", "品牌招商大会"],
    palette: {
      bg: "F8F5EF",
      surface: "FFFFFF",
      deep: "15110A",
      muted: "6F675C",
      accent: "7A4E2D",
      accent2: "D9A441",
      soft: "EFE1CC",
      line: "D9C4A7",
    },
    layoutHints: ["品牌宣言封面", "沉浸式大图", "主题视觉系统", "媒介传播物料延展"],
    promptCue:
      "采用品牌发布 PPT 风格：从品牌洞察进入主题宣言，用统一视觉语言串联舞美、美陈、宣发物料和现场转化，强调高级感与记忆点。",
    referenceLabels: ["gbif/ppt-template", "reveal.js", "singerla/pptx-automizer"],
  },
];

const TEMPLATE_ALIASES = {
  strategy: "argument-logic",
  brand: "brand-launch",
  commerce: "creative-ceremony",
  enterprise: "premium-business",
};

const ACTIVITY_PROMPT_PRESETS = {
  beauty: {
    id: "beauty",
    name: "美业大健康微商活动号",
    proposalPrompt: `
请围绕「美业大健康品牌增长与招商转化」生成商业级活动方案 PPT。方案要兼具高级品牌感、成交转化力和私域传播力。
核心策略：甲方真正要的不是一场热闹活动，而是品牌势能提升、代理商信任建立、招商转化成交、私域裂变传播。
体验路径：信任建立 - 情绪调动 - 产品价值证明 - 成交转化 - 私域复购。
现场重点：主舞台、签约仪式区、产品体验区、达人打卡区、洽谈成交区。
宣发重点：朋友圈海报、短视频切片、成交战报、客户见证、现场金句传播。
PPT 语言要高级、坚定、有招商会销经验，多用成交路径、信任背书、现场转化、私域传播、代理商信心等商业语言。`.trim(),
    imagePromptTemplate:
      "美业大健康品牌招商峰会现场，豪华酒店宴会厅或城市会议中心，主舞台大型 LED 屏，香槟金与珍珠白高级配色，环形灯光矩阵，品牌产品陈列区，代理商签约仪式区，现场座无虚席，女性创业者和品牌代理商参与，氛围高端、热烈、有成交感，商业活动摄影，广角镜头，真实舞美搭建材质，电影级灯光，16:9，无文字水印。",
    sceneFocus: ["主舞台峰会全景", "产品体验与品牌美陈区", "签约成交与代理商合影区", "朋友圈打卡装置与达人拍摄区"],
  },
  campus: {
    id: "campus",
    name: "校园活动号",
    proposalPrompt: `
请围绕「年轻人参与感、校园文化表达、社交传播和现场秩序」生成商业级校园活动方案 PPT。方案要既有青春活力，又有学校/甲方能接受的安全与组织逻辑。
核心策略：校园活动不是简单搭台做节目，而是完成校园情绪唤醒、学生参与、社群传播、组织文化沉淀。
体验路径：入口吸引 - 互动参与 - 内容共创 - 社交传播 - 记忆留存。
现场重点：社团展示区、舞台表演区、市集互动区、拍照打卡区、校企展示区、志愿者服务点。
宣发重点：校园公众号、朋友圈、社群、短视频、社团联动、活动打卡任务。
PPT 语言要年轻、有画面感，但逻辑清楚，兼顾学生喜欢和甲方放心。`.trim(),
    imagePromptTemplate:
      "大型校园开学季活动现场，大学操场或校园广场，青春明亮的舞台设计，彩色模块化美陈装置，社团摊位、市集帐篷、互动游戏区、拍照打卡墙，学生人群自然参与，阳光傍晚氛围，青春、热烈、有秩序，商业活动摄影，广角空间感，真实搭建材质，16:9，无文字水印。",
    sceneFocus: ["校园主舞台与观众区全景", "社团市集摊位动线", "青春打卡美陈装置", "校企互动展示区"],
  },
  construction: {
    id: "construction",
    name: "建筑行业活动号",
    proposalPrompt: `
请围绕「专业可信、工程实力、样板展示、客户信任」生成建筑行业商业级活动方案 PPT。方案要体现建筑行业的严谨、秩序、品质和安全感。
核心策略：建筑行业活动不是做热闹，而是把项目实力、工程质量、管理能力和品牌可信度可视化。
体验路径：专业迎宾 - 工程展示 - 样板参观 - 技术讲解 - 客户信任建立 - 合作转化。
现场重点：项目形象门头、接待签到区、工程成果展区、样板展示区、技术讲解区、洽谈区、安全导视系统。
宣发重点：工程实力、项目进度、样板开放、客户见证、媒体报道、行业背书。
PPT 语言要稳重、专业、理性、有工程汇报感，强调安全、秩序、品质、可信。`.trim(),
    imagePromptTemplate:
      "建筑行业项目开放日活动现场，现代地产项目或样板工地展示区，专业接待门头，工程成果展板，建筑模型展示台，安全导视系统，客户参观动线清晰，商务人群参观交流，深蓝、灰白、金属质感配色，空间秩序感强，专业可信，商业摄影，广角镜头，真实展陈材料，16:9，无文字水印。",
    sceneFocus: ["项目开放日入口门头", "工程成果与建筑模型展示区", "样板参观动线与讲解区", "高端客户洽谈区"],
  },
  mall: {
    id: "mall",
    name: "商超美陈号",
    proposalPrompt: `
请围绕「客流吸引、打卡传播、空间美陈、商业转化」生成商超美陈活动商业级 PPT。方案要有强视觉、强打卡、强动线、强传播。
核心策略：商超美陈不是单点装饰，而是商业空间里的流量入口、拍照理由、消费触发器和传播素材库。
体验路径：入口吸睛 - 中庭爆点 - DP 打卡 - 互动停留 - 商户联动 - 社交传播。
现场重点：主题门头、中庭主装置、DP 打卡点、互动体验区、商户联动区、导视系统、拍照机位。
宣发重点：朋友圈打卡、小红书种草、商场会员、商户联动、节日主题海报。
PPT 语言要视觉化、商业化、有空间策展感，突出可拍、可逛、可传播、可转化。`.trim(),
    imagePromptTemplate:
      "大型购物中心节日主题美陈活动，中庭宏大主装置，沉浸式场景布置，节日主题色彩，巨型艺术装置、DP 打卡点、互动体验区、商户联动摊位，人群拍照打卡，空间层次丰富，商业氛围热烈，高级商场灯光，真实材质，广角镜头，商业摄影，16:9，无文字水印。",
    sceneFocus: ["商场中庭主装置全景", "主入口吸睛门头", "DP 打卡点和互动装置", "商户联动市集与人流动线"],
  },
  enterprise: {
    id: "enterprise",
    name: "企业年会团建号",
    proposalPrompt: `
请围绕「组织文化、仪式感、员工参与、品牌形象、执行稳定」生成企业年会/晚宴/发布会商业级 PPT。方案要既有舞台震撼力，又有企业文化表达和现场执行秩序。
核心策略：企业年会不是吃饭表演，而是组织文化表达、团队情绪凝聚、品牌形象展示和年度成果发布。
体验路径：入场仪式 - 年度回顾 - 荣誉表彰 - 高光节目 - 晚宴互动 - 品牌留影。
现场重点：签到区、品牌留影区、主舞台、颁奖区、晚宴区、互动抽奖区、设备控台和执行保障区。
宣发重点：企业公众号、员工朋友圈、年会回顾视频、获奖海报、现场照片直播。
PPT 语言要正式、大气、有组织温度，强调仪式感、荣誉感、凝聚力、稳定执行。`.trim(),
    imagePromptTemplate:
      "大型企业年度盛典晚宴现场，高端酒店宴会厅，宏大主舞台，超宽 LED 大屏，品牌色灯光矩阵，颁奖仪式区，圆桌晚宴区，员工观众席，舞台层次丰富，灯光震撼但高级，企业文化氛围，商业活动摄影，广角镜头，真实舞美搭建材质，16:9，无文字水印。",
    sceneFocus: ["年会主舞台全景", "签到留影品牌美陈区", "颁奖仪式舞台效果", "晚宴互动与员工氛围"],
  },
};

function loadPptxGen() {
  try {
    const mod = require("pptxgenjs");
    return mod.default || mod;
  } catch {
    const mod = require(path.join(BUNDLED_NODE_MODULES, "pptxgenjs"));
    return mod.default || mod;
  }
}

function json(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function sendBuffer(response, statusCode, buffer, headers = {}) {
  response.writeHead(statusCode, headers);
  response.end(buffer);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHash(value) {
  return String(value || "").replace(/^#/, "");
}

function publicTemplatePreset(preset) {
  return {
    id: preset.id,
    name: preset.name,
    description: preset.description,
    bestFor: preset.bestFor,
    palette: preset.palette,
    layoutHints: preset.layoutHints,
    promptCue: preset.promptCue,
    referenceLabels: preset.referenceLabels,
  };
}

function resolveActivityPromptPreset(input = {}) {
  const rawValue = input.activityAccount || input.activityPromptPreset?.id || "beauty";
  return ACTIVITY_PROMPT_PRESETS[rawValue] || ACTIVITY_PROMPT_PRESETS.beauty;
}

function publicActivityPromptPreset(preset) {
  return {
    id: preset.id,
    name: preset.name,
    proposalPrompt: preset.proposalPrompt,
    imagePromptTemplate: preset.imagePromptTemplate,
    sceneFocus: preset.sceneFocus,
  };
}

function getActivityPromptPayload() {
  return {
    defaultActivityId: "beauty",
    prompts: Object.values(ACTIVITY_PROMPT_PRESETS).map(publicActivityPromptPreset),
  };
}

function resolveTemplatePreset(input = {}) {
  const rawValue =
    input.templatePreset?.id ||
    input.templatePreset?.templateId ||
    input.templateId ||
    input.pptTemplate ||
    "premium-business";
  const templateId = TEMPLATE_ALIASES[rawValue] || rawValue;
  return TEMPLATE_PRESETS.find((preset) => preset.id === templateId) || TEMPLATE_PRESETS[0];
}

function resolveGenerationStage(payload = {}, input = {}) {
  const rawStage = String(payload.stage || input?.workflow?.stage || input?.stage || "").toLowerCase();
  if (["draft", "preview"].includes(rawStage)) {
    return "preview";
  }
  if (["full", "final", "production"].includes(rawStage)) {
    return "final";
  }
  return "final";
}

function getTemplatePayload() {
  return {
    defaultTemplateId: TEMPLATE_PRESETS[0].id,
    templates: TEMPLATE_PRESETS.map(publicTemplatePreset),
    references: [
      {
        label: "gbif/ppt-template",
        url: "https://github.com/gbif/ppt-template",
        note: "偏正式报告和机构汇报的版式参考。",
      },
      {
        label: "SUSE/presentation-template",
        url: "https://github.com/SUSE/presentation-template",
        note: "偏企业品牌演示系统和一致性组件参考。",
      },
      {
        label: "singerla/pptx-automizer",
        url: "https://github.com/singerla/pptx-automizer",
        note: "偏模板驱动、结构化生成 PPT 的工程参考。",
      },
      {
        label: "reveal.js",
        url: "https://github.com/hakimel/reveal.js",
        note: "偏演示节奏、章节感和舞台化表达参考。",
      },
    ],
  };
}

function resolveStaticPath(urlPath) {
  const normalizedPath = urlPath === "/" ? "/index.html" : urlPath.split("?")[0];
  const decodedPath = decodeURIComponent(normalizedPath);
  const filePath = path.resolve(__dirname, `.${decodedPath}`);

  if (!filePath.startsWith(__dirname)) {
    return null;
  }

  return filePath;
}

async function serveStatic(request, response) {
  const filePath = resolveStaticPath(request.url || "/");
  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const content = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": CONTENT_TYPES[extension] || "application/octet-stream",
    });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf-8");
  return raw ? JSON.parse(raw) : {};
}

function requireArkKey(response) {
  if (ARK_API_KEY) {
    return true;
  }

  json(response, 500, {
    error: "未设置 ARK_API_KEY。请先在 PowerShell 中设置豆包 Ark API Key，再启动本地服务。",
  });
  return false;
}

function buildArkError(payload, statusCode) {
  if (payload?.error?.message) {
    return payload.error.message;
  }

  if (payload?.message) {
    return payload.message;
  }

  if (statusCode === 401) {
    return "Ark API Key 无效，请检查 ARK_API_KEY。";
  }

  if (statusCode === 403) {
    return "Ark 请求被拒绝，请确认账号权限、模型权限或地域配置。";
  }

  return "豆包 Ark 接口调用失败。";
}

async function callArkChat(messages, responseFormat = "json_object") {
  const body = {
    model: ARK_TEXT_MODEL,
    messages,
    temperature: 0.75,
  };

  if (responseFormat) {
    body.response_format = { type: responseFormat };
  }

  const upstream = await fetch(`${ARK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ARK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    if (responseFormat && upstream.status === 400) {
      return callArkChat(messages, "");
    }
    throw new Error(buildArkError(result, upstream.status));
  }

  const content = result?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("豆包文本模型未返回内容。");
  }

  return content;
}

async function generateArkImage(prompt) {
  const upstream = await fetch(`${ARK_BASE_URL}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ARK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: ARK_IMAGE_MODEL,
      prompt,
      size: "2K",
      response_format: "url",
      watermark: true,
    }),
  });

  const result = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    throw new Error(buildArkError(result, upstream.status));
  }

  const imageUrl = result?.data?.[0]?.url;
  const imageBase64 = result?.data?.[0]?.b64_json;

  if (!imageUrl && !imageBase64) {
    throw new Error("豆包图片模型未返回图片 URL 或图片数据。");
  }

  return imageUrl ? { imageUrl } : { imageBase64, mimeType: "image/png" };
}

function buildThreeDPrompt(input, proposal) {
  const reference = input?.threeD?.referenceImage;
  const referenceInfo = reference
    ? `\n参考图信息：文件名 ${reference.name || ""}，类型 ${reference.type || ""}，大小 ${reference.size || ""} 字节。`
    : "";
  const brief = input?.threeD?.brief ? `\n3D 风格说明：${input.threeD.brief}` : "";
  const title = proposal?.title || input?.themeDirection || "活动方案";
  return `基于活动方案主题“${title}”生成一张 3D 美陈 / 包装参考图，适合用于路演汇报中的空间氛围展示。要求突出真实材质、结构层次、装置尺度、灯光氛围、品牌调性和可落地效果，不要文字水印，不要说明文字。画面要适合 16:9 PPT${brief}${referenceInfo}`;
}

async function generateArk3d(prompt, referenceImage) {
  if (!referenceImage?.dataUrl) {
    throw new Error("Seed3D 需要上传 1 张参考图片。");
  }

  const body = {
    model: ARK_3D_MODEL,
    content: [
      {
        type: "image_url",
        image_url: {
          url: referenceImage.dataUrl,
        },
      },
      {
        type: "text",
        text: `--subdivisionlevel ${ARK_3D_SUBDIVISION} --fileformat ${ARK_3D_FILE_FORMAT}`,
      },
    ],
  };

  const upstream = await fetch(ARK_3D_CREATE_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ARK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const result = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    throw new Error(buildArkError(result, upstream.status));
  }

  const taskId = result?.id || result?.data?.id || result?.task_id || "";
  if (!taskId) {
    throw new Error("Seed3D 创建任务未返回任务 ID。");
  }

  const task = await pollArk3dTask(taskId).catch(() => null);
  return {
    taskId,
    status: task?.status || result?.status || "queued",
    fileUrl: task?.content?.file_url || result?.content?.file_url || "",
    raw: task || result,
    prompt,
  };
}

async function pollArk3dTask(taskId) {
  const deadline = Date.now() + ARK_3D_POLL_TIMEOUT_MS;
  let latest = await queryArk3dTask(taskId);

  while (["queued", "running"].includes(latest?.status) && Date.now() < deadline) {
    await sleep(ARK_3D_POLL_INTERVAL_MS);
    latest = await queryArk3dTask(taskId);
  }

  return latest;
}

async function queryArk3dTask(taskId) {
  const upstream = await fetch(`${ARK_3D_QUERY_ENDPOINT}/${encodeURIComponent(taskId)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ARK_API_KEY}`,
    },
  });

  const result = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    throw new Error(buildArkError(result, upstream.status));
  }

  return result;
}

function extractJson(content) {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("模型返回内容不是有效 JSON。");
    }
    return JSON.parse(match[0]);
  }
}

async function repairJsonContent(content) {
  const repaired = await callArkChat(
    [
      {
        role: "system",
        content: "你是 JSON 修复器。只输出严格合法 JSON，不要 Markdown，不要解释。",
      },
      {
        role: "user",
        content: `下面内容本应是活动方案 JSON，但存在格式错误。请在不改写内容含义的前提下修复为严格合法 JSON，并保持原字段结构：\n\n${content}`,
      },
    ],
    "json_object"
  );

  return extractJson(repaired);
}

function sanitizeFileName(value) {
  return String(value || "活动方案")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

const PROPOSAL_SECTIONS = ["策划思路", "活动概览", "环节介绍", "活动宣传"];
const MAX_PROPOSAL_SLIDES = 16;

const PROPOSAL_SECTION_PLAN = [
  { page: 1, section: "策划思路", title: "封面" },
  { page: 2, section: "策划思路", title: "项目理解" },
  { page: 3, section: "策划思路", title: "策划策略与主题方向" },
  { page: 4, section: "活动概览", title: "活动概况" },
  { page: 5, section: "活动概览", title: "活动概况总结" },
  { page: 6, section: "活动概览", title: "主题创意与活动亮点" },
  { page: 7, section: "活动概览", title: "区域规划与动线设计" },
  { page: 8, section: "环节介绍", title: "流程规划" },
  { page: 9, section: "环节介绍", title: "重点环节设计" },
  { page: 10, section: "环节介绍", title: "舞美美陈与物料设备" },
  { page: 11, section: "活动宣传", title: "宣发引流方案" },
  { page: 12, section: "活动宣传", title: "执行保障与风险预案" },
  { page: 13, section: "活动宣传", title: "报价/预算框架与预期效果" },
];

function getSectionPlan(page = 1) {
  const pageNumber = Number.parseInt(page, 10) || 1;
  return (
    PROPOSAL_SECTION_PLAN.find((item) => item.page === pageNumber) || {
      page: pageNumber,
      section: "活动宣传",
      title: `延展内容 ${pageNumber}`,
    }
  );
}

function normalizeSection(value, page = 1) {
  const text = String(value || "").trim();
  if (PROPOSAL_SECTIONS.includes(text)) {
    return text;
  }
  return getSectionPlan(page).section;
}

function inferSlideArchetype(slide, index) {
  const page = Number(slide.page || index + 1);
  const title = `${slide.title || ""} ${slide.coreMessage || ""}`;
  if (page === 1 || /封面|cover/i.test(title)) return "cover";
  if (/项目理解|背景|洞察/.test(title)) return "project-understanding";
  if (/策略|路径|打法/.test(title)) return "strategy";
  if (/主题|创意|宣言/.test(title)) return "creative";
  if (/亮点|爆点|打卡/.test(title)) return "highlights";
  if (/流程|排期|时间|timeline/i.test(title)) return "timeline";
  if (/区域|动线|空间|规划/.test(title)) return "area-planning";
  if (/舞美|美陈|舞台|3D|装置/.test(title)) return "stage-design";
  if (/物料|设备|清单/.test(title)) return "materials";
  if (/宣发|引流|传播|朋友圈/.test(title)) return "promotion";
  if (/执行|人员|风险|预案|保障/.test(title)) return "execution-risk";
  if (/预算|报价|效果|预期/.test(title)) return "budget-effect";
  return page % 2 === 0 ? "content-split" : "content-cards";
}

function inferLayoutVariant(archetype, index, templatePreset = TEMPLATE_PRESETS[0]) {
  if (archetype === "cover") return "cover-hero";
  if (["timeline", "execution-risk"].includes(archetype)) return "horizontal-process";
  if (["area-planning", "stage-design"].includes(archetype)) return "visual-board";
  if (["materials", "budget-effect"].includes(archetype)) return "matrix";
  if (archetype === "creative" && templatePreset.id !== "argument-logic") return "image-led";
  if (archetype === "highlights") return "cards";
  return index % 2 === 0 ? "text-left-visual-right" : "visual-left-text-right";
}

function scoreVisualPriority(slide, index) {
  if (slide.visualPriority) return 100 - index;
  const archetype = slide.archetype || inferSlideArchetype(slide, index);
  const scores = {
    cover: 90,
    creative: 86,
    highlights: 84,
    "stage-design": 82,
    "area-planning": 78,
    promotion: 72,
  };
  return scores[archetype] || 40 - index;
}

function normalizeSlides(proposal, templatePreset = resolveTemplatePreset(proposal || {})) {
  const slides = Array.isArray(proposal?.slides) ? proposal.slides : [];
  return slides.map((slide, index) => ({
    page: slide.page || index + 1,
    section: normalizeSection(slide.section, slide.page || index + 1),
    title: String(slide.title || `第 ${index + 1} 页`).trim(),
    coreMessage: String(slide.coreMessage || slide.keyMessage || "").trim(),
    body: Array.isArray(slide.body)
      ? slide.body.map((item) => String(item).trim()).filter(Boolean)
      : String(slide.body || slide.bodyText || "")
          .split(/\n+|；|;/)
          .map((item) => item.trim())
          .map((item) => item.replace(/^[-•\d.、\s]+/, "").trim())
          .filter(Boolean),
    imagePrompt: String(slide.imagePrompt || "").trim(),
    layoutHint: String(slide.layoutHint || "").trim(),
    executionNotes: String(slide.executionNotes || "").trim(),
    visualPriority: Boolean(slide.visualPriority),
    imageUrl: slide.imageUrl || "",
    imageBase64: slide.imageBase64 || "",
    imageError: slide.imageError || "",
    threeDImageUrl: slide.threeDImageUrl || "",
    threeDImageBase64: slide.threeDImageBase64 || "",
    threeDImageError: slide.threeDImageError || "",
    threeDPrompt: String(slide.threeDPrompt || "").trim(),
    threeDFileUrl: slide.threeDFileUrl || "",
    threeDStatus: slide.threeDStatus || "",
    scenePrompts: Array.isArray(slide.scenePrompts) ? slide.scenePrompts.map((item) => String(item).trim()).filter(Boolean) : [],
    sceneImages: Array.isArray(slide.sceneImages) ? slide.sceneImages : [],
  }));
}

function normalizeSlidesForDeck(proposal, templatePreset = resolveTemplatePreset(proposal || {})) {
  return normalizeSlides(proposal).map((slide, index) => {
    const archetype = slide.archetype || inferSlideArchetype(slide, index);
    return {
      ...slide,
      archetype,
      layoutVariant: slide.layoutVariant || inferLayoutVariant(archetype, index, templatePreset),
      visualPriorityScore: Number.isFinite(slide.visualPriorityScore)
        ? slide.visualPriorityScore
        : scoreVisualPriority({ ...slide, archetype }, index),
    };
  });
}

function buildProposalPrompt(input) {
  return `
你是资深活动策划总监、甲方提案 PPT 内容策划师、舞美美陈执行顾问。请基于用户输入，生成一份可直接给甲方路演汇报的活动方案。

输出必须是严格 JSON，不要 Markdown，不要解释。

用户输入：
${JSON.stringify(input, null, 2)}

公司能力背书：
公司主营活动策划，舞美搭建执行拥有自有搭建团队，可承接美陈类、会议类物料搭建、展会搭建，并配备自有舞台活动设备。方案需要自然体现策划、设计、搭建、设备、执行、人员统筹、现场保障的一体化交付能力。

${input?.threeD?.enabled ? `3D 附加要求：
用户已选择加入 3D 美陈 / 包装参考图。请在第 7-9 页相关内容中强化 3D 空间展示、装置造型、DP 点、舞台包装、材质质感与落地效果；同时在对应页面的 IMAGE_PROMPT 中写出适合生成 3D 风格参考图的画面描述。` : ""}

活动号类型约束：
1. 美业大健康微商活动号：美业峰会、招商会、私域会销、品牌沙龙，重点突出转化、成交、私域裂变、品牌势能。
2. 校园活动号：开学季、社团活动、毕业典礼、校园市集、校企活动，重点突出青春、参与感、校园传播和秩序安全。
3. 建筑行业活动号：地产开放日、工地开放日、建筑展会、工程发布会，重点突出专业可信、工程实力、样板展示和客户信任。
4. 商超美陈号：商场节日美陈、快闪店、DP 点、商业空间活动，重点突出打卡传播、人流转化、空间氛围和商业动线。
5. 企业年会团建号：年会、团建、晚宴、答谢会、发布会、会议布置，重点突出仪式感、组织文化、舞台效果和执行稳定。

质量要求：
方案要打动甲方，语言正式、有画面感、有策略、有创意、有差异化，同时可落地执行。不要空泛口号。每页都要有明确观点、可直接放进 PPT 的内容、图片提示词、现场执行说明。
为了保证系统能解析，body 字段必须是一个多行字符串，不能是数组；每条要点用换行分隔。

建议生成 13-16 页，至少包含以下结构：
1. 封面
2. 项目理解
3. 策划策略与主题方向
4. 活动概况
5. 活动概况总结
6. 主题创意与活动亮点
7. 区域规划与动线设计
8. 流程规划
9. 重点环节设计
10. 舞美美陈与物料设备
11. 宣发引流方案
12. 执行保障与风险预案
13. 报价/预算框架与预期效果

图片要求：
每页必须给 imagePrompt。挑选 3-5 页设置 visualPriority=true，用于直接 AI 生图。其他页 visualPriority=false，但仍必须保留详细 imagePrompt 作为概念图占位。

JSON Schema：
{
  "title": "方案总标题",
  "subtitle": "副标题",
  "theme": "推荐活动主题",
  "slogan": "传播口号",
  "styleRationale": "为什么采用该提案风格",
  "slides": [
    {
      "page": 1,
      "section": "策划思路 / 活动概览 / 环节介绍 / 活动宣传",
      "title": "页面标题",
      "coreMessage": "页面核心观点，一句话",
      "body": "3-6条可直接放入PPT的正文要点，用换行分隔，不要使用 JSON 数组",
      "imagePrompt": "详细 AI 生图提示词，写清楚画面主体、场景、构图、色彩、质感、氛围、不要文字水印，适合16:9 PPT",
      "layoutHint": "版式建议",
      "executionNotes": "现场落地或执行说明",
      "visualPriority": true
    }
  ]
}
`.trim();
}

function buildProposalTextPrompt(input) {
  return `
你是资深活动策划总监、甲方提案 PPT 内容策划师、舞美美陈执行顾问。请基于用户输入，生成一份可直接给甲方路演汇报的活动方案。

用户输入：
${JSON.stringify(input, null, 2)}

公司能力背书：
公司主营活动策划，舞美搭建执行拥有自有搭建团队，可承接美陈类、会议类物料搭建、展会搭建，并配备自有舞台活动设备。方案需要自然体现策划、设计、搭建、设备、执行、人员统筹、现场保障的一体化交付能力。

活动号类型约束：
1. 美业大健康微商活动号：美业峰会、招商会、私域会销、品牌沙龙，重点突出转化、成交、私域裂变、品牌势能。
2. 校园活动号：开学季、社团活动、毕业典礼、校园市集、校企活动，重点突出青春、参与感、校园传播和秩序安全。
3. 建筑行业活动号：地产开放日、工地开放日、建筑展会、工程发布会，重点突出专业可信、工程实力、样板展示和客户信任。
4. 商超美陈号：商场节日美陈、快闪店、DP 点、商业空间活动，重点突出打卡传播、人流转化、空间氛围和商业动线。
5. 企业年会团建号：年会、团建、晚宴、答谢会、发布会、会议布置，重点突出仪式感、组织文化、舞台效果和执行稳定。

质量要求：
方案要打动甲方，语言正式、有画面感、有策略、有创意、有差异化，同时可落地执行。不要空泛口号。每页都要有明确观点、可直接放进 PPT 的内容、图片提示词、现场执行说明。
所有页面必须落入四个固定章节：策划思路、活动概览、环节介绍、活动宣传。不要新增其他章节名。
活动概览中的「活动概况」页必须明确写入以下生产 PPT 字段：活动主题、活动时间、活动地点、活动对象、活动形式、活动执行。字段内容必须优先使用用户输入，不要擅自改写成另一个活动。

请严格按照下面的纯文本格式输出，不要输出 JSON，不要 Markdown 代码块，不要改变字段名。

DECK_TITLE: 方案总标题
DECK_SUBTITLE: 副标题
DECK_THEME: 推荐活动主题
DECK_SLOGAN: 传播口号
STYLE_RATIONALE: 为什么采用该提案风格

建议生成 13-16 页，不要为了压页数牺牲内容完整度；至少必须包含以下 13 页四章节结构，如活动复杂可额外增加场景效果图、分区细化、宣发素材延展页：
1. 策划思路 / 封面
2. 策划思路 / 项目理解
3. 策划思路 / 策划策略与主题方向
4. 活动概览 / 活动概况，必须包含：活动主题=${input.themeDirection || "按用户输入"}；活动时间=${input.eventTime || "按用户输入"}；活动地点=${input.eventLocation || "按用户输入"}；活动对象=${input.targetAudience || "按用户输入"}；活动形式=${input.activityForm || "按用户输入"}；活动执行=${input.activityExecution || "按用户输入"}
5. 活动概览 / 活动概况总结，必须用一页把活动定位、甲方价值、人群体验、现场交付和预期收益总结成可路演表达
6. 活动概览 / 主题创意与活动亮点
7. 活动概览 / 区域规划与动线设计
8. 环节介绍 / 流程规划
9. 环节介绍 / 重点环节设计
10. 环节介绍 / 舞美美陈与物料设备
11. 活动宣传 / 宣发引流方案
12. 活动宣传 / 执行保障与风险预案
13. 活动宣传 / 报价/预算框架与预期效果

每页必须使用如下格式：
===SLIDE 1===
SECTION: 策划思路
TITLE: 页面标题
CORE: 页面核心观点，一句话
BODY:
- 3-6条可直接放入PPT的正文要点
- 每条要点要具体、可执行、有说服力
IMAGE_PROMPT: 详细 AI 生图提示词，写清楚画面主体、场景、构图、色彩、质感、氛围、不要文字水印，适合16:9 PPT
LAYOUT: 版式建议
EXECUTION: 现场落地或执行说明
VISUAL_PRIORITY: true 或 false
===END_SLIDE===

图片要求：
每页必须给 IMAGE_PROMPT。挑选 3-5 页设置 VISUAL_PRIORITY: true，用于直接 AI 生图。其他页设置 false，但仍必须保留详细 IMAGE_PROMPT 作为概念图占位。
`.trim();
}

function buildTemplateAwareProposalPrompt(input, stage, templatePreset) {
  const activityPromptPreset = resolveActivityPromptPreset(input);
  const draft = input?.workflow?.reviewedDraft
    ? `\n已确认草稿摘要：\n${JSON.stringify(input.workflow.reviewedDraft, null, 2)}\n`
    : "";
  const stageInstruction =
    stage === "preview"
      ? "当前为草稿预览阶段：仍需输出完整 13 页以上、四章节结构，但只把最适合视觉确认的 3 页设置为 VISUAL_PRIORITY: true，其余页面保留详细 IMAGE_PROMPT 占位。重点验证主题、策略、PPT模板方向和主视觉调性。"
      : "当前为正式出稿阶段：基于已确认方向输出可直接路演汇报的完整 13-16 页四章节方案。每页内容必须更具体、更像甲方汇报稿；每页都要给足可生成图片的 IMAGE_PROMPT。第 4/7/9/10/11 页附近要强化宏大场景布置、舞美美陈、打卡装置、动线氛围和空间尺度，便于后续生成 2-4 张场景效果图。";
  const templateInstruction = `
PPT 模板预设：
- 模板名称：${templatePreset.name}
- 适用场景：${templatePreset.bestFor.join("、")}
- 版式策略：${templatePreset.layoutHints.join("；")}
- 视觉与表达要求：${templatePreset.promptCue}
- 参考来源标签：${templatePreset.referenceLabels.join("、")}

活动号专属 Prompt：
- 当前活动号：${activityPromptPreset.name}
${activityPromptPreset.proposalPrompt}

生图风格基准：
${activityPromptPreset.imagePromptTemplate}

重点场景图方向：
${activityPromptPreset.sceneFocus.map((item, index) => `${index + 1}. ${item}`).join("\n")}

阶段要求：
${stageInstruction}
${draft}
额外要求：
- 全部页面必须标注 SECTION，且只能属于：策划思路、活动概览、环节介绍、活动宣传。
- 每页内容必须服务于甲方决策，不要泛泛而谈。
- 舞美搭建、美陈、会议物料、展会搭建、自有舞台设备和自有执行团队能力要自然融入方案。
- 图片提示词必须描述画面主体、空间、材质、灯光、构图、情绪、镜头语言和“无文字水印”，适合 16:9 PPT。
`;

  return `${templateInstruction}\n\n${buildProposalTextPrompt(input)}`;
}

function readField(block, name, nextNames = []) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nextPattern = nextNames.length
    ? `(?=\\n(?:${nextNames.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")}):|\\n===SLIDE\\s+\\d+===|\\n===END_SLIDE===|$)`
    : "(?=\\n[A-Z_]+:|\\n===SLIDE\\s+\\d+===|\\n===END_SLIDE===|$)";
  const match = block.match(new RegExp(`${escaped}:\\s*([\\s\\S]*?)${nextPattern}`, "i"));
  return match ? match[1].trim() : "";
}

function splitBody(value) {
  return String(value || "")
    .split(/\n+/)
    .map((line) => line.replace(/^[-•\d.、\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 8);
}

function parseProposalText(content) {
  const title = readField(content, "DECK_TITLE", [
    "DECK_SUBTITLE",
    "DECK_THEME",
    "DECK_SLOGAN",
    "STYLE_RATIONALE",
  ]);
  const subtitle = readField(content, "DECK_SUBTITLE", ["DECK_THEME", "DECK_SLOGAN", "STYLE_RATIONALE"]);
  const theme = readField(content, "DECK_THEME", ["DECK_SLOGAN", "STYLE_RATIONALE"]);
  const slogan = readField(content, "DECK_SLOGAN", ["STYLE_RATIONALE"]);
  const styleRationale = readField(content, "STYLE_RATIONALE", []);

  const slideBlocks = [...content.matchAll(/===SLIDE\s+(\d+)===([\s\S]*?)(?====SLIDE\s+\d+===|$)/gi)];
  const slides = slideBlocks.map((match, index) => {
    const block = match[2];
    const page = Number.parseInt(match[1], 10) || index + 1;
    const section = readField(block, "SECTION", ["TITLE", "CORE", "BODY", "IMAGE_PROMPT", "LAYOUT", "EXECUTION", "VISUAL_PRIORITY"]);
    const body = readField(block, "BODY", ["IMAGE_PROMPT", "LAYOUT", "EXECUTION", "VISUAL_PRIORITY"]);
    const priority = readField(block, "VISUAL_PRIORITY", []).toLowerCase();
    return {
      page,
      section: normalizeSection(section, page),
      title: readField(block, "TITLE", ["CORE", "BODY", "IMAGE_PROMPT", "LAYOUT", "EXECUTION"]) || getSectionPlan(page).title,
      coreMessage: readField(block, "CORE", ["BODY", "IMAGE_PROMPT", "LAYOUT", "EXECUTION"]),
      body: splitBody(body),
      imagePrompt: readField(block, "IMAGE_PROMPT", ["LAYOUT", "EXECUTION", "VISUAL_PRIORITY"]),
      layoutHint: readField(block, "LAYOUT", ["EXECUTION", "VISUAL_PRIORITY"]),
      executionNotes: readField(block, "EXECUTION", ["VISUAL_PRIORITY"]),
      visualPriority: priority.includes("true") || priority.includes("是"),
    };
  });

  if (slides.length < 10) {
    throw new Error(`模型返回的页面数量不足，解析到 ${slides.length} 页。`);
  }

  return {
    title: title || "活动方案",
    subtitle,
    theme,
    slogan,
    styleRationale,
    slides: slides.slice(0, MAX_PROPOSAL_SLIDES),
  };
}

function selectSlidesForImageGeneration(slides, stage) {
  const candidates = slides
    .filter((slide) => slide.imagePrompt)
    .map((slide, index) => ({ slide, index }))
    .sort((a, b) => {
      const scoreDiff = (b.slide.visualPriorityScore || 0) - (a.slide.visualPriorityScore || 0);
      return scoreDiff || a.index - b.index;
    })
    .map((item) => item.slide);

  if (stage === "preview") {
    return candidates.slice(0, 3);
  }

  return slides.filter((slide) => slide.imagePrompt);
}

function isSceneEffectSlide(slide) {
  return ["creative", "highlights", "area-planning", "stage-design", "promotion"].includes(slide.archetype);
}

function selectSceneEffectSlides(slides) {
  const selected = [];
  const seen = new Set();
  const add = (slide) => {
    if (slide && !seen.has(slide.page)) {
      seen.add(slide.page);
      selected.push(slide);
    }
  };

  slides.filter((slide) => isSceneEffectSlide(slide)).forEach(add);
  [6, 7, 9, 10, 11, 5].forEach((page) => add(slides.find((slide) => slide.page === page)));
  return selected.slice(0, 3);
}

function buildSceneEffectPrompts(slide, input, proposal, templatePreset) {
  const activityPromptPreset = resolveActivityPromptPreset(input);
  const activity = input?.themeDirection || proposal?.theme || proposal?.title || "活动方案";
  const place = input?.eventLocation || input?.venueType || "活动现场";
  const style = `${templatePreset.name}风格，宏大场景布置，舞美搭建和美陈装置可落地`;
  const sceneFocus = activityPromptPreset.sceneFocus || [];
  const base = `活动号：${activityPromptPreset.name}；主题：${activity}；地点：${place}；页面：${slide.title}；${style}；16:9，真实材质，电影级灯光，空间层次丰富，现场人流尺度清晰，无文字水印。风格基准：${activityPromptPreset.imagePromptTemplate}`;

  return [
    `${base} 生成一张全景主效果图：${sceneFocus[0] || "大场景空间布置"}，主舞台/中庭/主入口整体氛围、灯光矩阵、品牌装置和观众动线，广角镜头，宏大、震撼、适合甲方汇报。`,
    `${base} 生成一张核心装置效果图：${sceneFocus[1] || "核心打卡装置"}，强调材质、结构、灯光和落地搭建细节。`,
    `${base} 生成一张现场运营视角效果图：${sceneFocus[2] || "现场人群参与"}，体现人群参与、导视动线、互动区与洽谈区关系、活动热度和商业转化氛围。`,
    `${base} 生成一张传播素材效果图：${sceneFocus[3] || "品牌留影与朋友圈传播点"}，强调拍照机位、社交传播、品牌露出和高质量商业摄影感。`,
  ];
}

function attachScenePrompts(proposal, input, stage, templatePreset) {
  if (stage !== "final") {
    return proposal.slides;
  }

  const sceneSlides = new Set(selectSceneEffectSlides(proposal.slides).map((slide) => slide.page));
  return proposal.slides.map((slide) => {
    if (!sceneSlides.has(slide.page)) {
      return slide;
    }

    const scenePrompts = slide.scenePrompts?.length
      ? slide.scenePrompts.slice(0, 4)
      : buildSceneEffectPrompts(slide, input, proposal, templatePreset);
    return {
      ...slide,
      scenePrompts,
      layoutVariant: "scene-gallery",
    };
  });
}

async function generateSceneImagesForSlides(slides) {
  for (const slide of slides.filter((item) => item.scenePrompts?.length)) {
    slide.sceneImages = [];
    for (const prompt of slide.scenePrompts.slice(0, 4)) {
      try {
        const image = await generateArkImage(prompt);
        slide.sceneImages.push({ prompt, ...image });
      } catch (error) {
        slide.sceneImages.push({ prompt, imageError: String(error.message || error) });
      }
    }
  }
}

function buildEventOverviewBody(input = {}, activity = "活动方案") {
  return [
    `活动主题：${input?.themeDirection || activity}`,
    `活动时间：${input?.eventTime || "待甲方确认"}`,
    `活动地点：${input?.eventLocation || input?.venueType || "待甲方确认"}`,
    `活动对象：${input?.targetAudience || "按甲方目标人群细化"}`,
    `活动形式：${input?.activityForm || "按活动目标组合设计"}`,
    `活动执行：${input?.activityExecution || "覆盖筹备、搭建、现场执行与活动后复盘传播"}`,
  ];
}

function buildEventOverviewSummaryBody(input = {}, activity = "活动方案") {
  return [
    `活动定位：以「${input?.themeDirection || activity}」作为甲方对外表达和现场体验的统一抓手`,
    `甲方价值：围绕${input?.eventObjective || "品牌传播、现场转化和用户体验"}建立可汇报、可传播、可复盘的活动结果`,
    `人群体验：面向${input?.targetAudience || "目标人群"}设计从到场、参与、拍摄到分享的完整路径`,
    `现场交付：以${input?.activityForm || "主题活动"}为主线，串联舞美搭建、美陈装置、物料设备和执行保障`,
    `预期收益：形成现场热度、朋友圈传播素材、客户信任背书和后续招商/消费/品牌转化线索`,
  ];
}

function enforceProposalSectionPlan(slides, input, proposal) {
  const activity = input?.themeDirection || input?.clientIndustry || proposal?.theme || "活动方案";
  return slides.map((slide, index) => {
    const page = index + 1;
    const pagePlan = getSectionPlan(page);
    if (page === 4) {
      const overviewBody = buildEventOverviewBody(input, activity);
      const extraBody = Array.isArray(slide.body)
        ? slide.body.filter((item) => !/^活动(主题|时间|地点|对象|形式|执行)：/.test(item)).slice(0, 2)
        : [];
      return {
        ...slide,
        page,
        section: pagePlan.section,
        title: pagePlan.title,
        coreMessage: slide.coreMessage || "把甲方最关心的基本信息先讲清楚",
        body: [...overviewBody, ...extraBody].slice(0, 8),
      };
    }
    if (page === 5) {
      const summaryBody = buildEventOverviewSummaryBody(input, activity);
      return {
        ...slide,
        page,
        section: pagePlan.section,
        title: pagePlan.title,
        coreMessage: slide.coreMessage || "用一页把活动概况转化成甲方能听懂的价值结论",
        body: summaryBody,
      };
    }

    return {
      ...slide,
      page,
      section: pagePlan.section,
      title: slide.title || pagePlan.title,
    };
  });
}

function buildFallbackSlide(page, input, proposal, templatePreset) {
  const activity = input?.themeDirection || input?.clientIndustry || proposal?.theme || "活动方案";
  const capability = input?.companyCapability || "活动策划、舞美搭建、自有设备执行";
  const pagePlan = getSectionPlan(page);
  const eventOverviewBody = buildEventOverviewBody(input, activity);
  const eventOverviewSummaryBody = buildEventOverviewSummaryBody(input, activity);
  const base = {
    1: {
      title: "封面",
      coreMessage: activity,
      body: [capability, "高端汇报版式", "可落地执行闭环", "AI 视觉占位"],
      imagePrompt: `活动方案封面视觉，主题是${activity}，体现${templatePreset.name}的高级质感与甲方汇报气质，16:9，强视觉中心，品牌舞美感，无文字水印。`,
      visualPriority: true,
      archetype: "cover",
      layoutVariant: "cover-hero",
    },
    2: {
      title: "项目理解",
      coreMessage: "先把甲方真正要的结果说清楚",
      body: ["活动目标拆解", "目标人群与场景判断", "品牌与传播诉求", "执行边界与资源条件"],
      imagePrompt: `项目理解页概念图，体现活动策划分析、目标拆解和甲方视角，信息图风格，16:9，商务质感，无文字水印。`,
      archetype: "project-understanding",
      layoutVariant: "text-left-visual-right",
    },
    3: {
      title: "策划策略与主题方向",
      coreMessage: "用策略串起主题、传播和落地",
      body: ["活动定位", "主题方向", "体验路径", "转化目标"],
      imagePrompt: `活动策略页概念图，体现策略路径、转化逻辑和活动架构，带流程图和结构感，16:9，无文字水印。`,
      visualPriority: true,
      archetype: "strategy",
      layoutVariant: "cards",
    },
    4: {
      title: "活动概况",
      coreMessage: "把甲方最关心的基本信息先讲清楚",
      body: eventOverviewBody,
      imagePrompt: `活动概况页视觉，主题是${activity}，体现活动时间、地点、对象、形式和执行路径的清晰汇报感，结合活动现场概览、动线、主视觉和核心信息卡片，16:9，大气专业，无文字水印。`,
      visualPriority: true,
      archetype: "project-understanding",
      layoutVariant: "cards",
    },
    5: {
      title: "活动概况总结",
      coreMessage: "用一页把活动概况转化成甲方能听懂的价值结论",
      body: eventOverviewSummaryBody,
      imagePrompt: `活动概况总结页视觉，主题是${activity}，用高端汇报感信息卡总结活动定位、甲方价值、人群体验、现场交付和预期收益，16:9，无文字水印。`,
      archetype: "strategy",
      layoutVariant: "cards",
    },
    6: {
      title: "主题创意与活动亮点",
      coreMessage: "把能打动甲方和用户的亮点列清楚",
      body: ["一句话主题", "核心传播口号", "核心打卡点", "互动玩法", "品牌露出机制"],
      imagePrompt: `活动亮点页概念图，体现打卡装置、互动玩法和人群参与感，场景真实，16:9，无文字水印。`,
      archetype: "highlights",
      layoutVariant: "cards",
    },
    7: {
      title: "区域规划与动线设计",
      coreMessage: "空间分区和动线必须先定",
      body: ["签到区", "主舞台", "互动区", "洽谈区"],
      imagePrompt: `活动区域规划页视觉，体现空间动线、分区和现场布局，平面图与空间感结合，16:9，无文字水印。`,
      visualPriority: true,
      archetype: "area-planning",
      layoutVariant: "visual-board",
    },
    8: {
      title: "流程规划",
      coreMessage: "每个环节都要能执行",
      body: ["筹备期", "搭建期", "执行期", "撤场期"],
      imagePrompt: `活动流程页概念图，体现时间线和流程节点，简洁专业，16:9，无文字水印。`,
      archetype: "timeline",
      layoutVariant: "horizontal-process",
    },
    9: {
      title: "重点环节设计",
      coreMessage: "把体验高光做成可感知、可拍摄、可传播的现场节点",
      body: ["开场仪式", "核心互动", "主题打卡", "成交/转化/表彰环节"],
      imagePrompt: `重点环节设计页，体现活动高光环节、仪式感、互动参与、人群情绪和传播画面，16:9，真实活动摄影质感，无文字水印。`,
      visualPriority: true,
      archetype: "highlights",
      layoutVariant: "visual-board",
    },
    10: {
      title: "舞美美陈与物料设备",
      coreMessage: "把舞美、装置、物料和设备统一成可落地的现场系统",
      body: ["主舞台造型", "DP点和美陈装置", "灯光音响与舞台设备", "导视物料与执行物料"],
      imagePrompt: `舞美美陈与物料设备页，体现舞台搭建、空间装置、灯光氛围、设备系统和材质质感，适合3D参考图，16:9，无文字水印。`,
      visualPriority: true,
      archetype: "stage-design",
      layoutVariant: "visual-board",
    },
    11: {
      title: "宣发引流方案",
      coreMessage: "让朋友圈和公域都能看见",
      body: ["预热海报", "朋友圈内容", "现场拍照传播", "活动后复盘内容"],
      imagePrompt: `宣发引流页概念图，体现朋友圈传播、短视频素材和海报物料，传播感强，16:9，无文字水印。`,
      visualPriority: true,
      archetype: "promotion",
      layoutVariant: "image-led",
    },
    12: {
      title: "执行保障与风险预案",
      coreMessage: "把风险前置，保障现场稳定",
      body: ["人员分工", "供应链协同", "应急预案", "现场巡检机制"],
      imagePrompt: `活动执行保障页概念图，体现项目管理、团队协同和现场调度，专业稳健，16:9，无文字水印。`,
      archetype: "execution-risk",
      layoutVariant: "horizontal-process",
    },
    13: {
      title: "报价/预算框架与预期效果",
      coreMessage: "预算要透明，效果要能解释",
      body: ["预算框架", "资源投入重点", "传播和转化预期", "甲方汇报口径"],
      imagePrompt: `预算与预期效果页概念图，体现预算结构、成本分配和效果预判，正式汇报感，16:9，无文字水印。`,
      archetype: "budget-effect",
      layoutVariant: "matrix",
    },
  };

  return {
    page,
    section: normalizeSection(base[page]?.section || pagePlan.section, page),
    title: base[page]?.title || pagePlan.title || `第 ${page} 页`,
    coreMessage: base[page]?.coreMessage || "",
    body: base[page]?.body || [],
    imagePrompt: base[page]?.imagePrompt || "",
    layoutHint: base[page]?.layoutVariant || "",
    executionNotes: base[page]?.title || "",
    visualPriority: Boolean(base[page]?.visualPriority),
    archetype: base[page]?.archetype || inferSlideArchetype({ page, title: "", coreMessage: "" }, page - 1),
    layoutVariant: base[page]?.layoutVariant || "text-left-visual-right",
    imageUrl: "",
    imageBase64: "",
    imageError: "",
    threeDImageUrl: "",
    threeDImageBase64: "",
    threeDImageError: "",
    threeDPrompt: "",
    threeDFileUrl: "",
    threeDStatus: "",
  };
}

function ensurePlannedSlides(proposal, input, templatePreset) {
  const incomingSlides = Array.isArray(proposal.slides) ? proposal.slides : [];
  const byPage = new Map(incomingSlides.map((slide) => [Number(slide.page), slide]));
  const maxReturnedPage = incomingSlides.reduce((max, slide) => Math.max(max, Number(slide.page) || 0), 0);
  const pageCount = Math.min(MAX_PROPOSAL_SLIDES, Math.max(PROPOSAL_SECTION_PLAN.length, maxReturnedPage));
  const slides = [];
  for (let page = 1; page <= pageCount; page += 1) {
    slides.push(byPage.get(page) || buildFallbackSlide(page, input, proposal, templatePreset));
  }
  return slides;
}

function applyVisualPriorityLimit(slides, stage) {
  const limit = stage === "preview" ? 3 : 5;
  const scored = slides
    .map((slide, index) => ({
      index,
      score: slide.visualPriority ? 100 - index : scoreVisualPriority(slide, index),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);
  const selected = new Set(scored.slice(0, limit).map((item) => item.index));
  const scoreByIndex = new Map(scored.map((item) => [item.index, item.score]));
  return slides.map((slide, index) => ({
    ...slide,
    visualPriority: selected.has(index),
    visualPriorityScore: scoreByIndex.get(index) || 0,
  }));
}

function buildModelsPayload() {
  return {
    text: ARK_TEXT_MODEL,
    image: ARK_IMAGE_MODEL,
    threeD: ARK_3D_MODEL,
  };
}

const proposalJobs = new Map();
const PROPOSAL_JOB_TTL_MS = 30 * 60 * 1000;

function createProposalJobId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function pruneProposalJobs() {
  const now = Date.now();
  for (const [id, job] of proposalJobs.entries()) {
    if (now - job.updatedAt > PROPOSAL_JOB_TTL_MS) {
      proposalJobs.delete(id);
    }
  }
}

function serializeProposalJob(job) {
  return {
    id: job.id,
    status: job.status,
    stage: job.stage,
    progress: job.progress,
    message: job.message,
    updatedAt: job.updatedAt,
    result: job.result || null,
    error: job.error || "",
  };
}

async function startProposalJob(request, response) {
  if (!requireArkKey(response)) {
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    json(response, 400, { error: "请求体不是有效 JSON。" });
    return;
  }

  pruneProposalJobs();
  const input = payload.input || {};
  const job = {
    id: createProposalJobId(),
    status: "running",
    stage: resolveGenerationStage(payload, input),
    progress: 3,
    message: "任务已创建，等待生成引擎开始处理",
    updatedAt: Date.now(),
    result: null,
    error: "",
  };
  proposalJobs.set(job.id, job);

  const updateJob = (patch = {}) => {
    Object.assign(job, patch, { updatedAt: Date.now() });
  };

  buildProposalFromPayload(payload, updateJob)
    .then((result) => {
      updateJob({
        status: "done",
        progress: 100,
        message: "生成完成，可预览或导出",
        result,
      });
    })
    .catch((error) => {
      updateJob({
        status: "error",
        progress: Math.max(job.progress || 0, 100),
        message: "生成失败",
        error: `方案生成失败：${String(error.message || error)}`,
      });
    });

  json(response, 202, { job: serializeProposalJob(job) });
}

function getProposalJob(request, response) {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  const id = url.searchParams.get("id");
  if (!id || !proposalJobs.has(id)) {
    json(response, 404, { error: "生成任务不存在或已过期。" });
    return;
  }

  json(response, 200, { job: serializeProposalJob(proposalJobs.get(id)) });
}

async function buildProposalFromPayload(payload, onProgress = () => {}) {
  const input = payload.input || {};
  const generateImages = Boolean(payload.generateImages);
  const stage = resolveGenerationStage(payload, input);
  const templatePreset = resolveTemplatePreset(input);

  onProgress({ progress: 8, message: "已接收输入，正在准备生成参数" });

  let threeDJob = null;
  if (input?.threeD?.enabled && stage === "final") {
    const referenceImage = input.threeD.referenceImage;
    if (!referenceImage?.dataUrl) {
      throw new Error("已勾选 3D 参考图，但未上传参考图片。");
    }

    const threeDPrompt = buildThreeDPrompt(input, {
      title: input.themeDirection || input.clientIndustry || "活动方案",
    });
    threeDJob = {
      prompt: threeDPrompt,
      referenceImage,
      result: generateArk3d(threeDPrompt, referenceImage)
        .then((asset) => ({ asset }))
        .catch((error) => ({ error })),
    };
    onProgress({ progress: 12, message: "已创建 3D 参考任务，文本方案同步生成中" });
  }

  onProgress({ progress: 18, message: "正在调用文本模型撰写四章节方案" });
  const content = await callArkChat(
    [
      {
        role: "system",
        content:
          "你擅长活动策划、甲方提案、PPT内容策划、舞美美陈执行方案。请严格按用户指定字段格式输出。",
      },
      { role: "user", content: buildTemplateAwareProposalPrompt(input, stage, templatePreset) },
    ],
    ""
  );

  onProgress({ progress: 42, message: "文本方案已返回，正在解析页纲和章节" });
  const proposal = parseProposalText(content);
  proposal.templatePreset = publicTemplatePreset(templatePreset);
  proposal.activityPromptPreset = publicActivityPromptPreset(resolveActivityPromptPreset(input));
  proposal.stage = stage;
  proposal.slides = normalizeSlidesForDeck(proposal, templatePreset);
  proposal.slides = ensurePlannedSlides(proposal, input, templatePreset).map((slide, index) => ({
    ...slide,
    page: index + 1,
  }));
  proposal.slides = enforceProposalSectionPlan(proposal.slides, input, proposal);
  proposal.slides = applyVisualPriorityLimit(proposal.slides, stage);
  proposal.slides = attachScenePrompts(proposal, input, stage, templatePreset);

  if (!proposal.slides.length) {
    throw new Error("模型未返回 slides。");
  }

  onProgress({ progress: 55, message: `已形成 ${proposal.slides.length} 页结构，正在处理视觉内容` });

  if (generateImages) {
    const slidesToGenerate = selectSlidesForImageGeneration(proposal.slides, stage);
    const imageStart = stage === "preview" ? 58 : 55;
    const imageEnd = stage === "preview" ? 88 : 75;

    for (const [index, slide] of slidesToGenerate.entries()) {
      onProgress({
        progress: Math.round(imageStart + ((imageEnd - imageStart) * index) / Math.max(slidesToGenerate.length, 1)),
        message: `正在生成核心 AI 图 ${index + 1}/${slidesToGenerate.length}`,
      });
      try {
        const image = await generateArkImage(slide.imagePrompt);
        Object.assign(slide, image);
      } catch (error) {
        slide.imageError = String(error.message || error);
      }
    }
  }

  if (generateImages && stage === "final") {
    onProgress({ progress: 78, message: "正在生成多场景效果图" });
    await generateSceneImagesForSlides(proposal.slides);
  }

  if (input?.threeD?.enabled && stage === "preview") {
    const targetSlide =
      proposal.slides.find((slide) => [10, 7, 9].includes(slide.page)) ||
      proposal.slides.find((slide) => slide.visualPriority) ||
      proposal.slides[0];
    if (targetSlide) {
      targetSlide.threeDPrompt = buildThreeDPrompt(input, proposal);
      targetSlide.threeDStatus = "preview-prompt";
      targetSlide.threeDImageError = "草稿阶段仅保留 3D 生成提示；确认后正式出稿时再调用 Seed3D。";
    }
  }

  if (threeDJob) {
    onProgress({ progress: 90, message: "正在等待 3D 参考任务返回" });
    const referenceImage = threeDJob.referenceImage;
    const threeDPrompt = threeDJob.prompt;
    const targetSlide =
      proposal.slides.find((slide) => [10, 7, 9].includes(slide.page)) ||
      proposal.slides.find((slide) => slide.visualPriority) ||
      proposal.slides[0];

    const threeDResult = await threeDJob.result;
    if (threeDResult.asset) {
      const threeDAsset = threeDResult.asset;
      proposal.threeD = {
        enabled: true,
        prompt: threeDPrompt,
        referenceImageName: referenceImage.name || "",
        taskId: threeDAsset.taskId || "",
        status: threeDAsset.status || "",
        fileUrl: threeDAsset.fileUrl || "",
      };
      if (targetSlide) {
        targetSlide.threeDPrompt = threeDPrompt;
        targetSlide.threeDFileUrl = threeDAsset.fileUrl || "";
        targetSlide.threeDStatus = threeDAsset.status || "";
        targetSlide.threeDImageError = threeDAsset.fileUrl
          ? ""
          : `3D 任务已创建，当前状态：${threeDAsset.status || "queued"}，任务 ID：${threeDAsset.taskId || ""}`;
      }
    } else {
      const error = threeDResult.error;
      proposal.threeD = {
        enabled: true,
        prompt: threeDPrompt,
        referenceImageName: referenceImage.name || "",
        error: String(error.message || error),
      };
      if (targetSlide) {
        targetSlide.threeDPrompt = threeDPrompt;
        targetSlide.threeDImageError = String(error.message || error);
      }
    }
  }

  onProgress({ progress: 100, message: "方案生成完成" });
  return {
    proposal,
    models: buildModelsPayload(),
  };
}

async function generateProposal(request, response) {
  if (!requireArkKey(response)) {
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    json(response, 400, { error: "请求体不是有效 JSON。" });
    return;
  }

  try {
    const result = await buildProposalFromPayload(payload);
    json(response, 200, result);
  } catch (error) {
    json(response, 500, {
      error: `方案生成失败：${String(error.message || error)}`,
    });
  }
}

async function generateImage(request, response) {
  if (!requireArkKey(response)) {
    return;
  }

  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    json(response, 400, { error: "请求体不是有效 JSON。" });
    return;
  }

  const prompt = String(payload.prompt || "").trim();
  if (!prompt) {
    json(response, 400, { error: "缺少 prompt。" });
    return;
  }

  try {
    const image = await generateArkImage(prompt);
    json(response, 200, {
      ...image,
      model: ARK_IMAGE_MODEL,
      size: "2K",
    });
  } catch (error) {
    json(response, 500, {
      error: `图片生成失败：${String(error.message || error)}`,
    });
  }
}

async function imageToDataUri(value) {
  if (!value) {
    return "";
  }

  if (value.startsWith("data:")) {
    return value;
  }

  const upstream = await fetch(value);
  if (!upstream.ok) {
    throw new Error(`图片下载失败：${upstream.status}`);
  }

  const contentType = upstream.headers.get("content-type") || "image/png";
  const arrayBuffer = await upstream.arrayBuffer();
  return `data:${contentType};base64,${Buffer.from(arrayBuffer).toString("base64")}`;
}

function addWrappedText(slide, text, options) {
  slide.addText(text, {
    fontFace: "Microsoft YaHei",
    breakLine: false,
    fit: "shrink",
    margin: 0.04,
    ...options,
  });
}

function buildPpt(response, proposal) {
  const PptxGenJS = loadPptxGen();
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Poster Assistant";
  pptx.company = "活动策划方案生成助手";
  pptx.subject = proposal.subtitle || proposal.theme || "活动方案";
  pptx.title = proposal.title || "活动方案";
  pptx.lang = "zh-CN";
  pptx.theme = {
    headFontFace: "Microsoft YaHei",
    bodyFontFace: "Microsoft YaHei",
    lang: "zh-CN",
  };

  const slides = normalizeSlides(proposal);
  const accent = "2563eb";
  const deep = "111827";
  const muted = "64748b";
  const light = "f8fafc";

  return Promise.all(
    slides.map(async (item) => {
      const slide = pptx.addSlide();
      slide.background = { color: "ffffff" };

      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.333,
        h: 0.16,
        fill: { color: accent },
        line: { color: accent },
      });
      addWrappedText(slide, String(item.page).padStart(2, "0"), {
        x: 0.52,
        y: 0.34,
        w: 0.8,
        h: 0.28,
        fontSize: 10,
        bold: true,
        color: accent,
      });
      addWrappedText(slide, item.title, {
        x: 0.52,
        y: 0.68,
        w: 7.1,
        h: 0.42,
        fontSize: item.page === 1 ? 26 : 21,
        bold: true,
        color: deep,
      });

      if (item.coreMessage) {
        addWrappedText(slide, item.coreMessage, {
          x: 0.54,
          y: 1.22,
          w: 7.15,
          h: 0.42,
          fontSize: 12,
          color: accent,
          bold: true,
        });
      }

      const bullets = item.body.slice(0, 6).map((line) => ({ text: line, options: { bullet: { type: "ul" } } }));
      slide.addText(bullets, {
        x: 0.62,
        y: 1.78,
        w: 6.9,
        h: 2.62,
        fontFace: "Microsoft YaHei",
        fontSize: 11,
        color: deep,
        breakLine: false,
        fit: "shrink",
        paraSpaceAfterPt: 5,
        margin: 0.06,
      });

      if (item.executionNotes) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: 0.54,
          y: 4.72,
          w: 7.06,
          h: 0.94,
          rectRadius: 0.08,
          fill: { color: light },
          line: { color: "e5e7eb" },
        });
        addWrappedText(slide, `执行说明：${item.executionNotes}`, {
          x: 0.74,
          y: 4.88,
          w: 6.66,
          h: 0.56,
          fontSize: 9,
          color: muted,
        });
      }

      const visualX = 8.04;
      const visualY = 0.68;
      const visualW = 4.72;
      const visualH = 5.02;

      const imageData = item.threeDImageBase64
        ? `data:image/png;base64,${item.threeDImageBase64}`
        : item.imageBase64
          ? `data:image/png;base64,${item.imageBase64}`
          : item.threeDImageUrl
            ? await imageToDataUri(item.threeDImageUrl).catch(() => "")
            : await imageToDataUri(item.imageUrl).catch(() => "");

      if (imageData) {
        slide.addImage({
          data: imageData,
          x: visualX,
          y: visualY,
          w: visualW,
          h: visualH,
          sizing: { type: "cover", x: visualX, y: visualY, w: visualW, h: visualH },
        });
      } else {
        slide.addShape(pptx.ShapeType.rect, {
          x: visualX,
          y: visualY,
          w: visualW,
          h: visualH,
          fill: { color: "f1f5f9" },
          line: { color: "cbd5e1" },
        });
        addWrappedText(slide, item.threeDPrompt ? "3D 美陈参考 / AI 提示词" : "概念图 / AI 提示词", {
          x: visualX + 0.28,
          y: visualY + 0.28,
          w: visualW - 0.56,
          h: 0.32,
          fontSize: 11,
          bold: true,
          color: accent,
        });
        addWrappedText(
          slide,
          item.threeDFileUrl
            ? `3D模型文件：${item.threeDFileUrl}\n${item.threeDPrompt || item.imagePrompt || ""}`
            : item.threeDPrompt || item.imagePrompt || "请补充画面提示词。",
          {
          x: visualX + 0.28,
          y: visualY + 0.74,
          w: visualW - 0.56,
          h: visualH - 1.0,
          fontSize: 9,
          color: muted,
          }
        );
      }

      if (item.layoutHint) {
        addWrappedText(slide, `版式：${item.layoutHint}`, {
          x: 0.54,
          y: 6.98,
          w: 12.2,
          h: 0.24,
          fontSize: 7.8,
          color: "94a3b8",
        });
      }
    })
  ).then(async () => {
    const buffer = await pptx.write({ outputType: "nodebuffer" });
    const fileName = `${sanitizeFileName(proposal.title)}.pptx`;
    sendBuffer(response, 200, buffer, {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    });
  });
}

function getPptPalette(templatePreset) {
  const palette = templatePreset?.palette || TEMPLATE_PRESETS[0].palette;
  return {
    bg: stripHash(palette.bg || "F7F2EA"),
    surface: stripHash(palette.surface || "FFFFFF"),
    deep: stripHash(palette.deep || "18212F"),
    muted: stripHash(palette.muted || "667085"),
    accent: stripHash(palette.accent || "B98535"),
    accent2: stripHash(palette.accent2 || "263A59"),
    soft: stripHash(palette.soft || "EFE7DA"),
    line: stripHash(palette.line || "D8C7AA"),
  };
}

function addDeckFooter(slide, pptx, item, templatePreset, palette) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 7.05,
    w: 12.25,
    h: 0.02,
    fill: { color: palette.line },
    line: { color: palette.line },
  });
  addWrappedText(slide, `${item.section || getSectionPlan(item.page).section} · ${templatePreset.name} · ${String(item.page).padStart(2, "0")}`, {
    x: 0.55,
    y: 7.12,
    w: 5.2,
    h: 0.18,
    fontSize: 7.5,
    color: palette.muted,
  });
}

function addSlideTitle(slide, item, palette, options = {}) {
  addWrappedText(slide, String(item.page).padStart(2, "0"), {
    x: options.x || 0.58,
    y: options.y || 0.35,
    w: 0.75,
    h: 0.22,
    fontSize: 8.5,
    bold: true,
    color: palette.accent,
  });
  addWrappedText(slide, item.section || getSectionPlan(item.page).section, {
    x: (options.x || 0.58) + 0.88,
    y: options.y || 0.35,
    w: 1.5,
    h: 0.22,
    fontSize: 8,
    bold: true,
    color: palette.muted,
  });
  addWrappedText(slide, item.title, {
    x: options.x || 0.58,
    y: (options.y || 0.35) + 0.34,
    w: options.w || 7.1,
    h: 0.46,
    fontSize: options.fontSize || 21,
    bold: true,
    color: options.color || palette.deep,
  });
  if (item.coreMessage) {
    addWrappedText(slide, item.coreMessage, {
      x: options.x || 0.58,
      y: (options.y || 0.35) + 0.9,
      w: options.w || 7.1,
      h: 0.36,
      fontSize: 11,
      bold: true,
      color: options.coreColor || palette.accent,
    });
  }
}

function addBulletList(slide, items, box, palette, fontSize = 10.2) {
  const body = items.length ? items : ["内容待根据甲方反馈进一步细化。"];
  const bullets = body.slice(0, 7).map((line) => ({
    text: line,
    options: { bullet: { type: "ul" } },
  }));
  slide.addText(bullets, {
    ...box,
    fontFace: "Microsoft YaHei",
    fontSize,
    color: palette.deep,
    fit: "shrink",
    paraSpaceAfterPt: 5,
    breakLine: false,
    margin: 0.07,
  });
}

function getSlideVisualText(item) {
  if (item.threeDFileUrl) {
    return `3D模型文件：${item.threeDFileUrl}\n${item.threeDPrompt || item.imagePrompt || ""}`;
  }
  return item.threeDPrompt || item.imagePrompt || "此处保留概念图提示词，正式出稿时可继续生成 AI 图。";
}

async function resolveSlideImageData(item) {
  if (item.threeDImageBase64) return `data:image/png;base64,${item.threeDImageBase64}`;
  if (item.imageBase64) return `data:image/png;base64,${item.imageBase64}`;
  if (item.threeDImageUrl) return imageToDataUri(item.threeDImageUrl).catch(() => "");
  if (item.imageUrl) return imageToDataUri(item.imageUrl).catch(() => "");
  return "";
}

async function addVisualBlock(slide, pptx, item, box, palette, label = "AI VISUAL") {
  const imageData = await resolveSlideImageData(item);
  if (imageData) {
    slide.addImage({
      data: imageData,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      sizing: { type: "cover", x: box.x, y: box.y, w: box.w, h: box.h },
    });
    return;
  }

  slide.addShape(pptx.ShapeType.roundRect, {
    x: box.x,
    y: box.y,
    w: box.w,
    h: box.h,
    rectRadius: 0.08,
    fill: { color: palette.soft },
    line: { color: palette.line },
  });
  addWrappedText(slide, item.threeDPrompt ? "3D 美陈 / 空间参考提示" : label, {
    x: box.x + 0.22,
    y: box.y + 0.22,
    w: box.w - 0.44,
    h: 0.26,
    fontSize: 10,
    bold: true,
    color: palette.accent,
  });
  addWrappedText(slide, getSlideVisualText(item), {
    x: box.x + 0.24,
    y: box.y + 0.62,
    w: box.w - 0.48,
    h: box.h - 0.78,
    fontSize: 8.2,
    color: palette.muted,
  });
}

async function resolveSceneImageData(sceneImage) {
  if (!sceneImage) return "";
  if (sceneImage.imageBase64) return `data:image/png;base64,${sceneImage.imageBase64}`;
  if (sceneImage.imageUrl) return imageToDataUri(sceneImage.imageUrl).catch(() => "");
  return "";
}

async function addSceneTile(slide, pptx, sceneImage, prompt, box, palette, index) {
  const imageData = await resolveSceneImageData(sceneImage);
  if (imageData) {
    slide.addImage({
      data: imageData,
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      sizing: { type: "cover", x: box.x, y: box.y, w: box.w, h: box.h },
    });
  } else {
    slide.addShape(pptx.ShapeType.roundRect, {
      x: box.x,
      y: box.y,
      w: box.w,
      h: box.h,
      rectRadius: 0.08,
      fill: { color: palette.soft },
      line: { color: palette.line },
    });
    addWrappedText(slide, prompt || sceneImage?.imageError || "场景效果图 Prompt 占位", {
      x: box.x + 0.18,
      y: box.y + 0.2,
      w: box.w - 0.36,
      h: box.h - 0.4,
      fontSize: 8,
      color: palette.muted,
    });
  }

  addWrappedText(slide, `SCENE ${index + 1}`, {
    x: box.x + 0.16,
    y: box.y + box.h - 0.28,
    w: 1.0,
    h: 0.16,
    fontSize: 6.8,
    bold: true,
    color: palette.accent,
  });
}

function addExecutionNote(slide, pptx, item, box, palette) {
  if (!item.executionNotes) return;
  slide.addShape(pptx.ShapeType.roundRect, {
    ...box,
    rectRadius: 0.08,
    fill: { color: palette.surface },
    line: { color: palette.line },
  });
  addWrappedText(slide, `执行说明：${item.executionNotes}`, {
    x: box.x + 0.18,
    y: box.y + 0.14,
    w: box.w - 0.36,
    h: box.h - 0.26,
    fontSize: 8.2,
    color: palette.muted,
  });
}

async function renderCoverSlide(slide, pptx, proposal, item, templatePreset, palette) {
  slide.background = { color: palette.deep };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    fill: { color: palette.deep },
    line: { color: palette.deep },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.18,
    h: 7.5,
    fill: { color: palette.accent },
    line: { color: palette.accent },
  });
  await addVisualBlock(slide, pptx, item, { x: 7.15, y: 0.55, w: 5.55, h: 6.25 }, palette, "COVER VISUAL");
  addWrappedText(slide, templatePreset.name, {
    x: 0.72,
    y: 0.72,
    w: 2.2,
    h: 0.26,
    fontSize: 9,
    bold: true,
    color: palette.accent,
  });
  addWrappedText(slide, proposal.title || item.title, {
    x: 0.72,
    y: 1.45,
    w: 5.95,
    h: 1.25,
    fontSize: 31,
    bold: true,
    color: "FFFFFF",
  });
  addWrappedText(slide, proposal.subtitle || proposal.theme || item.coreMessage || "", {
    x: 0.76,
    y: 3.0,
    w: 5.7,
    h: 0.58,
    fontSize: 13,
    color: "F7F2EA",
  });
  addWrappedText(slide, proposal.slogan || "策略 × 创意 × 舞美搭建 × 现场执行", {
    x: 0.76,
    y: 4.1,
    w: 5.7,
    h: 0.36,
    fontSize: 12,
    bold: true,
    color: palette.accent,
  });
}

async function renderSceneGallerySlide(slide, pptx, item, templatePreset, palette) {
  slide.background = { color: palette.bg };
  addSlideTitle(slide, item, palette, { w: 11.8, fontSize: 20 });
  addWrappedText(slide, "宏大场景效果图页：用于向甲方直接展示空间布置、打卡装置、动线氛围与落地质感。", {
    x: 0.62,
    y: 1.42,
    w: 11.8,
    h: 0.3,
    fontSize: 9.2,
    color: palette.muted,
  });

  const prompts = item.scenePrompts?.length ? item.scenePrompts.slice(0, 4) : [item.imagePrompt].filter(Boolean);
  const images = Array.isArray(item.sceneImages) ? item.sceneImages : [];
  const count = Math.max(prompts.length, images.length, 1);
  const boxes =
    count <= 2
      ? [
          { x: 0.62, y: 1.95, w: 5.9, h: 4.6 },
          { x: 6.82, y: 1.95, w: 5.9, h: 4.6 },
        ]
      : [
          { x: 0.62, y: 1.95, w: 5.9, h: 2.18 },
          { x: 6.82, y: 1.95, w: 5.9, h: 2.18 },
          { x: 0.62, y: 4.38, w: 5.9, h: 2.18 },
          { x: 6.82, y: 4.38, w: 5.9, h: 2.18 },
        ];

  for (let index = 0; index < Math.min(count, 4); index += 1) {
    await addSceneTile(slide, pptx, images[index], prompts[index], boxes[index], palette, index);
  }
  addDeckFooter(slide, pptx, item, templatePreset, palette);
}

async function renderSplitSlide(slide, pptx, item, templatePreset, palette, visualLeft = false) {
  slide.background = { color: palette.bg };
  addSlideTitle(slide, item, palette, { x: visualLeft ? 6.55 : 0.58, w: 6.0 });
  const textBox = visualLeft ? { x: 6.55, y: 1.78, w: 5.9, h: 3.05 } : { x: 0.68, y: 1.78, w: 5.95, h: 3.05 };
  const visualBox = visualLeft ? { x: 0.58, y: 0.78, w: 5.55, h: 5.65 } : { x: 7.1, y: 0.78, w: 5.55, h: 5.65 };
  addBulletList(slide, item.body, textBox, palette, 10.5);
  addExecutionNote(slide, pptx, item, { x: textBox.x, y: 5.05, w: textBox.w, h: 0.9 }, palette);
  await addVisualBlock(slide, pptx, item, visualBox, palette);
  addDeckFooter(slide, pptx, item, templatePreset, palette);
}

async function renderImageLedSlide(slide, pptx, item, templatePreset, palette) {
  slide.background = { color: palette.bg };
  await addVisualBlock(slide, pptx, item, { x: 0.58, y: 0.55, w: 12.18, h: 3.35 }, palette, "HERO VISUAL");
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.58,
    y: 3.65,
    w: 12.18,
    h: 0.28,
    fill: { color: palette.accent },
    line: { color: palette.accent },
  });
  addSlideTitle(slide, item, palette, { x: 0.66, y: 4.12, w: 4.9, fontSize: 20 });
  addBulletList(slide, item.body, { x: 5.9, y: 4.18, w: 6.65, h: 1.8 }, palette, 9.6);
  addDeckFooter(slide, pptx, item, templatePreset, palette);
}

async function renderProcessSlide(slide, pptx, item, templatePreset, palette) {
  slide.background = { color: palette.surface };
  addSlideTitle(slide, item, palette, { w: 10.8 });
  const cards = item.body.slice(0, 5);
  const cardW = 2.32;
  cards.forEach((text, index) => {
    const x = 0.62 + index * 2.48;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.15,
      w: cardW,
      h: 2.52,
      rectRadius: 0.08,
      fill: { color: index % 2 === 0 ? palette.soft : palette.bg },
      line: { color: palette.line },
    });
    addWrappedText(slide, `0${index + 1}`, {
      x: x + 0.18,
      y: 2.38,
      w: 0.58,
      h: 0.28,
      fontSize: 13,
      bold: true,
      color: palette.accent,
    });
    addWrappedText(slide, text, {
      x: x + 0.18,
      y: 2.88,
      w: cardW - 0.36,
      h: 1.42,
      fontSize: 8.6,
      color: palette.deep,
    });
  });
  addExecutionNote(slide, pptx, item, { x: 0.68, y: 5.26, w: 11.9, h: 0.82 }, palette);
  addDeckFooter(slide, pptx, item, templatePreset, palette);
}

async function renderVisualBoardSlide(slide, pptx, item, templatePreset, palette) {
  slide.background = { color: palette.bg };
  addSlideTitle(slide, item, palette, { w: 11.8 });
  await addVisualBlock(slide, pptx, item, { x: 0.62, y: 1.62, w: 6.25, h: 4.65 }, palette, "SPACE VISUAL");
  const cards = item.body.slice(0, 4);
  cards.forEach((text, index) => {
    const y = 1.62 + index * 1.12;
    slide.addShape(pptx.ShapeType.roundRect, {
      x: 7.24,
      y,
      w: 5.16,
      h: 0.88,
      rectRadius: 0.06,
      fill: { color: palette.surface },
      line: { color: palette.line },
    });
    addWrappedText(slide, text, {
      x: 7.48,
      y: y + 0.15,
      w: 4.68,
      h: 0.5,
      fontSize: 8.8,
      color: palette.deep,
    });
  });
  addDeckFooter(slide, pptx, item, templatePreset, palette);
}

async function renderMatrixSlide(slide, pptx, item, templatePreset, palette) {
  slide.background = { color: palette.surface };
  addSlideTitle(slide, item, palette, { w: 10.8 });
  const rows = item.body.slice(0, 6);
  rows.forEach((text, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 0.72 + col * 6.05;
    const y = 1.88 + row * 1.28;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y,
      w: 5.58,
      h: 0.95,
      rectRadius: 0.06,
      fill: { color: row % 2 === 0 ? palette.bg : palette.soft },
      line: { color: palette.line },
    });
    addWrappedText(slide, text, {
      x: x + 0.22,
      y: y + 0.16,
      w: 5.12,
      h: 0.56,
      fontSize: 8.8,
      color: palette.deep,
    });
  });
  await addVisualBlock(slide, pptx, item, { x: 8.9, y: 5.65, w: 3.48, h: 0.62 }, palette, "PROMPT");
  addDeckFooter(slide, pptx, item, templatePreset, palette);
}

async function renderCardsSlide(slide, pptx, item, templatePreset, palette) {
  slide.background = { color: palette.bg };
  addSlideTitle(slide, item, palette, { w: 10.8 });
  const cards = item.body.slice(0, 3);
  cards.forEach((text, index) => {
    const x = 0.72 + index * 4.1;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 2.0,
      w: 3.65,
      h: 2.35,
      rectRadius: 0.08,
      fill: { color: palette.surface },
      line: { color: palette.line },
    });
    addWrappedText(slide, `${index + 1}`, {
      x: x + 0.25,
      y: 2.22,
      w: 0.46,
      h: 0.36,
      fontSize: 18,
      bold: true,
      color: palette.accent,
    });
    addWrappedText(slide, text, {
      x: x + 0.28,
      y: 2.82,
      w: 3.1,
      h: 1.0,
      fontSize: 9.2,
      color: palette.deep,
    });
  });
  await addVisualBlock(slide, pptx, item, { x: 0.72, y: 4.85, w: 11.85, h: 1.1 }, palette, "CONCEPT PROMPT");
  addDeckFooter(slide, pptx, item, templatePreset, palette);
}

async function buildPptV2(response, proposal) {
  const PptxGenJS = loadPptxGen();
  const pptx = new PptxGenJS();
  const templatePreset = resolveTemplatePreset(proposal);
  const palette = getPptPalette(templatePreset);
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "Poster Assistant";
  pptx.company = "活动策划方案生成助手";
  pptx.subject = proposal.subtitle || proposal.theme || "活动方案";
  pptx.title = proposal.title || "活动方案";
  pptx.lang = "zh-CN";
  pptx.theme = {
    headFontFace: "Microsoft YaHei",
    bodyFontFace: "Microsoft YaHei",
    lang: "zh-CN",
  };

  const slides = normalizeSlidesForDeck(proposal, templatePreset);
  for (const item of slides) {
    const slide = pptx.addSlide();
    if (item.layoutVariant === "scene-gallery" || item.scenePrompts?.length) {
      await renderSceneGallerySlide(slide, pptx, item, templatePreset, palette);
    } else if (item.layoutVariant === "cover-hero") {
      await renderCoverSlide(slide, pptx, proposal, item, templatePreset, palette);
    } else if (item.layoutVariant === "image-led") {
      await renderImageLedSlide(slide, pptx, item, templatePreset, palette);
    } else if (item.layoutVariant === "horizontal-process") {
      await renderProcessSlide(slide, pptx, item, templatePreset, palette);
    } else if (item.layoutVariant === "visual-board") {
      await renderVisualBoardSlide(slide, pptx, item, templatePreset, palette);
    } else if (item.layoutVariant === "matrix") {
      await renderMatrixSlide(slide, pptx, item, templatePreset, palette);
    } else if (item.layoutVariant === "cards") {
      await renderCardsSlide(slide, pptx, item, templatePreset, palette);
    } else {
      await renderSplitSlide(slide, pptx, item, templatePreset, palette, item.layoutVariant === "visual-left-text-right");
    }
  }

  const buffer = await pptx.write({ outputType: "nodebuffer" });
  const fileName = `${sanitizeFileName(proposal.title)}.pptx`;
  sendBuffer(response, 200, buffer, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
  });
}

async function exportPpt(request, response) {
  let payload;
  try {
    payload = await readJsonBody(request);
  } catch {
    json(response, 400, { error: "请求体不是有效 JSON。" });
    return;
  }

  const proposal = payload.proposal;
  if (!proposal || !Array.isArray(proposal.slides)) {
    json(response, 400, { error: "缺少有效 proposal.slides。" });
    return;
  }

  try {
    await buildPptV2(response, proposal);
  } catch (error) {
    json(response, 500, {
      error: `PPT 导出失败：${String(error.message || error)}`,
    });
  }
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  if (request.method === "GET" && request.url === "/api/health") {
    json(response, 200, {
      ok: true,
      provider: "ark",
      hasApiKey: Boolean(ARK_API_KEY),
      textModel: ARK_TEXT_MODEL,
      imageModel: ARK_IMAGE_MODEL,
      threeDModel: ARK_3D_MODEL,
    });
    return;
  }

  if (request.method === "GET" && request.url === "/api/proposal-templates") {
    json(response, 200, getTemplatePayload());
    return;
  }

  if (request.method === "GET" && request.url === "/api/activity-prompts") {
    json(response, 200, getActivityPromptPayload());
    return;
  }

  if (request.method === "POST" && request.url === "/api/generate-proposal") {
    await generateProposal(request, response);
    return;
  }

  if (request.method === "POST" && request.url === "/api/generate-proposal-job") {
    await startProposalJob(request, response);
    return;
  }

  if (request.method === "GET" && request.url.startsWith("/api/proposal-job")) {
    getProposalJob(request, response);
    return;
  }

  if (request.method === "POST" && request.url === "/api/export-ppt") {
    await exportPpt(request, response);
    return;
  }

  if (request.method === "POST" && request.url === "/api/generate-image") {
    await generateImage(request, response);
    return;
  }

  if (request.method === "GET") {
    await serveStatic(request, response);
    return;
  }

  response.writeHead(405);
  response.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Poster assistant running at http://localhost:${PORT}`);
  console.log(ARK_API_KEY ? "ARK_API_KEY 已检测到" : "ARK_API_KEY 未设置");
  console.log(`Text model: ${ARK_TEXT_MODEL}`);
  console.log(`Image model: ${ARK_IMAGE_MODEL}`);
  console.log(`3D model: ${ARK_3D_MODEL}`);
});
