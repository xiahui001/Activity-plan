const STORAGE_KEYS = {
  templates: "poster-assistant-templates",
  draft: "poster-assistant-draft",
};

const form = document.getElementById("poster-form");
const titleInput = document.getElementById("title");
const subtitleInput = document.getElementById("subtitle");
const dateInput = document.getElementById("date");
const titleFontInput = document.getElementById("title-font");
const subtitleFontInput = document.getElementById("subtitle-font");
const locationInput = document.getElementById("location");
const highlightsInput = document.getElementById("highlights");
const themeInput = document.getElementById("theme");
const brandPrimaryInput = document.getElementById("brand-primary");
const brandAccentInput = document.getElementById("brand-accent");
const brandPrimaryShell = document.getElementById("brand-primary-shell");
const brandAccentShell = document.getElementById("brand-accent-shell");
const posterTypeInput = document.getElementById("poster-type");
const imageOrientationInput = document.getElementById("image-orientation");
const imageResolutionInput = document.getElementById("image-resolution");
const visualKeywordsInput = document.getElementById("visual-keywords");
const brandNameInput = document.getElementById("brand-name");
const logoUploadInput = document.getElementById("logo-upload");
const qrEnabledInput = document.getElementById("qr-enabled");
const qrUploadInput = document.getElementById("qr-upload");
const momentsCopyOutput = document.getElementById("moments-copy-output");
const copyOutput = document.getElementById("copy-output");
const proposalOutput = document.getElementById("proposal-output");
const promptOutput = document.getElementById("prompt-output");
const imageModelInput = document.getElementById("image-model");
const imageQualityInput = document.getElementById("image-quality");
const imagePromptInput = document.getElementById("image-prompt-input");
const templateSelect = document.getElementById("template-select");
const templateImportInput = document.getElementById("template-import");

const posterCard = document.getElementById("poster-card");
const sizeBadge = document.getElementById("size-badge");
const posterTag = document.getElementById("poster-tag");
const posterLogoText = document.getElementById("poster-logo-text");
const posterLogoImage = document.getElementById("poster-logo-image");
const posterTitle = document.getElementById("poster-title");
const posterSubtitle = document.getElementById("poster-subtitle");
const posterDate = document.getElementById("poster-date");
const posterLocation = document.getElementById("poster-location");
const posterHighlights = document.getElementById("poster-highlights");
const posterLink = document.getElementById("poster-link");
const posterCta = document.getElementById("poster-cta");
const posterQr = document.getElementById("poster-qr");
const posterQrImage = document.getElementById("poster-qr-image");
const posterQrPlaceholder = document.getElementById("poster-qr-placeholder");

