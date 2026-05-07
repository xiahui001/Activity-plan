const STORAGE_KEYS = {
  templates: "poster-assistant-templates",
  draft: "poster-assistant-draft",
};

const form = document.getElementById("poster-form");
const titleInput = document.getElementById("title");
const subtitleInput = document.getElementById("subtitle");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const locationInput = document.getElementById("location");
const highlightsInput = document.getElementById("highlights");
const ctaInput = document.getElementById("cta");
const themeInput = document.getElementById("theme");
const sizeInput = document.getElementById("size");
const brandPrimaryInput = document.getElementById("brand-primary");
const brandAccentInput = document.getElementById("brand-accent");
const visualKeywordsInput = document.getElementById("visual-keywords");
const campaignChannelInput = document.getElementById("campaign-channel");
const offerHookInput = document.getElementById("offer-hook");
const brandNameInput = document.getElementById("brand-name");
const logoTextInput = document.getElementById("logo-text");
const signupLinkInput = document.getElementById("signup-link");
const logoUploadInput = document.getElementById("logo-upload");
const qrUploadInput = document.getElementById("qr-upload");
const companyProfileInput = document.getElementById("company-profile");
const companyStrengthsInput = document.getElementById("company-strengths");
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
const posterTime = document.getElementById("poster-time");
const posterLocation = document.getElementById("poster-location");
const posterHighlights = document.getElementById("poster-highlights");
const posterLink = document.getElementById("poster-link");
const posterCta = document.getElementById("poster-cta");
const posterQrImage = document.getElementById("poster-qr-image");
const posterQrPlaceholder = document.getElementById("poster-qr-placeholder");

const aiStatus = document.getElementById("ai-status");
const aiResultImage = document.getElementById("ai-result-image");
const aiResultPlaceholder = document.getElementById("ai-result-placeholder");

const themeLabels = {
  sunset: "落日露营",
  neon: "霓虹派对",
  forest: "自然市集",
};

const sizeLabels = {
  portrait: "4:5",
  square: "1:1",
  story: "9:16",
};

const state = {
  logoImage: "",
  qrImage: "",
  aiImage: "",
  aiImageMimeType: "image/png",
  lastAutoPrompt: "",
};

function getThemeTokens(theme, primaryColor, accentColor) {
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
    ...defaults[theme],
    ctaBg: accentColor || "#fff4d0",
    ctaText: getReadableTextColor(accentColor || "#fff4d0"),
    orb1: hexToRgba(accentColor || "#fff4d0", 0.28),
    orb2: hexToRgba(primaryColor || defaults[theme].base, 0.32),
  };
}

function getPosterDimensions(size) {
  if (size === "square") {
    return { width: 1200, height: 1200 };
  }
  if (size === "story") {
    return { width: 1080, height: 1920 };
  }
  return { width: 1200, height: 1500 };
}

function getImageApiSize(size) {
  if (size === "square") {
    return "1024x1024";
  }
  return "1024x1536";
}

function getFormData() {
  return {
    title: titleInput.value.trim() || "未命名活动",
    subtitle: subtitleInput.value.trim() || "补充一句吸引人的活动描述",
    date: dateInput.value.trim() || "待定",
    time: timeInput.value.trim() || "待定",
    location: locationInput.value.trim() || "待定",
    highlights: highlightsInput.value.trim() || "亮点待补充",
    cta: ctaInput.value.trim() || "立即参与",
    theme: themeInput.value,
    size: sizeInput.value,
    brandPrimary: brandPrimaryInput.value,
    brandAccent: brandAccentInput.value,
    visualKeywords: visualKeywordsInput.value.trim() || "强视觉、活动海报、商业传播",
    campaignChannel: campaignChannelInput.value,
    offerHook: offerHookInput.value.trim() || "限时预约 / 到场福利 / 名额有限",
    brandName: brandNameInput.value.trim() || "活动企划",
    logoText: logoTextInput.value.trim() || "LOGO",
    signupLink: signupLinkInput.value.trim() || "https://example.com",
    companyProfile: companyProfileInput.value.trim() || "公司主营活动策划与执行服务。",
    companyStrengths: companyStrengthsInput.value.trim() || "活动策划与执行一体化。",
    logoImage: state.logoImage,
    qrImage: state.qrImage,
    imageModel: imageModelInput.value,
    imageQuality: imageQualityInput.value,
    imagePrompt: imagePromptInput.value.trim(),
  };
}

