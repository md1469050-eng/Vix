"use strict";
const axios = require("axios");
const fs    = require("fs-extra");
const path  = require("path");

const QUERIES = [
  "Kingdom of Heaven edit aura","Kingdom of Heaven cinematic edit",
  "Kingdom of Heaven Balian edit","Kingdom of Heaven epic edit 4k",
  "Kingdom of Heaven sigma edit","Kingdom of Heaven phonk edit",
  "Kingdom of Heaven warrior edit","Kingdom of Heaven battle scene",
  "Kingdom of Heaven legendary edit","Kingdom of Heaven honor edit",
  "Kingdom of Heaven slomo edit","Kingdom of Heaven emotional edit",
  "Kingdom of Heaven siege scene edit","Kingdom of Heaven Jerusalem scene",
  "Kingdom of Heaven Saladin scene","Kingdom of Heaven knight edit",
  "Kingdom of Heaven epic speech","Kingdom of Heaven dark edit",
  "Kingdom of Heaven powerful edit","Kingdom of Heaven motivational edit",
];

const usedMap = new Map();
let cache = [], cacheTime = 0;

function getUnused(threadID, videos) {
  if (!usedMap.has(threadID)) usedMap.set(threadID, new Set());
  const used = usedMap.get(threadID);
  if (used.size >= videos.length) used.clear();
  const avail = videos.filter(v => !used.has(v.id));
  const pick  = avail[Math.floor(Math.random() * avail.length)];
  if (pick) used.add(pick.id);
  return pick;
}

async function fetchAll() {
  if (cache.length && Date.now() - cacheTime < 600000) return cache;
  const H    = { "User-Agent": "Mozilla/5.0 Chrome/124", "Accept": "application/json" };
  const seen = new Set();
  const all  = [];
  const batch = 5;
  for (let i = 0; i < QUERIES.length; i += batch) {
    await Promise.allSettled(
      QUERIES.slice(i, i + batch).map(q =>
        axios.get(`https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(q)}&count=20`, { headers: H, timeout: 12000 })
          .then(r => {
            for (const v of (r.data?.data?.videos || [])) {
              if ((v.play || v.hdplay) && !seen.has(v.video_id)) {
                seen.add(v.video_id);
                all.push({ id: v.video_id, url: v.hdplay || v.play, bak: v.play, title: v.title || "Kingdom" });
              }
            }
          }).catch(() => {})
      )
    );
  }
  if (all.length) { cache = all; cacheTime = Date.now(); }
  return all;
}

async function download(url, fp) {
  const H = { "User-Agent": "Mozilla/5.0 Chrome/124", "Referer": "https://www.tiktok.com/", "Connection": "keep-alive" };
  try {
    const r = await axios.get(url, { responseType: "arraybuffer", headers: H, timeout: 45000, maxContentLength: 150*1024*1024 });
    if (r.data?.byteLength > 1000) { await fs.writeFile(fp, Buffer.from(r.data)); return true; }
  } catch {}
  try {
    const r = await axios.get(url, { responseType: "stream", headers: H, timeout: 45000 });
    await new Promise((res, rej) => { const w = fs.createWriteStream(fp); r.data.pipe(w); w.on("finish", res); w.on("error", rej); });
    return (await fs.stat(fp).catch(() => ({size:0}))).size > 1000;
  } catch { return false; }
}

// বট চালু হলেই background এ cache গরম করো
setTimeout(() => fetchAll().catch(() => {}), 3000);

module.exports = {
  config: {
    name: "kingdom", aliases: ["koh","heaven","balian"],
    version: "8.2.0", author: "BELAL BOTX666 🪬",
    countDown: 10, role: 0, hasPermssion: 0,
    commandCategory: "Media",
    shortDescription: { en: "Kingdom of Heaven এডিট ভিডিও" },
    guide: { en: "{pn}kingdom" },
  },
  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    api.setMessageReaction("⏳", messageID, () => {}, true);

    const dir = path.join(process.cwd(), "tmp");
    await fs.ensureDir(dir);
    const fp = path.join(dir, `kingdom_${Date.now()}.mp4`);

    try {
      const videos = await fetchAll();
      if (!videos.length) throw new Error("ভিডিও নেই");

      const v = getUnused(threadID, videos);
      if (!v) throw new Error("ভিডিও নেই");

      const ok = await download(v.url, fp) || (v.bak !== v.url && await download(v.bak, fp));
      if (!ok) throw new Error("download ব্যর্থ");

      api.setMessageReaction("✅", messageID, () => {}, true);
      await api.sendMessage({ attachment: fs.createReadStream(fp) },
        threadID, () => fs.remove(fp).catch(() => {}), messageID);

    } catch (e) {
      await fs.remove(fp).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ ভিডিও আসেনি, আবার চেষ্টা করো।", threadID, messageID);
    }
  },
};
