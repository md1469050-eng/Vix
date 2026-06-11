"use strict";
const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const moment = require("moment-timezone");

const IMG_LINKS = [
"https://i.imgur.com/RPCOLzu.jpeg","https://i.imgur.com/L8A6HFL.jpeg","https://i.imgur.com/cvvG89C.jpeg",
"https://i.imgur.com/DHnTck3.jpeg","https://i.imgur.com/bUVmVzd.jpeg","https://i.imgur.com/Dlr9rdJ.jpeg",
"https://i.imgur.com/mY8qdfM.jpeg","https://i.imgur.com/0VqwLdg.jpeg","https://i.imgur.com/xPdZwdm.jpeg",
"https://i.imgur.com/tnjkUCs.jpeg","https://i.imgur.com/AgCvrSP.jpeg","https://i.imgur.com/7z2IfiJ.jpeg",
"https://i.imgur.com/624c9F5.jpeg","https://i.imgur.com/eTXr82D.jpeg","https://i.imgur.com/pqc1TBK.jpeg",
"https://i.imgur.com/DGr7o4K.jpeg","https://i.imgur.com/A4871Wf.jpeg","https://i.imgur.com/MYK94zg.jpeg",
"https://i.imgur.com/ZnsZ5OL.jpeg","https://i.imgur.com/PlLHBSA.jpeg","https://i.imgur.com/rrkToNs.jpeg",
"https://i.imgur.com/RPnk38A.jpeg","https://i.imgur.com/mAxVI7w.jpeg","https://i.imgur.com/nwKvpqX.jpeg",
"https://i.imgur.com/cibCtis.jpeg","https://i.imgur.com/gZPvDYo.jpeg","https://i.imgur.com/LPJQgkE.jpeg",
"https://i.imgur.com/uh6Q7HU.jpeg","https://i.imgur.com/1olEdF7.jpeg","https://i.imgur.com/bDoDJk0.jpeg",
"https://i.imgur.com/usv33Pv.jpeg","https://i.imgur.com/bHa32Qz.jpeg","https://i.imgur.com/mQfPwzC.jpeg",
"https://i.imgur.com/t1AKaVd.jpeg","https://i.imgur.com/OyApjao.jpeg","https://i.imgur.com/UlmaT4s.jpeg",
"https://i.imgur.com/yBzxxjJ.jpeg","https://i.imgur.com/VNXNLhZ.jpeg","https://i.imgur.com/EJ4dEup.jpeg",
"https://i.imgur.com/jaJ0xzj.jpeg","https://i.imgur.com/pTxa2uK.jpeg","https://i.imgur.com/ABLKXUA.jpeg",
"https://i.imgur.com/L6NVshi.jpeg","https://i.imgur.com/95ICiba.jpeg","https://i.imgur.com/BRqk69H.jpeg",
"https://i.imgur.com/RWmiOD4.jpeg","https://i.imgur.com/CgUtYTb.jpeg","https://i.imgur.com/aJr1nNo.jpeg",
"https://i.imgur.com/CtGBnBo.jpeg","https://i.imgur.com/fl97bGx.jpeg","https://i.imgur.com/SeQ7lyY.jpeg",
"https://i.imgur.com/4bF5B2j.jpeg","https://i.imgur.com/OpR2RaV.jpeg","https://i.imgur.com/YlQklLI.jpeg",
"https://i.imgur.com/tOq7ZmQ.jpeg","https://i.imgur.com/HzVHj1T.jpeg","https://i.imgur.com/dKGI3CC.jpeg",
"https://i.imgur.com/85u8YKN.jpeg","https://i.imgur.com/le1Qh06.jpeg","https://i.imgur.com/eoh564u.jpeg",
"https://i.imgur.com/ebYYxDA.jpeg","https://i.imgur.com/h3uVd3j.jpeg","https://i.imgur.com/gJtyFY7.jpeg",
"https://i.imgur.com/c7zzf9t.jpeg","https://i.imgur.com/qu6SYUv.jpeg","https://i.imgur.com/FjO4iVL.jpeg",
"https://i.imgur.com/yXg2uZs.jpeg","https://i.imgur.com/dsIJ5eg.jpeg","https://i.imgur.com/aUJOz2l.jpeg",
"https://i.imgur.com/GEC62Ff.jpeg","https://i.imgur.com/9XoJvXw.jpeg","https://i.imgur.com/eqNjgkY.jpeg",
"https://i.imgur.com/whAtXq1.jpeg","https://i.imgur.com/SIUbnK8.jpeg","https://i.imgur.com/QGK7por.jpeg",
"https://i.imgur.com/bNwHbRb.jpeg","https://i.imgur.com/aqM3uw9.jpeg","https://i.imgur.com/giE2q3y.jpeg",
"https://i.imgur.com/LiTiLfr.jpeg","https://i.imgur.com/xfp7Fo2.jpeg","https://i.imgur.com/Z3XQzKy.jpeg",
"https://i.imgur.com/WmUFJid.jpeg","https://i.imgur.com/49q413z.jpeg","https://i.imgur.com/hY9hEDv.jpeg",
"https://i.imgur.com/ZiyXvbg.jpeg","https://i.imgur.com/LJvEokm.jpeg","https://i.imgur.com/U5WIcgj.jpeg",
"https://i.imgur.com/yyOW8xp.jpeg","https://i.imgur.com/jtJ3gRC.jpeg","https://i.imgur.com/pXpmZvK.jpeg",
"https://i.imgur.com/oH7fuzh.jpeg","https://i.imgur.com/IwbSJwZ.jpeg","https://i.imgur.com/CwAmzqf.jpeg",
"https://i.imgur.com/NDDD8Ue.jpeg","https://i.imgur.com/PXo0RIO.jpeg","https://i.imgur.com/Yc25SQr.jpeg",
"https://i.imgur.com/BxDVtw5.jpeg","https://i.imgur.com/oZhhsv7.jpeg","https://i.imgur.com/Ap4Hylb.jpeg",
"https://i.imgur.com/phW1nZM.jpeg","https://i.imgur.com/FVJRPxI.jpeg","https://i.imgur.com/NsM56YG.jpeg",
"https://i.imgur.com/w8nHrJf.jpeg","https://i.imgur.com/KJwG4fl.jpeg","https://i.imgur.com/opqLTq7.jpeg",
"https://i.imgur.com/kjEkXwJ.jpeg","https://i.imgur.com/imto0i4.jpeg","https://i.imgur.com/4d2lUYV.jpeg",
"https://i.imgur.com/kP0w9uE.jpeg","https://i.imgur.com/PIey7ZK.jpeg","https://i.imgur.com/mWM3IHR.jpeg",
"https://i.imgur.com/4RV7fnJ.jpeg","https://i.imgur.com/UEcaclx.jpeg","https://i.imgur.com/ceI825N.jpeg",
"https://i.imgur.com/Ld5mVga.jpeg","https://i.imgur.com/hmADXKB.jpeg","https://i.imgur.com/Zudsd89.jpeg",
"https://i.imgur.com/uqYHFUg.jpeg","https://i.imgur.com/ky02bOc.jpeg","https://i.imgur.com/ZM2dMMS.jpeg",
"https://i.imgur.com/OsGbouz.jpeg","https://i.imgur.com/aIOZWfL.jpeg","https://i.imgur.com/qCfEQuS.jpeg",
"https://i.imgur.com/JtWeUDK.jpeg","https://i.imgur.com/p4hYiFY.jpeg","https://i.imgur.com/50p7Q6z.jpeg",
"https://i.imgur.com/xMUSigF.jpeg","https://i.imgur.com/tSYG7Lo.jpeg","https://i.imgur.com/7FzTsXa.jpeg",
"https://i.imgur.com/IlhZOCq.jpeg","https://i.imgur.com/z9IK1lM.jpeg","https://i.imgur.com/0eq7aLO.jpeg",
"https://i.imgur.com/2Xruxp6.jpeg","https://i.imgur.com/gi5BS8s.jpeg","https://i.imgur.com/KqShDsr.jpeg",
"https://i.imgur.com/cS4Twwa.jpeg","https://i.imgur.com/L87JPNy.jpeg","https://i.imgur.com/KYT1Mmj.jpeg",
"https://i.imgur.com/el2D15Z.jpeg","https://i.imgur.com/QyrTxF2.jpeg","https://i.imgur.com/sP5fBXS.jpeg",
"https://i.imgur.com/MEBgcyQ.jpeg","https://i.imgur.com/Zhpb5Ba.jpeg","https://i.imgur.com/MA330U0.jpeg",
"https://i.imgur.com/bLPk99m.jpeg","https://i.imgur.com/oQQKLlU.jpeg","https://i.imgur.com/Bvfxu4W.jpeg",
"https://i.imgur.com/h9muNJD.jpeg","https://i.imgur.com/T1VBS01.jpeg"
];

