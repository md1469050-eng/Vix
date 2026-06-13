"use strict";
const fs = require("fs-extra");
const { downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

const VIDEOS = ['https://i.imgur.com/AzF8qu2.mp4','https://i.imgur.com/1bxxZCK.mp4','https://i.imgur.com/zF5Foig.mp4','https://i.imgur.com/jbUCtTa.mp4','https://i.imgur.com/J0sVuRc.mp4','https://i.imgur.com/CHMhxku.mp4','https://i.imgur.com/lEAyLIE.mp4','https://i.imgur.com/exfA2k9.mp4','https://i.imgur.com/ugGG2BY.mp4','https://i.imgur.com/dZEap0Z.mp4','https://i.imgur.com/xgpGdNe.mp4','https://i.imgur.com/LLucP15.mp4','https://i.imgur.com/DEBRSER.mp4','https://i.imgur.com/0HNqXfX.mp4','https://i.imgur.com/iPibbD9.mp4','https://i.imgur.com/p4BHIJE.mp4','https://i.imgur.com/qh295t5.mp4','https://i.imgur.com/c98dIlK.mp4','https://i.imgur.com/5ty0RNA.mp4','https://i.imgur.com/W2fd3e5.mp4','https://i.imgur.com/OS2lRVW.mp4','https://i.imgur.com/J524CfA.mp4','https://i.imgur.com/OHn0L1g.mp4','https://i.imgur.com/dshmNdc.mp4','https://i.imgur.com/0785PGJ.mp4','https://i.imgur.com/J59Hl1t.mp4','https://i.imgur.com/SoVP1Qe.mp4','https://i.imgur.com/G8uYNxl.mp4','https://i.imgur.com/iutOxsG.mp4','https://i.imgur.com/eCF9cBd.mp4','https://i.imgur.com/HmHXjyJ.mp4','https://i.imgur.com/iNCRwUz.mp4','https://i.imgur.com/Opeg9MG.mp4','https://i.imgur.com/7dqTUvv.mp4','https://i.imgur.com/6nvzJ1q.mp4','https://i.imgur.com/vznF0YY.mp4','https://i.imgur.com/aKMiLTo.mp4','https://i.imgur.com/cy4w6Tz.mp4','https://i.imgur.com/iyNLH0u.mp4','https://i.imgur.com/FCwSA0x.mp4','https://i.imgur.com/G6HsY3Z.mp4','https://i.imgur.com/NT3LT2w.mp4','https://i.imgur.com/9xiSW5o.mp4','https://i.imgur.com/DmC9av3.mp4','https://i.imgur.com/tuaCyjp.mp4','https://i.imgur.com/TQIejDd.mp4','https://i.imgur.com/vywuYQ8.mp4','https://i.imgur.com/m7zvwaq.mp4','https://i.imgur.com/Ev3TJKG.mp4','https://i.imgur.com/XItdI9A.mp4','https://i.imgur.com/GbOiBxK.mp4','https://i.imgur.com/TtiTM5H.mp4','https://i.imgur.com/uJfRVHE.mp4','https://i.imgur.com/8xMGbf5.mp4','https://i.imgur.com/cC0OxQI.mp4','https://i.imgur.com/Eclw9qK.mp4','https://i.imgur.com/u8RVSk4.mp4','https://i.imgur.com/mHa55LQ.mp4','https://i.imgur.com/VwDPT3u.mp4','https://i.imgur.com/qEfCFwj.mp4','https://i.imgur.com/We18rbB.mp4','https://i.imgur.com/wK9pmGn.mp4','https://i.imgur.com/BeiUY8F.mp4','https://i.imgur.com/6YH1wQL.mp4','https://i.imgur.com/i3VQpLm.mp4','https://i.imgur.com/wXIBgQg.mp4','https://i.imgur.com/rDNtrkr.mp4','https://i.imgur.com/GFY5fvj.mp4','https://i.imgur.com/C9ap29j.mp4'];

const usedSet = new Set();
const pick = () => {
  if (usedSet.size >= VIDEOS.length) usedSet.clear();
  const pool = VIDEOS.filter(v => !usedSet.has(v));
  const v    = pool[Math.floor(Math.random() * pool.length)];
  usedSet.add(v); return v;
};

const LABELS = [
  "✡️⃝🅰🅳🅼🅸🅽 ◎⃝😘─͢͢চৃাঁদেৃঁরৃঁ পাৃঁহা্ঁড়ৃঁ✡️⎞🪽",
  "┈──╼ 🪬 চাঁদের পাহাড় 🪬 ╾──┈",
  "✨ BELAL BOTX666 ✨",
];

module.exports.config = {
  name: "Reals", version: "2.0.0", hasPermission: 0,
  credits: "BELAL BOTX666", description: "Trending ভিডিও পাঠায়",
  commandCategory: "media", usages: "", cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  const url   = pick();
  const label = LABELS[Math.floor(Math.random() * LABELS.length)];
  let tmp     = null;
  try {
    tmp = await downloadToTmp(url, `reals_${Date.now()}.mp4`);
    await api.sendMessage({ body: `「 ${label} 」`, attachment: fs.createReadStream(tmp) }, threadID, messageID);
  } catch { api.sendMessage("❌ ভিডিও লোড ব্যর্থ।", threadID, messageID); }
  finally { if (tmp) cleanTmp(tmp); }
};
