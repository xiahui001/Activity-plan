import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..", "..");
const nodeBin = process.execPath;
const defaultNodePath =
  process.env.NODE_PATH ||
  "C:\\Users\\Mia\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules";

const defaultActivityFields = {
  subtitle: "把周末交给城市绿地和好音乐",
  highlights: "自然露营氛围 / 乐队现场 / 手作市集 / 轻社交打卡",
  theme: "城市绿洲露营",
  brandPrimary: "#2f8f6b",
  brandAccent: "#f4d35e",
  visualKeywords: "城市绿洲、自然材质、帐篷光影、松弛感人群、明亮社交氛围",
};

function json(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolveBody(body));
    request.on("error", reject);
  });
}

export async function startMockArk(options = {}) {
  const calls = {
    chat: [],
    images: [],
    threeDCreate: [],
    threeDQuery: [],
  };

  const server = createServer(async (request, response) => {
    if (request.method === "POST" && request.url === "/chat/completions") {
      const payload = JSON.parse(await readRequestBody(request));
      calls.chat.push(payload);
      const content =
        typeof options.chatContent === "function"
          ? options.chatContent(payload, calls)
          : options.chatContent || JSON.stringify(defaultActivityFields);
      json(response, 200, { choices: [{ message: { content } }] });
      return;
    }

    if (request.method === "POST" && request.url === "/images/generations") {
      const payload = JSON.parse(await readRequestBody(request));
      calls.images.push(payload);
      const body =
        typeof options.imageResponse === "function"
          ? options.imageResponse(payload, calls.images.length, calls)
          : options.imageResponse || { data: [{ b64_json: Buffer.from(`image-${calls.images.length}`).toString("base64") }] };
      json(response, 200, body);
      return;
    }

    if (request.method === "POST" && request.url === "/contents/generations/tasks") {
      const payload = JSON.parse(await readRequestBody(request));
      calls.threeDCreate.push(payload);
      json(response, 200, options.threeDCreateResponse || { id: "test-3d-task", status: "queued" });
      return;
    }

    if (request.method === "GET" && request.url?.startsWith("/contents/generations/tasks/")) {
      calls.threeDQuery.push(request.url);
      json(response, 200, options.threeDQueryResponse || { id: "test-3d-task", status: "succeeded", file_url: "" });
      return;
    }

    json(response, 404, { error: "not found" });
  });

  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    calls,
    close: () => new Promise((resolveClose) => server.close(resolveClose)),
  };
}

export async function waitForHealth(baseUrl, timeoutMs = 6000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 150));
  }
  throw lastError || new Error("server did not become healthy");
}

export async function startAppServer(arkBaseUrl, env = {}) {
  const port = 5200 + Math.floor(Math.random() * 1000);
  const server = spawn(nodeBin, ["server.mjs"], {
    cwd: root,
    env: {
      ...process.env,
      NODE_PATH: defaultNodePath,
      PORT: String(port),
      ARK_BASE_URL: arkBaseUrl,
      ARK_API_KEY: "test-key",
      ARK_TEXT_MODEL: "test-text-model",
      ARK_IMAGE_MODEL: "test-image-model",
      ARK_3D_MODEL: "test-3d-model",
      ARK_3D_CREATE_ENDPOINT: `${arkBaseUrl}/contents/generations/tasks`,
      ARK_3D_QUERY_ENDPOINT: `${arkBaseUrl}/contents/generations/tasks`,
      ...env,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  const stdout = [];
  const stderr = [];
  server.stdout.on("data", (chunk) => stdout.push(String(chunk)));
  server.stderr.on("data", (chunk) => stderr.push(String(chunk)));

  const baseUrl = `http://127.0.0.1:${port}`;
  try {
    await waitForHealth(baseUrl);
  } catch (error) {
    if (!server.killed) server.kill();
    throw new Error(`${error.message}\nSTDOUT:\n${stdout.join("")}\nSTDERR:\n${stderr.join("")}`);
  }

  return {
    baseUrl,
    stdout,
    stderr,
    close: async () => {
      if (!server.killed) server.kill();
      await once(server, "exit").catch(() => {});
    },
  };
}

export async function pollProposalJob(baseUrl, jobId, options = {}) {
  const intervalMs = options.intervalMs || 100;
  const timeoutMs = options.timeoutMs || 15000;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const response = await fetch(`${baseUrl}/api/proposal-job?id=${encodeURIComponent(jobId)}&t=${Date.now()}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload.error || `proposal job polling failed: ${response.status}`);
    }
    if (payload.job?.status === "done") {
      return payload.job.result;
    }
    if (payload.job?.status === "error") {
      throw new Error(payload.job.error || payload.job.message || "proposal job failed");
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, intervalMs));
  }

  throw new Error(`proposal job ${jobId} did not finish within ${timeoutMs}ms`);
}
