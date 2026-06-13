"use strict";
const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const BOXES = [
  ["╔══『 🎂 HAPPY BIRTHDAY 』══╗","╚══════════════════════════════╝"],
  ["«━━◤ 🎉 BIRTHDAY BASH ◢━━»","«━━━━━━━━━━━━━━━━━━━━━━━━━━━━━»"],
  ["┏━━『 🎁 SPECIAL DAY 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔🎈🎈『 🥳 B-DAY 』🎈🎈╗","╚🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈╝"],
];

module.exports.config = {
  name: "birthday", version: "2.0.0", hasPermssion: 2,
  credits: "BELAL BOTX666", description: "জন্মদিনের শুভেচ্ছা পাঠাও",
  commandCategory: "group", usages: "birthday [@mention]", cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, mentions } = event;
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";
  const [bTop, bBot] = rand(BOXES);

  if (!Object.keys(mentions).length) return api.sendMessage(
    `${bTop}\n❌ কাকে শুভেচ্ছা জানাবে mention করো!\n${bBot}`, threadID, messageID);

  const uid  = Object.keys(mentions)[0];
  const name = mentions[uid].replace("@","");
  const tag  = [{ id: uid, tag: name }];

  const send = (msg) => api.sendMessage({ body: msg, mentions: tag }, threadID);

  const [bTop2, bBot2] = rand(BOXES);
  send(`${bTop2}\n🎂 @${name} কে জন্মদিনের শুভেচ্ছা!\n🎉 HAPPY BIRTHDAY 🎉\nচাঁদের পাহাড়ের পক্ষ থেকে 🪬\n${bBot2}${sig}`);

  const msgs = [
    { d:3000,  m:`আরো একটি বছর করলে তুমি পার। সুস্থ থাকো ভালো থাকো! 🥰\nশুভ জন্মদিন @${name}` },
    { d:7000,  m:`আনন্দ উল্লাসে কাটে যেন তোমার প্রতিটি দিন! 🌸\nশুভ জন্মদিন @${name}` },
    { d:12000, m:`জন্মদিনে শুভেচ্ছা নিও প্রিয়~\nবার্থডে ট্রিট পেলে বৎস হবো প্রীত! 🎂\nশুভ জন্মদিন @${name}` },
    { d:17000, m:`কামনা করি তুমি পৃথিবীর সব সুখ পাও 💖\nশুভ জন্মদিন @${name}` },
    { d:22000, m:`ফুলে হাঁসিতে প্রাণের খুশিতে,\nসব সুন্দর হোক আজকের দিনে ❦\nশুভ জন্মদিন @${name}` },
    { d:27000, m:`শুভ হোক তোমার আগামী দিন 💖\nতোমার মুখের হাসি সারাজীবন থাকুক 🥰\nHappy Birthday @${name}` },
    { d:32000, m:`many many happy returns of the day 🥰😘\nHappy Birthday 🎂 @${name}` },
    { d:37000, m:`মন থেকে দোয়া করি সুখে থাকো, ভালো থাকো 🥰\nশুভ জন্মদিন @${name}!` },
    { d:42000, m:`সবসময় পাশে আছি ইনশাল্লাহ 🥰😘 @${name}\n${sig}` },
  ];

  msgs.forEach(({d, m}) => setTimeout(() => send(m), d));
};
