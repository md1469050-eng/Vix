/*
╔══════════════════════════════════════════════════════════════╗
║   🎨 pic.js v3.0 — Fast AI Image (4-5 sec)                  ║
║   ✅ Parallel API race — সবচেয়ে আগে যে দেয় সেটা নাও      ║
║   BELAL BOTX666 | Master: Belal YT                          ║
╚══════════════════════════════════════════════════════════════╝
*/
"use strict";

const axios = require("axios");

const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
};

// বাংলা → ইংরেজি
async function toEnglish(text) {
  if (!/[\u0980-\u09FF]/.test(text)) return text;
  try {
    const res = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=bn&tl=en&dt=t&q=${encodeURIComponent(text)}`,
      { timeout: 5000 }
    );
    return res.data[0].map(x => x[0]).join("").trim() || text;
  } catch { return text; }
}

// একটা URL থেকে image stream নাও
function fetchStream(url) {
  return axios({
    method: "GET", url,
    responseType: "stream",
    headers: HEADERS,
    timeout: 20000,
    maxRedirects: 10
  }).then(r => {
    if (r.status !== 200) throw new Error("bad status");
    r.data.path = "pic.jpg";
    return r.data;
  });
}

// ══════════════════════════════════════════════════════
//  সব API একসাথে race করাও — যে আগে দেয় সেটাই নাও
// ══════════════════════════════════════════════════════
async function getImage(prompt) {
  const seed = Date.now();
  const enc  = encodeURIComponent;

  const p1 = `${prompt}, ultra realistic, high quality, 4k, beautiful`;
  const p2 = `${prompt}, photorealistic, detailed, cinematic lighting`;
  const p3 = `${prompt}, high resolution, stunning, professional photo`;

  const apis = [
    // Pollinations flux (সবচেয়ে ফাস্ট)
    fetchStream(`https://image.pollinations.ai/prompt/${enc(p1)}?width=1024&height=1024&nologo=true&enhance=true&seed=${seed}&model=flux`),
    // Pollinations flux-realism
    fetchStream(`https://image.pollinations.ai/prompt/${enc(p2)}?width=1024&height=1024&nologo=true&seed=${seed+1}&model=flux-realism`),
    // Pollinations turbo (দ্রুত)
    fetchStream(`https://image.pollinations.ai/prompt/${enc(p3)}?width=1024&height=1024&nologo=true&seed=${seed+2}&model=turbo`),
  ];

  // Promise.any — যেটা আগে succeed করে সেটা return
  return Promise.any(apis);
}

module.exports = {
  config: {
    name: "pic",
    aliases: ["imagine", "gen", "ছবি", "বানাও", "draw", "ai"],
    version: "3.0.0",
    author: "Belal YT",
    countDown: 5,
    role: 0,
    shortDescription: { en: "AI ছবি তৈরি — বাংলায় চাহিদা বলুন" },
    longDescription:  { en: "বাংলায় যা চাইবেন তাই AI দিয়ে ছবি তৈরি করা হবে।" },
    category: "🎨 ইমেজ",
    guide: {
      en: "{pn} <চাহিদা>\n\nউদাহরণ:\n{pn} সমুদ্র সৈকতে একটা সুন্দর মেয়ে\n{pn} রাতের আকাশে পূর্ণিমার চাঁদ\n{pn} a beautiful girl in a flower garden"
    }
  },

  onStart: async function ({ message, event, api, args }) {
    const { messageID } = event;

    const rawPrompt = args.join(" ").trim();
    if (!rawPrompt) {
      return message.reply(
        `❌ কী ছবি বানাতে চান বলুন!\n\n` +
        `📝 ব্যবহার: /pic <চাহিদা>\n\n` +
        `✨ উদাহরণ:\n` +
        `• /pic সমুদ্র সৈকতে একটা সুন্দর মেয়ে\n` +
        `• /pic রাতের আকাশে পূর্ণিমার চাঁদ\n` +
        `• /pic পাহাড়ের চূড়ায় সূর্যোদয়${sig}`
      );
    }

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const isBengali    = /[\u0980-\u09FF]/.test(rawPrompt);
    const englishPrompt = isBengali ? await toEnglish(rawPrompt) : rawPrompt;

    try {
      const stream = await getImage(englishPrompt);

      api.setMessageReaction("✅", messageID, () => {}, true);
      await message.reply({
        body:
          `🎨 ছবি তৈরি হয়েছে ✅\n` +
          `📝 চাহিদা: ${rawPrompt}\n` +
          (isBengali ? `🔤 Prompt: ${englishPrompt}` : "") +
          sig,
        attachment: stream
      });

    } catch (err) {
      console.error("[pic]", err?.message);
      api.setMessageReaction("❌", messageID, () => {}, true);
      message.reply(`❌ ছবি তৈরি করা সম্ভব হয়নি। আবার চেষ্টা করুন।${sig}`);
    }
  }
};
