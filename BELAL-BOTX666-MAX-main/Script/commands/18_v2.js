"use strict";
const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const moment = require("moment-timezone");

const VIDEO_LINKS = [
"https://drive.google.com/uc?export=download&id=1OZUKqC7ooU572Vice1a0w3O3qRbC1F-r",
"https://drive.google.com/uc?export=download&id=1P36Avho0fdTGnIm--wsIbSXqvTtaNbGA",
"https://drive.google.com/uc?export=download&id=1PU4U-VHzWzZ_3chEOUdUJOeOj_8QTC19",
"https://drive.google.com/uc?export=download&id=1Q-ZiZE9B1nADleloUlZPk9Yt2UcT9Jli",
"https://drive.google.com/uc?export=download&id=1Q6ZlUc7gYbKng2T5BW8ihDXSohNVvl9i",
"https://drive.google.com/uc?export=download&id=1QS5LbZmGXsHynBSVP2eNMBctjp7i8Veh",
"https://drive.google.com/uc?export=download&id=1QoegqFfHWnaSRimcwZouya7xM9aIYOLO",
"https://drive.google.com/uc?export=download&id=1RFtXmVTzPt6LkpX2q_2co9_-lpKI5czZ",
"https://drive.google.com/uc?export=download&id=1Rtx9IpniEP0RQ8cREvf4q5OjoBvlxlVd",
"https://drive.google.com/uc?export=download&id=1RwR0hE9oroYy1r92qySPSFbddsBdnGZd",
"https://drive.google.com/uc?export=download&id=1TAshp38cUnJ0bQxSnlur_srBG-iSmhKZ",
"https://drive.google.com/uc?export=download&id=1V5IB7_yn1mPhgnY15Zqo7hl6_ypAj-c_",
"https://drive.google.com/uc?export=download&id=1VdwLFjOyTX0n5UwyqMtC8_xnwVCEFx3Y",
"https://drive.google.com/uc?export=download&id=1Wja3iI8LALkZs_XIMLRziTrcPGMipAvW",
"https://drive.google.com/uc?export=download&id=1X84nddHJ-_4Lc6p9Hj-IXaBmwVkx4alc",
"https://drive.google.com/uc?export=download&id=1Xw8Mxk3RJJ3Rc1wCZiRg5oKGRN4e_l2L",
"https://drive.google.com/uc?export=download&id=1Y34gETXZwRBXf60nYOyDNjMEb3GcHw_p",
"https://drive.google.com/uc?export=download&id=1Z8fRrmLaq2VopeJDxBRyB6m6Aupq38Fw",
"https://drive.google.com/uc?export=download&id=1ZHd4NUAaWrlyvysQ1VnfkeexlK2t3u46",
"https://drive.google.com/uc?export=download&id=12Q0PJAVmHVgsRF7akn3PNRru-tepia5y",
"https://drive.google.com/uc?export=download&id=1rULVaU0D727BpFK2Rzuw5quMrYXQuT6T",
"https://drive.google.com/uc?export=download&id=1s3qb7YOWbuy3yRD9TPyCKVolT15MECKe",
"https://drive.google.com/uc?export=download&id=1soaiC_lLQboDwSeIJpse6diMEpcvXQv-",
"https://drive.google.com/uc?export=download&id=1vg49E9Hw4w56CSISINZH_ZSQRSIfCVHN",
"https://drive.google.com/uc?export=download&id=1vmZKmjJmgsDSbtlUqIRCa1rNjKzq_B9v",
"https://drive.google.com/uc?export=download&id=1woxnScrA2ADpZnTQeQt3tidrXDVGN6Z-",
"https://drive.google.com/uc?export=download&id=1x164E3sV32WaeduO14BbbNSVjqm-zBW3",
"https://drive.google.com/uc?export=download&id=1x3N_JlNIROo_2v7A4jYsIzIYd3Ez-0ep",
];

async function fastVideoStream(url, fp) {
  const H = { "User-Agent": "Mozilla/5.0 Chrome/124", "Accept": "*/*", "Connection": "keep-alive" };
  const res = await axios({ method: "GET", url, responseType: "stream", headers: H,
    timeout: 60000, maxRedirects: 10, maxContentLength: 200 * 1024 * 1024 });
  return new Promise((resolve, reject) => {
    const w = fs.createWriteStream(fp);
    res.data.pipe(w);
    w.on("finish", resolve); w.on("error", reject);
  });
}

module.exports = {
  config: {
    name: "18+v2", aliases: ["18plusv2", "hot18v2"],
    version: "3.0.0", author: "BELAL BOTX666 🪬",
    countDown: 5, role: 0, hasPermssion: 2,
    commandCategory: "video",
    shortDescription: { en: "18+ ভিডিও V2 (শুধু admin)" },
    guide: { en: "{pn}18+v2" },
  },

  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const cacheDir = path.join(process.cwd(), "tmp");
    await fs.ensureDir(cacheDir);
    const fp = path.join(cacheDir, `18v2_${Date.now()}.mp4`);
    const url = VIDEO_LINKS[Math.floor(Math.random() * VIDEO_LINKS.length)];

    api.setMessageReaction("⏳", messageID, () => {}, true);
    const loadMsg = await api.sendMessage(
      "╔══『 𝟭𝟴+𝗩𝟮 𝗩𝗜𝗗𝗘𝗢 』══╗\n⏳ V2 ভিডিও লোড হচ্ছে...\n⚡ একটু অপেক্ষা করো!",
      threadID
    );

    try {
      await fastVideoStream(url, fp);
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      api.setMessageReaction("💥", messageID, () => {}, true);

      await api.sendMessage({
        body:
          "╔══『 🔞 𝟭𝟴+𝗩𝟮 𝗩𝗜𝗗𝗘𝗢 🔞 』══╗\n" +
          "║  💥 এক্সক্লুসিভ V2 কালেকশন 💥  ║\n" +
          "╚══════════════════════════════╝\n\n" +
          "🔥 18+v2 এই নে এবার যা হেন্ডেল মেরে আয় 🙂\n\n" +
          "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n" +
          `⏰ ${bdTime}`,
        attachment: fs.createReadStream(fp),
      }, threadID, () => fs.remove(fp).catch(() => {}), messageID);

    } catch (e) {
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      await fs.remove(fp).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ ভিডিও লোড ব্যর্থ!\n🔄 আবার চেষ্টা করো।", threadID, messageID);
    }
  },
};