function setInputValue(element, value) {
  element.value = value || "";
}

function applyTemplateData(template) {
  setInputValue(titleInput, template.title);
  setInputValue(subtitleInput, template.subtitle);
  setInputValue(dateInput, template.date);
  setInputValue(timeInput, template.time);
  setInputValue(locationInput, template.location);
  setInputValue(highlightsInput, template.highlights);
  setInputValue(ctaInput, template.cta);
  setInputValue(themeInput, template.theme || "sunset");
  setInputValue(sizeInput, template.size || "portrait");
  setInputValue(brandPrimaryInput, template.brandPrimary || "#ff8c61");
  setInputValue(brandAccentInput, template.brandAccent || "#fff4d0");
  setInputValue(visualKeywordsInput, template.visualKeywords);
  setInputValue(campaignChannelInput, template.campaignChannel || "moments");
  setInputValue(offerHookInput, template.offerHook);
  setInputValue(brandNameInput, template.brandName);
  setInputValue(logoTextInput, template.logoText);
  setInputValue(signupLinkInput, template.signupLink);
  setInputValue(companyProfileInput, template.companyProfile);
  setInputValue(companyStrengthsInput, template.companyStrengths);
  setInputValue(imageModelInput, template.imageModel || "doubao-seedream-5-0-260128");
  setInputValue(imageQualityInput, template.imageQuality || "medium");
  state.logoImage = template.logoImage || "";
  state.qrImage = template.qrImage || "";
  logoUploadInput.value = "";
  qrUploadInput.value = "";
  refreshAll(Boolean(template.imagePrompt), template.imagePrompt || "");
}

function buildCopy(data) {
  const channelLead = {
    moments: "这版内容优先服务朋友圈宣发和私域引流，信息要短、狠、直接。",
    poster: "这版内容优先服务活动主海报传播，强调视觉记忆点和活动氛围。",
    group: "这版内容优先服务社群转发，强调清晰利益点和快速报名动作。",
  }[data.campaignChannel];

  const styleLead = {
    sunset: "把周末做成一场有温度、有画面感的城市假日。",
    neon: "把夜场热度、社交氛围和传播记忆点一次性拉满。",
    forest: "把自然治愈感、市集松弛感和活动参与感揉进同一张海报。",
  }[data.theme];

  return [
    `${data.brandName}｜${data.title}`,
    `${data.date} ${data.time} @ ${data.location}`,
    channelLead,
    styleLead,
    `${data.subtitle}。`,
    `核心亮点：${data.highlights}`,
    `公司能力：${data.companyStrengths}`,
    `引流钩子：${data.offerHook}`,
    `传播关键词：${data.visualKeywords}`,
    `转化动作：主按钮使用“${data.cta}”，底部保留报名入口 ${data.signupLink}`,
  ].join("\n");
}

function buildMomentsCopy(data) {
  return [
    `${data.title}｜${data.date}`,
    `${data.subtitle}`,
    `这次我们把 ${data.highlights} 都安排上了，适合想找周末活动、做社交分享、现场打卡的人来玩。`,
    `时间：${data.date} ${data.time}`,
    `地点：${data.location}`,
    `福利：${data.offerHook}`,
    `我们这边可提供活动策划、舞美搭建执行、物料搭建和舞台设备整体落地，现场呈现会更完整。`,
    `${data.cta}，感兴趣可以直接私聊或扫码报名：${formatLink(data.signupLink)}`,
  ].join("\n");
}

