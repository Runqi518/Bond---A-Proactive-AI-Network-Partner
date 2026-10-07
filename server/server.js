/**
 * Bond - AI 关系管理助手
 * 轻量全栈原型：Node.js 原生 http server（无需 npm install）
 * - 提供 /api/* REST 接口，数据持久化到 server/data/db.json
 * - 静态托管 public/ 目录作为前端
 *
 * 启动：node server/server.js
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const url = require("url");

const PORT = process.env.PORT || 4173;
const DATA_DIR = path.join(__dirname, "data");
const DB_PATH = path.join(DATA_DIR, "db.json");
const SEED_PATH = path.join(DATA_DIR, "seed.json");
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// ---------- 数据层 ----------

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    const seed = fs.readFileSync(SEED_PATH, "utf-8");
    fs.writeFileSync(DB_PATH, seed);
  }
}

function readDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function newId(prefix) {
  return `${prefix}_${crypto.randomBytes(5).toString("hex")}`;
}

// ---------- 极简 "AI" 生成逻辑（无外部 API key，规则 + 模板模拟 Persona / 引导鼓励机制）----------

const OPENERS = [
  (p) => `嘿，最近还好吗？上次聊到你在关注${firstTopic(p)}，有什么新进展吗？`,
  (p) => `好久没聊啦，最近在忙${firstTopic(p)}相关的事吗？`,
  (p) => `突然想到你，最近关于${firstTopic(p)}有什么新想法吗？`,
];

const AFFIRMATIONS = [
  "这个追问很自然，继续保持～",
  "这是一个很好的切入点。",
  "你们之间已经建立了一个不错的共同话题。",
  "这个提问方式很真诚，值得记住。",
];

const BRIDGE_SUGGESTIONS = [
  (p) => `可以试着分享一件你最近和「${firstTopic(p)}」相关的小经历，拉近距离。`,
  (p) => `或许可以问问 TA 对「${firstTopic(p)}」最近有没有新的看法。`,
  (p) => `可以从「${p.commonGround || "你们的共同点"}」切入，聊得会更自然。`,
];

const AGENT_REPLY_POOL = [
  (p) => `最近确实在想「${firstTopic(p)}」这件事，你怎么看？`,
  (p) => `说到这个，我倒是想到了 ${p.name.split(" ")[0]} 之前提过的一个想法，你有兴趣听听吗？`,
  (p) => `挺有意思的，你是怎么开始关注这个的？`,
  (p) => `如果之后有机会，要不要找个时间当面聊聊？`,
  (p) => `这个话题我们上次好像也提到过一点，可以继续展开说说。`,
];

function firstTopic(person) {
  const cares = (person.caresAbout || "").split(/[、,，.]/).filter(Boolean);
  return cares[0] || "最近在忙的事";
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProfileFromInput(input) {
  const bio = input.bio || "";
  const name = input.name || "TA";
  const howMet = input.howMet || "";
  const goalTags = input.goalTags || [];
  const freeGoal = input.freeGoal || "";

  // 极简启发式抽取：真实产品中由 LLM 结构化输出替代
  const whoHeIs =
    bio.trim().length > 0
      ? bio.trim().slice(0, 60)
      : `通过「${howMet || "共同的场合"}」认识的 ${name}。`;

  const caresAbout =
    bio.trim().length > 0
      ? bio
      : goalTags.length
      ? `可能关注：${goalTags.join("、")}`
      : "还需要更多互动来了解 TA 关注什么";

  const commonGround = freeGoal
    ? `你希望这段关系能帮你：${freeGoal}`
    : "共同点还在建立中，多聊几次会更清晰";

  return { whoHeIs, caresAbout, commonGround };
}

function generateOpeningMessage(person) {
  return pick(OPENERS)(person);
}

function generateAgentReply(person, history, userText) {
  const trimmed = (userText || "").trim();
  const isHesitant =
    trimmed.length === 0 ||
    trimmed.length <= 2 ||
    /不知道|随便|嗯|啊这|额/.test(trimmed);

  let text = pick(AGENT_REPLY_POOL)(person);
  let hint = null;
  let affirmation = null;

  if (isHesitant) {
    hint = pick(BRIDGE_SUGGESTIONS)(person);
    text = "没关系，我们可以从一个小话题开始～";
  } else if (Math.random() < 0.35) {
    affirmation = pick(AFFIRMATIONS);
  }

  return { text, hint, affirmation };
}

function generateReflection(person, rawText) {
  const text = rawText || "";
  const whatWentWell =
    text.length > 0
      ? `你主动聊到了「${firstTopic(person)}」相关的话题，这是一次自然的连接。`
      : "你完成了一次真实的互动，这本身就值得被记录。";

  const tryNextTime = /没|不|担心|紧张/.test(text)
    ? "下次可以提前准备 1-2 个开放式问题，减少现场的紧张感。"
    : "下次可以试着多追问一层细节，让对话更深入。";

  const confidenceNote = "这是一次可以被记住的练习——你已经比上一次更主动了一点。";

  // 极简关键词抽取，模拟 Promise / Follow-up 结构化解析
  let promise = null;
  let followUp = null;
  if (/介绍|推荐/.test(text)) promise = `${person.name} 提到可以做一个介绍`;
  if (/发|分享|资料|论文|paper/i.test(text)) followUp = "发送相关资料 / 论文";

  return { whatWentWell, tryNextTime, confidenceNote, promise, followUp };
}

// ---------- 路由处理 ----------

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf-8")));
      } catch (e) {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function computeStatus(person, db) {
  // 简化版关系状态机：Preparing / Follow up / Growing / Maintain
  const now = new Date();
  const upcoming = db.events.some(
    (e) =>
      e.personId === person.id &&
      new Date(e.date) >= new Date(now.toDateString()) &&
      (new Date(e.date) - now) / 86400000 <= 7
  );
  if (upcoming) return "Preparing";

  const hasFollowUp = db.todos.some(
    (t) => t.personId === person.id && t.type === "follow_up" && !t.done
  );
  if (hasFollowUp) return "Follow up";

  const msgs = db.messages[person.id] || [];
  const lastTs = msgs.length ? new Date(msgs[msgs.length - 1].ts) : new Date(person.createdAt);
  const days = (now - lastTs) / 86400000;
  if (days <= 30) return "Growing";
  return "Maintain";
}

function computeMilestones(db) {
  const milestones = [];
  const totalPeople = db.people.length;
  if (totalPeople >= 1)
    milestones.push({ id: "m_first_agent", label: "创建了第一个 Agent", done: true });

  const totalMessages = Object.values(db.messages).reduce((a, m) => a + m.length, 0);
  if (totalMessages > 0)
    milestones.push({ id: "m_first_chat", label: "完成了第一次陪伴对话", done: true });

  if (db.reflections.length > 0)
    milestones.push({ id: "m_first_reflection", label: "完成了第一次会后复盘", done: true });

  const doneFollowUps = db.todos.filter((t) => t.type === "follow_up" && t.done).length;
  if (doneFollowUps > 0)
    milestones.push({
      id: "m_followup",
      label: `已完成 ${doneFollowUps} 次 Follow-up`,
      done: true,
    });

  const meetingEvents = db.events.filter((e) => e.type === "meeting").length;
  if (meetingEvents > 0)
    milestones.push({
      id: "m_meeting",
      label: `安排了 ${meetingEvents} 次真实见面`,
      done: true,
    });

  return milestones;
}

const routes = [];
function route(method, pattern, handler) {
  const keys = [];
  const regex = new RegExp(
    "^" +
      pattern.replace(/:[^/]+/g, (m) => {
        keys.push(m.slice(1));
        return "([^/]+)";
      }) +
      "$"
  );
  routes.push({ method, regex, keys, handler });
}

// People
route("GET", "/api/people", async (req, res, params, db) => {
  const list = db.people.map((p) => ({ ...p, status: computeStatus(p, db) }));
  sendJson(res, 200, list);
});

route("POST", "/api/people", async (req, res, params, db) => {
  const body = await readBody(req);
  const profile = generateProfileFromInput(body);
  const person = {
    id: newId("p"),
    name: body.name || "未命名",
    identity: body.identity || "",
    howMet: body.howMet || "",
    avatarColor: pick(["#F2B79A", "#B9D6EF", "#F6E2B3", "#CBE3C9", "#E3C9EE"]),
    avatarEmoji: pick(["🙂", "🧑🏻‍💻", "👩🏻‍🎨", "🧑🏻‍🚀", "👨🏻‍🏫", "👩🏻‍🔬"]),
    goalTags: body.goalTags || [],
    freeGoal: body.freeGoal || "",
    bio: body.bio || "",
    ...profile,
    createdAt: new Date().toISOString(),
  };
  db.people.push(person);
  db.messages[person.id] = [];
  writeDb(db);
  sendJson(res, 201, person);
});

route("GET", "/api/people/:id", async (req, res, params, db) => {
  const person = db.people.find((p) => p.id === params.id);
  if (!person) return sendJson(res, 404, { error: "not found" });
  sendJson(res, 200, { ...person, status: computeStatus(person, db) });
});

route("DELETE", "/api/people/:id", async (req, res, params, db) => {
  db.people = db.people.filter((p) => p.id !== params.id);
  delete db.messages[params.id];
  db.events = db.events.filter((e) => e.personId !== params.id);
  db.todos = db.todos.filter((t) => t.personId !== params.id);
  db.reflections = db.reflections.filter((r) => r.personId !== params.id);
  writeDb(db);
  sendJson(res, 200, { ok: true });
});

// Messages / Chat
route("GET", "/api/messages/:personId", async (req, res, params, db) => {
  const person = db.people.find((p) => p.id === params.personId);
  if (!person) return sendJson(res, 404, { error: "not found" });
  let msgs = db.messages[params.personId] || [];
  if (msgs.length === 0) {
    const opener = {
      id: newId("m"),
      sender: "agent",
      text: generateOpeningMessage(person),
      ts: new Date().toISOString(),
    };
    msgs = [opener];
    db.messages[params.personId] = msgs;
    writeDb(db);
  }
  sendJson(res, 200, msgs);
});

route("POST", "/api/messages/:personId", async (req, res, params, db) => {
  const person = db.people.find((p) => p.id === params.personId);
  if (!person) return sendJson(res, 404, { error: "not found" });
  const body = await readBody(req);
  const history = db.messages[params.personId] || [];

  const userMsg = {
    id: newId("m"),
    sender: "user",
    text: body.text || "",
    ts: new Date().toISOString(),
  };
  history.push(userMsg);

  const { text, hint, affirmation } = generateAgentReply(person, history, body.text);
  const agentMsg = {
    id: newId("m"),
    sender: "agent",
    text,
    hint,
    affirmation,
    ts: new Date().toISOString(),
  };
  history.push(agentMsg);

  db.messages[params.personId] = history;
  writeDb(db);
  sendJson(res, 200, { userMsg, agentMsg });
});

// Events / Calendar
route("GET", "/api/events", async (req, res, params, db, query) => {
  let list = db.events;
  if (query.month) {
    list = list.filter((e) => e.date.startsWith(query.month));
  }
  const withNames = list.map((e) => ({
    ...e,
    personName: (db.people.find((p) => p.id === e.personId) || {}).name || null,
  }));
  sendJson(res, 200, withNames);
});

route("POST", "/api/events", async (req, res, params, db) => {
  const body = await readBody(req);
  const event = {
    id: newId("e"),
    personId: body.personId || null,
    date: body.date,
    time: body.time || "",
    title: body.title || "",
    type: body.type || "meeting",
  };
  db.events.push(event);
  writeDb(db);
  sendJson(res, 201, event);
});

route("DELETE", "/api/events/:id", async (req, res, params, db) => {
  db.events = db.events.filter((e) => e.id !== params.id);
  writeDb(db);
  sendJson(res, 200, { ok: true });
});

// Todos (Today)
route("GET", "/api/todos", async (req, res, params, db) => {
  const list = db.todos
    .filter((t) => !t.done)
    .map((t) => ({
      ...t,
      personName: (db.people.find((p) => p.id === t.personId) || {}).name || null,
      avatarEmoji: (db.people.find((p) => p.id === t.personId) || {}).avatarEmoji || "🙂",
      avatarColor: (db.people.find((p) => p.id === t.personId) || {}).avatarColor || "#eee",
    }));
  sendJson(res, 200, list);
});

route("POST", "/api/todos", async (req, res, params, db) => {
  const body = await readBody(req);
  const todo = {
    id: newId("t"),
    personId: body.personId,
    type: body.type || "follow_up",
    title: body.title || "",
    dueDate: body.dueDate || new Date().toISOString().slice(0, 10),
    done: false,
  };
  db.todos.push(todo);
  writeDb(db);
  sendJson(res, 201, todo);
});

route("POST", "/api/todos/:id/done", async (req, res, params, db) => {
  const todo = db.todos.find((t) => t.id === params.id);
  if (!todo) return sendJson(res, 404, { error: "not found" });
  todo.done = true;
  writeDb(db);
  sendJson(res, 200, todo);
});

// Reflections
route("GET", "/api/reflections", async (req, res, params, db) => {
  const list = db.reflections.map((r) => ({
    ...r,
    personName: (db.people.find((p) => p.id === r.personId) || {}).name || null,
  }));
  sendJson(res, 200, list.reverse());
});

route("GET", "/api/reflections/:personId", async (req, res, params, db) => {
  const list = db.reflections.filter((r) => r.personId === params.personId);
  sendJson(res, 200, list.reverse());
});

route("POST", "/api/reflections", async (req, res, params, db) => {
  const body = await readBody(req);
  const person = db.people.find((p) => p.id === body.personId);
  if (!person) return sendJson(res, 404, { error: "person not found" });

  const analysis = generateReflection(person, body.text || "");
  const reflection = {
    id: newId("r"),
    personId: person.id,
    rawText: body.text || "",
    ...analysis,
    createdAt: new Date().toISOString(),
  };
  db.reflections.push(reflection);

  // 自动生成 Follow-up 待办（对齐 PRD 2.2.5）
  if (analysis.followUp) {
    db.todos.push({
      id: newId("t"),
      personId: person.id,
      type: "follow_up",
      title: analysis.followUp,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      done: false,
    });
  }

  writeDb(db);
  sendJson(res, 201, reflection);
});

route("GET", "/api/confidence-journey", async (req, res, params, db) => {
  sendJson(res, 200, computeMilestones(db));
});

// Preferences (Me)
route("GET", "/api/preferences", async (req, res, params, db) => {
  sendJson(res, 200, db.preferences);
});

route("POST", "/api/preferences", async (req, res, params, db) => {
  const body = await readBody(req);
  db.preferences = { ...db.preferences, ...body };
  writeDb(db);
  sendJson(res, 200, db.preferences);
});

// ---------- 静态文件服务 ----------

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function serveStatic(req, res, pathname) {
  let filePath = path.join(PUBLIC_DIR, pathname === "/" ? "index.html" : pathname);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), (err2, data2) => {
        if (err2) {
          res.writeHead(404);
          return res.end("Not found");
        }
        res.writeHead(200, { "Content-Type": MIME[".html"] });
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(data);
  });
}

// ---------- Server ----------

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const pathname = parsed.pathname;

  if (pathname.startsWith("/api/")) {
    const db = readDb();
    for (const r of routes) {
      if (r.method !== req.method) continue;
      const m = pathname.match(r.regex);
      if (!m) continue;
      const params = {};
      r.keys.forEach((k, i) => (params[k] = decodeURIComponent(m[i + 1])));
      try {
        await r.handler(req, res, params, db, parsed.query);
      } catch (e) {
        console.error(e);
        sendJson(res, 500, { error: String(e) });
      }
      return;
    }
    return sendJson(res, 404, { error: "no such route" });
  }

  serveStatic(req, res, pathname);
});

ensureDb();
server.listen(PORT, () => {
  console.log(`\n  Bond 原型已启动: http://localhost:${PORT}\n`);
});