const aiStatus = document.getElementById("ai-status");
const aiProgress = document.getElementById("ai-progress");
const aiProgressBar = document.getElementById("ai-progress-bar");
const aiProgressPercent = document.getElementById("ai-progress-percent");
const aiProgressDetail = document.getElementById("ai-progress-detail");
const aiResultGallery = document.getElementById("ai-result-gallery");
const aiResultCard = document.getElementById("ai-result-card");
const aiResultImage = document.getElementById("ai-result-image");
const aiResultPlaceholder = document.getElementById("ai-result-placeholder");
const aiResultSlots = Array.from(document.querySelectorAll("[data-ai-result-slot]"));
const aiResultImages = aiResultSlots.map((slot) => slot.querySelector("[data-ai-result-image]"));
const aiResultPlaceholders = aiResultSlots.map((slot) => slot.querySelector("[data-ai-result-placeholder]"));
const aiResultDownloadButtons = Array.from(document.querySelectorAll("[data-ai-download]"));
const imageLightbox = document.getElementById("image-lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxDownloadButton = document.getElementById("lightbox-download");
const lightboxCloseTriggers = Array.from(document.querySelectorAll("[data-lightbox-close]"));
const generateAiFieldsButton = document.getElementById("generate-ai-fields");
const generateAiImageButton = document.getElementById("generate-ai-image");
const downloadPngButton = document.getElementById("download-png");
const aiFieldsStatus = document.getElementById("ai-fields-status");

const themeLabels = {
  sunset: "落日露营",
  neon: "霓虹派对",
  forest: "自然市集",
};

const orientationLabels = {
  portrait: "竖屏 9:16",
  landscape: "横屏 16:9",
};

const POSTER_IMAGE_COUNT = 3;

const POSTER_TYPE_CONFIG = {
  kv: {
    label: "主 KV",
    defaultOrientation: "landscape",
    sizes: {
      landscape: "5504x3040",
      portrait: "3040x5504",
    },
    typePrompt:
      "主 KV 类型特点：作为活动主视觉、提案封面、大屏主画面和后续物料延展母版；画面要有明确视觉中心、品牌氛围和空间延展性，文字克制但标题有冲击力，避免塞满细节。",
  },
  checkin: {
    label: "打卡点",
    defaultOrientation: "landscape",
    sizes: {
      landscape: "4096x2304",
      portrait: "2304x4096",
    },
    typePrompt:
      "打卡点类型特点：表现可落地的现场拍照装置、DP 点或互动美陈场景；需要有人可站位的空间、装置结构、材质细节、拍照动线和社交传播感，不要只做平面海报。",
  },
  poster: {
    label: "海报",
    defaultOrientation: "portrait",
    sizes: {
      portrait: "3040x5504",
      landscape: "5504x3040",
    },
    typePrompt:
      "海报类型特点：作为朋友圈、社群和线上传播主图；信息层级要清楚，主标题、副标题、日期、地点和视觉氛围完整进入画面，适合手机端快速阅读与转发。",
  },
};

const DEFAULT_POSTER_TYPE = "kv";
const DEFAULT_SIZE = POSTER_TYPE_CONFIG[DEFAULT_POSTER_TYPE].defaultOrientation;

const FONT_CSS_MAP = {
  "思源黑体 Heavy": '"Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif',
  "思源黑体 Medium": '"Noto Sans SC", "Source Han Sans SC", "Microsoft YaHei", sans-serif',
  "思源宋体 Heavy": '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif',
  "思源宋体 Medium": '"Noto Serif SC", "Source Han Serif SC", "Songti SC", serif',
  "阿里巴巴普惠体 Heavy": '"Alibaba PuHuiTi", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  "阿里巴巴普惠体 Medium": '"Alibaba PuHuiTi", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  方正兰亭黑: '"FZLTHJW", "FZLanTingHei", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  方正大标宋: '"FZDaBiaoSong", "STSong", "SimSun", serif',
  方正小标宋: '"FZXiaoBiaoSong", "STSong", "SimSun", serif',
  汉仪旗黑: '"HYQiHei", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  汉仪尚巍手书: '"HYShangWeiShouShu", "STKaiti", "KaiTi", cursive',
  优设标题黑: '"YouSheBiaoTiHei", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  站酷高端黑: '"ZCOOL QingKe HuangYou", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  庞门正道标题体: '"PangMenZhengDao", "Noto Sans SC", "Microsoft YaHei", sans-serif',
  造字工房力黑: '"ZaoZiGongFangLiHei", "Noto Sans SC", "Microsoft YaHei", sans-serif',
};

const state = {
  logoImage: "",
  qrImage: "",
  aiImage: "",
  aiImages: [],
  aiImageMimeType: "image/png",
  lastAutoPrompt: "",
  fieldIdeaIteration: 0,
  imageProgressPercent: 0,
  selectedAiImageIndex: 0,
};

function resolveThemePreset(themeText) {
  const normalized = String(themeText || "").toLowerCase();
  if (normalized.includes("neon") || normalized.includes("霓虹") || normalized.includes("派对") || normalized.includes("夜")) {
    return "neon";
  }
  if (normalized.includes("forest") || normalized.includes("自然") || normalized.includes("市集") || normalized.includes("森")) {
    return "forest";
  }
  return "sunset";
}

function getThemeText(value) {
  return themeLabels[value] || value || "落日露营";
}

function getFallbackLogoText(brandName) {
  const normalized = String(brandName || "").trim();
  if (!normalized) {
    return "LOGO";
  }
  const ascii = normalized.match(/[A-Za-z0-9]/g);
  if (ascii && ascii.length) {
    return ascii.slice(0, 2).join("").toUpperCase();
  }
  return normalized.slice(0, 2);
}

function getThemeTokens(theme, primaryColor, accentColor) {
  const preset = themeLabels[theme] ? theme : "sunset";
  const defaults = {
    sunset: {
      base: primaryColor || "#ff8c61",
      secondary: mixColors(primaryColor || "#ff8c61", "#c53d52", 0.45),
      dark: "#33203e",
      text: "#fff8f3",
    },
    neon: {
      base: primaryColor || "#00c2ff",
      secondary: mixColors(primaryColor || "#00c2ff", "#162447", 0.48),
      dark: "#10172b",
      text: "#eef6ff",
    },
    forest: {
      base: primaryColor || "#4f8f67",
      secondary: mixColors(primaryColor || "#4f8f67", "#275e4d", 0.42),
      dark: "#10332b",
      text: "#f5f9f0",
    },
  };

  return {
    ...defaults[preset],
    ctaBg: accentColor || "#fff4d0",
    ctaText: getReadableTextColor(accentColor || "#fff4d0"),
    orb1: hexToRgba(accentColor || "#fff4d0", 0.28),
    orb2: hexToRgba(primaryColor || defaults[preset].base, 0.32),
  };
}

function getPosterTypeConfig(type) {
  return POSTER_TYPE_CONFIG[type] || POSTER_TYPE_CONFIG[DEFAULT_POSTER_TYPE];
}

function getFontCss(fontName) {
  return FONT_CSS_MAP[fontName] || FONT_CSS_MAP["思源黑体 Heavy"];
}

function getImageApiSize(size, type = DEFAULT_POSTER_TYPE) {
  const config = getPosterTypeConfig(type);
  return config.sizes[size] || config.sizes[config.defaultOrientation];
}

function getPosterDimensions(size, type = DEFAULT_POSTER_TYPE) {
  const [width, height] = getImageApiSize(size, type).split("x").map((part) => Number.parseInt(part, 10));
  return { width, height };
}

function getFormData() {
  const brandName = brandNameInput.value.trim() || "活动企划";
  const themeText = themeInput.value.trim() || "落日露营";
  const posterType = posterTypeInput.value || DEFAULT_POSTER_TYPE;
  const posterTypeConfig = getPosterTypeConfig(posterType);

  return {
    title: titleInput.value.trim() || "未命名活动",
    subtitle: subtitleInput.value.trim() || "补充一句吸引人的活动描述",
    date: dateInput.value.trim() || "待定",
    titleFont: titleFontInput.value || "思源黑体 Heavy",
    subtitleFont: subtitleFontInput.value || "思源黑体 Medium",
    location: locationInput.value.trim() || "待定",
    highlights: highlightsInput.value.trim() || "设计方向待补充",
    theme: themeText,
    themePreset: resolveThemePreset(themeText),
    posterType,
    posterTypeLabel: posterTypeConfig.label,
    posterTypePrompt: posterTypeConfig.typePrompt,
    size: imageOrientationInput.value || DEFAULT_SIZE,
    imageResolution: imageResolutionInput.value || "4K",
    brandPrimary: brandPrimaryInput.value,
    brandAccent: brandAccentInput.value,
    visualKeywords: visualKeywordsInput.value.trim() || "强视觉、活动海报、商业传播",
    brandName,
    logoText: getFallbackLogoText(brandName),
    logoImage: state.logoImage,
    qrEnabled: qrEnabledInput.checked,
    qrImage: state.qrImage,
    imageModel: imageModelInput.value,
    imageQuality: imageQualityInput.value,
    imagePrompt: imagePromptInput.value.trim(),
  };
}

function setInputValue(element, value) {
  element.value = value || "";
  resizeTextarea(element);
}

function resizeTextarea(element) {
  if (!element || !element.classList?.contains("auto-resize-textarea")) {
    return;
  }
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
}

function resizeAutoTextareas() {
  document.querySelectorAll(".auto-resize-textarea").forEach(resizeTextarea);
}

function syncColorPicker(input, shell) {
  const value = input.value || "#000000";
  shell.style.background = value;
}

function syncColorPickers() {
  syncColorPicker(brandPrimaryInput, brandPrimaryShell);
  syncColorPicker(brandAccentInput, brandAccentShell);
}

function applyTemplateData(template) {
  setInputValue(titleInput, template.title);
  setInputValue(subtitleInput, template.subtitle);
  setInputValue(dateInput, template.date);
  setInputValue(titleFontInput, template.titleFont || "思源黑体 Heavy");
  setInputValue(subtitleFontInput, template.subtitleFont || "思源黑体 Medium");
  setInputValue(locationInput, template.location);
  setInputValue(highlightsInput, template.highlights);
  setInputValue(themeInput, getThemeText(template.theme));
  setInputValue(brandPrimaryInput, template.brandPrimary || "#ff8c61");
  setInputValue(brandAccentInput, template.brandAccent || "#fff4d0");
  const templateType = template.posterType || DEFAULT_POSTER_TYPE;
  setInputValue(posterTypeInput, POSTER_TYPE_CONFIG[templateType] ? templateType : DEFAULT_POSTER_TYPE);
  const templateSize = ["portrait", "landscape"].includes(template.size)
    ? template.size
    : getPosterTypeConfig(posterTypeInput.value).defaultOrientation;
  setInputValue(imageOrientationInput, templateSize);
  setInputValue(imageResolutionInput, template.imageResolution || "4K");
  setInputValue(visualKeywordsInput, template.visualKeywords);
  setInputValue(brandNameInput, template.brandName);
  setInputValue(imageModelInput, template.imageModel || "doubao-seedream-5-0-260128");
  setInputValue(imageQualityInput, template.imageQuality || "medium");
  qrEnabledInput.checked = Boolean(template.qrEnabled);
  syncColorPickers();
  state.logoImage = template.logoImage || "";
  state.qrImage = template.qrImage || "";
  logoUploadInput.value = "";
  qrUploadInput.value = "";
  refreshAll(Boolean(template.imagePrompt), template.imagePrompt || "");
}

function buildCopy(data) {
  return [
    `${data.brandName}｜${data.title}`,
    `${data.date} @ ${data.location}`,
    `画面类型：${data.posterTypeLabel}`,
    `视觉风格：${data.theme}`,
    `${data.subtitle}。`,
    `设计方向：${data.highlights}`,
    `字体建议：主标题 ${data.titleFont}，副标题 ${data.subtitleFont}`,
    `传播关键词：${data.visualKeywords}`,
  ].join("\n");
}

function buildMomentsCopy(data) {
  return [
    `${data.title}｜${data.date}`,
    `${data.subtitle}`,
    `这次整体视觉会围绕“${data.highlights}”展开，适合做现场打卡、社交分享和活动主视觉延展。`,
    `日期：${data.date}`,
    `地点：${data.location}`,
    data.qrEnabled ? "感兴趣可以直接私聊或扫描现场二维码了解详情。" : "感兴趣可以直接私聊了解详情。",
  ].join("\n");
}

function buildProposal(data) {
  const themeDirection = {
    sunset: "以温暖、放松、适合拍照打卡的氛围为主，强调周末松弛感和社交分享感。",
    neon: "以夜场节奏、互动体验和强视觉记忆点为主，强调年轻人社交扩散和现场热度。",
    forest: "以自然疗愈、轻逛轻体验和停留时长为主，强调品质感与生活方式内容。",
  }[data.themePreset];

  const audience = {
    sunset: "城市白领、年轻情侣、亲子家庭、周末出游人群",
    neon: "年轻白领、潮流人群、夜生活爱好者、社交媒体活跃用户",
    forest: "品质消费人群、手作爱好者、生活方式用户、亲子与宠物友好客群",
  }[data.themePreset];

  return [
    `一、活动定位`,
    `${data.title} 以“${data.subtitle}”为核心传播表达，当前输出类型为“${data.posterTypeLabel}”，整体视觉采用“${data.theme}”方向。${themeDirection}设计方向重点为：${data.highlights}。`,
    ``,
    `二、活动目标`,
    `1. 拉新：通过主视觉海报和社群传播吸引目标人群关注活动并形成到场意向。`,
    `2. 停留：围绕 ${data.highlights} 设计内容体验，提升用户停留时长和参与深度。`,
    data.qrEnabled
      ? "3. 转化：通过二维码、现场咨询和私域承接完成后续沟通，减少海报信息负担。"
      : "3. 转化：通过私域沟通、现场咨询和后续内容承接完成转化，不在海报上增加扫码负担。",
    `4. 引流：围绕视觉关键词“${data.visualKeywords}”设计传播素材，保证朋友圈、社群和现场物料风格一致。`,
    ``,
    `三、目标人群`,
    `核心客群：${audience}。`,
    `传播人设：对活动氛围、视觉质感和社交分享有较高敏感度的人群。`,
    ``,
    `四、活动内容结构`,
    `1. 主会场主题：围绕“${data.title}”设置一处核心视觉区，确保适合拍照、直播和短视频传播。`,
    `2. 内容模块：根据“${data.highlights}”拆分为 3 至 4 个体验单元，建议包含互动、展示、消费、打卡四类内容。`,
    data.qrEnabled
      ? `3. 信息呈现：重点突出日期 ${data.date}、地点 ${data.location}，二维码区域仅作为后续了解入口。`
      : `3. 信息呈现：重点突出日期 ${data.date}、地点 ${data.location}，不设置二维码区，保持主视觉完整。`,
    ``,
    `五、传播节奏`,
    `建议拆分为预热发布、现场打卡、集中传播、后续复盘四段执行。`,
    `前期预热：上线海报主视觉、释放视觉关键词“${data.visualKeywords}”，建立第一轮朋友圈与社群传播素材。`,
    `活动当天：现场重点记录人流高峰、互动参与和品牌露出画面，适合即时二次传播。`,
    `活动后续：回收照片和视频素材，沉淀复盘内容，用于下一轮活动招商或招募。`,
    ``,
    `六、传播建议`,
    `1. 视觉传播：统一使用品牌名 ${data.brandName} 与主色 ${data.brandPrimary}，保持海报、社媒封面和现场物料一致。`,
    data.qrEnabled
      ? "2. 文案传播：主标题聚焦活动名，副标题负责氛围解释，设计方向负责画面记忆点，二维码区域负责后续了解动作。"
      : "2. 文案传播：主标题聚焦活动名，副标题负责氛围解释，设计方向负责画面记忆点，画面不再承担扫码动作。",
    `3. 字体传播：主标题使用 ${data.titleFont}，副标题使用 ${data.subtitleFont}，保证 KV、打卡点和海报延展时识别一致。`,
  ].join("\n");
}

function buildPrompt(data) {
  const imageSize = getImageApiSize(data.size, data.posterType);
  const qrPrompt = data.qrEnabled
    ? "二维码要求：右下角必须预留真实二维码覆盖区，不要生成假的二维码图案；请围绕该区域设计与主色调、搭配色系一致的底托、发光边框、角标或信息框，底部标签为“扫码报名”。"
    : "二维码要求：本张海报不需要二维码，不要预留二维码区域，不要生成二维码图案，也不要出现“扫码报名”等扫码文案。";
  const layoutPrompt = data.qrEnabled
    ? "版式要求：大标题强冲击，日期和地点清晰，右下角预留二维码位置。所有文字、Logo、二维码都必须完整位于画面内，四周保留 12%-14% 文字安全区，不要贴边，不要裁切。"
    : "版式要求：大标题强冲击，日期和地点清晰；画面保持完整留白和视觉呼吸感。所有文字、Logo 都必须完整位于画面内，四周保留 12%-14% 文字安全区，不要贴边，不要裁切。";
  const titlePlacementPrompt =
    "主标题排版：主标题必须放在顶部安全区内，距离上边缘至少 10%-14%，不要贴顶，不要超出画布，不要裁切字形；副标题紧跟主标题下方但保持清晰间距，不要覆盖人物脸部、产品主体或关键场景。";
  const infoPlacementPrompt =
    "日期地点排版：日期和地点必须作为底部信息栏处理，放在画面左下角或底部左侧安全区，距离下边缘至少 8%-12%，用小字号横向信息条呈现；不要放在画面中部，不要放在主标题正下方中央，不要使用 @ 符号或巨大定位图标，不要压住主视觉、人物、产品、地标或活动场景主体。";
  return [
    `请生成一张中文活动视觉图，画面类型为${data.posterTypeLabel}，画面方向为${orientationLabels[data.size]}，输出尺寸 ${imageSize}。`,
    data.posterTypePrompt,
    `活动主题：${data.title}。`,
    `副标题：${data.subtitle}。`,
    `活动信息：日期 ${data.date}，地点 ${data.location}。`,
    `品牌信息：品牌名 ${data.brandName}，Logo 使用上传的品牌文件；如果没有 Logo 文件，只保留简洁品牌标识位。`,
    `字体要求：主标题使用或模仿 ${data.titleFont} 的字形气质，副标题使用或模仿 ${data.subtitleFont} 的字形气质；中文排版要专业，不要乱码。`,
    `传播目标：用于${data.posterTypeLabel}视觉输出，首屏信息优先突出活动主题和活动氛围，日期地点作为底部辅助信息清晰出现。`,
    `视觉方向：${data.theme}，主色调 ${data.brandPrimary}，搭配色系 ${data.brandAccent}。`,
    `画面关键词：${data.visualKeywords}。`,
    qrPrompt,
    titlePlacementPrompt,
    infoPlacementPrompt,
    layoutPrompt,
    `设计方向：${data.highlights}。`,
    `整体要求：高级、商业、适合活动策划提案，不要杂乱，不要过度卡通。`,
  ].join("\n");
}

function syncImagePrompt(force = false, explicitValue = "") {
  if (explicitValue) {
    imagePromptInput.value = explicitValue;
    state.lastAutoPrompt = explicitValue;
    return;
  }

  const nextPrompt = promptOutput.value;
  if (force || !imagePromptInput.value.trim() || imagePromptInput.value.trim() === state.lastAutoPrompt) {
    imagePromptInput.value = nextPrompt;
    state.lastAutoPrompt = nextPrompt;
  }
}

function updateOutputs(syncPrompt = false, explicitPrompt = "") {
  const data = getFormData();
  const generatedPrompt = buildPrompt(data);
  momentsCopyOutput.value = buildMomentsCopy(data);
  copyOutput.value = buildCopy(data);
  proposalOutput.value = buildProposal(data);
  promptOutput.value = generatedPrompt;
  syncImagePrompt(syncPrompt, explicitPrompt);
  return generatedPrompt;
}

function updatePreview() {
  const data = getFormData();
  const theme = getThemeTokens(data.themePreset, data.brandPrimary, data.brandAccent);

  posterTitle.textContent = data.title;
  posterSubtitle.textContent = data.subtitle;
  posterDate.textContent = data.date;
  posterLocation.textContent = data.location;
  posterHighlights.textContent = data.highlights;
  posterLink.textContent = "扫码了解";
  posterCta.hidden = true;
  posterTag.textContent = data.brandName;
  posterLogoText.textContent = data.logoText;
  posterTitle.style.fontFamily = getFontCss(data.titleFont);
  posterSubtitle.style.fontFamily = getFontCss(data.subtitleFont);
  sizeBadge.textContent = `${data.posterTypeLabel} ${orientationLabels[data.size]} ${data.imageResolution || "4K"} ${getImageApiSize(data.size, data.posterType)}`;
  sizeBadge.hidden = false;
  posterQr.hidden = !data.qrEnabled;

  posterCard.className = `poster-card ${data.themePreset} poster-${data.size}`;
  posterCard.style.background = [
    `radial-gradient(circle at top right, ${hexToRgba(data.brandAccent, 0.5)}, transparent 26%)`,
    `linear-gradient(150deg, ${theme.base} 0%, ${theme.secondary} 44%, ${theme.dark} 100%)`,
  ].join(", ");
  posterCard.style.color = theme.text;

  const orbs = posterCard.querySelectorAll(".poster-orb");
  if (orbs.length === 2) {
    orbs[0].style.background = theme.orb1;
    orbs[1].style.background = theme.orb2;
  }

  if (data.logoImage) {
    posterLogoImage.src = data.logoImage;
    posterLogoImage.hidden = false;
    posterLogoText.hidden = true;
  } else {
    posterLogoImage.hidden = true;
    posterLogoText.hidden = false;
  }

  if (data.qrEnabled && data.qrImage) {
    posterQrImage.src = data.qrImage;
    posterQrImage.hidden = false;
    posterQrPlaceholder.hidden = true;
  } else if (data.qrEnabled) {
    posterQrImage.hidden = true;
    posterQrPlaceholder.hidden = false;
    posterQrPlaceholder.textContent = "QR";
  } else {
    posterQrImage.hidden = true;
    posterQrPlaceholder.hidden = true;
  }
}

function setAiFieldsStatus(message, type = "") {
  aiFieldsStatus.textContent = message;
  aiFieldsStatus.className = "field-status";
  if (type) {
    aiFieldsStatus.classList.add(`is-${type}`);
  }
}

function isHexColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || ""));
}

