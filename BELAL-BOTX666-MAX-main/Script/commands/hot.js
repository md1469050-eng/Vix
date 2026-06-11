"use strict";
const fs   = require("fs-extra");
const { safeGet, downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

const TERMS = [
  "hot girl dance","hot girls reels","capcut_edit girl","hot girls edit",
  "tiktok hot girl dance","hot dance girl viral","trending girl remix",
  "hot edit girl","girl dance capcut","sexy dance girl",
];
const EXCLUDE = ["boy","male","guy","man","bro","dude","ছেলে","পুরুষ"];
const TIKWM = [
  q => `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=40`,
  q => `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=30`,
  q => `https://api.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20`,
];
let recentIds = [];

async function getVideo() {
  for (let a = 0; a < 5; a++) {
    const term = TERMS[Math.floor(Math.random() * TERMS.length)];
    for (const b of TIKWM) {
      try {
        const r = await safeGet(b(term), { timeout: 12000 });
        const videos = r?.data?.data?.videos?.filter(v => v.play);
        if (!videos?.length) continue;
        let pool = videos.filter(v => !recentIds.includes(v.video_id));
        if (!pool.length) { recentIds = []; pool = videos; }
        for (const v of pool) {
          const t = (v.title||"").toLowerCase(), au = (v.author?.unique_id||"").toLowerCase();
          if (EXCLUDE.some(w => t.includes(w) || au.includes(w))) continue;
          recentIds.push(v.video_id);
          if (recentIds.length > 25) recentIds.shift();
          return { url: v.play, title: v.title, digg: v.digg_count||0 };
        }
      } catch {}
    }
  }
  return null;
}

module.exports = {
  config: {
    name: "hot", aliases: ["হট","hotreels","hotgirls"],
    description: "হট গার্লস ভিডিও", usage: "hot", cooldown: 10, role: 0,
  },
  run: async ({ api, event }) => {
    const { threadID, messageID } = event;
    const wait = await api.sendMessage("🔥 হট গার্লস ভিডিও খুঁজছি...", threadID);
    let tmpFile = null;
    try {
      const video = await getVideo();
      if (!video) throw new Error("ভিডিও পাওয়া যায়নি");
      tmpFile = await downloadToTmp(video.url, `hot_${Date.now()}.mp4`);
      await api.unsendMessage(wait.messageID).catch(() => {});
      await api.sendMessage({
        body: `💃 হট গার্লস ভিডিও:\n📹 ${(video.title||"Hot Dance").slice(0,80)}\n❤️ লাইক: ${Number(video.digg).toLocaleString()}`,
        attachment: fs.createReadStream(tmpFile),
      }, threadID, messageID);
    } catch {
      await api.unsendMessage(wait.messageID).catch(() => {});
      api.sendMessage("❌ ভিডিও আনতে ব্যর্থ। আবার চেষ্টা করুন।", threadID, messageID);
    } finally {
      if (tmpFile) cleanTmp(tmpFile);
    }
  },
};
