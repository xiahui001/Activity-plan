import { test } from "node:test";
import assert from "node:assert/strict";

import { pollProposalJob, startAppServer, startMockArk } from "./helpers/app-server.mjs";

function buildProposalText(slideCount = 13) {
  const slideTitles = [
    "封面",
    "项目理解",
    "策划策略与主题方向",
    "活动概况",
    "活动概况总结",
    "主题创意与活动亮点",
    "区域规划与动线设计",
    "流程规划",
    "重点环节设计",
    "舞美美陈与物料设备",
    "宣发引流方案",
    "执行保障与风险预案",
    "报价/预算框架与预期效果",
  ];

  const slides = slideTitles.slice(0, slideCount).map((title, index) => {
    const page = index + 1;
    return `===SLIDE ${page}===
SECTION: ${page < 4 ? "策划思路" : page < 8 ? "活动概览" : page < 11 ? "环节介绍" : "活动宣传"}
TITLE: ${title}
CORE: ${title}的核心判断
BODY:
- ${title}要点一
- ${title}要点二
- ${title}要点三
IMAGE_PROMPT: ${title} 16:9 商业汇报视觉，无文字水印
LAYOUT: 图文汇报版式
EXECUTION: 按现场执行闭环推进
VISUAL_PRIORITY: ${[1, 4, 10].includes(page) ? "true" : "false"}
===END_SLIDE===`;
  });

  return `DECK_TITLE: 年度品牌招商峰会活动方案
DECK_SUBTITLE: 品牌势能提升与招商转化
DECK_THEME: 年度品牌招商峰会
DECK_SLOGAN: 让品牌现场成交
STYLE_RATIONALE: 高端商务汇报风格适合甲方路演

${slides.join("\n\n")}`;
}

function buildProposalInput() {
  return {
    workflow: { stage: "full" },
    templatePreset: {
      id: "premium-business",
      name: "高端商务",
      summary: "正式汇报",
      structure: "四章节",
      visual: "高级商务",
      promptCue: "克制高级",
    },
    activityPromptPreset: {
      id: "beauty",
      name: "美业大健康微商活动号",
      proposalPrompt: "美业峰会、招商会、品牌沙龙。",
      imagePromptTemplate: "高端峰会舞美现场，真实材质，商业摄影。",
      sceneFocus: ["主舞台", "签到区", "洽谈区"],
    },
    activityAccount: "beauty",
    clientIndustry: "美业大健康品牌",
    eventTitle: "年度品牌招商峰会",
    eventSubtitle: "品牌势能提升与招商转化活动方案",
    themeDirection: "年度品牌招商峰会",
    eventObjective: "提升品牌势能，完成招商转化。",
    eventTime: "2026年6月",
    eventLocation: "室内会议厅",
    activityForm: "品牌招商峰会 + 产品体验 + 签约转化",
    activityExecution: "一天完成签到、主讲、互动、签约和复盘。",
    budgetRange: "10-30万",
    targetAudience: "品牌代理商、意向加盟客户",
    headcount: "200人",
    venueType: "室内会议厅 + 签到展示区 + 洽谈区",
    needStage: "需要",
    needDisplay: "需要",
    needPromotion: "需要",
    proposalStyle: "高端商务型",
    companyCapability: "活动策划、舞美搭建、自有设备、自有执行团队",
    outputOptions: {
      generateAllImages: false,
      includeBuildPlan: true,
      includeRunbookPlan: true,
    },
    threeD: { enabled: false },
  };
}

test("proposal page keeps production input fields and optional output checkboxes visible", async () => {
  const ark = await startMockArk();
  const app = await startAppServer(ark.url);
  try {
    const response = await fetch(`${app.baseUrl}/proposal.html`);
    assert.equal(response.status, 200);
    const html = await response.text();

    for (const id of [
      "key-visual-reference",
      "event-title",
      "event-subtitle",
      "proposal-style",
      "venue-map-reference",
      "execution-flow",
      "execution-program",
      "execution-shooting",
      "execution-operation",
      "generate-build-plan",
      "generate-runbook-plan",
    ]) {
      assert.match(html, new RegExp(`id="${id}"`));
    }
  } finally {
    await app.close();
    await ark.close();
  }
});

test("selected build and runbook options append slides and generate only their AI images when full deck images are off", async () => {
  const ark = await startMockArk({
    chatContent: buildProposalText(),
    imageResponse: (payload, index) => ({
      data: [{ b64_json: Buffer.from(`image-${index}-${payload.prompt}`).toString("base64") }],
    }),
  });
  const app = await startAppServer(ark.url);
  try {
    const startResponse = await fetch(`${app.baseUrl}/api/generate-proposal-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: buildProposalInput(),
        stage: "final",
        generateImages: false,
      }),
    });

    assert.equal(startResponse.status, 202);
    const started = await startResponse.json();
    const result = await pollProposalJob(app.baseUrl, started.job.id, { intervalMs: 30, timeoutMs: 8000 });
    const slides = result.proposal.slides;

    assert.equal(result.proposal.stage, "final");
    assert.ok(slides.some((slide) => slide.title === "活动搭建方案"));
    assert.ok(slides.some((slide) => slide.title === "活动统筹方案"));
    assert.equal(ark.calls.images.length, 6);
    const generatedPrompts = ark.calls.images.map((call) => call.prompt).join("\n");
    assert.match(generatedPrompts, /搭建/);
    assert.match(generatedPrompts, /统筹/);
    assert.doesNotMatch(generatedPrompts, /报价\/预算框架/);

    const imageSlides = slides.filter((slide) => slide.imageBase64 || slide.imageUrl).map((slide) => slide.title);
    assert.deepEqual(imageSlides.sort(), ["活动搭建方案", "活动统筹方案"].sort());
  } finally {
    await app.close();
    await ark.close();
  }
});
