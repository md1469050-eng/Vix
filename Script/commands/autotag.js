"use strict";
const moment = require("moment-timezone");
const { safeGet } = require("../../utils/apiHelper");

const autoTagThreads = new Map();
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const EMOJIS = ["🪬","🔥","🔱","⚡","👑","💎","✨","🌟","🛡️","💫"];
const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";

module.exports = {
  config: {
    name: "autotag", version: "9.0", author: "BELAL BOTX666 🪬",
    countDown: 5, role: 1, category: "box chat",
    description: "প্রতি ২ ঘণ্টায় সবাইকে ট্যাগ করে",
    guide: "autotag on | autotag off",
  },

  onStart: async function ({ message, event, args, api }) {
    const { threadID } = event;
    const head = "«━━━◤ 📡 AUTO TAG ◢━━━»";

    if (args[0] === "off") {
      if (autoTagThreads.has(threadID)) {
        clearInterval(autoTagThreads.get(threadID));
        autoTagThreads.delete(threadID);
        return message.reply(`${head}\n❌ অটো ট্যাগ বন্ধ।${sig}`);
      }
      return message.reply(`${head}\n⚠️ আগে থেকেই অফ আছে।`);
    }

    if (autoTagThreads.has(threadID))
      return message.reply(`${head}\n⚠️ অলরেডি চালু আছে!`);

    const interval = setInterval(async () => {
      try {
        const info    = await api.getThreadInfo(threadID);
        const members = info.participantIDs;
        const time    = moment().tz("Asia/Dhaka").format("hh:mm A");
        const date    = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");
        const e1 = rand(EMOJIS), e2 = rand(EMOJIS), e3 = rand(EMOJIS);

        let weather = "তথ্য নেই";
        try {
          const w = await safeGet("https://wttr.in/Kurigram?format=3", { timeout: 5000 });
          if (w?.data) weather = w.data;
        } catch {}

        const body =
`«━━━◤ ${e1} ATTENTION ${e2} ◢━━━»

👥 @everyone
━━━━━━━━━━━━━━━━━━
⚡ সবাই অনলাইনে আসুন! ${e3}
🪬 চাঁদের পাহাড় নজর রাখছেন 👀
━━━━━━━━━━━━━━━━━━
⏰ Time    » ${time}
📅 Date    » ${date}
🌦️ Weather » ${weather}
━━━━━━━━━━━━━━━━━━
👑 BELAL | WA: 01913246554
🔥 BOTX666 SYSTEM 🪬${sig}`;

        const idx      = body.indexOf("@everyone");
        const mentions = members.map(uid => ({ tag: "@", id: uid, fromIndex: idx }));

        api.sendMessage({ body, mentions }, threadID, (err, info) => {
          if (!err && info?.messageID)
            setTimeout(() => api.unsendMessage(info.messageID).catch(() => {}), 2 * 60 * 1000);
        });
      } catch (e) { console.error("autotag:", e.message); }
    }, 2 * 60 * 60 * 1000);

    autoTagThreads.set(threadID, interval);
    return message.reply(`${head}\n✅ অটো ট্যাগ চালু!\n⏰ প্রতি ২ ঘণ্টায় সবাইকে ট্যাগ করবে।${sig}`);
  },
};
