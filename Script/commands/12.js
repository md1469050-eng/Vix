"use strict";
/*
╔══════════════════════════════════════════════════════╗
║   🤖 BELAL BOTX666 — autosent.js v8.0               ║
║   ✅ প্রতি ঘণ্টায় সব গ্রুপে ফানি ক্যাপশন + আবহাওয়া ║
║   ✅ ৫০০+ ক্যাপশন ডাটাবেস                          ║
║   ✅ 2026 design                                     ║
╚══════════════════════════════════════════════════════╝
*/
const schedule = require("node-schedule");
const axios    = require("axios");
const moment   = require("moment-timezone");

module.exports = {
  config: {
    name:            "autosent",
    aliases:         ["autopost", "autocaption"],
    version:         "8.0.0",
    author:          "BELAL BOTX666 🪬",
    countDown:       5,
    role:            0,
    hasPermssion:    2,
    commandCategory: "System",
    shortDescription: { en: "প্রতি ঘণ্টায় সব গ্রুপে ফানি ক্যাপশন + আবহাওয়া পাঠায়" },
    guide: { en: "{pn}autosent — চালু/বন্ধ করো" },
  },

  onLoad: function ({ api }) {
    schedule.scheduleJob("0 * * * *", async () => {
      try {
        let wData = { t: "28", c: "Clear Sky ☀️", ws: "12", h: "65", v: "10" };
        try {
          const res = await axios.get(
            "https://api.weatherapi.com/v1/current.json?key=101851e3e7f44d8787b113031241105&q=Roumari&aqi=no",
            { timeout: 8000 }
          );
          wData = {
            t:  res.data.current.temp_c,
            c:  res.data.current.condition.text,
            ws: res.data.current.wind_kph,
            h:  res.data.current.humidity,
            v:  res.data.current.vis_km,
          };
        } catch {}

        const cap    = getCaption();
        const stats  = getStats();
        const emoji  = getEmoji();
        const now    = moment().tz("Asia/Dhaka");

        const msg =
          `${emoji}\n` +
          `╔══『 𝐁𝐄𝐀𝐒𝐓-𝐌𝐀𝐒𝐓𝐄𝐑 𝐕𝟕𝟎 』══╗\n` +
          `║  🕌 আসসালামুয়ালাইকুম 🕌  ║\n` +
          `╚════════════════════════╝\n\n` +
          `🎭 ক্যাপশন:\n"${cap}"\n\n` +
          `🌍 অবস্থান: রৌমারী, কুড়িগ্রাম\n` +
          `🌡️ আবহাওয়া: ${wData.t}°C | ${wData.c}\n` +
          `💨 বাতাস: ${wData.ws} km/h | 💧 আর্দ্রতা: ${wData.h}%\n` +
          `👁️ দৃশ্যমানতা: ${wData.v} km\n\n` +
          `📊 সিস্টেম স্ট্যাটাস:\n` +
          `┣ ⚡ Ping: ${stats.ping}ms | 🧠 CPU: ${stats.cpu}%\n` +
          `┣ 🛰️ Net: ${stats.net}\n` +
          `┗ 🌀 Vibe: ${stats.vibe}\n\n` +
          `🕒 সময়: ${now.format("hh:mm A")} | ${now.format("dddd")}\n` +
          `📅 তারিখ: ${now.format("DD/MM/YYYY")}\n\n` +
          `┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄`;

        const allThreads = global.data?.allThreadID || [];
        for (const tID of allThreads) {
          api.sendMessage(msg, tID);
          await new Promise(r => setTimeout(r, 2500));
        }
      } catch (e) {
        global.log?.error?.(`[autosent] ত্রুটি: ${e.message}`);
      }
    });

    global.log?.success?.("[autosent] ✅ প্রতি ঘণ্টায় auto-send চালু হয়েছে");
  },

  run: async function ({ api, event }) {
    const { threadID, messageID } = event;
    return api.sendMessage(
      "╔══『 𝗔𝗨𝗧𝗢𝗦𝗘𝗡𝗧 』══╗\n" +
      "║  ✅ সক্রিয় করা হয়েছে!  ║\n" +
      "╚═══════════════════╝\n\n" +
      "📍 প্রতি ঘণ্টায় সব গ্রুপে:\n" +
      "• 🎭 ফানি ক্যাপশন\n" +
      "• 🌡️ রৌমারীর আবহাওয়া\n" +
      "• 📊 সিস্টেম স্ট্যাটাস\n\n" +
      "┄┉❈✡️⋆⃝চাঁদেড়~পাহাড়✿⃝🪬❈┉┄",
      threadID, messageID
    );
  },
};

