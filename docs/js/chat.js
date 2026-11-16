/* Scripted personality bots. No AI and no network: each type answers from a small set of
   lines chosen by its temperament and by keywords in what you typed. */
const NAMES = { INTJ: "The Mastermind", INTP: "The Logician", ENTJ: "The Commander", ENTP: "The Debater",
  INFJ: "The Advocate", INFP: "The Mediator", ENFJ: "The Protagonist", ENFP: "The Campaigner",
  ISTJ: "The Logistician", ISFJ: "The Defender", ESTJ: "The Executive", ESFJ: "The Consul",
  ISTP: "The Virtuoso", ISFP: "The Adventurer", ESTP: "The Entrepreneur", ESFP: "The Entertainer" };
const HAS_IMAGE = ["enfp", "entp", "esfj", "estp", "infj", "intj", "intp", "istp"];
const VOICE = {
  NT: { hello: "State your question. I'll look for the structure in it.",
        why: "Start from first principles: what must be true for that to hold?",
        feel: "I'd separate the feeling from the facts first, then weigh both.",
        plan: "Define the goal, list the constraints, then pick the shortest path that satisfies them.",
        other: ["Interesting. What's the underlying model?", "I'd want evidence before I agree.", "There's a cleaner way to frame that."] },
  NF: { hello: "Hi! Tell me what's on your mind, and what it means to you.",
        why: "Maybe ask what it's in service of. What matters to you here?",
        feel: "That sounds like it carries weight. What would feel true to you?",
        plan: "Begin with who it's for. The steps get clearer once the purpose is.",
        other: ["I can see why you'd care about that.", "What would the best version of this look like?", "There's a story in that. Tell me more."] },
  SJ: { hello: "Hello. What needs doing, and by when?",
        why: "Because it has worked before. What does the record say?",
        feel: "That's understandable. What's one practical thing that would help today?",
        plan: "Write the steps down in order, give each a date, and start with the first.",
        other: ["Let's be precise about that.", "What did you do last time?", "Good. Now what's the next step?"] },
  SP: { hello: "Hey. What are we doing?",
        why: "Try it and see. You'll learn faster than by arguing about it.",
        feel: "Fair. Want to go do something and think about it after?",
        plan: "Skip the plan. What's the first thing you can do in the next ten minutes?",
        other: ["Show me.", "Sounds fun. What's the catch?", "Less talking, more trying."] },
};
const temperament = (t) => t[1] === "N" ? (t[2] === "T" ? "NT" : "NF") : (t[3] === "J" ? "SJ" : "SP");
function reply(type, text) {
  const v = VOICE[temperament(type)], s = text.toLowerCase();
  if (/^(hi|hey|hello|yo)\b/.test(s)) return v.hello;
  if (/\bwhy\b|\bhow come\b/.test(s)) return v.why;
  if (/feel|sad|happy|anxious|stress|tired|love/.test(s)) return v.feel;
  if (/plan|should i|how do i|goal|start/.test(s)) return v.plan;
  return v.other[Math.floor(Math.random() * v.other.length)];
}

document.addEventListener("DOMContentLoaded", () => {
  const fromUrl = (new URLSearchParams(location.search).get("type") || "").toUpperCase();
  const fromTitle = (document.title.match(/\b[EI][NS][TF][JP]\b/) || [])[0];
  const type = NAMES[fromUrl] ? fromUrl : fromTitle;
  const box = document.getElementById("chat-box"), form = document.getElementById("chat-form"), input = document.getElementById("chat-input");
  if (!type || !box || !form) return;

  // the generic page (bot.html?type=xxxx) fills in its own heading and avatar
  const title = document.getElementById("bot-title"), avatar = document.getElementById("bot-avatar");
  if (title) { title.textContent = `${type} – ${NAMES[type]}`; document.title = `${type} – ${NAMES[type]} Bot`; }
  if (avatar) { if (HAS_IMAGE.includes(type.toLowerCase())) avatar.innerHTML = `<img src="../assets/images/${type.toLowerCase()}.png" alt="${type} bot" class="bot-avatar">`; else avatar.textContent = type; }

  const say = (text, mine) => {
    const b = document.createElement("div");
    b.className = (mine ? "self-end bg-teal-600" : "self-start bg-gray-700") + " px-4 py-2 rounded-lg max-w-md text-left";
    b.textContent = text; box.appendChild(b); box.scrollTop = box.scrollHeight;
  };
  say(VOICE[temperament(type)].hello, false);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim(); if (!text) return;
    say(text, true); input.value = "";
    setTimeout(() => say(reply(type, text), false), 350);
  });
});