function applyAiFields(fields) {
  setInputValue(subtitleInput, fields.subtitle || subtitleInput.value);
  setInputValue(highlightsInput, fields.highlights || highlightsInput.value);
  setInputValue(themeInput, fields.theme || themeInput.value);
  if (isHexColor(fields.brandPrimary)) {
    setInputValue(brandPrimaryInput, fields.brandPrimary);
  }
  if (isHexColor(fields.brandAccent)) {
    setInputValue(brandAccentInput, fields.brandAccent);
  }
  setInputValue(visualKeywordsInput, fields.visualKeywords || visualKeywordsInput.value);
}

async function generateAiFields() {
  const data = getFormData();
  if (!data.title || data.title === "未命名活动") {
    window.alert("请先填写活动名称。");
    return;
  }

  state.fieldIdeaIteration += 1;
  generateAiFieldsButton.disabled = true;
  generateAiFieldsButton.textContent = "刷新中...";
  setAiFieldsStatus(`正在生成第 ${state.fieldIdeaIteration} 版视觉方案...`);

  try {
    const response = await fetch("/api/generate-activity-fields", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        subtitle: data.subtitle,
        date: data.date,
        location: data.location,
        highlights: data.highlights,
        theme: data.theme,
        posterType: data.posterTypeLabel,
        titleFont: data.titleFont,
        subtitleFont: data.subtitleFont,
        brandPrimary: data.brandPrimary,
        brandAccent: data.brandAccent,
        visualKeywords: data.visualKeywords,
        brandName: data.brandName,
        iteration: state.fieldIdeaIteration,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "AI 字段生成失败。");
    }

    applyAiFields(payload);
    refreshAll(true);
    setAiFieldsStatus(`已生成第 ${state.fieldIdeaIteration} 版，可继续点击切换。`, "success");
  } catch (error) {
    setAiFieldsStatus(String(error.message || error), "error");
    window.alert(String(error.message || error));
  } finally {
    generateAiFieldsButton.disabled = false;
    generateAiFieldsButton.textContent = "刷新文案";
  }
}

