const STORE_KEY = location.search.includes("test=1") ? "bond-mobile-test-v1" : "bond-mobile-v1";
const ASSET = "./assets/";
const seedPeople = [
  {
    id: "maya", name: "Maya Chen", role: "ex-Stripe Product Lead", initials: "MC", tone: "blue",
    tags: ["Advisory", "Coffee tomorrow"], how: "Met through a product community",
    about: "Product leader exploring advisory work and thoughtful partnerships.",
    goal: "Discuss a possible advisory relationship and product strategy.",
    meeting: "Tomorrow · 10:30 AM", place: "Blue Bottle Mint Plaza", photo: "chat-maya.png",
    preview: "Coffee catch-up tomorrow", reply: "That sounds promising. Which part would you like to explore first?",
    messages: [
      { by: "agent", text: "Looking forward to our coffee tomorrow, Riley. Should we start with the product direction or the partnership idea?" },
      { by: "me", text: "Let’s start with the product direction, then see where a partnership could fit." },
      { by: "agent", text: "Perfect. Tell me what you want people to feel when they use it." }
    ]
  },
  {
    id: "marcus", name: "Marcus Vance", role: "Climate Tech Angel Investor", initials: "MV", tone: "yellow",
    tags: ["Investor", "Follow up"], how: "Met at a climate technology dinner",
    about: "Angel investor focused on climate technology and disciplined execution.",
    goal: "Continue the discussion about climate technology and send the reading list.",
    meeting: "Tonight · 7:30 PM", place: "The Bar Room", photo: "chat-marcus.png",
    preview: "Reading list promised", reply: "I appreciate the clear follow-through. What stood out most to you?",
    messages: [
      { by: "agent", text: "Good to see you again, Riley. I’m curious how your thinking on the milestones has developed." },
      { by: "me", text: "I’ve put together a short reading list and a clearer path for the next phase." },
      { by: "agent", text: "That’s useful. Walk me through the first milestone." }
    ]
  },
  {
    id: "sarah", name: "Sarah Lin", role: "Lead Design Engineer", initials: "SL", tone: "pink",
    tags: ["Design", "Friday sync"], how: "Connected through a design systems workshop",
    about: "Design engineer interested in interaction details and tactile product experiences.",
    goal: "Align on interaction direction before the next design sync.",
    meeting: "Friday · 3:00 PM", place: "Studio 4", photo: "chat-sarah.png",
    preview: "Design sync on Friday", reply: "I like that direction. Could you show me one concrete interaction example?",
    messages: [
      { by: "agent", text: "For Friday’s sync, should we review the motion curve first or the haptic feedback?" },
      { by: "me", text: "Let’s test the motion curve on devices first, then tune the haptics." },
      { by: "agent", text: "Great. Bring two examples we can compare side by side." }
    ]
  },
  {
    id: "elena", name: "Elena Rostova", role: "Cognitive Systems Researcher", initials: "ER", tone: "green",
    tags: ["Research", "Reconnect"], how: "Met through an AI research community",
    about: "Researcher exploring privacy and on-device agent models.",
    goal: "Reconnect and compare ideas about agent memory.",
    meeting: "Sunday · 2:30 PM", place: "Courtyard café", photo: "chat-elena.png",
    preview: "Shared interest in agent models", reply: "That’s fascinating. How would you test the idea in practice?",
    messages: [
      { by: "agent", text: "It has been a while, Riley! Are you still thinking about on-device agent memory?" },
      { by: "me", text: "Always. I’d love to share a few new findings with you." },
      { by: "agent", text: "I’d like that. What surprised you the most?" }
    ]
  }
];
const actions = [
  { id: "maya-meeting", personId: "maya", color: "blue", label: "Happening soon · Next 48h", icon: "clock", description: "Coffee catch-up · Partnership discussion", meta: "Tomorrow, 10:30 AM · Blue Bottle Mint Plaza", primary: "Prepare rehearsal", task: "prepare" },
  { id: "marcus-draft", personId: "marcus", color: "yellow", label: "To follow up · Commitment", icon: "clock", description: "Send reading list on decentralized governance", meta: "Promised during dinner", primary: "Draft message", task: "draft" },
  { id: "elena-reconnect", personId: "elena", color: "green", label: "Cadence · 60d+ idle", icon: "clock", description: "Shared interest in agent models", meta: "Last connected 62 days ago", primary: "Reconnect", task: "reconnect" }
];
const calendarDays = [["Mon", "20"], ["Tue", "21"], ["Wed", "22"], ["Thu", "23"], ["Fri", "24"], ["Sat", "25"], ["Sun", "26"]];
const sarahSync = { id: "sarah-sync", personId: "sarah", color: "pink", label: "Design sync · Friday", icon: "clock", description: "Review the interaction direction together", meta: "May 24, 3:00 PM · Studio 4", primary: "Prepare rehearsal", task: "prepare" };
const sampleReflections = [
  { personId: "marcus", date: "May 14", text: "Dinner with Marcus clarified the next climate-tech milestone. I promised to send a focused reading list with two useful examples for his team." },
  { personId: "sarah", date: "May 17", text: "Sarah liked the lighter interaction direction. We agreed to test the chat flow before Friday’s design sync and compare notes." }
];
const freshState = () => ({ people: structuredClone(seedPeople), completed: [], dismissed: [], reflections: [] });
let data;
try {
  const saved = JSON.parse(localStorage.getItem(STORE_KEY));
  data = saved && Array.isArray(saved.people) ? saved : freshState();
} catch { data = freshState(); }
const ui = { tab: "today", screen: "tab", personId: null, origin: "people", returnOrigin: "people", mode: "chat", sheet: null, search: "", reflectionSearch: "", toast: "", showMoreActions: false, selectedDay: null };
const app = document.getElementById("app");

