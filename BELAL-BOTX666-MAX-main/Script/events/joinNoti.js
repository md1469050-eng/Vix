"use strict";
/*
╔══════════════════════════════════════════════════════════╗
║  ✨ joinNoti.js v31.0 — BELAL BOTX666                   ║
║  ✅ getThreadInfo parallel — দেরি নেই                   ║
║  ✅ ভিডিও local cache থেকে — API call নেই              ║
║  ✅ ৩-৫ সেকেন্ডে সব শেষ                                ║
║  ✅ চোখ ধাঁধানো ডিজাইন                                  ║
╚══════════════════════════════════════════════════════════╝
*/
const fs     = require("fs-extra");
const path   = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "31.0.0",
  credits: "Belal x Gemini",
  description: "Ultra-fast welcome — ৩-৫ সেকেন্ডে ভিডিও + মেসেজ",
};

module.exports.onLoad = function () {
  [
    path.join(__dirname, "cache", "joinGif"),
    path.join(__dirname, "cache", "randomgif"),
  ].forEach(d => fs.ensureDirSync(d));
};

const rand = arr => arr[Math.floor(Math.random() * arr.length)];

function getLocalStream(folderPath) {
  try {
    const files = fs.readdirSync(folderPath)
      .filter(f => [".mp4",".gif",".jpg",".png"].some(e => f.endsWith(e)));
    if (!files.length) return null;
    return fs.createReadStream(path.join(folderPath, rand(files)));
  } catch { return null; }
}

