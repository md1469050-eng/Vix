"use strict";
const moment = require("moment-timezone");
const { safeGet } = require("../../utils/apiHelper");

const DRIVE_APIS = [
  url => `https://aryan-xyz-google-drive.vercel.app/drive?url=${encodeURIComponent(url)}&apikey=ArYAN`,
  url => `https://gdrive-upload.vercel.app/api/upload?url=${encodeURIComponent(url)}`,
  url => `https://bk9.fun/upload/gdrive?url=${encodeURIComponent(url)}`,
];

async function uploadToDrive(inputUrl) {
  for (const b of DRIVE_APIS) {
    try {
      const r = await safeGet(b(inputUrl), { timeout: 35000 });
      const d = r?.data || {};
      const link = d.driveLink || d.driveLIink || d.link || d.url || d.download_url;
      if (link) return link;
    } catch {}
  }
  throw new Error("সব Drive API ব্যর্থ হয়েছে");
}

module.exports = {
  config: {
    name: "drive", aliases: ["gdrive","googledrive","gd"],
    version: "4.0.0", author: "BELAL BOTX666 🪬",
    countDown: 5, role: 0, hasPermssion: 0, category: "Media",
    shortDescription: { en: "media Google Drive এ upload করে link দেয়" },
    guide: { en: "media reply → {pn}drive অথবা {pn}drive [url]" },
  },
  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, messageReply } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const header = "╔════『 𝐆𝐎𝐎𝐆𝐋𝐄 𝐃𝐑𝐈𝐕𝐄 』════╗\n║  ☁️  Cloud Storage Upload  ☁️  ║\n╚═══════════════════════════╝";
    const sig = "\n┄┉❈চাঁদেড়~পাহাড়❈┉┄\n⏰ " + bdTime;

    let inputUrl = null, fileName = "media";
    if (messageReply?.attachments?.length > 0) {
      inputUrl = messageReply.attachments[0].url;
      fileName = messageReply.attachments[0].filename || "media";
    } else if (args.length > 0) inputUrl = args[0];

    if (!inputUrl) return api.sendMessage(`${header}\n\n⚠️ media তে reply দিয়ে drive লিখো\nঅথবা drive [url]${sig}`, threadID, messageID);

    api.setMessageReaction("⏳", messageID, () => {}, true);
    const loadMsg = await api.sendMessage(`${header}\n\n☁️ Upload হচ্ছে... ⚡`, threadID);
    try {
      const link = await uploadToDrive(inputUrl);
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      api.setMessageReaction("✅", messageID, () => {}, true);
      api.sendMessage(`${header}\n\n✅ Upload সফল!\n\n📁 ${fileName}\n\n🔗 Drive Link:\n${link}${sig}`, threadID, messageID);
    } catch (e) {
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(`${header}\n\n❌ Upload ব্যর্থ!\n${e.message.slice(0,100)}${sig}`, threadID, messageID);
    }
  },
};