function save() { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
function esc(value) { return String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]); }
function person(id) { return data.people.find(p => p.id === id); }
function icon(name) {
  const paths = {
    today: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>',
    people: '<circle cx="8" cy="8" r="3"/><path d="M2 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M16 15c2.8 0 5 2.2 5 5"/>',
    me: '<circle cx="12" cy="7" r="3.5"/><path d="M4.5 21c0-4.2 3.3-7.5 7.5-7.5s7.5 3.3 7.5 7.5z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    back: '<path d="m15 5-7 7 7 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    chat: '<path d="M20 11.5c0 4.7-3.5 8-8.2 8-1.5 0-2.8-.3-4-.9L3 20l1.4-4.3A8 8 0 1 1 20 11.5Z"/>',
    refresh: '<path d="M20 6v6h-6M4 18v-6h6"/><path d="M18.2 9A7 7 0 0 0 6.1 6.4L4 9M5.8 15A7 7 0 0 0 17.9 17.6L20 15"/>',
    send: '<path d="M12 19V5m-7 7 7-7 7 7"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    x: '<path d="M5 5l14 14M19 5 5 19"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    note: '<path d="M5 4h14v16H5zM8 9h8M8 13h8M8 17h5"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 6-3 7-3 9h18c0-2-3-3-3-9ZM10 21h4"/>',
    flag: '<path d="M5 21V4m0 1c2.5-1.8 4.5 1.8 7 0s4.5-1.8 7 0v10c-2.5-1.8-4.5 1.8-7 0s-4.5-1.8-7 0"/>',
    shield: '<path d="M12 2 20 5v6c0 5-3.2 8.6-8 11-4.8-2.4-8-6-8-11V5l8-3Z"/><rect x="9" y="10.5" width="6" height="5.5" rx="1"/><path d="M10.5 10.5V9a1.5 1.5 0 0 1 3 0v1.5"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.note}</svg>`;
}
function avatar(p) { return `<span class="avatar ${esc(p.tone || "blue")}">${esc(p.initials || p.name.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase())}</span>`; }
function brandbar(add = false) { return `<div class="brandbar"><span class="bond-logo" role="img" aria-label="Bond"><svg viewBox="0 0 32 24" aria-hidden="true"><path d="M16 12c-3-4-5-6-8-6a6 6 0 0 0 0 12c3 0 5-2 8-6s5-6 8-6a6 6 0 0 1 0 12c-3 0-5-2-8-6Z" /></svg><span>bond</span></span><span class="spacer"></span><button class="round-btn" data-action="search" aria-label="Search">${icon("search")}</button>${add ? `<button class="round-btn" data-action="create" aria-label="Add person">${icon("plus")}</button>` : `<button class="round-btn" data-action="settings" aria-label="Settings">${icon("more")}</button>`}</div>`; }
function nav() { return `<nav class="bottom-nav" aria-label="Main navigation">${["today","people","me"].map(t=>`<button class="nav-item ${ui.tab===t?"active":""}" data-action="tab" data-tab="${t}" aria-current="${ui.tab===t?"page":"false"}"><span class="nav-icon">${icon(t)}</span><span>${t[0].toUpperCase()+t.slice(1)}</span></button>`).join("")}</nav>`; }
function actionCard(a) {
  const p=person(a.personId); if(!p || data.completed.includes(a.id) || data.dismissed.includes(a.id)) return "";
  const compactAction=a.task==="draft"
    ? `<button class="pill-button secondary complete-action" data-action="complete" data-id="${a.id}" aria-label="Mark done">${icon("check")}</button>`
    : `<button class="pill-button ghost secondary" data-action="${a.task==="reconnect"?"dismiss":"open-chat"}" data-id="${a.id}" data-person="${p.id}">${a.task==="reconnect"?"Dismiss":"Details"}</button>`;
  return `<article class="action-card ${a.color}"><div class="action-person">${avatar(p)}<div class="action-copy"><button class="action-name" data-action="open-chat" data-person="${p.id}">${esc(p.name)}</button><p class="action-desc">${esc(a.description)}</p></div></div><div class="action-buttons">${compactAction}</div></article>`;
}
function allActions() {
  const fromReflections=data.reflections.filter(r=>r.next).map((r,i)=>({
    id:`reflection-${i}`,personId:r.personId,color:"green",label:"Follow up · From reflection",
    icon:"clock",description:r.next,meta:`From your meeting notes · ${r.date}`,
    primary:"Draft message",task:"draft"
  }));
  return [...fromReflections.reverse(),...actions];
}
function todayCalendar() {
  return `<div class="today-calendar" role="group" aria-label="Week of May 20">${calendarDays.map(([day,date])=>`<button type="button" class="calendar-day ${ui.selectedDay===date?"selected":""}" data-action="select-day" data-day="${date}" aria-label="${day}, May ${date}" aria-pressed="${ui.selectedDay===date}"><span>${day}</span><strong>${date}</strong></button>`).join("")}</div>`;
}
function selectedDayActions() {
  const active = allActions();
  if (ui.selectedDay === "22") return active;
  if (ui.selectedDay === "23") return active.filter(a => a.id === "maya-meeting").map(a => ({ ...a, label: "Meeting today · 10:30 AM", meta: "May 23, 10:30 AM · Blue Bottle Mint Plaza" }));
  if (ui.selectedDay === "24") return [sarahSync];
  if (ui.selectedDay === "26") return active.filter(a => a.id === "elena-reconnect").map(a => ({ ...a, label: "Reconnect · Sunday", meta: "May 26, 2:30 PM · Courtyard café" }));
  return [];
}
function todayScreen() {
  const hasSelectedDay=Boolean(ui.selectedDay);
  const available=hasSelectedDay?selectedDayActions().filter(a=>!data.completed.includes(a.id)&&!data.dismissed.includes(a.id)):[];
  const shown=ui.showMoreActions?available:available.slice(0,2);
  const selectedLabel=calendarDays.find(([,date])=>date===ui.selectedDay)?.[0]||"Today";
  const cards=hasSelectedDay?`<div class="today-cards revealed" id="today-cards">${shown.map(actionCard).join("")}${available.length>2&&!ui.showMoreActions?`<button class="more-actions-toggle" data-action="show-more-actions">${available.length-2} more ${available.length-2===1?"action":"actions"} ↓</button>`:""}${!available.length?`<div class="empty today-empty"><h2>No actions for ${selectedLabel}, May ${ui.selectedDay}</h2><p>Choose another day to see what is coming up.</p></div>`:""}</div>`:"";
  return `<section class="screen with-nav today"><div class="today-hero"><img class="today-art" src="${ASSET}today-characters-transparent.png" alt="Bond artwork with three pastel cartoon characters" />${brandbar()}<h1 class="today-headline"><span>A little nudge</span><span>toward</span><span>someone you know.</span></h1>${todayCalendar()}</div>${cards}</section>${nav()}`;
}
function personCard(p) {
  return `<article class="person-card" data-action="open-chat" data-person="${esc(p.id)}" tabindex="0" role="button" aria-label="Open chat with ${esc(p.name)}"><div class="person-main">${avatar(p)}<div class="person-info"><div class="person-name">${esc(p.name)}</div><div class="person-role">${esc(p.role || p.how || "New connection")}</div></div><span class="chevron">${icon("chevron")}</span></div><div class="person-divider"></div><div class="person-bottom"><p class="person-preview">${esc(p.preview || p.messages?.at(-1)?.text || "Start a conversation")}</p><time class="person-time">${p.id==="maya"?"Tomorrow":p.id==="sarah"?"Friday":"Recent"}</time></div><div class="tag-list">${(p.tags||[]).slice(0,2).map(t=>`<span class="tag">${esc(t)}</span>`).join("")}</div></article>`;
}
function peopleScreen() {
  const q=ui.search.trim().toLowerCase();
  const shown=data.people.filter(p=>[p.name,p.role,p.how,...(p.tags||[])].join(" ").toLowerCase().includes(q));
  return `<section class="screen with-nav people">${brandbar(true)}<div class="people-intro"><div class="people-intro-top"><h1>People</h1><span class="sort-label">Conversations</span></div><label class="search-field">${icon("search")}<input id="people-search" type="search" placeholder="Search people or tags" value="${esc(ui.search)}" autocomplete="off" aria-label="Search people or tags" /></label></div><div class="people-list">${shown.length?shown.map(personCard).join(""):`<div class="empty"><h2>${data.people.length?"No matches yet":"Start with someone"}</h2><p>${data.people.length?"Try another name or tag.":"Add a person, then start chatting."}</p><button class="pill-button" data-action="create">Add person</button></div>`}</div></section>${nav()}`;
}
function meScreen() {
  const reflections = data.reflections.length ? data.reflections : sampleReflections;
  const q=ui.reflectionSearch.trim().toLowerCase();
  const shown=reflections.filter(r=>{const p=person(r.personId);return [p?.name,r.date,r.text].join(" ").toLowerCase().includes(q)}).slice().reverse().slice(0,4);
  return `<section class="screen with-nav me">${brandbar()}<div class="reflect-card"><h2>Reflect on a meeting</h2><p>Capture what happened and choose your next step.</p><div class="reflect-prompts"><p>When did you feel most connected?</p><p>What felt a little harder than expected?</p></div><div class="reflection-tools"><label class="reflection-search">${icon("search")}<input id="reflection-search" type="search" placeholder="Search reflections" value="${esc(ui.reflectionSearch)}" autocomplete="off" aria-label="Search reflections" /></label><button class="reflection-add" data-action="reflect" aria-label="Add new reflection draft">${icon("plus")}</button></div></div><section class="me-section reflections-section">${shown.length?shown.map(r=>{const p=person(r.personId);return `<article class="memory-card"><div class="memory-head"><strong>${esc(p?.name||"Person")}</strong><small>${esc(r.date)}</small></div><p>${esc(r.text)}</p></article>`}).join(""):`<p class="reflection-empty">No matching reflections.</p>`}</section><section class="me-section settings-section"><h2>Settings & privacy</h2><div class="settings-list">${[["bell","Notifications & cadence"],["flag","Relationship goals"],["shield","Privacy & data"],["me","Account"]].map(([symbol,label])=>`<button class="settings-row" data-action="setting" data-label="${esc(label)}"><span class="settings-dot">${icon(symbol)}</span><span>${label}</span><b>›</b></button>`).join("")}</div></section></section>${nav()}`;
}
function createScreen() {
  return `<section class="subscreen"><header class="subhead"><button class="icon-btn" data-action="back" aria-label="Back">${icon("back")}</button><h1>Add person</h1></header><form id="create-form" class="subscreen" style="min-height:0;flex:1"><div class="formscroll"><p class="form-intro">A few details help this Agent make your conversations feel relevant.</p><label class="field"><span>Name *</span><input name="name" required maxlength="60" placeholder="e.g. Jordan Lee" autofocus /></label><label class="field"><span>How you know them</span><input name="how" maxlength="120" placeholder="e.g. Met at a design meetup" /></label><label class="field"><span>What you know</span><textarea name="about" maxlength="700" placeholder="Their work, interests, shared topics…"></textarea></label><label class="field"><span>What you want to talk about</span><input name="goal" maxlength="180" placeholder="One thing you'd like to explore" /></label><label class="field"><span>Tags</span><input name="tags" maxlength="80" placeholder="e.g. Design, Coffee next week" /></label><p class="helper">Separate tags with commas. You can update context during a chat.</p></div><footer class="form-footer"><button class="solid-button" type="submit">Start chatting →</button></footer></form></section>`;
}
function chatScreen() {
  const p=person(ui.personId); if(!p){ ui.screen="tab";ui.tab="people";return peopleScreen(); }
  const messages=(p.messages||[]).map(m=>`<div class="bubble-wrap ${m.by==="me"?"mine":""}"><div class="bubble-label">${m.by==="me"?"Riley (You)":esc(p.name)}</div><div class="bubble">${esc(m.text)}</div></div>`).join("");
  const mode=ui.mode==="rehearse"?"REHEARSAL ACTIVE":ui.mode==="draft"?"DRAFT A REAL MESSAGE":"AI SIMULATION · PRIVATE PRACTICE";
  return `<section class="chat-screen"><div class="chat-bg" style="background-image:url('${ASSET}${esc(p.photo||"chat-maya.png")}')"></div><header class="chat-head"><button class="icon-btn" data-action="back" aria-label="Back to ${ui.origin=== "today"?"Today":"People"}">${icon("back")}</button><div class="chat-identity"><strong>${esc(p.name)}</strong><small>${esc(p.role||"Your connection")}</small></div><button class="icon-btn" data-action="context" aria-label="Open person context">${icon("note")}</button></header><div class="chat-top-context"><div class="context-meta"><span>${esc(p.meeting||"Your connection")}</span><span>${esc(p.place||p.how||"Person context")}</span></div><p><strong>Goal:</strong> ${esc(p.goal||"Get to know each other")}</p></div><div class="mode-label">${mode}</div><div class="messages" id="messages">${messages}${ui.mode==="rehearse"?`<div class="cue-card"><strong>BOND AI</strong><p>Practice a natural opening. Use a cue if you want a starting point.</p><div class="cue-actions"><button data-action="cue" data-cue="Ask about their recent work">Recent work</button><button data-action="cue" data-cue="Connect through a shared interest">Shared interest</button></div></div>`:""}${ui.mode==="draft"?`<div class="cue-card"><strong>BOND AI</strong><p>Write a short message you could send in real life. You can copy your draft after sending it here.</p></div>`:""}</div><form id="chat-form" class="chat-compose"><button type="button" class="rehearse-btn ${ui.mode==="rehearse"?"on":""}" data-action="rehearse">✦ Rehearse</button><input name="message" placeholder="Type a message…" maxlength="1200" autocomplete="off" aria-label="Message" required /><button class="send-btn" type="submit" aria-label="Send message">${icon("send")}</button></form></section>${ui.sheet==="context"?contextSheet(p):""}`;
}
function contextSheet(p) {
  return `<div class="sheet-shade" data-action="close-sheet"><div class="sheet" role="dialog" aria-label="${esc(p.name)} context"><div class="sheet-grip"></div><button class="sheet-close" data-action="close-sheet" aria-label="Close">×</button><h2>${esc(p.name)}</h2><p class="sheet-lede">Person context · Edit the details used in practice.</p><form id="context-form"><label class="field"><span>Role / connection</span><input name="role" value="${esc(p.role||"")}" /></label><label class="field"><span>How you know them</span><input name="how" value="${esc(p.how||"")}" /></label><label class="field"><span>What you know</span><textarea name="about">${esc(p.about||"")}</textarea></label><label class="field"><span>Relationship goal</span><input name="goal" value="${esc(p.goal||"")}" /></label><label class="field"><span>Tags</span><input name="tags" value="${esc((p.tags||[]).join(", "))}" /></label><button class="solid-button" type="submit">Save context</button></form><div class="sheet-section"><h3>Real-world moments</h3><p>${esc(p.meeting||"Add a meeting during reflection.")} · ${esc(p.place||"Location to be added")}</p><button class="pill-button" data-action="reflect-person" data-person="${p.id}">Reflect on a meeting</button></div></div></div>`;
}
function reflectScreen() {
  return `<section class="subscreen"><header class="subhead"><button class="icon-btn" data-action="back" aria-label="Back">${icon("back")}</button><h1>Reflect on a meeting</h1></header><form id="reflect-form" class="subscreen" style="min-height:0;flex:1"><div class="formscroll"><p class="form-intro">Capture the real conversation while it is fresh. You can edit everything before saving.</p><label class="field"><span>Who did you meet?</span><select name="personId" required>${data.people.map(p=>`<option value="${esc(p.id)}" ${ui.personId===p.id?"selected":""}>${esc(p.name)}</option>`).join("")}</select></label><label class="field"><span>How did it go?</span><textarea name="notes" required maxlength="1500" placeholder="What did you learn? What did you agree to?" style="min-height:170px"></textarea></label><label class="field"><span>Next step</span><input name="next" maxlength="180" placeholder="e.g. Send the article this week" /></label><p class="helper">Your note will be saved to this person's context.</p></div><footer class="form-footer"><button class="solid-button" type="submit">Save reflection</button></footer></form></section>`;
}
function render() {
  app.innerHTML = ui.screen==="chat"?chatScreen():ui.screen==="create"?createScreen():ui.screen==="reflect"?reflectScreen():ui.tab==="people"?peopleScreen():ui.tab==="me"?meScreen():todayScreen();
  if(ui.toast) app.insertAdjacentHTML("beforeend", `<div class="toast" role="status">${esc(ui.toast)}</div>`);
  if(ui.screen==="chat") requestAnimationFrame(()=>{ const list=document.getElementById("messages"); if(list) list.scrollTop=list.scrollHeight; });
}
function notify(msg) { ui.toast=msg; render(); clearTimeout(notify.timer); notify.timer=setTimeout(()=>{ui.toast="";render();},2300); }
function openChat(id, origin=ui.tab, mode="chat") { if(!person(id)) return; ui.personId=id;ui.origin=origin;ui.mode=mode;ui.tab="people";ui.screen="chat";ui.sheet=null;ui.toast="";render(); }
function goBack() { if(ui.sheet){ui.sheet=null;render();return;} if(ui.screen==="chat"){ui.tab=ui.origin;ui.screen="tab";ui.personId=null;if(ui.tab==="today")ui.showMoreActions=false;} else if(ui.screen==="create"){ui.tab="people";ui.screen="tab";} else if(ui.screen==="reflect"){const fromChat=ui.origin==="chat";ui.tab=fromChat?"people":"me";ui.screen=fromChat?"chat":"tab";if(fromChat)ui.origin=ui.returnOrigin;} render(); }
app.addEventListener("click", e => {
  const el=e.target.closest("[data-action]"); if(!el) return;
  const act=el.dataset.action;
  if(act==="tab"){ui.tab=el.dataset.tab;ui.screen="tab";ui.sheet=null;ui.toast="";if(ui.tab==="today"){ui.showMoreActions=false;ui.selectedDay=null;}render();}
  else if(act==="select-day"){ui.selectedDay=el.dataset.day;ui.showMoreActions=false;render();requestAnimationFrame(()=>document.getElementById("today-cards")?.scrollIntoView({behavior:"smooth",block:"start"}));}
  else if(act==="open-chat") openChat(el.dataset.person,ui.tab);
  else if(act==="create"){ui.origin="people";ui.tab="people";ui.screen="create";render();}
  else if(act==="task") openChat(el.dataset.person,"today",el.dataset.task==="prepare"?"rehearse":el.dataset.task==="draft"?"draft":"chat");
  else if(act==="complete"){data.completed.push(el.dataset.id);save();notify("Marked as done");}
  else if(act==="dismiss"){data.dismissed.push(el.dataset.id);save();notify("Action dismissed");}
  else if(act==="show-more-actions"){ui.showMoreActions=true;render();requestAnimationFrame(()=>document.querySelectorAll(".action-card")[2]?.scrollIntoView({behavior:"smooth",block:"center"}));}
  else if(act==="back") goBack();
  else if(act==="context"){ui.sheet="context";render();}
  else if(act==="close-sheet"){if(el.classList.contains("sheet-shade")&&e.target!==el)return;ui.sheet=null;render();}
  else if(act==="rehearse"){ui.mode=ui.mode==="rehearse"?"chat":"rehearse";render();}
  else if(act==="cue"){const input=document.querySelector('#chat-form input[name="message"]');if(input){input.value=el.dataset.cue;input.focus();}}
  else if(act==="reflect"){ui.origin="me";ui.personId=data.people[0]?.id||null;ui.screen="reflect";render();}
  else if(act==="reflect-person"){ui.returnOrigin=ui.origin;ui.origin="chat";ui.sheet=null;ui.screen="reflect";render();}
  else if(act==="search"){ui.tab="people";ui.screen="tab";render();document.getElementById("people-search")?.focus();}
  else if(act==="settings"){ui.tab="me";ui.screen="tab";render();}
  else if(act==="setting") notify(`${el.dataset.label} · Coming next`);
});
app.addEventListener("input", e => {
  if(!["people-search","reflection-search"].includes(e.target.id)) return;
  const isReflection=e.target.id==="reflection-search";
  if(isReflection) ui.reflectionSearch=e.target.value;
  else ui.search=e.target.value;
  const start=e.target.selectionStart;
  render();
  const input=document.getElementById(isReflection?"reflection-search":"people-search");input?.focus();input?.setSelectionRange(start,start);
});
app.addEventListener("keydown", e => {
  if(e.key==="Escape"){goBack();return;}
  if((e.key==="Enter"||e.key===" ")&&e.target.classList.contains("person-card")){e.preventDefault();openChat(e.target.dataset.person,"people");}
});
app.addEventListener("submit", e => {
  e.preventDefault();const form=e.target;const f=new FormData(form);
  if(form.id==="create-form"){
    const name=String(f.get("name")||"").trim();if(!name)return;
    const p={id:`person-${Date.now()}`,name,role:"New connection",initials:name.split(/\s+/).map(w=>w[0]).slice(0,2).join("").toUpperCase(),tone:["blue","yellow","green","pink"][data.people.length%4],tags:String(f.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,2),how:String(f.get("how")||"").trim(),about:String(f.get("about")||"").trim(),goal:String(f.get("goal")||"").trim(),meeting:"New connection",place:"Person context",photo:"chat-maya.png",preview:"New conversation",reply:"Tell me a little more. What would you like to explore together?",messages:[{by:"agent",text:`Hi Riley. I'm here to help you practice a conversation with ${name}. What would you like to talk about first?`}]};
    data.people.unshift(p);save();openChat(p.id,"people");
  } else if(form.id==="context-form"){
    const p=person(ui.personId);if(!p)return;
    p.role=String(f.get("role")||"").trim();p.how=String(f.get("how")||"").trim();p.about=String(f.get("about")||"").trim();p.goal=String(f.get("goal")||"").trim();p.tags=String(f.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,2);ui.sheet=null;save();notify("Context saved");
  } else if(form.id==="chat-form"){
    const p=person(ui.personId);const message=String(f.get("message")||"").trim();if(!p||!message)return;
    p.messages.push({by:"me",text:message});p.messages.push({by:"agent",text:ui.mode==="rehearse"?`That feels like a natural start. ${p.reply}`:p.reply});p.preview=message.length>55?message.slice(0,55)+"…":message;save();render();document.querySelector('#chat-form input[name="message"]')?.focus();
  } else if(form.id==="reflect-form"){
    const id=String(f.get("personId")||"");const p=person(id);if(!p)return;
    const notes=String(f.get("notes")||"").trim();if(!notes)return;
    const next=String(f.get("next")||"").trim();data.reflections.push({personId:id,text:notes,date:new Date().toLocaleDateString("en-US",{month:"short",day:"numeric"}),next});p.about=[p.about,notes].filter(Boolean).join("\n\n");if(next)p.preview=next;save();const fromChat=ui.origin==="chat";ui.screen=fromChat?"chat":"tab";ui.tab=fromChat?"people":"me";if(fromChat)ui.origin=ui.returnOrigin;notify("Reflection saved");
  }
});
render();
