"use strict";
const fs   = require("fs-extra");
const { safeGet, downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

module.exports.config = {
  name: "short", version: "4.0", hasPermssion: 0, credits: "BELAL BOTX666",
  description: "TikTok রিমিক্স সং ভিডিও সার্চ", commandCategory: "fun", usages: "[query]", cooldowns: 5,
};

async function searchVideos(query) {
  const SOURCES = [
    () => safeGet(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=20`,{timeout:10000})
          .then(r=>(r?.data?.data?.videos||[]).filter(v=>v.play).map(v=>({url:v.play,title:v.title||query}))),
    () => safeGet(`https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=20`,{timeout:10000})
          .then(r=>(r?.data?.data?.videos||[]).filter(v=>v.play).map(v=>({url:v.play,title:v.title||query}))),
    () => safeGet(`https://mahi-apis.onrender.com/api/tiktok?search=${encodeURIComponent(query)}`,{timeout:15000})
          .then(r=>(r?.data?.data||[]).filter(v=>v.video).map(v=>({url:v.video,title:v.title||query}))),
  ];
  for (const fn of SOURCES) {
    try { const v = await fn(); if (v?.length) return v; } catch {}
  }
  return [];
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(" ");
  if (!query) return api.sendMessage("❌ query দিন। উদাহরণ: /short dj sonu", threadID, messageID);
  api.setMessageReaction("✨", messageID, ()=>{}, true);
  let tmpFile = null;
  try {
    const videos = await searchVideos(query + " remix song");
    if (!videos.length) {
      api.setMessageReaction("❌", messageID, ()=>{}, true);
      return api.sendMessage(`❌ "${query}" এর জন্য ভিডিও পাওয়া যায়নি।`, threadID, messageID);
    }
    const picked = videos[Math.floor(Math.random()*videos.length)];
    tmpFile = await downloadToTmp(picked.url, `short_${Date.now()}.mp4`);
    api.setMessageReaction("✅", messageID, ()=>{}, true);
    await api.sendMessage({
      body: `🎵 ${picked.title}\n\nরিমিক্স সং ভিডিও নিচে দেওয়া হলো!`,
      attachment: fs.createReadStream(tmpFile),
    }, threadID, messageID);
  } catch {
    api.setMessageReaction("❌", messageID, ()=>{}, true);
    api.sendMessage("❌ এরর হয়েছে। আবার চেষ্টা করুন।", threadID, messageID);
  } finally {
    if (tmpFile) cleanTmp(tmpFile);
  }
};
