# 海报生成助手

一个适合活动策划使用的本地网页工具，用来整理活动信息、生成宣传文案、输出 AI 海报提示词、实时预览版式，并通过豆包 Ark 图片接口直接生成海报图。

## 方案生成助手

新增独立入口：[proposal.html](C:\工作\海报助手\proposal.html)。

启动本地服务后，打开 [http://localhost:3000/proposal.html](http://localhost:3000/proposal.html)，可输入甲方行业、活动目的、主题方向、预算、人数、场地、舞台/美陈/宣发需求，一键生成 10-12 页图文版活动方案，并导出为 `PPTX`。

大模型接入使用豆包 Ark：

```powershell
$env:ARK_API_KEY="你的豆包 Ark API Key"
.\start-server.ps1
```

默认图片模型为 `doubao-seedream-5-0-260128`，每版方案会优先生成 3-5 张核心 AI 图，其他页面保留详细概念图提示词作为占位。

## 当前能力

- 录入活动名称、副标题、时间、地点、亮点、按钮文案
- 配置品牌名、Logo 文字、Logo 图片、二维码图片、品牌主色和强调色
- 配置公司主营介绍和核心服务优势
- 配置传播场景和引流利益点，生成更适合朋友圈宣发的内容
- 自动生成宣传文案
- 自动生成活动方案草案
- 自动生成适合图像模型使用的海报提示词
- 预览海报版式并导出为 `SVG` / `PNG`
- 调用豆包 Ark 图片接口直接生成 AI 海报
- 本地保存、载入、导入、导出活动模板

## 文件说明

- [index.html](C:\工作\海报助手\index.html)：页面结构
- [styles.css](C:\工作\海报助手\styles.css)：界面与海报视觉样式
- [app.js](C:\工作\海报助手\app.js)：表单联动、模板管理、AI 出图前端逻辑
- [server.mjs](C:\工作\海报助手\server.mjs)：本地静态服务、豆包 Ark 文案生成和图片代理
- [start-server.ps1](C:\工作\海报助手\start-server.ps1)：PowerShell 启动脚本
- [start-server.cmd](C:\工作\海报助手\start-server.cmd)：双击启动入口

## 启动方式

1. 打开 PowerShell，进入 `C:\工作\海报助手`
2. 设置豆包 Ark API Key

```powershell
$env:ARK_API_KEY="你的豆包 Ark API Key"
```

3. 启动本地服务

```powershell
.\start-server.ps1
```

4. 浏览器打开 [http://localhost:3000](http://localhost:3000)

## 使用方式

1. 左侧填写活动信息、品牌信息和视觉关键词
2. 点击 `刷新文案` 获取宣传文案和 AI 提示词
3. 如需手动改 prompt，可直接修改 `生成提示词`
4. 点击 `AI 生成海报`
5. 在右侧 `AI 海报生成结果` 中查看并下载结果
6. 如需保留当前活动配置，可点击 `保存模板`

## 说明

- 当前 AI 出图通过本地服务代理调用豆包 Ark，因此不会把 API Key 暴露到浏览器页面
- 方案生成页会使用豆包文本模型生成 10-12 页方案，并使用 `doubao-seedream-5-0-260128` 生成核心配图
- 如果 AI 出图失败，优先检查：
  - `ARK_API_KEY` 是否已在当前 PowerShell 会话设置
  - 本地服务是否已经启动
  - 豆包 Ark 账户是否具备对应文本模型和图片模型权限

## 接口依据

本项目按豆包 Ark 的 OpenAI-compatible 调用方式接入，服务端读取 `ARK_API_KEY`，前端不保存密钥。

## 后续可继续扩展

- 支持一次生成多张候选海报
- 支持把 AI 生成图再叠加当前二维码和 Logo
- 增加活动模板分组、品牌库和批量出图

## Baseline Regression Gate

Before changing poster generation, prompt assembly, Ark proxy routes, or proposal export behavior, run:

```powershell
npm.cmd run test:baseline
```

This baseline protects the current working surface:

- `POST /api/generate-activity-fields` returns usable poster fields instead of 405.
- Poster generation keeps three parallel image requests.
- Image requests support 4K output and send `watermark: false`.
- Date and location stay in a bottom information bar in the fixed image prompt.
- Proposal regression coverage still passes.

Run the baseline before and after related changes. For a manually verified checkpoint, tag it with a date-based name such as `baseline-2026-05-12-tested`.
