"use strict";
const crypto = require("crypto");
const os     = require("os");

async function fastStream(links, filename = "file", timeout = 20000) {
  const axios = require("axios");
  const H = { "User-Agent": "Mozilla/5.0 Chrome/124", "Accept": "*/*", "Connection": "keep-alive" };
  const pick = () => links[Math.floor(Math.random() * links.length)];
  return Promise.any([pick(), pick(), pick()].map(url =>
    axios({ method: "GET", url, responseType: "stream", headers: H, timeout, maxRedirects: 5 })
      .then(r => { r.data.path = filename; return r.data; })
  ));
}

async function downloadFile(url, filePath) {
  const { createWriteStream } = require("fs");
  const axios = require("axios");
  const res = await axios({ method: "GET", responseType: "stream", url, timeout: 30000 });
  const w = createWriteStream(filePath);
  res.data.pipe(w);
  return new Promise((r, e) => { w.on("finish", r); w.on("error", e); });
}

async function getContent(url, opts = {}) { return require("axios")({ method: "GET", url, ...opts }); }

function throwError(cmd, tid, mid) {
  const ts = global.data?.threadData?.get(tid) || {};
  const px = ts.PREFIX ?? global.config?.PREFIX ?? "/";
  return global.client?.api?.sendMessage(`❌ Error. Prefix: ${px}`, tid, mid);
}

function cleanAnilistHTML(t = "") {
  return t.replace(/<br\s*\/?>/gi,"\n").replace(/<\/?(i|em)>/gi,"*").replace(/<\/?b>/gi,"**")
    .replace(/~!|!~/g,"||").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
    .replace(/&quot;/g,'"').replace(/&#039;/g,"'").replace(/<[^>]*>/g,"");
}

function randomString(len = 8) { return crypto.randomBytes(len).toString("hex").slice(0, len); }

const AES = {
  encrypt: (k, iv, d) => { const c = crypto.createCipheriv("aes-256-cbc", Buffer.from(k), Buffer.from(iv)); return Buffer.concat([c.update(d), c.final()]).toString("hex"); },
  decrypt: (k, iv, e) => { const d = crypto.createDecipheriv("aes-256-cbc", Buffer.from(k), Buffer.from(iv,"binary")); return Buffer.concat([d.update(Buffer.from(e,"hex")), d.final()]).toString(); },
  makeIv:  () => Buffer.from(crypto.randomBytes(16)).toString("hex").slice(0,16),
};

const homeDir  = () => [os.homedir(), process.platform];
const formatTime  = ms => { const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60),d=Math.floor(h/24); if(d>0)return`${d}d ${h%24}h`; if(h>0)return`${h}h ${m%60}m`; if(m>0)return`${m}m ${s%60}s`; return`${s}s`; };
const formatBytes = b  => b<1024?b+" B":b<1048576?(b/1024).toFixed(1)+" KB":b<1073741824?(b/1048576).toFixed(1)+" MB":(b/1073741824).toFixed(1)+" GB";

module.exports = {
  fastStream, downloadFile, getContent, throwError,
  cleanAnilistHTML, randomString, AES, homeDir,
  formatTime, formatBytes,
  assets: { font: async () => null, image: async () => null, data: async () => null },
};
