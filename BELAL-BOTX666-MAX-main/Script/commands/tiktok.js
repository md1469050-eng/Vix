/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  🎵 tiktok.js — TikTok ভিডিও ডাউনলোড
 *  ✅ Multi-API fallback (tikwm → mahi-apis → ssstik)
 *  ✅ Anti-block retry  ✅ HD support
 *  BELAL BOTX666 | Master: Belal YT
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */
"use strict";
const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const { safeGet, safePost, safeStream, getUA } = require("../../utils/apiHelper");

module.exports.config = {
  name: "tiktok", aliases: ["tt", "tikdown"], version: "3.0.0",
  author: "Belal YT", description: "TikTok ভিডিও watermark ছাড়া ডাউনলোড",
  usage: "/tiktok [link]", category: "📥 ডাউনলোড", cooldowns: 15, hasPermssion: 0,
};

// ── API Source 1: tikwm ────────────────────────────────────────────
async function fromTikwm(url) {
  const APIs = [
    `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`,
    `https://tikwm.com/api/?url=${encodeURIComponent(url)}`,
    `https://api.tikwm.com/api/?url=${encodeURIComponent(url)}`,
  ];
  for (const api of APIs) {
    try {
      const r = await safeGet(api, { timeout: 10000 });
      const d = r?.data?.data;
      if (!d) continue;
      const videoUrl = d.hdplay || d.play;
      if (!videoUrl) continue;
      return {
        url: videoUrl,
        info: {
          title:    d.title   || "TikTok ভিডিও",
          author:   d.author?.nickname || "Unknown",
          duration: d.duration ? `${d.duration}s` : "N/A",
          likes:    d.digg_count ? Number(d.digg_count).toLocaleString() : "N/A",
          comments: d.comment_count ? Number(d.comment_count).toLocaleString() : "N/A",
        }
      };
    } catch { /* try next */ }
  }
  return null;
}

// ── API Source 2: mahi-apis (fallback) ────────────────────────────
async function fromMahiApi(url) {
  try {
    const r = await safeGet(
      `https://mahi-apis.onrender.com/api/tiktok?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );
    const d = r?.data;
    if (!d?.video) return null;
    return {
      url: d.video,
      info: { title: d.title || "TikTok ভিডিও", author: d.author || "Unknown", duration: "N/A", likes: "N/A", comments: "N/A" }
    };
  } catch { return null; }
}

// ── API Source 3: ssstik (last resort) ───────────────────────────
async function fromSsstik(url) {
  try {
    const r = await safePost(
      "https://ssstik.io/abc?url=dl",
      new URLSearchParams({ id: url, locale: "en", tt: "" }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://ssstik.io/", "User-Agent": getUA() }, timeout: 12000 }
    );
    const match = r?.data?.match(/href="(https:\/\/[^"]+\.mp4[^"]*)"/i);
    if (!match) return null;
    return { url: match[1], info: { title: "TikTok ভিডিও", author: "Unknown", duration: "N/A", likes: "N/A", comments: "N/A" } };
  } catch { return null; }
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const url = args[0];
  if (!url || !url.includes("tiktok")) {
    return api.sendMessage("❌ TikTok লিংক দিন!\nউদাহরণ: /tiktok https://vm.tiktok.com/xxx", threadID, messageID);
  }

  const tmp = await new Promise(r => api.sendMessage("⬇️ TikTok ডাউনলোড হচ্ছে...", threadID, (e, i) => r(i?.messageID)));

  try {
    // Multi-source fallback
    let result = await fromTikwm(url) || await fromMahiApi(url) || await fromSsstik(url);
    if (!result) throw new Error("সব API ব্যর্থ হয়েছে");

    // Download video
    const stream = await safeStream(result.url, "tiktok.mp4");
    const tmpFile = path.join(process.cwd(), "tmp", `tt_${Date.now()}.mp4`);
    fs.ensureDirSync(path.dirname(tmpFile));

    await new Promise((resolve, reject) => {
      const ws = fs.createWriteStream(tmpFile);
      stream.pipe(ws);
      ws.on("finish", resolve);
      ws.on("error", reject);
    });

    try { api.unsendMessage(tmp); } catch {}

    await api.sendMessage({
      body: `🎵 ${result.info.title}\n👤 ${result.info.author}\n⏱️ ${result.info.duration}\n❤️ ${result.info.likes}  💬 ${result.info.comments}`,
      attachment: fs.createReadStream(tmpFile),
    }, threadID, messageID);

    setTimeout(() => fs.remove(tmpFile).catch(() => {}), 30000);
  } catch (err) {
    try { api.unsendMessage(tmp); } catch {}
    api.sendMessage(`❌ ডাউনলোড ব্যর্থ: ${err.message}`, threadID, messageID);
  }
};
