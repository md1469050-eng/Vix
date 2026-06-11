"use strict";
/*
╔══════════════════════════════════════════════════════╗
║   🤖 BELAL BOTX666 — ahpp.js v3.0                   ║
║   ✅ Promise.any fastStream — চোখের পলকে ছবি        ║
║   ✅ request বাদ দিয়ে axios ব্যবহার                 ║
╚══════════════════════════════════════════════════════╝
*/
const axios = require("axios");
const fs    = require("fs-extra");
const path  = require("path");
const moment = require("moment-timezone");

const IMG_LINKS = [
"https://i.imgur.com/r5OFIo4.jpeg","https://i.imgur.com/LSbd2JU.jpeg","https://i.imgur.com/7UrlKUo.jpeg",
"https://i.imgur.com/Sn1XNeR.jpeg","https://i.imgur.com/X1Z6MkZ.jpeg","https://i.imgur.com/XFl7bfr.jpeg",
"https://i.imgur.com/MBufwqf.jpeg","https://i.imgur.com/Q4mbBz4.jpeg","https://i.imgur.com/CwjH2Ug.jpeg",
"https://i.imgur.com/zexfE2n.jpeg","https://i.imgur.com/KbVog5J.jpeg","https://i.imgur.com/mCcfdJN.jpeg",
"https://i.imgur.com/izZ9kll.jpeg","https://i.imgur.com/lj6x9P2.jpeg","https://i.imgur.com/4LZnRuS.jpeg",
"https://i.imgur.com/omnpM2i.jpeg","https://i.imgur.com/IQPOReG.jpeg","https://i.imgur.com/X7wEJc8.jpeg",
"https://i.imgur.com/YCm5jvk.jpeg","https://i.imgur.com/DqF4hP6.jpeg","https://i.imgur.com/lYQVUw8.jpeg",
"https://i.imgur.com/xxAH6Sb.jpeg","https://i.imgur.com/lv0x2c9.jpeg","https://i.imgur.com/Pry1u3W.jpeg",
"https://i.imgur.com/fLVE5xs.jpeg","https://i.imgur.com/h83qmxY.jpeg","https://i.imgur.com/KJlCGEG.jpeg",
"https://i.imgur.com/xIHHISz.jpeg","https://i.imgur.com/4046ld6.jpeg","https://i.imgur.com/2QIUzyX.jpeg",
"https://i.imgur.com/DxCHWtH.jpeg","https://i.imgur.com/L3MyUIW.jpeg","https://i.imgur.com/gts6iSC.jpeg",
"https://i.imgur.com/M2afJ3z.jpeg","https://i.imgur.com/lEtoOeB.jpeg","https://i.imgur.com/qxWv1WM.jpeg",
"https://i.imgur.com/2wCiA6l.jpeg","https://i.imgur.com/q96jT8h.jpeg","https://i.imgur.com/wfT2SU2.jpeg",
"https://i.imgur.com/ohRD7Zh.jpeg","https://i.imgur.com/eRjo6D7.jpeg","https://i.imgur.com/ckF5hlJ.jpeg",
"https://i.imgur.com/raKG4Su.jpeg","https://i.imgur.com/ofW1g7n.jpeg","https://i.imgur.com/PFmLP8D.jpeg",
"https://i.imgur.com/yKnQ1xD.jpeg","https://i.imgur.com/yo4bxKD.jpeg","https://i.imgur.com/iUxsJvD.jpeg",
"https://i.imgur.com/0FFwSn2.jpeg","https://i.imgur.com/zEZaICA.jpeg","https://i.imgur.com/IjsA5Fz.jpeg",
"https://i.imgur.com/S5pDAn9.jpeg","https://i.imgur.com/25VdQhp.jpeg","https://i.imgur.com/hRQHZjJ.jpeg",
"https://i.imgur.com/OOLzZdQ.jpeg","https://i.imgur.com/i58mmKB.jpeg","https://i.imgur.com/8VdEszb.jpeg",
"https://i.imgur.com/WJN1hpk.jpeg","https://i.imgur.com/rRgySQn.jpeg","https://i.imgur.com/DoRl2kb.jpeg",
"https://i.imgur.com/4Fpipl0.jpeg","https://i.imgur.com/jd5PU7h.jpeg","https://i.imgur.com/g1VKNSw.jpeg",
"https://i.imgur.com/4QqEVrr.jpeg","https://i.imgur.com/qOU7RXf.jpeg","https://i.imgur.com/PqeigiL.jpeg",
"https://i.imgur.com/19xrC21.jpeg","https://i.imgur.com/BBWcimW.jpeg","https://i.imgur.com/YVjLw5V.jpeg",
"https://i.imgur.com/a9CjNAk.jpeg","https://i.imgur.com/uFVlmtN.jpeg","https://i.imgur.com/NZrkyGo.jpeg",
"https://i.imgur.com/hBjklSN.jpeg","https://i.imgur.com/2FVpXN6.jpeg","https://i.imgur.com/aX4HVpH.jpeg",
"https://i.imgur.com/sliqsIq.jpeg","https://i.imgur.com/dyMQU9c.jpeg","https://i.imgur.com/qiiynCf.jpeg",
"https://i.imgur.com/MGg5vD5.jpeg","https://i.imgur.com/wcMJ5PC.jpeg","https://i.imgur.com/DlRsdWW.jpeg",
"https://i.imgur.com/IkPVoa8.jpeg","https://i.imgur.com/NYJVNt4.jpeg","https://i.imgur.com/W1u2Wg8.jpeg",
"https://i.imgur.com/XGagcaS.jpeg","https://i.imgur.com/wHTwJky.jpeg","https://i.imgur.com/0vR2gad.jpeg",
"https://i.imgur.com/FNbGym5.jpeg","https://i.imgur.com/LGFvUNZ.jpeg","https://i.imgur.com/BZTkSsu.jpeg",
"https://i.imgur.com/SPlKiJn.jpeg","https://i.imgur.com/AiqBE08.jpeg","https://i.imgur.com/m4DRJYk.jpeg",
"https://i.imgur.com/A2om2PU.jpeg","https://i.imgur.com/HyQkl2U.jpeg","https://i.imgur.com/XJIB7gH.jpeg",
"https://i.imgur.com/zuWMRIM.jpeg","https://i.imgur.com/RpfXynX.jpeg","https://i.imgur.com/7zwm7JS.jpeg",
"https://i.imgur.com/aIfjUJf.jpeg","https://i.imgur.com/f8QALHB.jpeg","https://i.imgur.com/MlFHby4.jpeg",
"https://i.imgur.com/LHnEjSz.jpeg","https://i.imgur.com/XgEGhDk.jpeg","https://i.imgur.com/aoWeF4d.jpeg",
"https://i.imgur.com/9EBo2ly.jpeg","https://i.imgur.com/ssA2jW1.jpeg","https://i.imgur.com/bdAeqUE.jpeg",
"https://i.imgur.com/pZiZrSf.jpeg","https://i.imgur.com/TiTb8gT.jpeg","https://i.imgur.com/k1VzXEF.jpeg",
"https://i.imgur.com/48z8Zls.jpeg","https://i.imgur.com/ltafsKH.jpeg","https://i.imgur.com/6kKPsfT.jpeg",
"https://i.imgur.com/qB1OMWB.jpeg","https://i.imgur.com/9BUxmmC.jpeg","https://i.imgur.com/MNlCtno.jpeg",
"https://i.imgur.com/xZGHsPt.jpeg","https://i.imgur.com/WKnm85a.jpeg","https://i.imgur.com/s1J08qd.jpeg",
"https://i.imgur.com/65Gjzdn.jpeg","https://i.imgur.com/vCtsJ38.jpeg","https://i.imgur.com/k6vYTZj.jpeg",
"https://i.imgur.com/E4cHDdX.jpeg","https://i.imgur.com/zh1MqRr.jpeg","https://i.imgur.com/ucdVUsG.jpeg",
"https://i.imgur.com/vo7oOsA.jpeg","https://i.imgur.com/pC2dwwI.jpeg","https://i.imgur.com/Vx45Mmr.jpeg",
"https://i.imgur.com/QtYNECw.jpeg","https://i.imgur.com/KdmYj9i.jpeg","https://i.imgur.com/n1L2S29.jpeg",
"https://i.imgur.com/1nMqVRG.jpeg","https://i.imgur.com/9gzsoBL.jpeg","https://i.imgur.com/QvA22qc.jpeg",
"https://i.imgur.com/ZZcfD5g.jpeg","https://i.imgur.com/atWGWbf.jpeg","https://i.imgur.com/MmChiE1.jpeg",
"https://i.imgur.com/2txj43T.jpeg","https://i.imgur.com/CEO5XWQ.jpeg","https://i.imgur.com/2Ufg474.jpeg",
"https://i.imgur.com/LrB8c7F.jpeg","https://i.imgur.com/nshIUCt.jpeg","https://i.imgur.com/5A5vjac.jpeg",
"https://i.imgur.com/aFnYXKn.jpeg","https://i.imgur.com/ocncg15.jpeg","https://i.imgur.com/ywLhQ6x.jpeg",
"https://i.imgur.com/XotExLy.jpeg","https://i.imgur.com/vgUc6Ql.jpeg"
];