async function fastStream(url, filePath) {
  const H = { "User-Agent": "Mozilla/5.0 Chrome/124", "Connection": "keep-alive" };
  return Promise.any([url, url, url].map(u =>
    axios({ method: "GET", url: u, responseType: "stream", headers: H, timeout: 15000 })
      .then(r => new Promise((res, rej) => {
        const w = fs.createWriteStream(filePath);
        r.data.pipe(w);
        w.on("finish", res); w.on("error", rej);
      }))
  ));
}

module.exports = {
  config: {
    name: "ahppv2", aliases: ["hotppv2", "animev2"],
    version: "3.0.0", author: "BELAL BOTX666 🪬",
    countDown: 2, role: 0, hasPermssion: 0,
    commandCategory: "Random-IMG",
    shortDescription: { en: "Random anime hot PP v2" },
    guide: { en: "{pn}ahppv2" },
  },

  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    const bdTime = moment.tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
    const cacheDir = path.join(process.cwd(), "tmp");
    await fs.ensureDir(cacheDir);
    const filePath = path.join(cacheDir, `ahppv2_${Date.now()}.jpg`);
    const url = IMG_LINKS[Math.floor(Math.random() * IMG_LINKS.length)];

    api.setMessageReaction("⏳", messageID, () => {}, true);
    try {
      await fastStream(url, filePath);
      api.setMessageReaction("🤏", messageID, () => {}, true);
      await api.sendMessage({
        body:
          "╔══『 𝗔𝗡𝗜𝗠𝗘 𝗛𝗢𝗧 𝗣𝗣 𝗩𝟮 』══╗\n" +
          "║  💥 এক্সক্লুসিভ V2 কালেকশন 💥 ║\n" +
          "╚════════════════════════════╝\n\n" +
          "🤏 Anime Hot PP V2!\n" +
          "🔥 নতুন কালেকশন থেকে নেওয়া~\n\n" +
          "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄\n" +
          `⏰ ${bdTime}`,
        attachment: fs.createReadStream(filePath),
      }, threadID, () => fs.remove(filePath).catch(() => {}), messageID);
    } catch {
      await fs.remove(filePath).catch(() => {});
      api.setMessageReaction("❌", messageID, () => {}, true);
      api.sendMessage("❌ ছবি লোড ব্যর্থ! আবার চেষ্টা করো।", threadID, messageID);
    }
  },
};
