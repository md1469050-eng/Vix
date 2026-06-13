"use strict";
const fs   = require("fs-extra");
const path = require("path");
const axios = require("axios");
const { getUA } = require("../../utils/apiHelper");

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const BOXES = [
  ["╔══『 💘 LOVE PAIR 』══╗","╚══════════════════════╝"],
  ["«━━◤ 💑 BEST COUPLE ◢━━»","«━━━━━━━━━━━━━━━━━━━━━━━»"],
  ["┏━━『 ❤️ BF & GF 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔♥♥♥『 💝 MY LOVE 』♥♥♥╗","╚♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥╝"],
];

module.exports.config = {
  name: "bf", version: "8.0.0", hasPermssion: 0,
  credits: "BELAL BOTX666", description: "Pair image বানাও",
  commandCategory: "img", usages: "bf [@mention]", cooldowns: 5,
};

module.exports.onLoad = async function () {
  const dir  = path.join(__dirname, "cache", "canvas");
  const file = path.join(dir, "arr2.png");
  await fs.ensureDir(dir);
  if (!fs.existsSync(file)) {
    try {
      const r = await axios.get("https://i.imgur.com/iaOiAXe.jpeg", { responseType:"arraybuffer", timeout:10000 });
      fs.writeFileSync(file, r.data);
    } catch (e) { console.error("bf onLoad:", e.message); }
  }
};

async function makeImage(one, two) {
  const jimp    = require("jimp");
  const dir     = path.join(__dirname, "cache", "canvas");
  const bgPath  = path.join(dir, "arr2.png");
  const outPath = path.join(dir, `bf_${one}_${two}.png`);
  const avt1    = path.join(dir, `avt1_${one}.png`);
  const avt2    = path.join(dir, `avt2_${two}.png`);

  const getAvatar = async (id) => {
    const url = `https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    return (await axios.get(url, { responseType:"arraybuffer", timeout:8000, headers:{"User-Agent":getUA()} })).data;
  };

  const [a1, a2] = await Promise.all([getAvatar(one), getAvatar(two)]);
  fs.writeFileSync(avt1, a1); fs.writeFileSync(avt2, a2);

  const circle = async (p) => {
    const img = await jimp.read(p);
    img.circle();
    return img.getBufferAsync("image/png");
  };

  const bg = await jimp.read(bgPath);
  const c1 = await jimp.read(await circle(avt1));
  const c2 = await jimp.read(await circle(avt2));
  bg.composite(c1.resize(200,200), 70, 110).composite(c2.resize(200,200), 465, 110);
  fs.writeFileSync(outPath, await bg.getBufferAsync("image/png"));
  fs.remove(avt1).catch(()=>{}); fs.remove(avt2).catch(()=>{});
  return outPath;
}

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions } = event;
  const [bTop, bBot] = rand(BOXES);
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";

  const mention = Object.keys(mentions);
  if (!mention[0]) return api.sendMessage(`${bTop}\n❌ একজনকে mention করো!\n${bBot}`, threadID, messageID);

  const CAPTIONS = [
    "💘 ভালোবাসার সেরা জুটি!\n👑 এখন থেকে শুধু তোরই ❤️",
    "💑 দুইজনের মিল আকাশ-পাতাল!\n💌 তোর একমাত্র বয়ফ্রেন্ড হাজির 🩷",
    "❤️ এই কাপল টা কিন্তু জমে গেছে!\n🌸 ভালো থাকো দুজনেই 💛",
    "💝 Perfect Match!\n🌹 একে অপরের হয়ে থেকো সবসময় 🫶",
  ];

  try {
    const imgPath = await makeImage(senderID, mention[0]);
    return api.sendMessage({
      body: `${bTop}\n${rand(CAPTIONS)}\n${bBot}${sig}`,
      attachment: fs.createReadStream(imgPath),
    }, threadID, () => fs.remove(imgPath).catch(()=>{}), messageID);
  } catch (e) {
    api.sendMessage("❌ ছবি বানাতে সমস্যা হয়েছে!", threadID, messageID);
  }
};
