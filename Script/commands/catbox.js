"use strict";
/*
╔══════════════════════════════════════════════════════╗
║   🤖 BELAL BOTX666 — catbox.js v3.0                 ║
║   ✅ Promise.any fastStream — চোখের পলকে            ║
║   ✅ image / video / audio / gif সব ধরন             ║
║   ✅ auto cache cleanup                              ║
╚══════════════════════════════════════════════════════╝
*/

const axios    = require("axios");
const fs       = require("fs-extra");
const path     = require("path");
const FormData = require("form-data");
const moment   = require("moment-timezone");

// ── fastStream: Promise.any দিয়ে fastest download ────────────────
async function fastDownload(url, filePath) {
  const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124",
    "Accept":     "*/*",
    "Connection": "keep-alive",
  };
  // ৩টা parallel request — যেটা আগে আসে সেটা নেয়
  const attempts = [url, url, url].map(u =>
    axios({ method: "GET", url: u, responseType: "stream", headers: HEADERS, timeout: 20000 })
      .then(r => new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        r.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      }))
  );
  return Promise.any(attempts);
}

module.exports = {
  config: {
    name:        "catbox",
    aliases:     ["upload", "link", "cb"],
    version:     "3.0.0",
    author:      "BELAL BOTX666 🪬",
    countDown:   5,
    role:        0,
    hasPermssion: 0,
    category:    "Media",
    shortDescription: { en: "যেকোনো media Catbox এ upload করে permanent link দেয়" },
    guide:       { en: "যেকোনো media তে reply দিয়ে {pn}catbox লিখো" },
  },

  onStart: async function ({ api, event }) {
    const { threadID, messageID, messageReply, type } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");

    const header =
      "╔═══『 𝐂𝐀𝐓𝐁𝐎𝐗 𝐔𝐏𝐋𝐎𝐀𝐃𝐄𝐑 』═══╗\n" +
      "║  ⚡ Lightning Fast Upload ⚡ ║\n" +
      "╚═══════════════════════════╝";

    const sig =
      "\n┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄" +
      `\n⏰ ${bdTime}`;

    // ── Attachment check ────────────────────────────────────────
    if (type !== "message_reply" || !messageReply?.attachments?.length) {
      return api.sendMessage(
        `${header}\n\n⚠️ কোনো ছবি/ভিডিও/অডিও/GIF এ reply দিয়ে কমান্ড দাও!\n\n📌 ব্যবহার:\n• media তে reply দাও\n• তারপর catbox লিখো${sig}`,
        threadID, messageID
      );
    }

    const file     = messageReply.attachments[0];
    const cacheDir = path.join(process.cwd(), "tmp");
    await fs.ensureDir(cacheDir);

    const ext      = file.filename?.split(".").pop() || "bin";
    const filePath = path.join(cacheDir, `catbox_${Date.now()}.${ext}`);

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const loadMsg = await api.sendMessage(
      `${header}\n\n☁️ ফাইল আপলোড হচ্ছে...\n⚡ একটু অপেক্ষা করো!`,
      threadID
    );

    try {
      // ── Fast download ─────────────────────────────────────────
      await fastDownload(file.url, filePath);

      // ── Upload to Catbox ──────────────────────────────────────
      const form = new FormData();
      form.append("file", fs.createReadStream(filePath));

      const uploadRes = await axios.post(
        "https://catbox-api-d07o.onrender.com/upload",
        form,
        {
          headers:          { ...form.getHeaders() },
          maxContentLength: Infinity,
          maxBodyLength:    Infinity,
          timeout:          30000,
        }
      );

      // ── Cleanup ───────────────────────────────────────────────
      await fs.remove(filePath).catch(() => {});
      await api.unsendMessage(loadMsg.messageID).catch(() => {});

      if (!uploadRes.data?.url) throw new Error("URL পাওয়া যায়নি");

      api.setMessageReaction("✅", messageID, () => {}, true);

      // ── File type detect ──────────────────────────────────────
      const ftype = file.type || "";
      const icon  = ftype.includes("video") ? "🎬" :
                    ftype.includes("audio") ? "🎵" :
                    ftype.includes("gif")   ? "🎞️" : "🖼️";

      return api.sendMessage(
        `${header}\n\n` +
        `✅ 𝐔𝐩𝐥𝐨𝐚𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥!\n\n` +
        `${icon} ফাইল: ${file.filename || "media"}\n` +
        `📦 সাইজ: ${file.fileSize ? (file.fileSize / 1024 / 1024).toFixed(2) + " MB" : "অজানা"}\n\n` +
        `🔗 𝐋𝐢𝐧𝐤:\n${uploadRes.data.url}` +
        sig,
        threadID, messageID
      );

    } catch (e) {
      await fs.remove(filePath).catch(() => {});
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);

      return api.sendMessage(
        `${header}\n\n` +
        `❌ আপলোড ব্যর্থ হয়েছে!\n` +
        `📝 কারণ: ${e.message?.slice(0, 100)}\n` +
        `🔄 কিছুক্ষণ পরে আবার চেষ্টা করো।` +
        sig,
        threadID, messageID
      );
    }
  },
};