function refreshAll(syncPrompt = false, explicitPrompt = "") {
  resizeAutoTextareas();
  syncColorPickers();
  updatePreview();
  updateOutputs(syncPrompt, explicitPrompt);
  persistDraft();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function splitLines(text, maxLength) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  });

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : [text];
}

function wrapText(text, maxLength) {
  if (text.includes(" ")) {
    return splitLines(text, maxLength);
  }

  const result = [];
  for (let index = 0; index < text.length; index += maxLength) {
    result.push(text.slice(index, index + maxLength));
  }

  return result.length ? result : [text];
}

function buildSvgMarkup() {
  const data = getFormData();
  const theme = getThemeTokens(data.themePreset, data.brandPrimary, data.brandAccent);
  const { width, height } = getPosterDimensions(data.size, data.posterType);
  const titleFontFamily = getFontCss(data.titleFont);
  const subtitleFontFamily = getFontCss(data.subtitleFont);
  const titleLines = wrapText(data.title, data.size === "story" ? 6 : 8);
  const subtitleLines = wrapText(data.subtitle, data.size === "story" ? 12 : 16);
  const highlightLines = wrapText(data.highlights, data.size === "story" ? 14 : 18);
  const padding = data.size === "story" ? 84 : 72;
  const titleY = data.size === "story" ? 720 : data.size === "square" ? 640 : 760;
  const footerY = height - (data.size === "story" ? 360 : 280);
  const titleFontSize = data.size === "story" ? 122 : data.size === "square" ? 108 : 116;
  const subtitleFontSize = data.size === "story" ? 38 : 34;
  const qrSize = data.size === "story" ? 182 : 160;
  const qrX = width - padding - qrSize;
  const qrY = height - padding - qrSize - 24;
  const brandMarkSize = 96;
  const brandX = width - padding - brandMarkSize;
  const titleSvg = titleLines
    .map(
      (line, index) =>
        `<tspan x="${padding}" dy="${index === 0 ? 0 : titleFontSize * 0.92}">${escapeXml(line)}</tspan>`
    )
    .join("");
  const subtitleSvg = subtitleLines
    .map(
      (line, index) =>
        `<tspan x="${padding}" dy="${index === 0 ? 0 : subtitleFontSize * 1.45}">${escapeXml(line)}</tspan>`
    )
    .join("");
  const highlightsSvg = highlightLines
    .map(
      (line, index) =>
        `<tspan x="${padding}" dy="${index === 0 ? 0 : 42}">${escapeXml(line)}</tspan>`
    )
    .join("");

  const logoMarkup = data.logoImage
    ? `<image href="${escapeXml(data.logoImage)}" x="${brandX}" y="${padding - 4}" width="${brandMarkSize}" height="${brandMarkSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#brandClip)" />`
    : `<text x="${brandX + brandMarkSize / 2}" y="${padding + 54}" text-anchor="middle" font-size="30" font-family="Space Grotesk, Noto Sans SC, sans-serif" font-weight="700">${escapeXml(data.logoText)}</text>`;

  const qrMarkup = data.qrImage
    ? `<image href="${escapeXml(data.qrImage)}" x="${qrX}" y="${qrY + 24}" width="${qrSize}" height="${qrSize}" preserveAspectRatio="xMidYMid slice" clip-path="url(#qrClip)" />`
    : `<text x="${qrX + qrSize / 2}" y="${qrY + 92}" text-anchor="middle" font-size="24" font-family="Space Grotesk, Noto Sans SC, sans-serif" opacity="0.92">QR</text>`;
  const qrGroup = data.qrEnabled
    ? `<g>
    <rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize + 24}" rx="24" fill="#ffffff" fill-opacity="0.12" />
    <text x="${qrX + 18}" y="${qrY + 18}" fill="${theme.text}" font-size="14" font-family="Space Grotesk, Noto Sans SC, sans-serif" letter-spacing="2">
      SCAN
    </text>
    ${qrMarkup}
  </g>`
    : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.base}" />
      <stop offset="44%" stop-color="${theme.secondary}" />
      <stop offset="100%" stop-color="${theme.dark}" />
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22" />
      <stop offset="70%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
    <filter id="blur">
      <feGaussianBlur stdDeviation="22" />
    </filter>
    <clipPath id="brandClip">
      <rect x="${brandX}" y="${padding - 4}" width="${brandMarkSize}" height="${brandMarkSize}" rx="26" />
    </clipPath>
    <clipPath id="qrClip">
      <rect x="${qrX}" y="${qrY + 24}" width="${qrSize}" height="${qrSize}" rx="18" />
    </clipPath>
  </defs>

  <rect width="${width}" height="${height}" rx="34" fill="url(#bg)" />
  <circle cx="${width - 140}" cy="120" r="180" fill="${theme.orb1}" filter="url(#blur)" />
  <circle cx="100" cy="${height - 130}" r="190" fill="${theme.orb2}" filter="url(#blur)" />
  <rect width="${width}" height="${height}" rx="34" fill="url(#shine)" opacity="0.5" />

  <g fill="${theme.text}">
    <rect x="${padding}" y="${padding - 14}" width="250" height="54" rx="27" fill="#ffffff" fill-opacity="0.12" />
    <text x="${padding + 28}" y="${padding + 20}" font-size="22" font-family="Space Grotesk, Noto Sans SC, sans-serif" letter-spacing="2" font-weight="700">
      ${escapeXml(data.brandName)}
    </text>

    <rect x="${brandX}" y="${padding - 4}" width="${brandMarkSize}" height="${brandMarkSize}" rx="26" fill="#ffffff" fill-opacity="0.12" />
    ${logoMarkup}

    <text x="${padding}" y="${titleY - 84}" font-size="34" font-family="Space Grotesk, Noto Sans SC, sans-serif" letter-spacing="3" font-weight="700">
      ${escapeXml(data.date)}
    </text>

    <text x="${padding}" y="${titleY}" font-size="${titleFontSize}" font-family="${escapeXml(titleFontFamily)}" font-weight="700" letter-spacing="-4">
      ${titleSvg}
    </text>

    <text x="${padding}" y="${titleY + titleFontSize * titleLines.length + 58}" font-size="${subtitleFontSize}" font-family="${escapeXml(subtitleFontFamily)}" font-weight="500" opacity="0.95">
      ${subtitleSvg}
    </text>

    <text x="${padding}" y="${footerY}" font-size="22" font-family="Space Grotesk, Noto Sans SC, sans-serif" letter-spacing="4" opacity="0.76">PLACE</text>
    <text x="${padding + 132}" y="${footerY}" font-size="34" font-family="Noto Sans SC, sans-serif" font-weight="700">${escapeXml(data.location)}</text>

    <text x="${padding}" y="${footerY + 72}" font-size="30" font-family="Noto Sans SC, sans-serif" font-weight="500" opacity="0.92">
      ${highlightsSvg}
    </text>

    <text x="${padding}" y="${height - 136}" font-size="22" font-family="Space Grotesk, Noto Sans SC, sans-serif" opacity="0.82">
      ${escapeXml(data.brandName)}
    </text>
  </g>

  ${qrGroup}
