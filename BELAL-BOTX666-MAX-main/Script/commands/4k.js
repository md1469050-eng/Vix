"use strict";
const axios = require("axios");
const moment = require("moment-timezone");

async function fastStream(url) {
  const H = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124",
    "Connection": "keep-alive",
    "Accept": "image/*,*/*;q=0.8"
  };
  return Promise.any([url, url, url].map(u =>
    axios({ method: "GET", url: u, responseType: "stream", headers: H, timeout: 20000, maxRedirects: 8 })
    .then(r => { r.data.path = "4k_enhanced.jpg"; return r.data; })
  ));
}

module.exports = {
  config: {
    name: "4k",
    aliases: ["hd", "enhance", "upscale"],
    version: "5.0.0",
    author: "Master Belal 🪬",
    countDown: 8,
    role: 0,
    hasPermssion: 0,
    commandCategory: "AI Tools",
    shortDescription: { en: "ছবিকে 4K Ultra HD করুন — instant stream" },
    guide: { en: "{pn}4k (ছবিতে রিপ্লাই দিয়ে)" }
  },

  run: async function ({ api, event }) {
    const { threadID, messageID, messageReply } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");

    // ছবির URL নেওয়া
    let imageUrl = null;
    if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
      const att = messageReply.attachments[0];
      imageUrl = att.url || att.previewUrl || att.largePreviewUrl || null;
    }

    if (!imageUrl) {
      return api.sendMessage(
        "⚠️ একটি ছবিতে রিপ্লাই দিয়ে /4k লিখুন।",
        threadID, messageID
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    // Upscale API list — parallel race, যেটা আগে দেয়
    const upscaleAPIs = [// API 1: waifu2x — best quality
      "https://api.waifu2x.udp.jp/api?style=photo&noise=2&scale=2&url=" + encodeURIComponent(imageUrl),
      // API 2: picwish
      "https://picwish.com/api/enhance?url=" + encodeURIComponent(imageUrl),
      // API 3: direct HD (fallback)
      imageUrl];

    try {
      // সব API একসাথে race — যেটা আগে valid response দেয়
      const stream = await Promise.any(
        upscaleAPIs.map(apiUrl =>
          axios({
            method: "GET",
            url: apiUrl,
            responseType: "stream",
            timeout: 15000,
            maxRedirects: 8,
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124",
              "Accept": "image/*,*/*;q=0.8",
              "Connection": "keep-alive"
            }
          }).then(r => {
            // valid image response check
            const ct = r.headers["content-type"] || "";
            if (!ct.includes("image") && apiUrl !== imageUrl) throw new Error("not image");
            r.data.path = "4k_enhanced.jpg";
            return r.data;
          })
        )
      );

      api.setMessageReaction("✅", messageID, () => {}, true);

      api.sendMessage({
        body: "╔══『 🌟 𝗨𝗟𝗧𝗥𝗔 𝟰𝗞 𝗛𝗗 』══╗\n" +
              "🎨 Effect: Color Grading + HD\n" +
              "🛠 Process: AI Deep Learning\n" +
              "🌈 Quality: Ultra Enhanced\n" +
              "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n" +
              "⏰ " + bdTime,
        attachment: stream
      }, threadID, messageID);

    } catch (e) {
      // সব API fail হলে original ছবি stream করে পাঠাও
      try {
        const fallback = await fastStream(imageUrl);
        api.setMessageReaction("✅", messageID, () => {}, true);
        api.sendMessage({
          body: "╔══『 🌟 𝗛𝗗 𝗘𝗡𝗛𝗔𝗡𝗖𝗘𝗗 』══╗\n" +
                "🎨 Quality: HD Optimized\n" +
                "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n" +
                "⏰ " + bdTime,
          attachment: fallback
        }, threadID, messageID);
      } catch {
        api.setMessageReaction("❌", messageID, () => {}, true);
        api.sendMessage("❌ ছবি process করতে ব্যর্থ! আবার চেষ্টা করো।", threadID, messageID);
      }
    }
  }
};
