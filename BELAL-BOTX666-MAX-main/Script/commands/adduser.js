"use strict";
/*
╔══════════════════════════════════════════════════════╗
║   🤖 BELAL BOTX666 — adduser.js v3.0                ║
║   ✅ ID বা profile link দিয়ে user add করা           ║
║   ✅ সুন্দর বাংলা design                            ║
╚══════════════════════════════════════════════════════╝
*/
const moment = require("moment-timezone");

async function getUID(url, api) {
  if (!url.includes("facebook.com") && !url.includes("fb.com"))
    return [url, null, false];
  try {
    if (!url.includes("http://") && !url.includes("https://"))
      url = "https://" + url;
    let data  = await api.httpGet(url);
    const redirect = /for \(;;\);\{"redirect":"(.*?)"\}/.exec(data);
    if (data.includes('"redirect"')) data = await api.httpGet(redirect[1].replace(/\\/g, "").replace(/(?<=\?\s*)(.*)/, "").slice(0, -1));
    const regexID   = /"userID":"(\d+)"/.exec(data);
    const regexName = /"title":"(.*?)"/.exec(data);
    const name = regexName ? JSON.parse(`{"n":"${regexName[1]}"}`).n : null;
    return [+regexID[1], name, false];
  } catch {
    return [null, null, true];
  }
}

module.exports = {
  config: {
    name:         "adduser",
    aliases:      ["add", "addmember"],
    version:      "3.0.0",
    author:       "BELAL BOTX666 🪬",
    countDown:    5,
    role:         0,
    hasPermssion: 1,
    commandCategory: "group",
    shortDescription: { en: "ID বা link দিয়ে group এ user add করো" },
    guide: { en: "{pn}adduser [id অথবা profile link]" },
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const sig = "\n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n⏰ " + bdTime;

    const header =
      "╔══『 𝗔𝗗𝗗 𝗨𝗦𝗘𝗥 』══╗\n" +
      "║  👥 Group এ Add করো  ║\n" +
      "╚═══════════════════╝";

    const out = msg => api.sendMessage(msg, threadID, messageID);

    if (!args[0])
      return out(`${header}\n\n⚠️ ব্যবহার:\n📌 ${header.slice(50)}\n• adduser [Facebook ID]\n• adduser [Profile Link]` + sig);

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
    const botID = String(api.getCurrentUserID());
    participantIDs = participantIDs.map(e => String(e));

    async function addUser(id, name) {
      id = String(id);
      if (participantIDs.includes(id))
        return out(`${header}\n\n⚠️ ${name || "এই user"} ইতিমধ্যে গ্রুপে আছে!` + sig);

      try {
        await api.addUserToGroup(id, threadID);
        api.setMessageReaction("✅", messageID, () => {}, true);
        const admins = (adminIDs || []).map(e => String(e.id));
        if (approvalMode && !admins.includes(botID))
          return out(`${header}\n\n⚠️ ${name || "User"} কে approval list এ add করো!` + sig);
        return out(`${header}\n\n✅ ${name || "User"} (${id}) কে group এ add করা হয়েছে! 🎉` + sig);
      } catch {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return out(`${header}\n\n❌ ${name || "User"} কে add করা যায়নি!\n💡 বট admin কিনা চেক করো।` + sig);
      }
    }

    if (!isNaN(args[0])) {
      return addUser(args[0], undefined);
    } else {
      try {
        const [id, name, fail] = await getUID(args[0], api);
        if (fail || !id)
          return out(`${header}\n\n❌ User ID খুঁজে পাওয়া যায়নি!\n💡 সঠিক profile link দাও।` + sig);
        return addUser(id, name || "Facebook User");
      } catch (e) {
        api.setMessageReaction("❌", messageID, () => {}, true);
        return out(`${header}\n\n❌ ত্রুটি: ${e.message}` + sig);
      }
    }
  },
};
