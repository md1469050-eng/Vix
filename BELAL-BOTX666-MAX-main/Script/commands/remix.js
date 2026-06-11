"use strict";
const fs   = require("fs-extra");
const { safeGet, downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

const REMIX_QUERIES = [
  "remix song tiktok viral 2024","best remix tiktok 2024","dj remix bangla song",
  "phonk remix tiktok","trending remix tiktok 2024","bass boosted remix tiktok",
  "hindi remix tiktok viral","slow reverb remix tiktok","lofi remix tiktok",
  "bangla dj remix tiktok","arabic remix tiktok viral","best phonk music tiktok",
  "aggressive phonk remix","club remix tiktok viral","korean remix tiktok viral",
  "amapiano remix tiktok","afrobeats remix tiktok viral","electronic remix tiktok 2024",
];
let _cache = [], _cacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000;
const usedMap = new Map();

function pickUnused(tid, videos) {
  if (!usedMap.has(tid)) usedMap.set(tid, new Set());
  const used = usedMap.get(tid);
  if (used.size >= videos.length) used.clear();
  const pool = videos.filter(v => !used.has(v.url));
  const pick = pool[Math.floor(Math.random() * pool.length)];
  used.add(pick.url); return pick;
}

async function fetchVideos(userQuery) {
  if (userQuery) {
    for (const url of [
      `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(userQuery+" remix")}&count=20`,
      `https://mahi-apis.onrender.com/api/tiktok?search=${encodeURIComponent(userQuery+" remix song")}`,
    ]) {
      try {
        const r = await safeGet(url, { timeout: 12000 });
        const list = r?.data?.data?.videos || r?.data?.data || [];
        const mapped = list.filter(v => v.play||v.video).map(v => ({ url: v.play||v.video, title: v.title||userQuery }));
        if (mapped.length) return mapped;
      } catch {}
    }
  }
  if (_cache.length && Date.now() - _cacheTime < CACHE_TTL) return _cache;
  const seen = new Set(), all = [];
  for (let i = 0; i < REMIX_QUERIES.length; i += 6) {
    await Promise.allSettled(REMIX_QUERIES.slice(i, i+6).map(q =>
      safeGet(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20`, {timeout:10000})
        .then(r => (r?.data?.data?.videos||[]).forEach(v => {
          if (v.play && !seen.has(v.play)) { seen.add(v.play); all.push({url:v.play,title:v.title||q}); }
        })).catch(()=>{})
    ));
  }
  if (all.length) { _cache = all; _cacheTime = Date.now(); }
  return all;
}
setTimeout(() => fetchVideos(null).catch(()=>{}), 5000);

module.exports.config = {
  name: "remix", aliases: ["রিমিক্স"], version: "8.0",
  hasPermssion: 0, credits: "BELAL BOTX666",
  description: "TikTok রিমিক্স সং ভিডিও", commandCategory: "fun", usages: "remix [query]", cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  api.setMessageReaction("⏳", messageID, ()=>{}, true);
  let tmpFile = null;
  try {
    const videos = await fetchVideos(args.join(" ")||null);
    if (!videos?.length) throw new Error("ভিডিও নেই");
    const picked = pickUnused(threadID, videos);
    tmpFile = await downloadToTmp(picked.url, `remix_${Date.now()}.mp4`);
    await api.sendMessage({
      body: `🎵 Remix Song\n📌 ${picked.title}\n✨ ┄┉ Viral Remix ┉┄ ✨`,
      attachment: fs.createReadStream(tmpFile),
    }, threadID, ()=>{}, messageID);
    api.setMessageReaction("✅", messageID, ()=>{}, true);
  } catch {
    api.setMessageReaction("❌", messageID, ()=>{}, true);
    api.sendMessage("❌ ভিডিও আনতে ব্যর্থ, আবার চেষ্টা করুন।", threadID, messageID);
  } finally {
    if (tmpFile) cleanTmp(tmpFile);
  }
};
