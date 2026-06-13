"use strict";
const fs = require("fs-extra");
const { downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

const LINKS = ["https://i.imgur.com/2MOezkV.mp4","https://i.imgur.com/t9qQYXY.mp4","https://i.imgur.com/sfrCllI.mp4","https://i.imgur.com/wuWm4Zf.mp4","https://i.imgur.com/8Cze5eR.mp4","https://i.imgur.com/WbVxFiZ.mp4","https://i.imgur.com/5pZ7avd.mp4","https://i.imgur.com/rwJzo4j.mp4","https://i.imgur.com/IIuGEnP.mp4","https://i.imgur.com/PTcw69V.mp4","https://i.imgur.com/X1UyvYg.mp4","https://i.imgur.com/BXuOPCu.mp4","https://i.imgur.com/iYCVlFm.mp4","https://i.imgur.com/ToEnOF4.mp4","https://i.imgur.com/CHe8W0x.mp4","https://i.imgur.com/1MjqIFD.mp4","https://i.imgur.com/OYsv5kE.mp4","https://i.imgur.com/OuzACnd.mp4","https://i.imgur.com/vBc1xu0.mp4","https://i.imgur.com/ptGiFh3.mp4","https://i.imgur.com/kEd15eO.mp4","https://i.imgur.com/sUug0bN.mp4","https://i.imgur.com/kkVEHsh.mp4","https://i.imgur.com/AiAvenh.mp4","https://i.imgur.com/8iKZtJH.mp4","https://i.imgur.com/ISa89fg.mp4","https://i.imgur.com/lzWbYuo.mp4"];

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const BOXES = [
  ["╔══『 💜 BL VIDEO 』══╗","╚═════════════════════╝"],
  ["«━━◤ 🖤 DARK BL ◢━━»","«━━━━━━━━━━━━━━━━━━━━»"],
  ["┏━━『 🌀 BL VIBES 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔▓▓『 💙 BL WORLD 』▓▓╗","╚▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╝"],
];

module.exports.config = {
  name: "bl", version: "2.0.0", hasPermssion: 0,
  credits: "BELAL BOTX666", description: "BL ভিডিও পাঠায়",
  commandCategory: "video", usages: "bl", cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  const [bTop, bBot] = rand(BOXES);
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";
  let tmp = null;
  try {
    tmp = await downloadToTmp(rand(LINKS), `bl_${Date.now()}.mp4`);
    await api.sendMessage({
      body: `${bTop}\nBL 💜\n${bBot}${sig}`,
      attachment: fs.createReadStream(tmp),
    }, threadID, messageID);
  } catch { api.sendMessage("❌ ভিডিও লোড ব্যর্থ।", threadID, messageID); }
  finally { if (tmp) cleanTmp(tmp); }
};