// fastStream — Promise.any দিয়ে সবচেয়ে দ্রুত ছবি নামায়
async function fastStream(url, filePath) {
  const H = { "User-Agent": "Mozilla/5.0 Chrome/124", "Connection": "keep-alive" };
  const attempts = [url, url, url].map(u =>
    axios({ method: "GET", url: u, responseType: "stream", headers: H, timeout: 15000 })
      .then(r => new Promise((res, rej) => {
        const w = fs.createWriteStream(filePath);
        r.data.pipe(w);
        w.on("finish", res);
        w.on("error", rej);
      }))
  );
  return Promise.any(attempts);
}

module.exports = {
  config: {
    name:         "ahpp",
    aliases:      ["hotpp", "animegirl"],
    version:      "3.0.0",
    author:       "BELAL BOTX666 🪬",
    countDown:    2,
    role:         0,
    hasPermssion: 0,
    commandCategory: "Random-IMG",
    shortDescription: { en: "Random anime hot PP পাঠায়" },
    guide: { en: "{pn}ahpp — random anime ছবি পাঠাবে" },
  },

  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const cacheDir = path.join(process.cwd(), "tmp");
    await fs.ensureDir(cacheDir);
    const filePath = path.join(cacheDir, `ahpp_${Date.now()}.jpg`);
    const url = IMG_LINKS[Math.floor(Math.random() * IMG_LINKS.length)];

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
      await fastStream(url, filePath);
      api.setMessageReaction("🥵", messageID, () => {}, true);

      await api.sendMessage({
        body:
          "╔══『 𝗔𝗡𝗜𝗠𝗘 𝗛𝗢𝗧 𝗣𝗣 』══╗\n" +
          "║  🔥 আনিমে হট পিপি 🔥  ║\n" +
          "╚═══════════════════════╝\n\n" +
          "🥵 Hot Anime Girl PP!\n" +
          "😍 উপভোগ করো~\n\n" +
          "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n" +
          `⏰ ${bdTime}`,
        attachment: fs.createReadStream(filePath),
      }, threadID, () => fs.remove(filePath).catch(() => {}), messageID);

    } catch (e) {
      await fs.remove(filePath).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);
      return api.sendMessage(
        "❌ ছবি লোড করতে সমস্যা হয়েছে!\n🔄 আবার চেষ্টা করো।",
        threadID, messageID
      );
    }
  },
};