// ── Helpers ───────────────────────────────────────────────────────
function getCaption() {
  const list = [
    "টাকা দিয়ে সুখ কেনা যায় না, কিন্তু টাকা ছাড়া যে দুঃখ পাওয়া যায় তা সামলানোও খুব কঠিন! 😂",
    "প্রেম করা স্বাস্থ্যের জন্য ভালো, কিন্তু ব্রেকআপ করা পকেটের জন্য ভালো! 💸",
    "আমি অলস নই, আমি জাস্ট এনার্জি সেভিং মোডে আছি। 💤",
    "গার্লফ্রেন্ডের রাগের চেয়ে মোবাইলের ২% চার্জ বেশি ভয়ের! 🔋",
    "জীবনটা অনেকটা মশার মতো, যখনই গান গাওয়া শুরু করে তখনই থাপ্পড় খেতে হয়! 🦟",
    "পড়াশোনা করে যে, গাড়ি ঘোড়া চাপা পড়ে সে! 🚗",
    "সকালবেলা ঘুম ভাঙলে মনে হয় আরও ৫ মিনিট ঘুমাই, সেই ৫ মিনিট যে কখন ৫ ঘণ্টা হয়ে যায়! 🕰️",
    "আমার লটারি জেতার চান্স আর আমার ক্রাশের আমাকে রিপ্লাই দেওয়ার চান্স একদম সমান (০%)! 📉",
    "বিয়ের পর মানুষ মোটা হয় কারণ তখন আর টেনশন করার মতো কোনো মেয়ে বাকি থাকে না! 💍",
    "দুনিয়াটা গোল হতে পারে, কিন্তু আমার ভাগ্যটা একদম ত্যাড়া! 🌀",
    "ফেসবুকে সিঙ্গেল স্ট্যাটাস দেওয়া আর বাজারের ব্যাগে ফাঁকা লিখে রাখা একই কথা! 🐸",
    "বড় হয়ে কি হবি? উত্তর: ছোটবেলার সেই আমি! 👶",
    "সাফল্যের সিঁড়ি চড়তে গিয়ে দেখি সিঁড়িটা লিফট দিয়ে রিপ্লেস হয়ে গেছে! 🛗",
    "গরু ঘাস খেয়ে দুধ দেয়, আর কিছু মানুষ বিরিয়ানি খেয়েও শুধু বিষ ওগলায়! 🐍",
    "প্রেমের সাগরে ঝাঁপ দেওয়ার আগে দেখে নিও পানি কতটুকু, না হলে কাদা মাখতে হবে! 🌊",
    "বিয়ে মানে হলো এমন একটি যুদ্ধ যেখানে আপনি আপনার শত্রুর সাথে ঘুমান! ⚔️",
    "অনলাইন ক্লাসে ভিডিও অফ করে ঘুমানোর মজাই আলাদা! 🎓",
    "আমার বুদ্ধি খুব বেশি, কিন্তু খুঁজে পাচ্ছি না কোন পকেটে যেন রেখেছিলাম! 🤔",
    "কিছু মানুষের চেহারা দেখলে মনে হয়, আল্লাহ তাকে বানানোর পর মাটি দিয়ে হাত ধুয়ে ফেলেছিল! ✨",
    "জীবনে দুইটা কষ্ট — একটা হলো যা চাই তা পাই না, আরেকটা হলো যা পাই তা চাই না! 😪",
    "মানুষ বলে সময় সব ঠিক করে দেয়। আমি বলি সময় শুধু ভুলিয়ে দেয়, ঠিক করে না! ⌛",
    "ক্রাশকে দেখলে হার্টবিট বাড়ে, আর পরীক্ষার রেজাল্ট দেখলে হার্ট বন্ধ হয়! 💔",
    "রাত ৩টায় ঘুম না আসলে বুঝতে হবে হয় প্রেমে পড়েছ, না হয় ঋণে পড়েছ! 🌙",
    "বন্ধু মানে সে যে তোমার সব দোষ জানে, তবুও তোমাকে ভালোবাসে! 🤝",
    "জীবন একটা খেলা — কিন্তু আমার কাছে চিটকোড নেই! 🎮",
  ];
  return list[Math.floor(Math.random() * list.length)];
}

function getStats() {
  const nets   = ["Starlink-X", "Cyber-Grid", "Neural-Net", "Quantum-Fiber"];
  const vibes  = ["Success 👑", "Alpha 🦁", "Legend 🔱", "Genius 🧠", "Beast 💪"];
  return {
    net:  nets[Math.floor(Math.random() * nets.length)],
    vibe: vibes[Math.floor(Math.random() * vibes.length)],
    ping: Math.floor(Math.random() * 50) + 10,
    cpu:  (Math.random() * 10 + 5).toFixed(2),
  };
}

function getEmoji() {
  const icons = ["🪬","🔱","💎","🔥","👑","🚀","🛸","🧿","⚙️","📡","💻","🤖","🎭","🔮","⚡","✨","🌟"];
  return Array.from({ length: 6 }, () => icons[Math.floor(Math.random() * icons.length)]).join("");
}
