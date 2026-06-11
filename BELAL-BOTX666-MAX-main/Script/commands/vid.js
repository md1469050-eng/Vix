/*
╔══════════════════════════════════════════════════════════════╗
║   🎬 vid.js v3.3 — FFmpeg (scale-based, no zoompan)         ║
║   ✅ zoompan বাদ — vf_script ফাইল দিয়ে complex filter      ║
║   ✅ 5-7 সেকেন্ডে ভিডিও                                    ║
║   BELAL BOTX666 | Master: Belal YT                          ║
╚══════════════════════════════════════════════════════════════╝
*/
"use strict";

const axios        = require("axios");
const fs           = require("fs");
const path         = require("path");
const { execFileSync } = require("child_process");

const sig = "\n┄┉❈✡️⋆⃝ 𖤍চাঁদের~পাহাড়𖤍 ⋆⃝🪬❈┉┄";

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

async function downloadImage(url, dest) {
  const res = await axios({
    method: "GET", url,
    responseType: "arraybuffer",
    timeout: 20000,
    maxRedirects: 10,
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  fs.writeFileSync(dest, Buffer.from(res.data));
}

function pickEffect(prompt) {
  const p = (prompt || "").toLowerCase();
  if (/walk|run|হাঁট|দৌড়|চল|move/.test(p))       return "pan_lr";
  if (/wind|fly|উড়|বাতাস|float|ভাস/.test(p))      return "pan_ud";
  if (/zoom.?in|close|জীবন্ত|alive|life/.test(p))  return "zoomin";
  if (/zoom.?out|far|দূর/.test(p))                  return "zoomout";
  return "kenburns";
}

// ✅ FIX: scale ছবি বড় করে রাখো, তারপর
//    libav expression দিয়ে crop position সরাও (on/tb ব্যবহার নেই)
//    পরিবর্তে: color source + overlay + scale chain
function buildArgs(imgPath, outPath, effect) {
  const W = 1280, H = 720, FPS = 25, DUR = 6;
  // scale factor: ছবিকে বড় করো যাতে pan করার জায়গা থাকে
  const SW = W * 2, SH = H * 2;

  // vf_complex দিয়ে: ছবি scale করো, তারপর fps set করো,
  // তারপর trim করো DUR সেকেন্ড,
  // তারপর crop animate করো — কিন্তু crop-এ t নেই,
  // তাই আমরা overlay+pad trick ব্যবহার করব

  // ── সবচেয়ে reliable পদ্ধতি: ──
  // ছবিকে scale করে একটা বড় canvas বানাও
  // তারপর overlay position-এ expression দাও
  // overlay তে x/y expression-এ 't' কাজ করে!

  let overlayExpr;
  switch (effect) {
    case "zoomin":
      // center থেকে zoom in: scale বড়→ছোট (crop area বড়→ছোট)
      // overlay এ zoom effect: img scale বাড়াই সময়ের সাথে
      overlayExpr = `x='-(t/${DUR})*${W*0.2}':y='-(t/${DUR})*${H*0.2}'`;
      break;
    case "zoomout":
      overlayExpr = `x='-(${W*0.2})+(t/${DUR})*${W*0.2}':y='-(${H*0.2})+(t/${DUR})*${H*0.2}'`;
      break;
    case "pan_lr":
      // বাম থেকে ডানে
      overlayExpr = `x='-(t/${DUR})*${W*0.5}':y='0'`;
      break;
    case "pan_ud":
      // নিচ থেকে উপরে
      overlayExpr = `x='0':y='-(t/${DUR})*${H*0.5}'`;
      break;
    case "kenburns":
    default:
      // zoom in + diagonal
      overlayExpr = `x='-(t/${DUR})*${W*0.25}':y='-(t/${DUR})*${H*0.15}'`;
      break;
  }

  // filter_complex:
  // [0:v] ছবিকে SW×SH তে scale করো, fps দাও, loop করো → [big]
  // color black W×H → [bg]
  // [bg][big] overlay করো animate করে → crop করো W×H → fade
  const fc =
    `[0:v]scale=${SW}:${SH},setsar=1,fps=${FPS},loop=loop=-1:size=1:start=0[big];` +
    `color=black:size=${W}x${H}:rate=${FPS}:duration=${DUR}[bg];` +
    `[bg][big]overlay=${overlayExpr}:eval=frame[ov];` +
    `[ov]crop=${W}:${H}:0:0,` +
    `fade=t=in:st=0:d=0.6,` +
    `fade=t=out:st=${DUR - 0.8}:d=0.7[out]`;

  return [
    "-y",
    "-loop", "1",
    "-t", String(DUR + 1),   // input loop duration (একটু বেশি দাও)
    "-i", imgPath,
    "-filter_complex", fc,
    "-map", "[out]",
    "-t", String(DUR),
    "-pix_fmt", "yuv420p",
    "-c:v", "libx264",
    "-preset", "ultrafast",
    "-crf", "26",
    "-movflags", "+faststart",
    outPath
  ];
}

const effectNames = {
  zoomin:   "🔍 Zoom In",
  zoomout:  "🔎 Zoom Out",
  pan_lr:   "➡️ Pan",
  pan_ud:   "⬆️ Float Up",
  kenburns: "🎬 Ken Burns"
};

async function makeVideo(imageUrl, prompt) {
  const tmpDir = path.join(__dirname, "../../../tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

  const ts      = Date.now();
  const imgPath = path.join(tmpDir, `vi_${ts}.jpg`);
  const outPath = path.join(tmpDir, `vo_${ts}.mp4`);

  await downloadImage(imageUrl, imgPath);

  const effect = pickEffect(prompt);
  const args   = buildArgs(imgPath, outPath, effect);

  try {
    execFileSync("ffmpeg", args, { timeout: 120000, stdio: "pipe" });
  } catch (e) {
    try { fs.unlinkSync(imgPath); } catch {}
    try { fs.unlinkSync(outPath); } catch {}
    const errMsg = e.stderr?.toString?.()?.slice(-400) || e.message || "unknown";
    throw new Error(`FFmpeg: ${errMsg}`);
  }

  if (!fs.existsSync(outPath) || fs.statSync(outPath).size < 500) {
    try { fs.unlinkSync(imgPath); } catch {}
    throw new Error("Output missing or empty");
  }

  const stream = fs.createReadStream(outPath);
  stream.path  = "vid.mp4";
  stream.on("close", () => {
    try { fs.unlinkSync(imgPath); } catch {}
    try { fs.unlinkSync(outPath); } catch {}
  });

  return { stream, effect };
}

module.exports = {
  config: {
    name: "vid",
    aliases: ["ভিডিও", "toVideo", "img2vid", "picvid", "animate", "video"],
    version: "3.3.0",
    author: "Belal YT",
    countDown: 15,
    role: 0,
    shortDescription: { en: "ছবি থেকে সুন্দর animated ভিডিও" },
    longDescription:  { en: "ছবির উপর reply দিয়ে চাহিদা বলুন — FFmpeg দিয়ে animated ভিডিও।" },
    category: "🎬 ভিডিও",
    guide: {
      en: "ছবির উপর রিপ্লাই দিয়ে:\n{pn} <চাহিদা>\n\nউদাহরণ:\n{pn} ছবিটাকে জীবন্ত করো\n{pn} মেয়েটাকে হাঁটতে দেখাও\n{pn} zoom in করো"
    }
  },

  onStart: async function ({ message, event, api, args }) {
    const { threadID, messageID, messageReply, type } = event;

    const attachment = messageReply?.attachments?.[0];
    const hasPhoto =
      type === "message_reply" &&
      attachment &&
      ["photo", "sticker", "animated_image"].includes(attachment.type);

    if (!hasPhoto) {
      return message.reply(
        `❌ একটি ছবির উপর রিপ্লাই দিয়ে লিখুন:\n\n` +
        `📝 /vid <চাহিদা>\n\n` +
        `✨ উদাহরণ:\n` +
        `• /vid ছবিটাকে জীবন্ত করো\n` +
        `• /vid মেয়েটাকে হাঁটতে দেখাও\n` +
        `• /vid zoom in করো${sig}`
      );
    }

    const imageUrl = attachment.url || attachment.previewUrl || attachment.largePreviewUrl;
    if (!imageUrl) return message.reply(`❌ ছবির URL পাওয়া যায়নি।${sig}`);

    const rawPrompt = args.join(" ").trim() || "জীবন্ত করো";
    const isBengali = /[\u0980-\u09FF]/.test(rawPrompt);
    const engPrompt = isBengali ? await toEnglish(rawPrompt) : rawPrompt;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    let waitMsgID = null;
    const waitTimer = setTimeout(() => {
      api.sendMessage(
        `🎬 ভিডিও তৈরি হচ্ছে...\n⏳ একটু অপেক্ষা করুন...`,
        threadID,
        (err, info) => { if (!err) waitMsgID = info?.messageID; }
      );
    }, 5000);

    try {
      const { stream, effect } = await makeVideo(imageUrl, engPrompt);

      clearTimeout(waitTimer);
      if (waitMsgID) try { api.unsendMessage(waitMsgID); } catch {}

      api.setMessageReaction("✅", messageID, () => {}, true);
      await message.reply({
        body:
          `🎬 ভিডিও তৈরি হয়েছে ✅\n` +
          `📝 চাহিদা: ${rawPrompt}\n` +
          `🎞️ Effect: ${effectNames[effect]}\n` +
          (isBengali ? `🔤 Prompt: ${engPrompt}` : "") +
          sig,
        attachment: stream
      });

    } catch (err) {
      clearTimeout(waitTimer);
      if (waitMsgID) try { api.unsendMessage(waitMsgID); } catch {}
      console.error("[vid]", err?.message);
      api.setMessageReaction("❌", messageID, () => {}, true);
      message.reply(`❌ সমস্যা হয়েছে!\n${err.message?.slice(0, 150) || ""}${sig}`);
    }
  }
};
      
