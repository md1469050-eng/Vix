"use strict";
/*
╔══════════════════════════════════════════════════════════╗
║  💀 leaveNoti.js v18.0 — BELAL BOTX666                  ║
║  ✅ টেক্সট আগে পাঠায় (তাৎক্ষণিক)                       ║
║  ✅ Canvas ছবি background এ বানায়                       ║
║  ✅ avatar + gradient — ২-৩ সেকেন্ডে সব                 ║
║  ✅ চোখ ধাঁধানো নিওন ডার্ক ডিজাইন                       ║
╚══════════════════════════════════════════════════════════╝
*/
const axios  = require("axios");
const fs     = require("fs-extra");
const path   = require("path");
const Canvas = require("canvas");
const moment = require("moment-timezone");

module.exports.config = {
  name: "leaveNoti",
  eventType: ["log:unsubscribe"],
  version: "18.0.0",
  credits: "Belal x Gemini",
  description: "Ultra-fast leave card — ২-৩ সেকেন্ডে ছবি + মেসেজ",
};

const rand = arr => arr[Math.floor(Math.random() * arr.length)];

const EMOJIS = ["🔱","💎","🛡️","🌀","🛰️","🧿","💫","🔥","👑","✨","🌟","⚙️","💠","🏆","⚡","🌈","🪬"];
const BANNERS = [
  ["╔══════════════════════════╗","╚══════════════════════════╝"],
  ["┏━━━━━━━━━━━━━━━━━━━━━━━━━━┓","┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╗","╚▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╝"],
];
const DIVIDERS = [
  "◈━━━━━━━━━━━━━━━━━━━━━━━━◈",
  "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬",
  "▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰",
];
const ROASTS_SELF = [
  "নিজেই পালাইলি? 🤣 ভালোই হলো, আবাল ছিলি!",
  "নিজে বের হইলি? রাস্তা মাপ! 💩 টা টা বাই বাই! 👋",
  "নিজেই দৌড় দিলি? দে দৌড়া আরো জোরে! 🏃💨",
];
const ROASTS_KICK = [
  "সজোরে লাথি মেরে বের করা হলো! 👞💥 আর আসিস না!",
  "তোকে ছুঁড়ে ফেলে দেওয়া হলো! 🗑️ বিদায়!",
  "তোর থাকার যোগ্যতা নেই! 🚪 গেট আউট!",
];

