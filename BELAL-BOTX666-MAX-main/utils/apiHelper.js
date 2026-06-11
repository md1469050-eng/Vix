/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  BELAL BOTX666 — API Helper v3.0 (ANTI-BLOCK MAX)   ║
 * ║  ✅ baseApiUrl multi-source cache (30min TTL)        ║
 * ║  ✅ Auto retry with exponential backoff              ║
 * ║  ✅ User-Agent rotation (8 pool)                     ║
 * ║  ✅ Rate-limit queue per domain                      ║
 * ║  ✅ Request delay jitter (GitHub Actions safe)       ║
 * ╚══════════════════════════════════════════════════════╝
 */
"use strict";
const axios = require("axios");

// ─── User-Agent Pool ────────────────────────────────────────────────────────
const UA_POOL = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36",
  "Mozilla/5.0 (Linux; Android 14; SM-S928B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Mobile Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
];
let _uaIdx = 0;
const getUA = () => UA_POOL[_uaIdx++ % UA_POOL.length];

// ─── Random jitter delay (GitHub Actions rate-limit এড়াতে) ─────────────────
const jitter = (base = 0) => new Promise(r => setTimeout(r, base + Math.random() * 800));

// ─── Per-domain rate limit tracker ──────────────────────────────────────────
const _domainHits = new Map();
function getDomain(url) {
  try { return new URL(url).hostname; } catch { return "unknown"; }
}
function canRequest(url) {
  const domain = getDomain(url);
  const now = Date.now();
  const hits = _domainHits.get(domain) || [];
  // last 10 seconds এ max 15 request per domain
  const recent = hits.filter(t => now - t < 10000);
  _domainHits.set(domain, [...recent, now]);
  return recent.length < 15;
}

// ─── baseApiUrl Cache ────────────────────────────────────────────────────────
const API_SOURCES = [
  "https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json",
  "https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json",
  "https://raw.githubusercontent.com/shaonproject/Shaon/main/api.json",
];
let _cachedBase = null;
let _cacheTime  = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 মিনিট

async function getBaseApi() {
  if (_cachedBase && (Date.now() - _cacheTime) < CACHE_TTL) return _cachedBase;
  for (const src of API_SOURCES) {
    try {
      const r = await axios.get(src, {
        timeout: 8000,
        headers: { "User-Agent": getUA(), "Cache-Control": "no-cache" }
      });
      const base = r.data?.api || r.data?.baseApi || r.data?.url;
      if (base) {
        _cachedBase = base;
        _cacheTime  = Date.now();
        return _cachedBase;
      }
    } catch { /* try next */ }
  }
  return _cachedBase || null; // পুরানো cache ফেরত দাও
}

// ─── Core safe request (GET/POST) with retry + jitter ───────────────────────
async function safeRequest(method, url, data, opts = {}, maxRetry = 3) {
  // Rate limit check
  if (!canRequest(url)) {
    await jitter(1500); // throttle করো
  }

  for (let attempt = 1; attempt <= maxRetry; attempt++) {
    try {
      await jitter(attempt > 1 ? 500 : 0); // retry তে delay
      const config = {
        method,
        url,
        timeout: opts.timeout || 30000,
        headers: {
          "User-Agent": getUA(),
          "Accept-Language": "en-US,en;q=0.9",
          "Accept": "application/json, text/plain, */*",
          "Cache-Control": "no-cache",
          ...opts.headers,
        },
        maxRedirects: opts.maxRedirects || 5,
        ...opts,
      };
      if (data) config.data = data;
      return await axios(config);
    } catch (err) {
      const status = err.response?.status;
      const isRetryable = !err.response || status === 429 || status === 503 || status === 502 || status === 504;

      if (attempt < maxRetry && isRetryable) {
        // Exponential backoff: 2s → 5s → 12s
        const delay = [2000, 5000, 12000][attempt - 1] || 12000;
        if (global.log) global.log.warn(`⚠️ API retry ${attempt}/${maxRetry} (${status || "net"}) ${String(url).slice(0, 50)} — ${delay/1000}s`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
}

const safeGet  = (url, opts, retry)       => safeRequest("GET",  url, null, opts, retry);
const safePost = (url, data, opts, retry) => safeRequest("POST", url, data, opts, retry);

// ─── Stream request (video/image download) ──────────────────────────────────
async function safeStream(url, filename, opts = {}) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await jitter(attempt > 1 ? 300 : 0);
      const res = await axios({
        method: "GET",
        url,
        responseType: "stream",
        timeout: opts.timeout || 35000,
        maxRedirects: 8,
        headers: {
          "User-Agent": getUA(),
          "Referer":    opts.referer || "https://www.google.com/",
          "Accept":     "video/mp4,video/*;q=0.9,*/*;q=0.8",
          ...opts.headers,
        },
      });
      if (filename) res.data.path = filename;
      return res.data;
    } catch (err) {
      if (attempt < 3) { await new Promise(r => setTimeout(r, attempt * 2000)); continue; }
      throw err;
    }
  }
}

// ─── Multi-source race (একসাথে অনেক URL try, যেটা আগে সেটা জেতে) ──────────
async function raceStream(urls, filename) {
  const streams = urls.map(url => safeStream(url, filename).catch(() => null));
  // Promise.any — একটাও কাজ করলেই হবে
  try {
    return await Promise.any(streams.map(p => p.then(s => { if (!s) throw new Error("null"); return s; })));
  } catch {
    throw new Error("সব API ব্যর্থ হয়েছে");
  }
}

// see full exports at bottom of file

// ─── Download video to tmp file (Facebook upload safe) ──────────────────────
const fs   = require("fs-extra");
const path = require("path");

async function downloadToTmp(url, filename) {
  const tmpDir  = path.join(process.cwd(), "tmp");
  await fs.ensureDir(tmpDir);
  const tmpFile = path.join(tmpDir, filename || `dl_${Date.now()}.mp4`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await axios({
        method: "GET", url, responseType: "stream",
        headers: { "User-Agent": getUA(), "Referer": "https://www.tiktok.com/", "Accept": "*/*" },
        timeout: 35000, maxRedirects: 8,
      });
      await new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(tmpFile);
        res.data.pipe(ws);
        ws.on("finish", resolve);
        ws.on("error", reject);
      });
      return tmpFile;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise(r => setTimeout(r, attempt * 2000));
    }
  }
}

// cleanup helper — পাঠানোর পরে auto delete
function cleanTmp(filePath, delayMs = 10000) {
  setTimeout(() => fs.remove(filePath).catch(() => {}), delayMs);
}

module.exports = { getBaseApi, safeGet, safePost, safeStream, raceStream, getUA, jitter, downloadToTmp, cleanTmp };
