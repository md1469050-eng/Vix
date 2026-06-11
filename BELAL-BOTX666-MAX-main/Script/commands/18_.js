"use strict";
const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const moment = require("moment-timezone");

const VIDEO_LINKS = [
"https://drive.google.com/uc?export=download&id=1-gJdG8bxmZLyOC7-6E4A5Hm95Q9gWIPO",
"https://drive.google.com/uc?export=download&id=1-ryNR8j529EZyTCuMur9wmkFz4ahlv-f",
"https://drive.google.com/uc?export=download&id=1-vHh7XBtPOS3s42q-s8s30Bzsx2u6czu",
"https://drive.google.com/uc?export=download&id=11IUd-PDHozLmh_RtvSf0S-f3G6wut1ZT",
"https://drive.google.com/uc?export=download&id=12YCqZovJ8sVZZZTDLu8dv8NAwsMGfqiB",
"https://drive.google.com/uc?export=download&id=12eIiCYpd_Jm8zIVRSkqlSt7W-7OsxB6g",
"https://drive.google.com/uc?export=download&id=13utWruipZ_3fR0QSMtGMnFjGt3bthnbf",
"https://drive.google.com/uc?export=download&id=14GYNaYL-pkEh3UH0oIUXVamru5h830DY",
"https://drive.google.com/uc?export=download&id=14UGb2fH4wyUbVSQ-Vt5yf-4sH3-icXGC",
"https://drive.google.com/uc?export=download&id=161O9_EbCQJ8nHTT7VeE7BWtHvEjHAT4k",
"https://drive.google.com/uc?export=download&id=170YWB4jpMfR5GpmPb_Lymh6OmrmWDE0x",
"https://drive.google.com/uc?export=download&id=17nvXNBpMWVmuWLK-kkLzkbrbpW43rD4r",
"https://drive.google.com/uc?export=download&id=17w7sehThOv6IRrcsLboi7Zk6zZvfBHr5",
"https://drive.google.com/uc?export=download&id=17yaPd3PoYJkuL0IEZHzcBic9pX4AmGiK",
"https://drive.google.com/uc?export=download&id=18Dyc1vkysNhHSGi5OYpa6AzD5rk3_vkf",
"https://drive.google.com/uc?export=download&id=18brau5aYmiMAxfhDTLz_nFWuIcb_mja5",
"https://drive.google.com/uc?export=download&id=19GcLpOzFYypYFu1FboQyVjWxC9Jh3JC5",
"https://drive.google.com/uc?export=download&id=19lKQChg0hv2MOTphkyI4zTiUIxuujd03",
"https://drive.google.com/uc?export=download&id=1AjrBOBRWKpKjLOYV1oof2mVZBzx0ebgD",
"https://drive.google.com/uc?export=download&id=1BPOEwIt7lGv66w5pUTDU937q4i5ym5S_",
"https://drive.google.com/uc?export=download&id=1C-VxCoO5gMKCq2rg7PxjlitK4bOg7pt2",
"https://drive.google.com/uc?export=download&id=1DrhAOOeYIHlTWJU5e26OMjO0R5nueyf7",
"https://drive.google.com/uc?export=download&id=1EcBmrdqYfQbwSPr2kiKY2QV_6CXLJJj6",
"https://drive.google.com/uc?export=download&id=1F5Xc5Qff4RGyUuHzuqPfmOn2EZKQIn7P",
"https://drive.google.com/uc?export=download&id=1FTxkmgt2sWf8U2h8a5HszyKINMr6Gnwm",
"https://drive.google.com/uc?export=download&id=1yZMUmIIq8nvbannu3DUmLy7SOzgw0TMe",
"https://drive.google.com/uc?export=download&id=1ymACbIzXyMNJIF8O_XImq9QA4fZcTNdR",
"https://drive.google.com/uc?export=download&id=1zRAFPp3sMPOlVyhoEPnHflRpiRe6C2pt",
"https://drive.google.com/uc?export=download&id=1O1Cej8MFdytRun3RmGTnmT6uk1T-Zcmu",
"https://drive.google.com/uc?export=download&id=1Nk534yO5owt7IaMOKjbT6IGLGW96Gv0f",
];

async function fastVideoStream(url, fp) {
  const H = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124",
    "Accept": "*/*", "Connection": "keep-alive",
  };
  const res = await axios({ method: "GET", url, responseType: "stream", headers: H,
    timeout: 60000, maxRedirects: 10, maxContentLength: 200 * 1024 * 1024,
  });
  return new Promise((resolve, reject) => {
    const w = fs.createWriteStream(fp);
    res.data.pipe(w);
    w.on("finish", resolve);
    w.on("error", reject);
  });
}

module.exports = {
  config: {
    name: "18+", aliases: ["18plus", "hot18"],
    version: "3.0.0", author: "BELAL BOTX666 🪬",
    countDown: 5, role: 0, hasPermssion: 2,
    commandCategory: "video",
    shortDescription: { en: "18+ ভিডিও পাঠায় (শুধু admin)" },
    guide: { en: "{pn}18+" },
  },

  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const cacheDir = path.join(process.cwd(), "tmp");
    await fs.ensureDir(cacheDir);
    const fp = path.join(cacheDir, `18plus_${Date.now()}.mp4`);
    const url = VIDEO_LINKS[Math.floor(Math.random() * VIDEO_LINKS.length)];

    api.setMessageReaction("⏳", messageID, () => {}, true);
    const loadMsg = await api.sendMessage(
      "╔══『 𝟭𝟴+ 𝗩𝗜𝗗𝗘𝗢 』══╗\n⏳ ভিডিও লোড হচ্ছে...\n⚡ একটু অপেক্ষা করো!",
      threadID
    );

    try {
      await fastVideoStream(url, fp);
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      api.setMessageReaction("🔥", messageID, () => {}, true);

      await api.sendMessage({
        body:
          "╔══『 🔞 𝟭𝟴+ 𝗩𝗜𝗗𝗘𝗢 🔞 』══╗\n" +
          "║  ⚠️ শুধুমাত্র প্রাপ্তবয়স্কদের জন্য ⚠️  ║\n" +
          "╚══════════════════════════════╝\n\n" +
          "🔥 এই নে এবার যা হেন্ডেল মেরে আয় 🙂\n\n" +
          "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n" +
          `⏰ ${bdTime}`,
        attachment: fs.createReadStream(fp),
      }, threadID, () => fs.remove(fp).catch(() => {}), messageID);

    } catch (e) {
      await api.unsendMessage(loadMsg.messageID).catch(() => {});
      await fs.remove(fp).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(
        "❌ ভিডিও লোড ব্যর্থ হয়েছে!\n📝 " + e.message?.slice(0, 80) +
        "\n🔄 আবার চেষ্টা করো।",
        threadID, messageID
      );
    }
  },
};