</svg>`.trim();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

function downloadDataUrl(filename, dataUrl) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function downloadAiImageAt(index) {
  const image = state.aiImages[index];
  if (!image) {
    window.alert(`第 ${index + 1} 张图片还没有生成。`);
    return;
  }
  downloadDataUrl(`poster-ai-image-${index + 1}.png`, image);
}

function openImageLightbox(index) {
  const image = state.aiImages[index];
  if (!image || !imageLightbox || !lightboxImage || !lightboxTitle) {
    return;
  }

  selectAiImage(index);
  lightboxImage.src = image;
  lightboxTitle.textContent = `第 ${index + 1} 张生成结果`;
  imageLightbox.hidden = false;
  document.body.classList.add("has-lightbox");
}

function closeImageLightbox() {
  if (!imageLightbox) {
    return;
  }
  imageLightbox.hidden = true;
  document.body.classList.remove("has-lightbox");
}

function exportSvg() {
  downloadFile("poster-design.svg", buildSvgMarkup(), "image/svg+xml;charset=utf-8");
}

function exportPng() {
  const svgMarkup = buildSvgMarkup();
  const data = getFormData();
  const { width, height } = getPosterDimensions(data.size, data.posterType);
  const url = URL.createObjectURL(new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" }));
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    if (!context) {
      URL.revokeObjectURL(url);
      window.alert("PNG 导出失败，请改用 SVG 导出。");
      return;
    }

    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);

    canvas.toBlob((blob) => {
      if (!blob) {
        window.alert("PNG 导出失败，请改用 SVG 导出。");
        return;
      }

      const pngUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "poster-design.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(pngUrl), 200);
    }, "image/png");
  };

  image.onerror = () => {
    URL.revokeObjectURL(url);
    window.alert("PNG 导出失败，请改用 SVG 导出。");
  };

  image.src = url;
}

function setAiStatus(message, type = "") {
  aiStatus.textContent = message;
  aiStatus.className = "ai-status";
  if (type) {
    aiStatus.classList.add(`is-${type}`);
  }
}

function selectAiImage(index) {
  state.selectedAiImageIndex = Math.max(0, Math.min(POSTER_IMAGE_COUNT - 1, index));
  aiResultSlots.forEach((slot, slotIndex) => {
    slot.classList.toggle("is-selected", slotIndex === state.selectedAiImageIndex);
  });
}

function renderAiImages(images = []) {
  const data = getFormData();
  state.aiImages = images.filter(Boolean);

  aiResultSlots.forEach((slot, index) => {
    const image = aiResultImages[index];
    const placeholder = aiResultPlaceholders[index];
    const downloadButton = aiResultDownloadButtons[index];
    const dataUrl = state.aiImages[index] || "";
    slot.classList.toggle("is-landscape", data.size === "landscape");
    slot.classList.toggle("is-portrait", data.size !== "landscape");

    if (!image || !placeholder) {
      return;
    }

    if (dataUrl) {
      image.src = dataUrl;
      image.hidden = false;
      placeholder.hidden = true;
    } else {
      image.hidden = true;
      placeholder.hidden = false;
      placeholder.textContent = index === 0
        ? "点击左侧“AI 生成海报”，这里会并行显示 3 张真实模型生成结果。"
        : `第 ${index + 1} 张结果待生成`;
    }

    if (downloadButton) {
      downloadButton.disabled = !dataUrl;
    }
  });

  selectAiImage(Math.min(state.selectedAiImageIndex, Math.max(0, state.aiImages.length - 1)));
}

function renderAiImage(dataUrl) {
  renderAiImages(dataUrl ? [dataUrl] : []);
}

function setImageProgress(completedCount, totalCount, detail) {
  const total = Math.max(1, totalCount);
  const nextPercent = Math.max(
    state.imageProgressPercent,
    Math.min(100, Math.round((Math.max(0, completedCount) / total) * 100))
  );
  state.imageProgressPercent = nextPercent;
  aiProgress.hidden = false;
  aiProgressBar.style.width = `${nextPercent}%`;
  aiProgressPercent.textContent = `${Math.min(completedCount, total)}/${total}`;
  aiProgressDetail.textContent = detail;
}

function startImageProgress() {
  state.imageProgressPercent = 0;
  aiProgress.hidden = false;
  aiProgressBar.style.width = "0%";
  aiProgressPercent.textContent = `0/${POSTER_IMAGE_COUNT}`;
  aiProgressDetail.textContent = `已并行提交 ${POSTER_IMAGE_COUNT} 个真实生成请求，等待模型返回。`;
}

function finishImageProgress(detail, type = "success") {
  setImageProgress(POSTER_IMAGE_COUNT, POSTER_IMAGE_COUNT, detail);
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    if (!String(src).startsWith("data:")) {
      image.crossOrigin = "anonymous";
    }
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("图片加载失败，无法合成二维码。"));
    image.src = src;
  });
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}

function drawQrCornerMarks(context, x, y, width, height, color, lineWidth) {
  const length = Math.min(width, height) * 0.18;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.lineCap = "square";
  [
    [x, y, 1, 1],
    [x + width, y, -1, 1],
    [x, y + height, 1, -1],
    [x + width, y + height, -1, -1],
  ].forEach(([cornerX, cornerY, dirX, dirY]) => {
    context.beginPath();
    context.moveTo(cornerX, cornerY + dirY * length);
    context.lineTo(cornerX, cornerY);
    context.lineTo(cornerX + dirX * length, cornerY);
    context.stroke();
  });
  context.restore();
}

async function composeQrOverlay(baseImageUrl, data) {
  if (!data.qrEnabled || !data.qrImage) {
    return baseImageUrl;
  }

  const [baseImage, qrImage] = await Promise.all([
    loadCanvasImage(baseImageUrl),
    loadCanvasImage(data.qrImage),
  ]);
  const canvas = document.createElement("canvas");
  canvas.width = baseImage.naturalWidth || baseImage.width;
  canvas.height = baseImage.naturalHeight || baseImage.height;
  const context = canvas.getContext("2d");
  if (!context) {
    return baseImageUrl;
  }

  const width = canvas.width;
  const height = canvas.height;
  const isLandscape = width > height;
  const qrSize = Math.round(Math.max(220, Math.min(width * (isLandscape ? 0.13 : 0.16), height * 0.12, 720)));
  const padding = Math.round(qrSize * 0.09);
  const labelHeight = Math.round(qrSize * 0.26);
  const blockWidth = qrSize + padding * 2;
  const blockHeight = qrSize + padding * 2 + labelHeight;
  const marginX = Math.round(width * 0.055);
  const marginY = Math.round(height * 0.055);
  const blockX = width - marginX - blockWidth;
  const blockY = height - marginY - blockHeight;
  const qrX = blockX + padding;
  const qrY = blockY + padding;
  const radius = Math.round(qrSize * 0.08);
  const lineWidth = Math.max(4, Math.round(qrSize * 0.024));
  const primary = data.brandPrimary || "#111111";
  const accent = data.brandAccent || "#ffffff";

  context.drawImage(baseImage, 0, 0, width, height);

  context.save();
  context.shadowColor = hexToRgba(accent, 0.55);
  context.shadowBlur = Math.round(qrSize * 0.11);
  drawRoundedRect(context, blockX, blockY, blockWidth, blockHeight, radius * 1.3);
  context.fillStyle = hexToRgba(primary, 0.72);
  context.fill();
  context.restore();

  drawRoundedRect(context, blockX, blockY, blockWidth, blockHeight, radius * 1.3);
  context.strokeStyle = hexToRgba(accent, 0.92);
  context.lineWidth = lineWidth;
  context.stroke();

  context.save();
  drawRoundedRect(context, qrX, qrY, qrSize, qrSize, radius);
  context.fillStyle = "#ffffff";
  context.fill();
  context.clip();
  const innerPadding = Math.round(qrSize * 0.035);
  context.drawImage(qrImage, qrX + innerPadding, qrY + innerPadding, qrSize - innerPadding * 2, qrSize - innerPadding * 2);
  context.restore();

  drawQrCornerMarks(context, qrX - lineWidth, qrY - lineWidth, qrSize + lineWidth * 2, qrSize + lineWidth * 2, accent, lineWidth);

  context.font = `700 ${Math.round(labelHeight * 0.52)}px "Noto Sans SC", "Microsoft YaHei", sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.lineWidth = Math.max(3, Math.round(qrSize * 0.018));
  context.strokeStyle = hexToRgba(primary, 0.92);
  context.fillStyle = getReadableTextColor(primary) === "#18202f" ? "#18202f" : accent;
  const labelX = blockX + blockWidth / 2;
  const labelY = blockY + padding + qrSize + labelHeight / 2;
  context.strokeText("扫码报名", labelX, labelY);
  context.fillText("扫码报名", labelX, labelY);

  return canvas.toDataURL("image/png");
}

