const icon = (name, size = 20) => `<svg class="icon" width="${size}" height="${size}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
const chip = (text, color = 'ivory') => `<span class="chip ${color}">${text}</span>`;
const button = (text, target, cls = '') => `<button class="button ${cls}" data-mobile="${target}">${text}</button>`;
const webButton = (text, target, cls = '') => `<button class="button ${cls}" data-web="${target}">${text}</button>`;
const avatar = (letter, color = '') => `<span class="avatar ${color}">${letter}</span>`;
const backbar = (label, target) => `<div class="backbar"><button class="icon-button" data-mobile="${target}" aria-label="Back">${icon('back')}</button><strong>${label}</strong></div>`;
const rootTop = (kicker, title, subtitle) => `<div class="screen-top"><span class="top-label">${kicker}</span><button class="icon-button" data-mobile="settings" aria-label="Settings">${icon('settings')}</button></div><h1 class="screen-title">${title}</h1><p class="screen-subtitle">${subtitle}</p>`;
const section = (title, action = '') => `<div class="section-heading"><h2>${title}</h2>${action}</div>`;
const field = (label, control) => `<div class="form-group"><label>${label}</label>${control}</div>`;
const input = (placeholder, value = '') => `<input placeholder="${placeholder}" value="${value}">`;
const textarea = (placeholder, value = '') => `<textarea placeholder="${placeholder}">${value}</textarea>`;
const memory = (label, body) => `<div class="memory-card"><div class="label">${label}</div><p contenteditable="true" spellcheck="false">${body}</p></div>`;
const state = {platform:'mobile',mobile:'companion',web:'people',chatMode:'companion',messages:[
  {role:'ai',text:'Last time you mentioned a paper about AI in education. What stood out to you since then?'},
  {role:'user',text:'I keep thinking about how products can help people feel ready to try.'},
  {role:'ai',text:'That is interesting. What would make someone feel ready enough to take the first step?'},
  {role:'coach',text:'Coach note · You connected your research to a real question naturally.'}
]};
const mobileMap = [
  {group:'Main tabs',items:[['01','Today','today'],['02','AI Companion','companion'],['03','Meetings & Reflect','meetings']]},
  {group:'Core journey',items:[['04','Person detail','person'],['05','Companion chat','chat'],['06','Scenario rehearsal','scenario'],['07','Create a person','create'],['08','Profile review','preview'],['09','Meeting reflection','reflect'],['10','Practice takeaways','feedback'],['11','Plan a meeting','schedule'],['12','Draft a follow-up','draft'],['13','Preferences & privacy','settings']]}
];
const webMap = [{group:'Workspace',items:[['01','People dashboard','people'],['02','Person workspace','person'],['03','Today','today'],['04','Memories','memories'],['05','Insights','insights'],['06','Settings','settings'],['07','Create a person','create']]}];
const mobileViews = {
  today:()=>`${rootTop('TUESDAY · OCT 06','Today, Riley.','3 relationships worth moving forward.')}
    <div class="hero-card" style="margin-top:20px;background:var(--sky);min-height:169px"><span class="label">TODAY'S FOCUS</span><h2>Start with one<br>small action.</h2><p>Make progress at your own pace.</p></div>
    ${section('Coming up',`<button class="text-action" data-mobile="meetings">All meetings →</button>`)}
    <div class="card white"><div class="card-top">${chip('TOMORROW · 2:30 PM','pink')}<span class="meta">Coffee chat</span></div><h3>Meet Jack Chen</h3><p>Campus café · Prepare three easy talking points.</p>${button('Prepare together '+icon('arrow'),'scenario','small')}</div>
    ${section('To follow up')}
    <div class="card sky"><div class="card-top">${chip('DUE TODAY','ivory')}<span class="meta">From your Sep 30 reflection</span></div><h3>Send Jack your research paper</h3><p>One promise, one clear next step.</p>${button('Draft message '+icon('arrow'),'draft','small')}</div>
    <div class="card sage-light"><div class="card-top">${chip('RECONNECT','ivory')}<span class="meta">72 days since you last met</span></div><h3>Say hello to Sarah</h3><p>Pick up your conversation about AI in education.</p>${button('See suggestion '+icon('arrow'),'draft','small')}</div>`,
  companion:()=>`${rootTop('BOND · YOUR PEOPLE','Hi, Riley.','Pick up where real life left off.')}
    <div class="stack-wrap"><div class="hero-card"><span class="label">AI COMPANION</span><h2>A little practice<br>can go a long way.</h2><p>Talk it through before you meet.</p>${button('Open companion '+icon('arrow'),'chat')}</div></div>
    ${section('Your people',`<button class="text-action" data-mobile="person">View all →</button>`)}
    <div class="person-card"><button class="avatar" data-mobile="person" aria-label="Open Jack Chen">J</button><button class="person-copy" data-mobile="person"><strong>Jack Chen</strong><small>Senior AI PM · Duke alumnus</small>${chip('Preparing','sky')} ${chip('Coffee tomorrow','ivory')}</button><button class="chat-icon" data-mobile="chat" aria-label="Chat with Jack">${icon('chat')}</button></div>
    <div class="person-card"><button class="avatar sage" data-mobile="person" aria-label="Open Sarah Lin">S</button><button class="person-copy" data-mobile="person"><strong>Sarah Lin</strong><small>AI education · Community friend</small>${chip('Keep in touch','sage-light')}</button><button class="chat-icon" data-mobile="chat" aria-label="Chat with Sarah">${icon('chat')}</button></div>
    <button class="callout" style="width:100%;text-align:left" data-mobile="scenario">${icon('spark')}<span><b>Practice for your next meeting</b><br>Try a natural opening with Jack.</span>${icon('chevron')}</button>`,
  meetings:()=>`${rootTop('REAL MOMENTS','Meetings & reflection','Keep track of what happened and what comes next.')}
    <div class="stack-wrap"><div class="hero-card"><span class="label">NEXT MEETING · TOMORROW</span><h2>Coffee with<br>Jack Chen</h2><p>2:30 PM · Campus café</p>${button('Prepare for the meeting '+icon('arrow'),'scenario')}</div></div>
    ${section('Your calendar',`<button class="text-action" data-mobile="schedule">+ Add meeting</button>`)}
    <div class="card ivory"><div class="row">${icon('calendar')}<div><b style="font-size:13px">Wednesday, October 7</b><p style="margin:3px 0 0">Coffee chat with Jack · 2:30 PM</p></div></div></div>
    ${section('After the meeting')}
    <div class="card sky"><div class="row">${icon('book')}<div><b style="font-size:15px">Reflect on your conversation</b><p>Speak or write. Review every AI summary before saving.</p></div></div><div style="margin-top:13px">${button('Start reflection '+icon('arrow'),'reflect','small')}</div></div>
    ${section('Recent memory')}
    <div class="card white"><div class="row">${avatar('J')}<div><b style="font-size:13px">First coffee chat with Jack</b><p>Sep 30 · AI agents, education, and a paper to share.</p></div></div></div>`,
  person:()=>`${backbar('Person detail','companion')}<div class="profile-head">${avatar('J','large')}<div><h1>Jack Chen</h1><p>Senior AI PM · Duke alumnus</p>${chip('Preparing','sky')}</div></div>
    <div class="label">RELATIONSHIP GOAL</div><p class="goal-copy">Learn how senior AI PMs think and build a genuine alumni connection.</p>
    <div class="actions">${button(icon('chat')+' Chat with Jack','chat')}${button('Rehearse','scenario','outline')}</div>
    ${section('Next move')}
    <div class="card sky"><div class="label">DUE TODAY</div><h3>Send your research paper</h3><p>A promise from your last coffee chat.</p>${button('Draft a message '+icon('arrow'),'draft','small')}</div>
    ${section('What you know')}
    <div class="snapshot-grid"><div class="card sage"><strong>Who he is</strong><p>A product leader working on useful AI experiences.</p></div><div class="card pink"><strong>What he cares about</strong><p>Learning confidence and real user needs.</p></div><div class="card ivory"><strong>Common ground</strong><p>You both keep coming back to AI agents and education.</p></div></div>
    ${section('Timeline')}
    <div class="timeline-entry"><span class="meta">SEP 30 · MEETING</span><b>First coffee chat · promised to share a paper</b></div><div class="timeline-entry"><span class="meta">SEP 20 · CONNECTION</span><b>Met through the Duke alumni group</b></div>`,
  chat:()=>`${backbar('Companion chat','person')}<div class="chat-header">${avatar('J')}<div><strong>Jack Chen · AI rehearsal</strong><small>Last real conversation: Sep 30 coffee chat</small></div><button class="text-action" data-mobile="feedback">Finish</button></div>
    <div class="disclaimer">This is a simulation based on what you shared. It does not represent Jack's actual thoughts.</div>
    <div class="messages" id="messages">${state.messages.map(m=>`<div class="bubble ${m.role}">${escapeHtml(m.text)}</div>`).join('')}</div>
    <div class="prompt-row"><button data-prompt="Help me open naturally">Natural opening</button><button data-prompt="What could I ask next?">Follow-up question</button><button data-prompt="How can I connect this to my experience?">Connect my experience</button><button data-prompt="What might matter to him here?">What might matter</button></div>
    <div class="compose"><input id="chat-input" aria-label="Practice message" placeholder="Write what you want to practice…"><button data-send aria-label="Send practice message">${icon('send')}</button></div>
    <button class="text-action" style="display:block;margin:10px auto" data-mobile="feedback">Finish practice and see takeaways</button>`,
  scenario:()=>`${backbar('Scenario rehearsal','person')}<p class="eyebrow">PRACTICE FOR REAL LIFE</p><h1 class="screen-title">Get ready to meet.</h1><p class="screen-subtitle">Try a conversation now. Take one useful idea into your actual meeting.</p>
    <div class="hero-card" style="margin-top:22px;min-height:155px;background:var(--pink)"><span class="label">JACK · TOMORROW 2:30 PM</span><h2 style="font-size:24px">Coffee chat</h2><p>Goal: explore how he thinks about trust in AI products.</p></div>
    ${section('Choose a moment')}
    <button class="choice" data-mobile="chat" data-mode="scenario"><span class="choice-icon">${icon('chat')}</span><span><strong>Open naturally</strong><small>Start with a warm, easy topic.</small></span>${icon('chevron')}</button>
    <button class="choice" data-mobile="chat" data-mode="scenario"><span class="choice-icon">${icon('spark')}</span><span><strong>Go a little deeper</strong><small>Practice one thoughtful follow-up.</small></span>${icon('chevron')}</button>
    <button class="choice" data-mobile="chat" data-mode="scenario"><span class="choice-icon">${icon('book')}</span><span><strong>Close with care</strong><small>Find a natural next step.</small></span>${icon('chevron')}</button>
    <p class="meta" style="margin:18px 0">The simulated reply is practice material, not the person's opinion.</p>
    ${button('Start rehearsal '+icon('arrow'),'chat','full')}`,
  create:()=>`${backbar('Create a person','companion')}<div class="progress"><i class="active"></i><i class="active"></i><i></i></div><p class="eyebrow">START WITH WHAT YOU KNOW</p><h1 class="screen-title">Who is this person?</h1><p class="screen-subtitle">A few details are enough. You can edit the AI summary before saving.</p>
    ${field('Name *',input('e.g. Jack Chen'))}${field('How did you meet? *',input('e.g. Duke alumni group'))}${field('Bio or notes · optional',textarea('Paste a profile or write what you remember…'))}
    ${field('Why build this relationship?',`<div class="tag-options"><button class="selected" data-tag>Learn</button><button data-tag>Collaborate</button><button data-tag>Make friends</button><button data-tag>Stay in touch</button></div>`)}
    ${field('Your goal in one sentence',input('I want to learn how senior AI PMs think'))}
    <div class="form-footer">${button('Generate a profile preview '+icon('arrow'),'preview','full')}<span class="meta">Nothing becomes a person fact until you confirm it.</span></div>`,
  preview:()=>`${backbar('Review the profile','create')}<p class="eyebrow">A STARTING POINT</p><h1 class="screen-title">Did we get this right?</h1><p class="screen-subtitle">Edit each card. Uncertain details stay marked as suggestions.</p>
    <div class="profile-head">${avatar('J','large')}<div><h1>Jack Chen</h1><p>Senior AI PM · Duke alumni group</p></div></div>
    ${section('Three things to remember',`<span class="meta">Tap any card to edit</span>`)}
    ${memory('WHO HE IS · EDITABLE','A senior product manager exploring practical AI products.')}
    ${memory('WHAT HE CARES ABOUT · EDITABLE','How technology can support real learning.')}
    ${memory('POSSIBLE COMMON GROUND · EDITABLE','You may both be interested in AI agents and education.')}
    <div class="callout pink" style="margin:17px 0">${icon('spark')}<span>This Agent is a rehearsal tool. It cannot know Jack's actual thoughts.</span></div>
    ${button('Confirm and create person '+icon('arrow'),'person','full')}`,
  reflect:()=>`${backbar('Meeting reflection','meetings')}<p class="eyebrow">KEEP THE REAL MOMENT</p><h1 class="screen-title">How did it go<br>with Jack?</h1><p class="screen-subtitle">Start with your own words. Review each summary before it enters your relationship memory.</p>
    <div class="card sage" style="margin-top:19px"><b style="font-size:14px">Say what stood out.</b><p>What did you learn, connect on, or promise?</p></div>
    ${field('Your notes',textarea('We talked about AI agents in education. Jack mentioned Sarah, and I promised to share my paper…'))}
    <button class="button outline small" type="button">${icon('mic')} Record a voice note</button>
    ${section('AI summary to review',`<span class="meta">Every card is editable</span>`)}
    ${memory('01 · WHAT I LEARNED','Jack is working on AI education products and cares about learning confidence.')}
    ${memory('02 · WHAT WE CONNECTED ON','AI agents, education, and the gap between prototypes and real use.')}
    ${memory('03 · PROMISES','Jack may introduce Sarah. I said I would share my paper.')}
    ${memory('04 · FOLLOW-UP','Send the paper to Jack · remind me in 3 days.')}
    ${memory('05 · NEXT INTERACTION','Check in again in two weeks. The date can be changed.')}
    <div class="form-footer">${button('Save to relationship memory '+icon('check'),'meetings','full')}</div>`,
  feedback:()=>`${backbar('Practice takeaways','person')}<p class="eyebrow">TAKE IT INTO REAL LIFE</p><h1 class="screen-title">Ready for the<br>real conversation.</h1><p class="screen-subtitle">No score. Just a few things you can use when you meet.</p>
    <div class="hero-card sky" style="margin:20px 0 19px;min-height:142px"><span class="label">ONE THING TO KEEP</span><h2 style="font-size:23px">You found a natural way to begin.</h2></div>
    ${memory('A CONNECTION YOU MADE','You connected your research to Jack’s interest in education.')}
    ${memory('A QUESTION TO GO DEEPER','Ask for one concrete example when he mentions learning confidence.')}
    ${memory('REMEMBER FOR THE MEETING','Ask about his current work, then share one insight from the paper.')}
    <div class="card sage-light" style="margin-top:17px"><h3>Your next real step</h3><p>Would you like to send the paper to Jack? Review the message before you do.</p>${button('Draft a follow-up '+icon('arrow'),'draft','small')}</div>`,
  schedule:()=>`${backbar('Plan a meeting','meetings')}<p class="eyebrow">MAKE SPACE TO CONNECT</p><h1 class="screen-title">Set a time to meet.</h1><p class="screen-subtitle">Add it here first. Calendar sync can come later.</p>
    ${field('Meet with',input('Search people','Jack Chen'))}
    ${field('Setting',`<div class="tag-options"><button class="selected" data-tag>Coffee chat</button><button data-tag>Lunch</button><button data-tag>Walk</button><button data-tag>Event</button></div>`)}
    ${field('Date and time',input('Choose a time','Oct 7, 2026 · 2:30 PM'))}
    ${field('Location · optional',input('Add a place','Campus café'))}
    ${field('What would you like to talk about?',textarea('I want to hear how Jack thinks about trust in AI products.'))}
    <div class="form-footer">${button('Save meeting '+icon('check'),'meetings','full')}</div>`,
  draft:()=>`${backbar('Draft a follow-up','today')}<p class="eyebrow">A REAL NEXT STEP</p><h1 class="screen-title">A note for Jack.</h1><p class="screen-subtitle">Make it sound like you. Bond will not send it for you.</p>
    <div class="card sage" style="margin-top:21px"><span class="label">WHY THIS SUGGESTION?</span><p style="font-size:13px;margin-top:8px">You confirmed on Sep 30 that you would share your research paper.</p></div>
    ${field('Message draft',textarea('Hi Jack, I enjoyed our conversation last week. Here is the paper I mentioned on AI and learning confidence. I would love to hear what you think.'))}
    <div class="actions" style="margin:16px 0">${button('Copy message','draft','outline')}${button('Open share sheet','draft')}</div>
    <div class="card ivory"><b style="font-size:13px">After you contact Jack</b><p>Mark this done only when you have actually sent the message.</p>${button('I contacted Jack '+icon('check'),'today','small')}</div>`,
  settings:()=>`${backbar('Preferences & privacy','companion')}<p class="eyebrow">MAKE BOND YOURS</p><h1 class="screen-title">Your pace.<br>Your people.</h1><p class="screen-subtitle">You decide what to remember and when to hear from us.</p>
    ${section('Notifications')}
    <div class="card ivory"><div class="card-top"><b>Proactive suggestions</b>${chip('On','sage')}</div><p>At most one reminder per person per day.</p></div>
    <div class="card ivory"><b>Quiet hours</b><p>10:00 PM – 9:00 AM</p></div>
    ${section('Your data')}
    <div class="card ivory"><b>Export relationship memories</b><p>Get the people, notes, and timeline you saved.</p></div>
    <div class="card ivory"><b>Delete a person</b><p>Remove their profile, practice, memories, and search data.</p></div>
    <div class="callout sky" style="margin-top:15px">${icon('spark')}<span>AI conversation is a simulation for practice. Bond never contacts a real person for you.</span></div>`
};
function webHeader(kicker,title,action=''){return `<div class="web-header"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1></div>${action}</div>`}
function webPanel(title,content,color=''){return `<div class="web-panel ${color}"><h3>${title}</h3>${content}</div>`}
function boardCard(name,detail,status,color='ivory'){return `<button class="board-card" data-web="person"><b>${name}</b><small>${detail}</small>${chip(status,color)}</button>`}
const webViews={
  people:()=>`${webHeader('YOUR RELATIONSHIP WORKSPACE','Good morning, Riley.',webButton(icon('plus')+' Add a person','create'))}
    <div class="web-grid"><div><div class="web-hero"><span class="label">BUILD REAL CONNECTIONS</span><h2>Good relationships grow<br>one conversation at a time.</h2><p>3 relationships are ready for your attention.</p></div>
    <div class="web-metrics"><div class="metric"><b>12</b><span>Active relationships</span></div><div class="metric"><b>3</b><span>Follow-ups this week</span></div><div class="metric"><b>2</b><span>Upcoming meetings</span></div></div>
    <div class="web-section-head"><h2>Your people</h2><span class="meta">Drag to organize the board; status stays evidence-based.</span></div>
    <div class="board"><div class="board-column"><div class="board-column-head">Preparing <span>02</span></div>${boardCard('Jack Chen','Senior AI PM · Duke alumnus','Coffee tomorrow','sky')}${boardCard('Alex Wong','Founder · AI community','Friday meetup','pink')}</div>
    <div class="board-column"><div class="board-column-head">Growing <span>05</span></div>${boardCard('Maya Zhou','Product designer','Send a resource','ivory')}${boardCard('Daniel Wu','Researcher · alumni','Met last week','sage')}</div>
    <div class="board-column"><div class="board-column-head">Maintain <span>05</span></div>${boardCard('Sarah Lin','AI education · community','Worth a check-in','sage-light')}</div></div></div>
    <aside class="web-aside">${webPanel('This week',`<div class="item"><b>Send Jack your paper</b><span>Due today · Draft message →</span></div><div class="item"><b>Prepare for coffee</b><span>Tomorrow at 2:30 PM</span></div><div class="item"><b>Reconnect with Sarah</b><span>Start with AI in education</span></div>`)}
    ${webPanel('Practice a conversation',`<p>Find a natural opening before the real meeting.</p>${webButton('Open Jack’s space →','person','small ivory')}`,'sage')}
    ${webPanel('Recent memory','<p>Sep 30 · First coffee chat with Jack. AI agents, education, and a paper to share.</p>')}</aside></div>`,
  create:()=>`${webHeader('PEOPLE / NEW','Create a person',webButton('Back to people','people','outline'))}
    <div class="web-grid"><div><div class="web-hero" style="background:var(--sage)"><span class="label">START WITH WHAT YOU KNOW</span><h2>A few details are enough.</h2><p>Review the AI summary before anything becomes a memory.</p></div>
    <div class="web-cards" style="margin-top:16px"><div class="card white"><b>Name *</b><p>Jack Chen</p></div><div class="card white"><b>How you met *</b><p>Duke alumni group</p></div><div class="card sky"><b>Relationship goal</b><p>Learn how senior AI PMs think.</p></div></div>
    <div class="web-section-head"><h2>Profile preview</h2><span class="meta">Editable before saving</span></div>
    <div class="memory-row"><div><b>Who he is</b><p>A senior AI product manager focused on practical products.</p></div></div>
    <div class="memory-row"><div><b>Possible common ground</b><p>You may both be interested in AI agents and education.</p></div></div>
    ${webButton('Confirm and create person →','person')}</div><aside class="web-aside">${webPanel('Your control',`<p>Bond only uses information you provide. Suggestions remain editable until you confirm them.</p>`,'pink')}</aside></div>`,
  person:()=>`${webHeader('PEOPLE / JACK CHEN','Person workspace',webButton(icon('chat')+' Start a practice','person'))}
    <div class="web-person-head">${avatar('J','large')}<div><h2>Jack Chen ${chip('Preparing','sky')}</h2><p>Senior AI PM · Duke alumnus · Met through the alumni group</p></div></div>
    <div class="web-tabs"><button class="active">Overview</button><button>Timeline</button><button>Prepare</button><button>Reflection</button></div>
    <div class="web-split"><div><div class="card sage"><span class="label">RELATIONSHIP GOAL</span><h3 style="font-size:18px;margin:8px 0">Learn how senior AI PMs think and build a genuine alumni connection.</h3></div>
    <div class="web-section-head"><h2>What you know about Jack</h2><span class="meta">Confirmed memories only</span></div>
    <div class="web-cards"><div class="card sky"><b>Who he is</b><p>A product leader working on practical AI experiences.</p></div><div class="card pink"><b>What he cares about</b><p>Learning confidence and real user needs.</p></div><div class="card sage-light"><b>Common ground</b><p>You both keep returning to AI agents and education.</p></div></div>
    <div class="web-chat"><b style="font-size:12px">Companion chat · practice with Jack</b><div class="messages"><div class="bubble ai">What stood out to you in that paper?</div><div class="bubble user">How AI can help people feel ready to try.</div></div><div class="compose"><input placeholder="Write what you want to practice…"><button aria-label="Send">${icon('send')}</button></div><p class="meta">A simulation, not Jack's actual opinion.</p></div></div>
    <aside class="web-aside">${webPanel('Next move',`<p><b>Send your research paper</b></p><p>Due today · From your Sep 30 reflection</p>${webButton('Draft message →','today','small')}`,'sky')}
    ${webPanel('Next meeting',`<p>Tomorrow, 2:30 PM · Campus café</p>${webButton('Prepare together →','today','small ivory')}`)}
    ${webPanel('Timeline',`<div class="item"><b>Sep 30 · Coffee chat</b><span>AI agents and education</span></div><div class="item"><b>Sep 20 · First connection</b><span>Duke alumni group</span></div>`)}</aside></div>`,
  today:()=>`${webHeader('YOUR NEXT MOVES','Today',webButton('Reminder preferences','settings','outline'))}
    <div class="web-grid"><div><div class="web-hero" style="background:var(--sky)"><span class="label">TODAY'S FOCUS</span><h2>Start with one small action.</h2><p>Suggestions are based on moments you confirmed.</p></div>
    <div class="web-section-head"><h2>Coming up</h2></div><div class="memory-row">${chip('TOMORROW','pink')}<div><b>Coffee with Jack Chen</b><p>2:30 PM · Campus café · Prepare three talking points.</p></div>${webButton('Prepare','person','small')}</div>
    <div class="web-section-head"><h2>To follow up</h2></div><div class="memory-row">${chip('DUE TODAY','sky')}<div><b>Send Jack your research paper</b><p>A promise from your last coffee chat.</p></div>${webButton('Draft','person','small')}</div>
    <div class="web-section-head"><h2>Worth reconnecting</h2></div><div class="memory-row">${chip('72 DAYS','sage')}<div><b>Check in with Sarah</b><p>Start with your shared interest in AI education.</p></div>${webButton('Explore','person','small')}</div></div>
    <aside class="web-aside">${webPanel('Why these suggestions?',`<p>Bond looks at meetings, promises, and interaction dates you confirmed. Dismiss, snooze, or act when it feels right.</p>`)}${webPanel('A quieter rhythm','<p>One reminder per person per day. Quiet hours: 10:00 PM to 9:00 AM.</p>','sage')}</aside></div>`,
  memories:()=>`${webHeader('YOUR SHARED HISTORY','Memories',webButton(icon('plus')+' Add interaction','person'))}
    <div class="web-filter"><input class="web-search" placeholder="Search people, topics, or promises">${chip('All people ⌄','white')}${chip('All types ⌄','white')}${chip('All topics ⌄','white')}</div>
    <div class="web-section-head"><h2>Recent updates</h2><span class="meta">Sorted by when they happened</span></div>
    <div class="memory-row"><span class="date">SEP 30</span>${avatar('J')}<div><b>First coffee chat with Jack</b><p>Talked about AI agents and education. Promised to share the paper.</p>${chip('Meeting','sky')} ${chip('AI education','ivory')}</div></div>
    <div class="memory-row"><span class="date">SEP 26</span>${avatar('S','sage')}<div><b>Sarah shared a design observation</b><p>You both care about helping people build learning confidence.</p>${chip('Message','pink')} ${chip('Product design','ivory')}</div></div>
    <div class="memory-row"><span class="date">SEP 20</span>${avatar('J')}<div><b>Met Jack through the Duke alumni group</b><p>A first conversation about AI agents.</p>${chip('Connection','sage')}</div></div>`,
  insights:()=>`${webHeader('GENTLE INSIGHTS','Patterns worth noticing',`<span class="chip ivory">Last 3 months</span>`)}
    <div class="web-hero" style="background:var(--sky);margin-bottom:15px"><span class="label">A THOUGHTFUL LOOK BACK</span><h2>Notice what connects your conversations.</h2><p>These observations help you remember and act. They never rank people.</p></div>
    <div class="insights-grid"><div class="card sage"><b>New connections</b><p>You recorded four new people this season. Two conversations continued.</p></div><div class="card pink"><b>Promises to keep</b><p>Two small things you committed to can fit into this week.</p></div><div class="card sky"><b>Worth a check-in</b><p>Sarah and Alex have shared context you can pick up again.</p></div><div class="card sage-light"><b>Recurring themes</b><p>AI education, product design, and learning confidence keep appearing.</p></div></div>`,
  settings:()=>`${webHeader('MAKE BOND YOURS','Settings')}
    <div class="insights-grid"><div class="card sage"><b>Reminders</b><p>Proactive suggestions, quiet hours, and your follow-up rhythm.</p>${chip('10 PM – 9 AM quiet hours','ivory')}</div><div class="card sky"><b>Relationship goals</b><p>Manage your Learn, Collaborate, Stay in touch, and custom tags.</p></div><div class="card pink"><b>Privacy & export</b><p>Export or delete a person's profile, chat, timeline, and search data.</p></div><div class="card white"><b>About AI rehearsal</b><p>Bond simulates conversations from the details you provide. It never contacts the real person.</p></div></div>`
};
function escapeHtml(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderMap(){const map=state.platform==='mobile'?mobileMap:webMap;document.getElementById('screen-map').innerHTML=map.map(g=>`<p class="map-group">${g.group}</p>${g.items.map(([number,label,id])=>`<button class="map-button ${state[state.platform]===id?'active':''}" data-${state.platform}="${id}"><span class="map-number">${number}</span>${label}</button>`).join('')}`).join('')}
function renderMobile(){const root=['today','companion','meetings'].includes(state.mobile);const phone=document.getElementById('phone-preview');phone.classList.toggle('detail',!root);document.getElementById('mobile-content').innerHTML=mobileViews[state.mobile]();document.getElementById('mobile-content').scrollTop=0;document.getElementById('mobile-nav').innerHTML=[['today','Today','sun'],['companion','Companion','spark'],['meetings','Meetings','book']].map(([id,label,ic])=>`<button class="${state.mobile===id?'active':''}" data-mobile="${id}">${icon(ic)} ${label}</button>`).join('')}
function renderWeb(){document.getElementById('web-nav').innerHTML=`<div class="web-logo"><span>b</span>bond.</div>${[['people','People','grid'],['today','Today','sun'],['memories','Memories','book'],['insights','Insights','spark'],['settings','Settings','settings']].map(([id,label,ic])=>`<button class="nav-link ${state.web===id?'active':''}" data-web="${id}">${icon(ic)} ${label}</button>`).join('')}<div class="web-user">${avatar('R','pink')} Riley</div>`;document.getElementById('web-content').innerHTML=webViews[state.web]();document.getElementById('web-content').scrollTop=0;}
function switchPlatform(platform){state.platform=platform;document.getElementById('phone-preview').hidden=platform!=='mobile';document.getElementById('web-preview').hidden=platform!=='web';document.querySelectorAll('[data-platform]').forEach(b=>b.classList.toggle('active',b.dataset.platform===platform));renderMap();if(platform==='mobile')renderMobile();else renderWeb()}
function goMobile(id){if(!mobileViews[id])return;state.mobile=id;renderMap();renderMobile()}
function goWeb(id){if(!webViews[id])return;state.web=id;renderMap();renderWeb()}
function sendChat(){const input=document.getElementById('chat-input');if(!input)return;const text=input.value.trim();if(!text)return;state.messages.push({role:'user',text},{role:'ai',text:'That gives us a good place to start. What would you want to ask in person?'});renderMobile();const content=document.getElementById('mobile-content');content.scrollTop=content.scrollHeight}
document.addEventListener('click',event=>{const platform=event.target.closest('[data-platform]');if(platform){switchPlatform(platform.dataset.platform);return}const mob=event.target.closest('[data-mobile]');if(mob){if(mob.dataset.mode)state.chatMode=mob.dataset.mode;goMobile(mob.dataset.mobile);return}const web=event.target.closest('[data-web]');if(web){goWeb(web.dataset.web);return}const prompt=event.target.closest('[data-prompt]');if(prompt){const input=document.getElementById('chat-input');if(input){input.value=prompt.dataset.prompt;input.focus()}return}if(event.target.closest('[data-send]')){sendChat();return}const tag=event.target.closest('[data-tag]');if(tag)tag.classList.toggle('selected')});
document.addEventListener('keydown',event=>{if(event.target.id==='chat-input'&&event.key==='Enter'){event.preventDefault();sendChat()}});
switchPlatform('mobile');
