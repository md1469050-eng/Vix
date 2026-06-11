"use strict";
const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const moment = require("moment-timezone");
const { safeGet, getUA } = require("../../utils/apiHelper");

const TERMS = [
  "mood dance remix edit","vibe remix dance","aesthetic mood dance remix",
  "slow mood dance remix","chill mood dance","trend mood dance",
];
const TIKWM = [
  q => `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=40&cursor=0`,
  q => `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20`,
  q => `https://api.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20`,
];
let _cache = [], _cacheTime = 0, recentIds = [];
const CACHE_TTL = 15 * 60 * 1000;

async function getVideos() {
  if (_cache.length && Date.now() - _cacheTime < CACHE_TTL) return _cache;
  const term = TERMS[Math.floor(Math.random() * TERMS.length)];
  for (const b of TIKWM) {
    try {
      const r = await safeGet(b(term), { timeout: 12000 });
      const v = r?.data?.data?.videos?.filter(v => v.play);
      if (v?.length) { _cache = v; _cacheTime = Date.now(); return v; }
    } catch {}
  }
  return _cache.length ? _cache : [];
}

async function downloadToTmp(url, filename) {
  const tmpDir  = path.join(process.cwd(), "tmp");
  await fs.ensureDir(tmpDir);
  const tmpFile = path.join(tmpDir, filename);
  const res = await axios({ method: "GET", url, responseType: "stream",
    headers: { "User-Agent": getUA(), "Referer": "https://www.tiktok.com/" },
    timeout: 30000, maxRedirects: 8,
  });
  await new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(tmpFile);
    res.data.pipe(ws);
    ws.on("finish", resolve);
    ws.on("error", reject);
  });
  return tmpFile;
}

module.exports = {
  config: {
    name: "mood", aliases: ["মুড","mooddance","feelings","vibe"],
    version: "10.0", author: "BELAL BOTX666 🪬",
    countDown: 10, role: 0, hasPermssion: 0, commandCategory: "Media",
    shortDescription: { en: "মুড ড্যান্স রিমিক্স ভিডিও" },
  },
  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const header = "╔══『 𝗠𝗢𝗢𝗗 𝗗𝗔𝗡𝗖𝗘 』══╗\n║  🎭 Mood Dance Remix 🎭  ║\n╚═══════════════════════╝";
    api.setMessageReaction("⏳", messageID, () => {}, true);
    let tmpFile = null;
    try {
      const videos = await getVideos();
      if (!videos.length) throw new Error("ভিডিও নেই");
      let pool = videos.filter(v => !recentIds.includes(v.video_id));
      if (!pool.length) { recentIds = []; pool = videos; }
      const v = pool[Math.floor(Math.random() * pool.length)];
      recentIds.push(v.video_id);
      if (recentIds.length > 25) recentIds.shift();

      tmpFile = await downloadToTmp(v.play, `mood_${Date.now()}.mp4`);
      api.setMessageReaction("🎭", messageID, () => {}, true);
      await api.sendMessage({
        body: `${header}\n\n🎬 ${(v.title||"Mood Dance").slice(0,60)}...\n❤️ ${Number(v.digg_count||0).toLocaleString()}  💬 ${Number(v.comment_count||0).toLocaleString()}\n┄┉❈চাঁদেড়~পাহাড়❈┉┄\n⏰ ${bdTime}`,
        attachment: fs.createReadStream(tmpFile),
      }, threadID, messageID);
    } catch {
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage(`${header}\n\n❌ ভিডিও আনতে ব্যর্থ। আবার চেষ্টা করো।`, threadID, messageID);
    } finally {
      if (tmpFile) setTimeout(() => fs.remove(tmpFile).catch(() => {}), 5000);
    }
  },
};
