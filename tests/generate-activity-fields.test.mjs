import { test } from "node:test";
import assert from "node:assert/strict";

import { startAppServer, startMockArk } from "./helpers/app-server.mjs";

test("AI field generation endpoint calls the configured text model and returns usable poster fields", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/api/generate-activity-fields`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "春日城市露营节",
        date: "2026.05.18",
        location: "上海滨江绿地 A 区",
        iteration: 2,
      }),
    });

    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.equal(payload.subtitle, "把周末交给城市绿地和好音乐");
    assert.equal(payload.highlights, "自然露营氛围 / 乐队现场 / 手作市集 / 轻社交打卡");
    assert.equal(payload.theme, "城市绿洲露营");
    assert.equal(payload.brandPrimary, "#2f8f6b");
    assert.equal(payload.brandAccent, "#f4d35e");
    assert.match(payload.visualKeywords, /城市绿洲/);
    assert.equal(ark.calls.chat.length, 1);
    assert.equal(ark.calls.chat[0].model, "test-text-model");
  } finally {
    await app.close();
    await ark.close();
  }
});

test("served poster form does not expose signup link input", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.equal(html.includes("signup-link"), false);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("served poster form exposes image generation progress and logo format guidance", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /id="ai-progress"/);
    assert.match(html, /id="ai-progress-bar"/);
    assert.match(html, /SVG 优先/);
    assert.match(html, /AI\/EPS\/PDF/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("served poster form uses one refresh copy button beside the title and keeps QR upload", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /id="generate-ai-fields"[^>]*>刷新文案<\/button>/);
    assert.equal(html.includes("AI 优化一版"), false);
    assert.equal(html.includes('id="generate-copy"'), false);
    assert.match(html, /id="qr-upload"/);
    assert.match(html, /上传二维码图片/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("served poster form uses aligned custom color picker shells", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /class="color-picker-grid"/);
    assert.match(html, /class="[^"]*color-picker-shell/);
    assert.match(html, /id="brand-primary-shell"/);
    assert.match(html, /id="brand-accent-shell"/);
    assert.match(html, /id="brand-primary"/);
    assert.match(html, /id="brand-accent"/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("served poster form has a QR visibility switch that is off by default", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /id="qr-enabled"/);
    assert.match(html, /海报显示二维码/);
    assert.doesNotMatch(html, /id="qr-enabled"[^>]*checked/);

    const appJs = await fetch(`${app.baseUrl}/app.js`).then((res) => res.text());
    assert.match(appJs, /qrEnabled/);
    assert.match(appJs, /data\.qrEnabled && data\.qrImage/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("served poster page reuses the proposal assistant shell with a distinct poster accent", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const className of ["app-shell", "workspace", "input-pane", "output-pane", "app-header", "form-grid"]) {
      assert.match(html, new RegExp(`class="[^"]*${className}`));
    }
    assert.equal(html.includes("fonts.googleapis.com"), false);

    const css = await fetch(`${app.baseUrl}/styles.css`).then((res) => res.text());
    assert.match(css, /font-family: "Avenir Next", "Optima", "Noto Sans SC", "PingFang SC", sans-serif/);
    assert.match(css, /font-family: "Songti SC", "Noto Serif SC", "STSong", "SimSun", serif/);
    assert.match(css, /--accent: #b65a3c/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("served poster form supports poster type, font selection, and removes redundant time/company fields", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/`);
    assert.equal(response.status, 200);
    const html = await response.text();

    assert.match(html, /id="poster-type"/);
    assert.match(html, /value="kv"/);
    assert.match(html, /value="checkin"/);
    assert.match(html, /value="poster"/);
    assert.match(html, /id="title-font"/);
    assert.match(html, /id="subtitle-font"/);
    assert.match(html, /class="font-stack"/);
    assert.equal(html.includes("field-row font-row"), false);
    assert.match(html, /思源黑体/);
    assert.match(html, /方正兰亭黑/);
    assert.match(html, /优设标题黑/);

    const titleFontOptions = [...html.matchAll(/<select id="title-font"[\s\S]*?<\/select>/g)][0]?.[0] || "";
    assert.ok((titleFontOptions.match(/<option/g) || []).length >= 10);

    assert.equal(html.includes('id="time"'), false);
    assert.equal(html.includes("公司服务能力"), false);
    assert.equal(html.includes("company-profile"), false);
    assert.equal(html.includes("company-strengths"), false);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("visual keywords field is a 500 character adaptive textarea", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const html = await fetch(`${app.baseUrl}/`).then((res) => res.text());
    const css = await fetch(`${app.baseUrl}/styles.css`).then((res) => res.text());
    const appJs = await fetch(`${app.baseUrl}/app.js`).then((res) => res.text());

    const visualKeywordsField = html.match(/<textarea[\s\S]*?id="visual-keywords"[\s\S]*?<\/textarea>/)?.[0] || "";
    assert.ok(visualKeywordsField);
    assert.match(visualKeywordsField, /maxlength="500"/);
    assert.match(visualKeywordsField, /auto-resize-textarea/);
    assert.match(visualKeywordsField, /visual-keywords-field/);
    assert.doesNotMatch(html, /<input[^>]+id="visual-keywords"/);

    assert.match(css, /\.visual-keywords-field/);
    assert.match(css, /overflow:\s*hidden/);
    assert.match(appJs, /resizeAutoTextareas/);
    assert.match(appJs, /scrollHeight/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("poster image generation is configured for three parallel real model results", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const html = await fetch(`${app.baseUrl}/`).then((res) => res.text());
    assert.match(html, /id="ai-result-gallery"/);
    assert.equal((html.match(/data-ai-result-slot/g) || []).length, 3);
    assert.equal((html.match(/data-ai-download/g) || []).length, 3);
    assert.match(html, /id="image-lightbox"/);
    assert.match(html, /id="lightbox-download"/);

    const appJs = await fetch(`${app.baseUrl}/app.js`).then((res) => res.text());
    assert.match(appJs, /POSTER_IMAGE_COUNT\s*=\s*3/);
    assert.match(appJs, /Promise\.all/);
    assert.doesNotMatch(appJs, /setInterval/);
    assert.doesNotMatch(appJs, /elapsedSeconds/);
    assert.doesNotMatch(appJs, /Math\.min\(88/);
    assert.match(appJs, /getPosterTypeConfig/);
    assert.match(appJs, /typePrompt/);
    assert.match(appJs, /openImageLightbox/);
    assert.match(appJs, /downloadAiImageAt/);
    assert.match(appJs, /titleFont/);
    assert.match(appJs, /subtitleFont/);
    assert.match(appJs, /5504x3040/);
    assert.match(appJs, /4096x2304/);
    assert.match(appJs, /3040x5504/);
    assert.doesNotMatch(appJs, /companyProfileInput/);
    assert.doesNotMatch(appJs, /companyStrengthsInput/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("poster form exposes 4K image output size and forwards it to generation requests", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const html = await fetch(`${app.baseUrl}/`).then((res) => res.text());
    assert.match(html, /id="image-resolution"/);
    assert.match(html, /<option value="4K" selected>/);

    const appJs = await fetch(`${app.baseUrl}/app.js`).then((res) => res.text());
    assert.match(appJs, /const imageResolutionInput = document\.getElementById\("image-resolution"\)/);
    assert.match(appJs, /imageResolution: imageResolutionInput\.value/);
    assert.match(appJs, /size: data\.imageResolution \|\| getImageApiSize/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("poster prompt keeps date and location in a bottom information bar", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const appJs = await fetch(`${app.baseUrl}/app.js`).then((res) => res.text());
    assert.match(appJs, /文字安全区/);
    assert.match(appJs, /顶部安全区/);
    assert.match(appJs, /不要贴顶/);
    assert.match(appJs, /不要裁切/);
    assert.match(appJs, /底部信息栏/);
    assert.match(appJs, /左下角/);
    assert.match(appJs, /不要放在画面中部/);
    assert.match(appJs, /不要压住主视觉/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("image prompt refinement endpoint preserves user information and text placement rules", async () => {
  const ark = await startMockArk({
    chatContent: () => JSON.stringify({
      prompt:
        "专业海报 prompt：老年马拉松，2026.05.18，上海滨江绿地 A 区，Urban Weekends，顶部安全区内放标题，底部信息栏放日期地点。",
    }),
  });
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/api/refine-image-prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "老年马拉松 活动海报",
        fields: {
          title: "老年马拉松",
          subtitle: "岁月是勋章，步履不停歇",
          date: "2026.05.18",
          location: "上海滨江绿地 A 区",
          brandName: "Urban Weekends",
          posterTypeLabel: "主 KV",
        },
      }),
    });

    assert.equal(response.status, 200);
    const payload = await response.json();
    assert.match(payload.prompt, /老年马拉松/);
    assert.match(payload.prompt, /2026\.05\.18/);
    assert.match(payload.prompt, /上海滨江绿地 A 区/);
    assert.match(payload.prompt, /顶部安全区/);
    assert.match(payload.prompt, /底部信息栏/);

    assert.equal(ark.calls.chat.length, 1);
    const chatRequest = JSON.stringify(ark.calls.chat[0]);
    assert.match(chatRequest, /不得丢失/);
    assert.match(chatRequest, /老年马拉松/);
    assert.match(chatRequest, /2026\.05\.18/);
    assert.match(chatRequest, /上海滨江绿地 A 区/);
    assert.match(chatRequest, /顶部安全区/);
    assert.match(chatRequest, /底部信息栏/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("poster image generation refines the assembled prompt before image requests", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const appJs = await fetch(`${app.baseUrl}/app.js`).then((res) => res.text());
    assert.match(appJs, /async function refineImagePrompt/);
    assert.match(appJs, /\/api\/refine-image-prompt/);
    assert.match(appJs, /const refinedPrompt = await refineImagePrompt\(prompt, data\)/);
    assert.match(appJs, /requestAiImage\(refinedPrompt\.prompt, data, index\)/);
  } finally {
    await app.close();
    await ark.close();
  }
});

test("image generation requests 4K output without visible AI watermark", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/api/generate-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "commercial poster visual",
        size: "4K",
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(ark.calls.images.length, 1);
    assert.equal(ark.calls.images[0].size, "4K");
    assert.equal(ark.calls.images[0].watermark, false);
  } finally {
    await app.close();
    await ark.close();
  }
});