async function refineImagePrompt(prompt, data) {
  try {
    const response = await fetch("/api/refine-image-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        fields: {
          title: data.title,
          subtitle: data.subtitle,
          date: data.date,
          location: data.location,
          highlights: data.highlights,
          theme: data.theme,
          visualKeywords: data.visualKeywords,
          brandName: data.brandName,
          posterTypeLabel: data.posterTypeLabel,
          orientation: orientationLabels[data.size],
          imageResolution: data.imageResolution || "4K",
          titleFont: data.titleFont,
          subtitleFont: data.subtitleFont,
          qrEnabled: data.qrEnabled,
        },
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.prompt) {
      return {
        prompt,
        warning: payload.error || "专业 prompt 整理失败，已改用本地固定 prompt 继续生成。",
      };
    }

    return { prompt: payload.prompt };
  } catch {
    return {
      prompt,
      warning: "专业 prompt 整理失败，已改用本地固定 prompt 继续生成。",
    };
  }
}

async function requestAiImage(prompt, data, index) {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model: data.imageModel,
      quality: data.imageQuality,
      size: data.imageResolution || getImageApiSize(data.size, data.posterType),
      orientation: data.size,
      posterType: data.posterType,
      variation: index + 1,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `第 ${index + 1} 张图片生成失败。`);
  }

  const mimeType = payload.mimeType || "image/png";
  const imageUrl = payload.imageUrl || `data:${mimeType};base64,${payload.imageBase64}`;
  return composeQrOverlay(imageUrl, data);
}

