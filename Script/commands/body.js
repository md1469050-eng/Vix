"use strict";
const fs = require("fs-extra");
const { downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

const LINKS = ["https://i.imgur.com/HtKWgma.mp4","https://i.imgur.com/T0YDigG.mp4","https://i.imgur.com/n0vIGPL.mp4","https://i.imgur.com/3DmuzVK.mp4","https://i.imgur.com/3T9MDRN.mp4","https://i.imgur.com/OKe4qU9.mp4","https://i.imgur.com/mu9406G.mp4","https://i.imgur.com/soOacql.mp4","https://i.imgur.com/CDdnb47.mp4","https://i.imgur.com/3ejxOV4.mp4","https://i.imgur.com/HsX02Pw.mp4"];

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const BOXES = [
  ["╔══『 💀 BODY 』══╗","╚══════════════════╝"],
  ["«━━◤ 🖤 DARK VIBE ◢━━»","«━━━━━━━━━━━━━━━━━━━»"],
  ["┏━━『 😔 SAD VIDEO 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔▓▓『 🌑 MOOD OFF 』▓▓╗","╚▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╝"],
];

module.exports.config = {
  name: "body", version: "2.0.0", hasPermssion: 0,
  credits: "BELAL BOTX666", description: "Sad/Dark ভিডিও",
  commandCategory: "video", usages: "body", cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  const [bTop, bBot] = rand(BOXES);
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";
  let tmp = null;
  try {
    tmp = await downloadToTmp(rand(LINKS), `body_${Date.now()}.mp4`);
    await api.sendMessage({
      body: `${bTop}\nbody\n${bBot}${sig}`,
      attachment: fs.createReadStream(tmp),
    }, threadID, messageID);
  } catch { api.sendMessage("❌ ভিডিও লোড ব্যর্থ।", threadID, messageID); }
  finally { if (tmp) cleanTmp(tmp); }
};
