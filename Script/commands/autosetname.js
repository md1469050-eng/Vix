"use strict";
const moment = require("moment-timezone");
const sig    = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";

module.exports = {
  config: {
    name: "autosetname", aliases: ["autoname","setnickname"],
    version: "3.0.0", author: "BELAL BOTX666 🪬",
    countDown: 5, role: 1, category: "Admin Tool",
    description: { en: "নতুন মেম্বারের nickname auto set করে" },
    guide: { en: "{pn} on/off | {pn} set <format> | {pn} status\n🔖 {name}=নাম, {id}=UID" },
  },

  onStart: async function ({ message, event, args, threadsData }) {
    const { threadID } = event;
    const time = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YY");
    const head = "«━━━◤ 🏷️ AUTO-NAME ◢━━━»";

    if (args[0] === "on" || args[0] === "off") {
      const on = args[0] === "on";
      await threadsData.set(threadID, on, "settings.enableAutoSetName");
      return message.reply(`${head}\n${on ? "✅ চালু" : "❌ বন্ধ"} করা হয়েছে!\n⏰ ${time}${sig}`);
    }

    if (args[0] === "set") {
      const fmt = args.slice(1).join(" ");
      if (!fmt) return message.reply(`${head}\n⚠️ Format দিন!\nউদা: {pn} set [NEW] {name}${sig}`);
      await threadsData.set(threadID, fmt, "data.autoSetName");
      return message.reply(`${head}\n✅ Format সেট হয়েছে!\n📝 ${fmt}\n⏰ ${time}${sig}`);
    }

    if (args[0] === "status") {
      const fmt = await threadsData.get(threadID, "data.autoSetName") || "সেট হয়নি";
      const on  = await threadsData.get(threadID, "settings.enableAutoSetName");
      return message.reply(`${head}\n🟢 Status: ${on ? "ACTIVE ✅" : "INACTIVE ❌"}\n📝 Format: ${fmt}\n⏰ ${time}${sig}`);
    }

    return message.reply(`${head}\n❓ ব্যবহার:\n▶ {pn} on/off\n▶ {pn} set [format]\n▶ {pn} status${sig}`);
  },

  onEvent: async ({ event, api, threadsData }) => {
    if (event.logMessageType !== "log:subscribe") return;
    const { threadID, logMessageData } = event;
    const on  = await threadsData.get(threadID, "settings.enableAutoSetName");
    if (!on) return;
    const fmt = await threadsData.get(threadID, "data.autoSetName");
    if (!fmt) return;
    for (const m of logMessageData.addedParticipants) {
      const name = fmt.replace(/\{name\}/g, m.fullName).replace(/\{id\}/g, m.userFbId);
      setTimeout(async () => {
        try { await api.changeNickname(name, threadID, m.userFbId); }
        catch (e) { console.error("autosetname:", e.message); }
      }, 1500);
    }
  },
};