function buildProposal(data) {
  const themeDirection = {
    sunset: "以温暖、放松、适合拍照打卡的氛围为主，强调周末松弛感和社交分享感。",
    neon: "以夜场节奏、互动体验和强视觉记忆点为主，强调年轻人社交扩散和现场热度。",
    forest: "以自然疗愈、轻逛轻体验和停留时长为主，强调品质感与生活方式内容。",
  }[data.theme];

  const audience = {
    sunset: "城市白领、年轻情侣、亲子家庭、周末出游人群",
    neon: "年轻白领、潮流人群、夜生活爱好者、社交媒体活跃用户",
    forest: "品质消费人群、手作爱好者、生活方式用户、亲子与宠物友好客群",
  }[data.theme];

  const rhythm = data.time.includes("-")
    ? `建议按照 ${data.time} 的时段拆分为开场引流、核心体验、集中传播、收尾转化四段执行。`
    : "建议拆分为开场引流、核心体验、集中传播、收尾转化四段执行。";

  return [
    `一、活动定位`,
    `${data.title} 以“${data.subtitle}”为核心传播表达，整体视觉采用 ${themeLabels[data.theme]} 方向。${themeDirection}`,
    ``,
    `二、活动目标`,
    `1. 拉新：通过主视觉海报和报名链接吸引目标人群完成预约或到场。`,
    `2. 停留：围绕 ${data.highlights} 设计内容体验，提升用户停留时长和参与深度。`,
    `3. 转化：以“${data.cta}”作为主行动指令，统一线上传播与现场转化动作。`,
    `4. 引流：优先围绕 ${data.campaignChannel === "moments" ? "朋友圈宣发" : data.campaignChannel === "group" ? "社群转发" : "主海报扩散"} 设计传播节奏，突出 ${data.offerHook}。`,
    ``,
    `三、目标人群`,
    `核心客群：${audience}。`,
    `传播人设：对活动氛围、视觉质感和社交分享有较高敏感度的人群。`,
    ``,
    `四、公司承接优势`,
    `${data.companyProfile}`,
    `能力重点：${data.companyStrengths}`,
    `建议对外统一表达“策划、设计、搭建执行、设备支持一体化”，增强客户对整体交付能力的信任。`,
    ``,
    `五、活动内容结构`,
    `1. 主会场主题：围绕“${data.title}”设置一处核心视觉区，确保适合拍照、直播和短视频传播。`,
    `2. 内容模块：根据“${data.highlights}”拆分为 3 至 4 个体验单元，建议包含互动、展示、消费、打卡四类内容。`,
    `3. 信息呈现：重点突出时间 ${data.date} ${data.time}、地点 ${data.location}、报名入口 ${formatLink(data.signupLink)}。`,
    ``,
    `六、执行节奏`,
    rhythm,
    `前期预热：上线海报主视觉、释放亮点关键词“${data.visualKeywords}”，同步推送报名链接，并围绕“${data.offerHook}”设计首轮朋友圈文案。`,
    `活动当天：现场重点记录人流高峰、互动参与和品牌露出画面，适合即时二次传播。`,
    `活动后续：回收照片和视频素材，沉淀复盘内容，用于下一轮活动招商或招募。`,
    ``,
    `七、传播建议`,
    `1. 视觉传播：统一使用品牌名 ${data.brandName} 与主色 ${data.brandPrimary}，保持海报、社媒封面和现场物料一致。`,
    `2. 文案传播：主标题聚焦活动名，副标题负责氛围解释，按钮统一为“${data.cta}”，朋友圈首屏优先抛出“${data.offerHook}”。`,
    `3. 转发机制：可设置限时福利、拍照打卡点、好友同行机制，提升自然扩散和私域转发。`,
    ``,
    `八、落地清单`,
    `- 海报主视觉、社交媒体封面、报名页 Banner`,
    `- 现场导视、签到点、主舞台或主互动区视觉物料`,
    `- 美陈装置、会议类物料、展位结构或活动舞美搭建方案`,
    `- 舞台设备、灯光音响、屏幕或演出配套设备清单`,
    `- 二维码物料、主持人口播词、摄影摄像点位安排`,
    `- 活动结束后的图文复盘和二次传播内容`,
  ].join("\n");
}