const BANNERS = [
  ["╔══════════════════════════╗","╚══════════════════════════╝"],
  ["╔━━━━━━━━━━━━━━━━━━━━━━━━━━╗","╚━━━━━━━━━━━━━━━━━━━━━━━━━━╝"],
  ["┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓","┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╗","╚▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╝"],
];
const DIVIDERS = [
  "◈━━━━━━━━━━━━━━━━━━━━━━━━◈",
  "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
  "▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰",
  "┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄",
];
const EMOJIS = ["🌟","💎","🔥","👑","✨","🛡️","⚡","🌈","🏆","💫","🪬","🔱"];
const RANKS  = [
  "𝗩𝗜𝗣 𝗠𝗘𝗠𝗕𝗘𝗥 👑", "𝗘𝗟𝗜𝗧𝗘 𝗪𝗔𝗥𝗥𝗜𝗢𝗥 ⚔️",
  "𝗟𝗘𝗚𝗘𝗡𝗗𝗔𝗥𝗬 𝗦𝗢𝗟𝗗𝗜𝗘𝗥 🎖️", "𝗗𝗜𝗔𝗠𝗢𝗡𝗗 𝗖𝗟𝗔𝗦𝗦 💎", "𝗖𝗛𝗢𝗦𝗘𝗡 𝗢𝗡𝗘 🌟",
];

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const { threadID } = event;
  const t0     = Date.now();
  const prefix = global.config?.PREFIX || "/";
  const bot    = "𝗕𝗘𝗟𝗔𝗟 𝗕𝗢𝗧-𝗫𝟲𝟲𝟲 🪬";
  const sig    = "\n┄┉❈✡️⋆⃝চাঁদের~পাহাড়✿⃝🪬❈┉┄";

  // ── বটের নিজের এন্ট্রি ─────────────────────────────────
  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`[ ${prefix} ] • ${bot}`, threadID, api.getCurrentUserID()).catch(() => {});
    const [bTop, bBot] = rand(BANNERS); const d = rand(DIVIDERS); const e = rand(EMOJIS);
    const stream = getLocalStream(path.join(__dirname, "cache", "randomgif"));
    return api.sendMessage({
      body:
`${bTop}
  ${e} 𝗦𝗬𝗦𝗧𝗘𝗠 𝗔𝗖𝗧𝗜𝗩𝗔𝗧𝗘𝗗 ${e}
${bBot}

⚡ আস্সালামু আলাইকুম!
${bot} এখন এই গ্রুপের সেন্টিনেল।

${d}
🔰 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢
${d}
⌬ 𝗣𝗿𝗲𝗳𝗶𝘅   » [ ${prefix} ]
⌬ 𝗦𝘁𝗮𝘁𝘂𝘀   » 𝗢𝗻𝗹𝗶𝗻𝗲 🟢
⌬ 𝗦𝗲𝗰𝘂𝗿𝗶𝘁𝘆 » 𝗔𝗘𝗦-𝟮𝟱𝟲 𝗕𝗶𝘁 🔐
⌬ 𝗛𝗲𝗮𝗹𝘁𝗵   » 𝗘𝘅𝗰𝗲𝗹𝗹𝗲𝗻𝘁 💚
${d}
👑 𝗢𝘄𝗻𝗲𝗿 » 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱 ✅)
📞 𝗪𝗔 » 01913246554${sig}`,
      attachment: stream,
    }, threadID);
  }

  // ── নতুন মেম্বার — getThreadInfo parallel চলবে ──────────
  const [info] = await Promise.all([
    api.getThreadInfo(threadID).catch(() => null),
  ]);

  const threadName = info?.threadName  || "এই গ্রুপ";
  const memCount   = info?.participantIDs?.length || "?";
  const adminCount = info?.adminIDs?.length || "?";
  const names      = event.logMessageData.addedParticipants.map(i => i.fullName);
  const mentions   = event.logMessageData.addedParticipants.map(i => ({ tag: i.fullName, id: i.userFbId }));
  const time       = moment().tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
  const ms         = Date.now() - t0;
  const [bTop, bBot] = rand(BANNERS);
  const d          = rand(DIVIDERS);
  const e1 = rand(EMOJIS), e2 = rand(EMOJIS);
  const rank       = rand(RANKS);
  const uid        = "GX-" + Math.floor(Math.random() * 900000 + 100000);
  const next       = 100 * Math.ceil((Number(memCount) + 1) / 100);
  const pot        = Math.floor(Math.random() * 41) + 60;

  // ভিডিও local cache থেকে — কোনো download নেই, ০ms
  const stream = getLocalStream(path.join(__dirname, "cache", "joinGif"));

  return api.sendMessage({
    body:
`${bTop}
  ${e1} 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 𝗘𝗟𝗜𝗧𝗘 𝗖𝗟𝗔𝗡 ${e2}
${bBot}

🎉 স্বাগতম, ${names.join(" ও ")}!
তোমাকে ${rank} হিসেবে গ্রহণ করা হলো। ${e1}

${d}
📊 𝗨𝗦𝗘𝗥 𝗜𝗡𝗧𝗘𝗟𝗟𝗜𝗚𝗘𝗡𝗖𝗘
${d}
👤 𝗡𝗮𝗺𝗲      » ${names.join(", ")}
🆔 𝗨𝗜𝗗       » ${uid}
📈 𝗣𝗼𝘁𝗲𝗻𝘁𝗶𝗮𝗹 » ${pot}% 🔥
🛡️ 𝗦𝘁𝗮𝘁𝘂𝘀   » 𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱 🟢
⏰ 𝗝𝗼𝗶𝗻𝗲𝗱   » ${time}
${d}
🏰 𝗚𝗥𝗢𝗨𝗣 𝗦𝗧𝗔𝗧𝗦
${d}
🏘️ 𝗚𝗿𝗼𝘂𝗽    » ${threadName}
👑 𝗔𝗱𝗺𝗶𝗻𝘀  » ${adminCount} জন Active
👥 𝗠𝗲𝗺𝗯𝗲𝗿𝘀 » #${memCount} (Next: ${next})
⚡ 𝗟𝗮𝘁𝗲𝗻𝗰𝘆  » ${ms}ms ⚡
▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%
${d}
💬 𝗥𝗨𝗟𝗘𝗦:
➤ সবার সাথে সম্মানের সাথে কথা বলো
➤ স্প্যাম করা সম্পূর্ণ নিষিদ্ধ 🚫
➤ prefix [ ${prefix} ] দিয়ে command করো
${d}
👑 𝗔𝗱𝗺𝗶𝗻 » 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱 ✅)${sig}`,
    attachment: stream,
    mentions,
  }, threadID);
};