module.exports.handleEvent = async function ({ api, event, Users }) {
  if (event.logMessageType !== "log:unsubscribe") return;
  if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

  const { threadID } = event;
  const leftID       = event.logMessageData.leftParticipantFbId;
  const isSelf       = event.author == leftID;
  const time         = moment.tz("Asia/Dhaka").format("hh:mm A | DD/MM/YYYY");
  const sig          = "\n┄┉❈✡️⋆⃝চাঁদের~পাহাড়✿⃝🪬❈┉┄";

  // নাম বের করো
  let name = "Facebook User";
  try {
    name = global.data?.userName?.get(String(leftID)) || await Users.getNameUser(leftID);
  } catch {}

  const e1 = rand(EMOJIS), e2 = rand(EMOJIS);
  const [bTop, bBot] = rand(BANNERS);
  const d   = rand(DIVIDERS);
  const roast = isSelf ? rand(ROASTS_SELF) : rand(ROASTS_KICK);
  const uid = "EX-" + Math.floor(Math.random() * 900000 + 100000);

  // ── ১. টেক্সট মেসেজ আগে পাঠাও (তাৎক্ষণিক, await নেই) ──
  api.sendMessage(
`${bTop}
  ${e1} 𝗟𝗢𝗦𝗘𝗥 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗 ${e2}
${bBot}

${d}
💀 𝗨𝗦𝗘𝗥 𝗘𝗫𝗜𝗧 𝗟𝗢𝗚
${d}
👤 𝗡𝗮𝗺𝗲   » ${name}
🆔 𝗜𝗗     » ${leftID}
🕒 𝗧𝗶𝗺𝗲  » ${time}
🔖 𝗨𝗜𝗗   » ${uid}
📌 𝗧𝘆𝗽𝗲  » ${isSelf ? "স্বেচ্ছায় পালিয়েছে 🏃" : "লাথি খেয়ে গেছে 👞"}
${d}

আহারে ${name}! ${e1}
${roast}

${d}
👑 𝗔𝗱𝗺𝗶𝗻 » 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱 ✅)${sig}`,
    threadID
  );

  // ── ২. Canvas ছবি background এ বানাও ও পাঠাও ───────────
  const cacheDir  = path.join(__dirname, "cache");
  const cachePath = path.join(cacheDir, `leave_${leftID}_${Date.now()}.png`);
  await fs.ensureDir(cacheDir);

  try {
    // avatar — timeout 5s, fallback আছে
    const avatarUrl = `https://graph.facebook.com/${leftID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const avatarBuf = await axios.get(avatarUrl, { responseType: "arraybuffer", timeout: 5000 })
      .then(r => r.data)
      .catch(() => axios.get("https://i.imgur.com/6ve9YAs.png", { responseType: "arraybuffer", timeout: 5000 }).then(r => r.data));

    const W = 1200, H = 700;
    const canvas = Canvas.createCanvas(W, H);
    const ctx    = canvas.getContext("2d");

    // ── Background gradient ──────────────────────────────
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,    "#03001C");
    bg.addColorStop(0.3,  "#1B0033");
    bg.addColorStop(0.6,  "#240015");
    bg.addColorStop(1,    "#03001C");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // ── Grid lines ──────────────────────────────────────
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = "rgba(255,0,80,0.08)";
    for (let x = 0; x < W; x += 45) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 45) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // ── Glowing corner accents ──────────────────────────
    const corners = [[0,0],[W,0],[0,H],[W,H]];
    corners.forEach(([cx, cy]) => {
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
      g.addColorStop(0,   "rgba(255,0,60,0.25)");
      g.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });

    // ── Glass card (right side) ──────────────────────────
    ctx.save();
    ctx.shadowColor = "#FF003C"; ctx.shadowBlur = 30;
    const R = 24;
    ctx.beginPath();
    ctx.moveTo(420+R, 160); ctx.lineTo(W-60-R, 160);
    ctx.quadraticCurveTo(W-60, 160, W-60, 160+R);
    ctx.lineTo(W-60, H-80-R);
    ctx.quadraticCurveTo(W-60, H-80, W-60-R, H-80);
    ctx.lineTo(420+R, H-80);
    ctx.quadraticCurveTo(420, H-80, 420, H-80-R);
    ctx.lineTo(420, 160+R);
    ctx.quadraticCurveTo(420, 160, 420+R, 160);
    ctx.closePath();
    ctx.fillStyle   = "rgba(5,0,20,0.82)"; ctx.fill();
    ctx.strokeStyle = "#FF003C"; ctx.lineWidth = 6; ctx.stroke();
    ctx.restore();

    // ── Inner card border glow ───────────────────────────
    ctx.save();
    ctx.strokeStyle = "rgba(255,0,60,0.25)"; ctx.lineWidth = 2;
    ctx.strokeRect(428, 168, W-60-428-8, H-80-168-8);
    ctx.restore();

    // ── Avatar circle ────────────────────────────────────
    ctx.save();
    // outer glow ring
    for (let i = 5; i >= 1; i--) {
      ctx.beginPath(); ctx.arc(210, H/2, 155+i*8, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(255,0,60,${0.04*i})`; ctx.lineWidth = i*4; ctx.stroke();
    }
    ctx.shadowColor = "#FF003C"; ctx.shadowBlur = 50;
    ctx.beginPath(); ctx.arc(210, H/2, 155, 0, Math.PI*2);
    ctx.strokeStyle = "#FF003C"; ctx.lineWidth = 8; ctx.stroke();
    // clip and draw avatar
    ctx.beginPath(); ctx.arc(210, H/2, 148, 0, Math.PI*2); ctx.clip();
    ctx.drawImage(await Canvas.loadImage(avatarBuf), 210-148, H/2-148, 296, 296);
    ctx.restore();

    // ── Title "REST IN HELL" ─────────────────────────────
    ctx.save();
    ctx.font = "bold 64px Arial Unicode MS, Arial"; 
    ctx.shadowColor = "#FF003C"; ctx.shadowBlur = 25;
    const grad = ctx.createLinearGradient(440, 0, 1100, 0);
    grad.addColorStop(0, "#FF003C"); grad.addColorStop(0.5, "#FF6080"); grad.addColorStop(1, "#FF003C");
    ctx.fillStyle = grad;
    ctx.fillText("💀 REST IN HELL 💀", 445, 130);
    ctx.restore();

    // ── Divider line ─────────────────────────────────────
    ctx.save();
    ctx.shadowColor = "#FF003C"; ctx.shadowBlur = 10;
    ctx.strokeStyle = "#FF003C"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(435, 210); ctx.lineTo(W-75, 210); ctx.stroke();
    ctx.restore();

    // ── USER EXIT label ──────────────────────────────────
    ctx.save();
    ctx.font = "bold 28px Arial"; ctx.fillStyle = "#00FFFF";
    ctx.shadowColor = "#00FFFF"; ctx.shadowBlur = 12;
    ctx.fillText("━━━━━ 𝗨𝗦𝗘𝗥 𝗘𝗫𝗜𝗧 𝗥𝗘𝗖𝗢𝗥𝗗 ━━━━━", 440, 265);
    ctx.restore();

    // ── Info rows ─────────────────────────────────────────
    const rows = [
      ["👤 𝗡𝗮𝗺𝗲", name.length > 18 ? name.slice(0,18)+"…" : name],
      ["🆔 𝗜𝗗  ",  leftID],
      ["⏰ 𝗧𝗶𝗺𝗲",  time],
      ["📌 𝗧𝘆𝗽𝗲",  isSelf ? "স্বেচ্ছায় পালিয়েছে" : "লাথি খেয়ে গেছে"],
    ];
    ctx.font = "36px Arial Unicode MS, Arial";
    rows.forEach(([label, value], i) => {
      ctx.save();
      ctx.fillStyle = "#AAAAFF"; ctx.shadowColor = "#4444FF"; ctx.shadowBlur = 6;
      ctx.fillText(`${label} : `, 445, 325 + i * 68);
      ctx.fillStyle = "#FFFFFF"; ctx.shadowColor = "#000000"; ctx.shadowBlur = 4;
      ctx.fillText(value, 445 + ctx.measureText(`${label} : `).width, 325 + i * 68);
      ctx.restore();
    });

    // ── Bottom divider + admin ─────────────────────────────
    ctx.save();
    ctx.strokeStyle = "#FF003C"; ctx.lineWidth = 2; ctx.shadowColor = "#FF003C"; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(435, H-130); ctx.lineTo(W-75, H-130); ctx.stroke();
    ctx.font = "bold 32px Arial"; ctx.fillStyle = "#FFD700"; ctx.shadowColor = "#FFD700"; ctx.shadowBlur = 14;
    ctx.fillText("👑 𝗔𝗱𝗺𝗶𝗻 : 𝗕𝗘𝗟𝗔𝗟 (𝗩𝗲𝗿𝗶𝗳𝗶𝗲𝗱 ✅)", 445, H-88);
    ctx.restore();

    // save and send
    fs.writeFileSync(cachePath, canvas.toBuffer("image/png"));
    api.sendMessage(
      { attachment: fs.createReadStream(cachePath) },
      threadID,
      () => fs.remove(cachePath).catch(() => {})
    );

  } catch (e) {
    console.error("leaveNoti canvas error:", e.message);
  }
};