function buildPrompt(data) {
  return [
    `请生成一张中文活动宣传海报，比例 ${sizeLabels[data.size]}，用于线上传播。`,
    `活动主题：${data.title}。`,
    `副标题：${data.subtitle}。`,
    `活动信息：${data.date} ${data.time}，地点 ${data.location}。`,
    `品牌信息：品牌名 ${data.brandName}，Logo 以“${data.logoText}”为核心识别。`,
    `执行背景：${data.companyProfile}。`,
    `传播目标：用于${data.campaignChannel === "moments" ? "朋友圈引流" : data.campaignChannel === "group" ? "社群转发" : "活动主海报传播"}，首屏信息优先突出“${data.offerHook}”。`,
    `视觉方向：${themeLabels[data.theme]}，主品牌色 ${data.brandPrimary}，强调色 ${data.brandAccent}。`,
    `画面关键词：${data.visualKeywords}。`,
    `版式要求：大标题强冲击，日期清晰，时间和地点放底部信息区，保留按钮文案“${data.cta}”，右下角预留二维码位置。`,
    `内容亮点：${data.highlights}。`,
    `整体要求：高级、商业、适合活动策划提案，不要杂乱，不要过度卡通。`,
  ].join("\n");
}

function formatLink(link) {
  return link.replace(/^https?:\/\//i, "").replace(/\/$/, "");
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
}

function updatePreview() {
  const data = getFormData();
  const theme = getThemeTokens(data.theme, data.brandPrimary, data.brandAccent);

  posterTitle.textContent = data.title;
  posterSubtitle.textContent = data.subtitle;
  posterDate.textContent = data.date;
  posterTime.textContent = data.time;
  posterLocation.textContent = data.location;
  posterHighlights.textContent = data.highlights;
  posterLink.textContent = formatLink(data.signupLink);
  posterCta.textContent = data.cta;
  posterTag.textContent = data.brandName;
  posterLogoText.textContent = data.logoText;
  sizeBadge.textContent = sizeLabels[data.size];

  posterCard.className = `poster-card ${data.theme} poster-${data.size}`;
  posterCard.style.background = [
    `radial-gradient(circle at top right, ${hexToRgba(data.brandAccent, 0.5)}, transparent 26%)`,
    `linear-gradient(150deg, ${theme.base} 0%, ${theme.secondary} 44%, ${theme.dark} 100%)`,
  ].join(", ");
  posterCard.style.color = theme.text;
  posterCta.style.background = theme.ctaBg;
  posterCta.style.color = theme.ctaText;

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

  if (data.qrImage) {
    posterQrImage.src = data.qrImage;
    posterQrImage.hidden = false;
    posterQrPlaceholder.hidden = true;
  } else {
    posterQrImage.hidden = true;
    posterQrPlaceholder.hidden = false;
    posterQrPlaceholder.textContent = formatLink(data.signupLink);
  }
}

function refreshAll(syncPrompt = false, explicitPrompt = "") {
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
  const theme = getThemeTokens(data.theme, data.brandPrimary, data.brandAccent);
  const { width, height } = getPosterDimensions(data.size);
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
    : `<text x="${qrX + 16}" y="${qrY + 88}" font-size="22" font-family="Space Grotesk, Noto Sans SC, sans-serif" opacity="0.92">${escapeXml(formatLink(data.signupLink))}</text>`;

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

    <text x="${padding}" y="${titleY}" font-size="${titleFontSize}" font-family="Space Grotesk, Noto Sans SC, sans-serif" font-weight="700" letter-spacing="-4">
      ${titleSvg}
    </text>

    <text x="${padding}" y="${titleY + titleFontSize * titleLines.length + 58}" font-size="${subtitleFontSize}" font-family="Noto Sans SC, sans-serif" font-weight="500" opacity="0.95">
      ${subtitleSvg}
    </text>

    <text x="${padding}" y="${footerY}" font-size="22" font-family="Space Grotesk, Noto Sans SC, sans-serif" letter-spacing="4" opacity="0.76">TIME</text>
    <text x="${padding + 110}" y="${footerY}" font-size="34" font-family="Space Grotesk, Noto Sans SC, sans-serif" font-weight="700">${escapeXml(data.time)}</text>

    <text x="${padding}" y="${footerY + 62}" font-size="22" font-family="Space Grotesk, Noto Sans SC, sans-serif" letter-spacing="4" opacity="0.76">PLACE</text>
    <text x="${padding + 132}" y="${footerY + 62}" font-size="34" font-family="Noto Sans SC, sans-serif" font-weight="700">${escapeXml(data.location)}</text>

    <text x="${padding}" y="${footerY + 132}" font-size="30" font-family="Noto Sans SC, sans-serif" font-weight="500" opacity="0.92">
      ${highlightsSvg}
    </text>

    <text x="${padding}" y="${height - 136}" font-size="22" font-family="Space Grotesk, Noto Sans SC, sans-serif" opacity="0.82">
      ${escapeXml(formatLink(data.signupLink))}
    </text>
  </g>

  <g>
    <rect x="${padding}" y="${height - 120}" width="${Math.max(240, data.cta.length * 32)}" height="68" rx="34" fill="${theme.ctaBg}" />
    <text x="${padding + 28}" y="${height - 76}" fill="${theme.ctaText}" font-size="28" font-family="Space Grotesk, Noto Sans SC, sans-serif" font-weight="700">
      ${escapeXml(data.cta)}
    </text>

    <rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize + 24}" rx="24" fill="#ffffff" fill-opacity="0.12" />
    <text x="${qrX + 18}" y="${qrY + 18}" fill="${theme.text}" font-size="14" font-family="Space Grotesk, Noto Sans SC, sans-serif" letter-spacing="2">
      SCAN TO JOIN
    </text>
    ${qrMarkup}
  </g>
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

function exportSvg() {
  downloadFile("poster-design.svg", buildSvgMarkup(), "image/svg+xml;charset=utf-8");
}

function exportPng() {
  const svgMarkup = buildSvgMarkup();
  const { width, height } = getPosterDimensions(getFormData().size);
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

function renderAiImage(dataUrl) {
  if (!dataUrl) {
    aiResultImage.hidden = true;
    aiResultPlaceholder.hidden = false;
    return;
  }

  aiResultImage.src = dataUrl;
  aiResultImage.hidden = false;
  aiResultPlaceholder.hidden = true;
}

async function generateAiImage() {
  const data = getFormData();
  const prompt = data.imagePrompt || promptOutput.value;

  if (!prompt) {
    window.alert("请先生成或填写提示词。");
    return;
  }

  setAiStatus("生成中", "loading");
  aiResultPlaceholder.hidden = false;
  aiResultPlaceholder.textContent = "豆包正在生成海报，请稍候...";
  aiResultImage.hidden = true;

  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: data.imageModel,
        quality: data.imageQuality,
        size: getImageApiSize(data.size),
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || "图片生成失败。");
    }

    state.aiImageMimeType = payload.mimeType || "image/png";
    state.aiImage = payload.imageUrl || `data:${state.aiImageMimeType};base64,${payload.imageBase64}`;
    renderAiImage(state.aiImage);
    setAiStatus("生成完成", "success");
  } catch (error) {
    const message = String(error.message || error);
    setAiStatus("生成失败", "error");
    aiResultPlaceholder.hidden = false;
    aiResultPlaceholder.textContent = message.includes("Failed to fetch")
      ? "未连接到本地服务。请先按 README 启动本地服务，再刷新页面。"
      : message;
    aiResultImage.hidden = true;
  }
}