async function generateAiImage() {
  const data = getFormData();
  const prompt = data.imagePrompt || promptOutput.value || updateOutputs();

  if (!prompt) {
    window.alert("请先生成或填写提示词。");
    return;
  }

  setAiStatus("生成中", "loading");
  startImageProgress();
  state.aiImages = [];
  state.aiImage = "";
  aiResultImages.forEach((image) => {
    if (image) image.hidden = true;
  });
  aiResultPlaceholders.forEach((placeholder, index) => {
    if (!placeholder) return;
    placeholder.hidden = false;
    placeholder.textContent = `第 ${index + 1} 张正在生成...`;
  });
  aiResultDownloadButtons.forEach((button) => {
    button.disabled = true;
  });
  generateAiImageButton.disabled = true;
  generateAiImageButton.textContent = "并行生成中...";
  document.querySelector(".ai-result-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });

  try {
    const refinedPrompt = await refineImagePrompt(prompt, data);
    if (refinedPrompt.warning) {
      setImageProgress(0, POSTER_IMAGE_COUNT, refinedPrompt.warning);
    } else {
      setImageProgress(0, POSTER_IMAGE_COUNT, "专业 prompt 已整理完成，正在提交真实生图请求。");
      imagePromptInput.value = refinedPrompt.prompt;
      state.lastAutoPrompt = refinedPrompt.prompt;
    }

    let settledCount = 0;
    const tasks = Array.from({ length: POSTER_IMAGE_COUNT }, async (_, index) => {
      try {
        const imageUrl = await requestAiImage(refinedPrompt.prompt, data, index);
        return { index, imageUrl };
      } catch (error) {
        return { index, error };
      } finally {
        settledCount += 1;
        setImageProgress(
          settledCount,
          POSTER_IMAGE_COUNT,
          `真实请求已完成 ${settledCount}/${POSTER_IMAGE_COUNT}，正在整理生成结果。`
        );
      }
    });
    const results = await Promise.all(tasks);
    const images = results
      .filter((result) => result.imageUrl)
      .map((result) => result.imageUrl);
    if (!images.length) {
      const firstError = results.find((result) => result.error);
      throw new Error(firstError?.error?.message || "三张图片均生成失败。");
    }

    state.aiImages = images;
    state.aiImage = images[0];
    state.selectedAiImageIndex = 0;
    state.aiImageMimeType = "image/png";
    renderAiImages(images);
    const failedCount = results.filter((result) => result.error).length;
    finishImageProgress(
      failedCount
        ? `已生成 ${images.length} 张，${failedCount} 张失败，可直接下载已生成结果。`
        : data.qrEnabled && data.qrImage
          ? "3 张生成完成，已盖上上传的二维码。"
          : "3 张生成完成，已返回真实模型结果。"
    );
    setAiStatus(failedCount ? "部分完成" : "生成完成", failedCount ? "error" : "success");
  } catch (error) {
    const message = String(error.message || error);
    finishImageProgress(`生成失败：${message}`, "error");
    setAiStatus("生成失败", "error");
    aiResultPlaceholders.forEach((placeholder) => {
      if (!placeholder) return;
      placeholder.hidden = false;
      placeholder.textContent = message.includes("Failed to fetch")
        ? "未连接到本地服务。请先按 README 启动本地服务，再刷新页面。"
        : message;
    });
    aiResultImages.forEach((image) => {
      if (image) image.hidden = true;
    });
    window.alert(aiResultPlaceholders[0]?.textContent || message);
  } finally {
    generateAiImageButton.disabled = false;
    generateAiImageButton.textContent = "AI 生成海报";
  }
}

function downloadCurrentImage() {
  if (state.aiImages[state.selectedAiImageIndex]) {
    downloadAiImageAt(state.selectedAiImageIndex);
    return;
  }
  if (state.aiImage) {
    downloadDataUrl("poster-ai-image-1.png", state.aiImage);
    return;
  }
  window.alert("还没有真实 AI 生成图。请先点击“AI 生成海报”。");
}

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function getTemplates() {
  return safeJsonParse(localStorage.getItem(STORAGE_KEYS.templates) || "[]", []);
}

function saveTemplates(templates) {
  localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(templates));
}

