"use strict";
const fs   = require("fs-extra");
const { safeGet, downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

const TERMS = [
  "Argentina funny troll Bangladesh","আর্জেন্টিনা ট্রল মজার ভিডিও",
  "Brazil vs Argentina Bangla funny","আর্জেন্টিনা নিয়ে মজার ভিডিও",
  "argentina fail tiktok funny","brazil troll argentina tiktok",
];
const TIKWM = [
  q => `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=25`,
  q => `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20`,
  q => `https://api.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20`,
];
let recentIds = [];

async function getVideo() {
  const term = TERMS[Math.floor(Math.random() * TERMS.length)];
  for (const b of TIKWM) {
    try {
      const r = await safeGet(b(term), { timeout: 12000 });
      const videos = r?.data?.data?.videos?.filter(v => v.play);
      if (!videos?.length) continue;
      let pool = videos.filter(v => !recentIds.includes(v.video_id));
      if (!pool.length) { recentIds = []; pool = videos; }
      const v = pool[Math.floor(Math.random() * pool.length)];
      recentIds.push(v.video_id);
      if (recentIds.length > 25) recentIds.shift();
      return { url: v.play, title: v.title || "Troll Video" };
    } catch {}
  }
  return null;
}

module.exports = {
  config: {
    name: "brazil", aliases: ["brasil","bratroll","ব্রাজিল"],
    description: "🇧🇷 vs 🇦🇷 ট্রল ভিডিও", usage: "brazil", cooldown: 12, role: 0,
  },
  run: async ({ api, event }) => {
    const { threadID, messageID } = event;
    const wait = await api.sendMessage("⚽ ট্রল ভিডিও খুঁজছি...", threadID);
    let tmpFile = null;
    try {
      const video = await getVideo();
      if (!video) throw new Error("ভিডিও পাওয়া যায়নি");
      tmpFile = await downloadToTmp(video.url, `brazil_${Date.now()}.mp4`);
      await api.unsendMessage(wait.messageID).catch(() => {});
      await api.sendMessage({
        body: `🎭 আর্জেন্টিনা ট্রল ভিডিও:\n📹 ${video.title.slice(0,80)}\n❤️ লাইক কমেন্ট করো!`,
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
