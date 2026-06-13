"use strict";
const fs   = require("fs");
const path = require("path");
const { safePost } = require("../../utils/apiHelper");

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const BOXES = [
  ["╔══『 📤 PASTEBIN 』══╗","╚══════════════════════╝"],
  ["┏━━『 🗂️ FILE UPLOAD 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["«━━◤ 📋 CODE SHARE ◢━━»","«━━━━━━━━━━━━━━━━━━━━━━━»"],
];

module.exports.config = {
  name: "bin", version: "2.0.0", hasPermssion: 2,
  credits: "BELAL BOTX666", description: "Command file pastebin এ upload করো",
  commandCategory: "utility", usages: "bin [filename]", cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const [bTop, bBot] = rand(BOXES);
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";

  if (!args[0]) return api.sendMessage(`${bTop}\n⚠️ ফাইলের নাম দিন।\nউদা: bin mycommand\n${bBot}`, threadID, messageID);

  const cmdDir  = path.join(__dirname, "..", "commands");
  const tryPath = [path.join(cmdDir, args[0]), path.join(cmdDir, args[0]+".js")];
  const filePath = tryPath.find(p => fs.existsSync(p));

  if (!filePath) return api.sendMessage(`${bTop}\n❌ ফাইল খুঁজে পাওয়া যায়নি!\n📁 নাম: ${args[0]}\n${bBot}`, threadID, messageID);

  const content = fs.readFileSync(filePath, "utf8");

  const wait = await api.sendMessage(`${bTop}\n📤 Upload হচ্ছে...\n${bBot}`, threadID);

  try {
    const APIS = [
      () => safePost("https://pastebin-api.vercel.app/paste", { text: content }, { timeout: 15000 })
              .then(r => r?.data?.id ? `https://pastebin-api.vercel.app/raw/${r.data.id}` : null),
      () => sastePost("https://haste.zneix.eu/documents", content, { headers:{"Content-Type":"text/plain"}, timeout:15000 })
              .then(r => r?.data?.key ? `https://haste.zneix.eu/raw/${r.data.key}` : null),
    ];

    let link = null;
    for (const fn of APIS) {
      try { link = await fn(); if (link) break; } catch {}
    }

    await api.unsendMessage(wait.messageID).catch(()=>{});

    if (!link) return api.sendMessage(`${bTop}\n❌ Upload ব্যর্থ হয়েছে!\n${bBot}`, threadID, messageID);

    return api.sendMessage(
`${bTop}
✅ Upload সফল!
━━━━━━━━━━━━━━━━━━
📁 File  : ${args[0]}
🔗 Link  : ${link}
━━━━━━━━━━━━━━━━━━
${bBot}${sig}`, threadID, messageID);

  } catch (e) {
    await api.unsendMessage(wait.messageID).catch(()=>{});
    api.sendMessage(`❌ Error: ${e.message}`, threadID, messageID);
  }
};