function collectTemplateData() {
  return {
    version: 1,
    savedAt: new Date().toISOString(),
    ...getFormData(),
  };
}

function renderTemplateOptions() {
  const templates = getTemplates();
  const currentValue = templateSelect.value;

  templateSelect.innerHTML = '<option value=""></option>';
  templates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.name;
    option.textContent = template.name;
    templateSelect.appendChild(option);
  });

  if (templates.some((template) => template.name === currentValue)) {
    templateSelect.value = currentValue;
  }
}

function persistDraft() {
  localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(collectTemplateData()));
}

function restoreDraft() {
  const draft = safeJsonParse(localStorage.getItem(STORAGE_KEYS.draft) || "null", null);
  if (draft) {
    applyTemplateData(draft);
  } else {
    refreshAll(true);
  }
}

function saveTemplate() {
  const defaultName = `${titleInput.value.trim() || "活动模板"}-${dateInput.value.trim() || "未定期"}`;
  const name = window.prompt("输入模板名称", defaultName);
  if (!name) {
    return;
  }

  const templates = getTemplates().filter((template) => template.name !== name);
  templates.unshift({
    name,
    ...collectTemplateData(),
  });
  saveTemplates(templates);
  renderTemplateOptions();
  templateSelect.value = name;
}

function loadTemplate() {
  const selected = templateSelect.value;
  if (!selected) {
    window.alert("先选择一个模板。");
    return;
  }

  const template = getTemplates().find((item) => item.name === selected);
  if (!template) {
    window.alert("模板不存在，可能已被删除。");
    renderTemplateOptions();
    return;
  }

  applyTemplateData(template);
}

function deleteTemplate() {
  const selected = templateSelect.value;
  if (!selected) {
    window.alert("先选择一个模板。");
    return;
  }

  const templates = getTemplates().filter((template) => template.name !== selected);
  saveTemplates(templates);
  renderTemplateOptions();
}

function exportTemplate() {
  const payload = {
    name: templateSelect.value || `${titleInput.value.trim() || "活动模板"}-export`,
    ...collectTemplateData(),
  };

  downloadFile(`${payload.name}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

function importTemplateFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const template = safeJsonParse(String(reader.result || ""), null);
    if (!template) {
      window.alert("模板文件格式无效。");
      return;
    }

    applyTemplateData(template);
    if (template.name) {
      const templates = getTemplates().filter((item) => item.name !== template.name);
      templates.unshift(template);
      saveTemplates(templates);
      renderTemplateOptions();
      templateSelect.value = template.name;
    }
  };
  reader.readAsText(file, "utf-8");
}

function handleImageUpload(file, key) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    state[key] = String(reader.result || "");
    refreshAll();
  };
  reader.readAsDataURL(file);
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((part) => `${part}${part}`).join("")
    : normalized;

  return {
    r: parseInt(expanded.slice(0, 2), 16),
    g: parseInt(expanded.slice(2, 4), 16),
    b: parseInt(expanded.slice(4, 6), 16),
  };
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function mixColors(colorA, colorB, ratio) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const mix = (start, end) => Math.round(start * (1 - ratio) + end * ratio);
  return `#${[mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
}

function getReadableTextColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.66 ? "#18202f" : "#f8fbff";
}

form.addEventListener("input", (event) => {
  if (event.target.type === "file") {
    return;
  }
  resizeTextarea(event.target);
  refreshAll();
});

form.addEventListener("change", (event) => {
  if (event.target === logoUploadInput) {
    handleImageUpload(logoUploadInput.files[0], "logoImage");
    return;
  }

  if (event.target === qrUploadInput) {
    handleImageUpload(qrUploadInput.files[0], "qrImage");
    return;
  }

  if (event.target === posterTypeInput) {
    imageOrientationInput.value = getPosterTypeConfig(posterTypeInput.value).defaultOrientation;
    refreshAll(true);
    return;
  }

  if (event.target !== templateImportInput) {
    refreshAll();
  }
});

templateImportInput?.addEventListener("change", () => {
  const file = templateImportInput.files[0];
  if (file) {
    importTemplateFile(file);
  }
  templateImportInput.value = "";
});

generateAiFieldsButton.addEventListener("click", generateAiFields);
downloadPngButton.addEventListener("click", downloadCurrentImage);
generateAiImageButton.addEventListener("click", generateAiImage);
aiResultSlots.forEach((slot, index) => {
  slot.addEventListener("click", () => {
    selectAiImage(index);
    openImageLightbox(index);
  });
  slot.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectAiImage(index);
      openImageLightbox(index);
    }
  });
});
aiResultDownloadButtons.forEach((button, index) => {
  button.addEventListener("click", () => downloadAiImageAt(index));
});
lightboxCloseTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeImageLightbox);
});
lightboxDownloadButton?.addEventListener("click", () => downloadAiImageAt(state.selectedAiImageIndex));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageLightbox && !imageLightbox.hidden) {
    closeImageLightbox();
  }
});

renderTemplateOptions();
restoreDraft();
renderAiImage("");
setAiStatus("待生成");