function downloadAiImage() {
  if (!state.aiImage) {
    window.alert("还没有 AI 生成结果。");
    return;
  }

  downloadDataUrl("poster-ai-image.png", state.aiImage);
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

  templateSelect.innerHTML = '<option value="">选择已保存模板</option>';
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

  if (event.target !== templateImportInput) {
    refreshAll();
  }
});

templateImportInput.addEventListener("change", () => {
  const file = templateImportInput.files[0];
  if (file) {
    importTemplateFile(file);
  }
  templateImportInput.value = "";
});

document.getElementById("generate-copy").addEventListener("click", () => updateOutputs(true));
document.getElementById("download-svg").addEventListener("click", exportSvg);
document.getElementById("download-png").addEventListener("click", exportPng);
document.getElementById("generate-ai-image").addEventListener("click", generateAiImage);
document.getElementById("sync-ai-prompt").addEventListener("click", () => syncImagePrompt(true));
document.getElementById("download-ai-image").addEventListener("click", downloadAiImage);
document.getElementById("save-template").addEventListener("click", saveTemplate);
document.getElementById("load-template").addEventListener("click", loadTemplate);
document.getElementById("delete-template").addEventListener("click", deleteTemplate);
document.getElementById("export-template").addEventListener("click", exportTemplate);
document.getElementById("import-template").addEventListener("click", () => templateImportInput.click());

renderTemplateOptions();
restoreDraft();
renderAiImage("");
setAiStatus("待生成");
