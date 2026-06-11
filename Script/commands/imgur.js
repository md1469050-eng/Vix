"use strict";
const axios  = require("axios");
const moment = require("moment-timezone");
const { getBaseApi, safeGet, getUA } = require("../../utils/apiHelper");

// ৩টা Imgur-compatible upload API
const IMGUR_APIS = [
  (url, base) => `${base}/imgur?link=${encodeURIComponent(url)}`,
  (url)       => `https://aryan-xyz-google-drive.vercel.app/imgur?url=${encodeURIComponent(url)}`,
  (url)       => `https://bk9.fun/upload/imgur?url=${encodeURIComponent(url)}`,
];

async function uploadToImgur(attUrl) {
  const base = await getBaseApi();
  for (const b of IMGUR_APIS) {
    try {
      const r = await safeGet(b(attUrl, base), { timeout: 25000 });
      const d = r?.data || {};
      const link = d?.uploaded?.image || d?.link || d?.url || d?.data?.link;
      if (link) return link;
    } catch {}
  }
  throw new Error("সব Imgur API ব্যর্থ হয়েছে");
}

module.exports = {
  config: {
    name: "imgur", aliases: ["imgupload","imglink"],
    version: "4.0.0", author: "BELAL BOTX666 🪬",
    countDown: 5, role: 0, hasPermssion: 0, category: "Media",
    shortDescription: { en: "ছবি/ভিডিও/GIF Imgur এ upload করে direct link দেয়" },
    guide: { en: "যেকোনো media তে reply দিয়ে {pn}imgur লিখো" },
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const header = "╔═══『 𝐈𝐌𝐆𝐔𝐑 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑 』═══╗\n║  ☁️  Fast Cloud Upload  ☁️  ║\n╚══════════════════════════╝";
    const sig = "\n┄┉❈চাঁদেড়~পাহাড়❈┉┄\n⏰ " + bdTime;

    if (!messageReply?.attachments?.length) {
      return api.sendMessage(`${header}\n\n⚠️ কোনো ছবি/ভিডিও/GIF এ reply দিয়ে কমান্ড দাও!${sig}`, threadID, messageID);
    }

    api.setMessageReaction("⏳", messageID, ()=>{}, true);
    const links = [], failed = [];

    for (let i = 0; i < messageReply.attachments.length; i++) {
      const att = messageReply.attachments[i];
      try {
        const link = await uploadToImgur(att.url);
        links.push(`${i+1}. 🔗 ${link}`);
      } catch {
        failed.push(`${i+1}. ❌ upload ব্যর্থ`);
      }
    }

    api.setMessageReaction(links.length ? "✅" : "❌", messageID, ()=>{}, true);
    let body = `${header}\n\n`;
    if (links.length) body += links.length === 1 ? `✅ Upload সফল!\n\n🔗 Link:\n${links[0].replace("1. 🔗 ","")}` : `✅ ${links.length}টি file upload সফল!\n\n${links.join("\n")}`;
    if (failed.length) body += `\n\n❌ ব্যর্থ (${failed.length}টি):\n${failed.join("\n")}`;
    body += sig;
    return api.sendMessage(body, threadID, messageID);
  },
};
