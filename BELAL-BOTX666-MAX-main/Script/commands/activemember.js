"use strict";
/*
╔══════════════════════════════════════════════════════╗
║   🤖 BELAL BOTX666 — activemember.js v3.0           ║
║   ✅ শীর্ষ ১০ active member leaderboard             ║
║   ✅ tag সহ সুন্দর বাংলা design                     ║
╚══════════════════════════════════════════════════════╝
*/
const moment = require("moment-timezone");

module.exports = {
  config: {
    name:         "activemember",
    aliases:      ["active", "topmember", "leaderboard"],
    version:      "3.0.0",
    author:       "BELAL BOTX666 🪬",
    countDown:    15,
    role:         0,
    hasPermssion: 0,
    commandCategory: "group",
    shortDescription: { en: "শীর্ষ ১০ active member এর leaderboard দেখায়" },
    guide: { en: "{pn}activemember" },
  },

  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const sig = "\n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n⏰ " + bdTime;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const loadMsg = await api.sendMessage(
      "╔══『 𝗔𝗖𝗧𝗜𝗩𝗘 𝗠𝗘𝗠𝗕𝗘𝗥 』══╗\n" +
      "⏳ র‍্যাঙ্ক বিশ্লেষণ হচ্ছে...\n" +
      "📊 শেষ ১০০০ মেসেজ চেক করা হচ্ছে!",
      threadID
    );

    try {
      const threadInfo   = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs;
      const messages     = await api.getThreadHistory(threadID, 1000);

      // Count messages per user
      const count = {};
      participantIDs.forEach(id => { count[id] = 0; });
      messages.forEach(msg => {
        if (count[msg.senderID] !== undefined) count[msg.senderID]++;
      });

      // Top 10
      const top = Object.entries(count)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .filter(([, c]) => c > 0);

      if (!top.length) {
        await api.unsendMessage(loadMsg.messageID).catch(() => {});
        api.setMessageReaction("😶", messageID, () => {}, true);
        return api.sendMessage("❌ কোনো active member পাওয়া যায়নি!", threadID, messageID);
      }

      const MEDALS  = { 0: "🥇", 1: "🥈", 2: "🥉" };
      const TITLES  = [
        "「 𝗟𝗘𝗚𝗘𝗡𝗗 」👑", "「 𝗘𝗟𝗜𝗧𝗘 」💎",
        "「 𝗪𝗔𝗥𝗥𝗜𝗢𝗥 」⚔️", "「 𝗔𝗖𝗧𝗜𝗩𝗘 」🔥",
        "「 𝗔𝗖𝗧𝗜𝗩𝗘 」🔥", "「 𝗦𝗨𝗣𝗣𝗢𝗥𝗧𝗘𝗥 」✨",
        "「 𝗦𝗨𝗣𝗣𝗢𝗥𝗧𝗘𝗥 」✨", "「 𝗦𝗨𝗣𝗣𝗢𝗥𝗧𝗘𝗥 」✨",
        "「 𝗠𝗘𝗠𝗕𝗘𝗥 」💬", "「 𝗠𝗘𝗠𝗕𝗘𝗥 」💬",
      ];

      let body     =
        "╔═══『 𝗚𝗥𝗢𝗨𝗣 𝗟𝗘𝗔𝗗𝗘𝗥𝗕𝗢𝗔𝗥𝗗 』═══╗\n" +
        "║  🏆 শীর্ষ Active Member 🏆  ║\n" +
        "╚══════════════════════════╝\n\n";
      const mentions = [];

      for (let i = 0; i < top.length; i++) {
        const [uid, cnt] = top[i];
        let name = "User";
        try {
          const info = await api.getUserInfo(uid);
          name = info[uid]?.name || "User";
        } catch {}

        const icon = MEDALS[i] || `🔹 ${i + 1}.`;
        body += `${icon} ${name}\n`;
        body += `╰─ ${TITLES[i]} 💬 ${cnt.toLocaleString()} মেসেজ\n\n`;
        mentions.push({ tag: name, id: uid });
      }

      body +=
        "━━━━━━━━━━━━━━━━━━━━━━━━\n" +
        "📊 শেষ ১,০০০ মেসেজ বিশ্লেষণ\n" +
        "🌟 আড্ডা দিয়ে র‍্যাঙ্ক ধরে রাখো!" +
        sig;

      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      api.setMessageReaction("🏆", messageID, () => {}, true);
      return api.sendMessage({ body, mentions }, threadID, messageID);

    } catch (e) {
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(
        "❌ leaderboard লোড করতে সমস্যা হয়েছে!\n📝 " + e.message?.slice(0, 80),
        threadID, messageID
      );
    }
  },
};
