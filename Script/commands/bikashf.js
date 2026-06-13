"use strict";
const { downloadToTmp, cleanTmp, getUA } = require("../../utils/apiHelper");
const fs = require("fs-extra");

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const BOXES = [
  ["╔══『 💸 FAKE BKASH 』══╗","╚══════════════════════════╝"],
  ["«━━◤ 📱 BKASH RECEIPT ◢━━»","«━━━━━━━━━━━━━━━━━━━━━━━━━━»"],
  ["┏━━『 🟥 BKASH FAKE 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔▓▓『 💰 PAYMENT SLIP 』▓▓╗","╚▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓╝"],
];

module.exports.config = {
  name: "bkashf", version: "2.0.0", hasPermssion: 0,
  credits: "BELAL BOTX666", description: "Fake Bkash screenshot বানাও",
  commandCategory: "Fun", usages: "bkashf <number> - <txnID> - <amount>", cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const [bTop, bBot] = rand(BOXES);
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";
  const input = args.join(" ");

  if (!input.includes("-")) return api.sendMessage(
`${bTop}
❌ ভুল format!
📝 ব্যবহার: bkashf 017xxxxxxxx - TXN123 - 1000
${bBot}`, threadID, messageID);

  const [numRaw, txnRaw, amtRaw] = input.split("-");
  const number = numRaw.trim(), txn = txnRaw.trim(), amount = amtRaw.trim();

  const APIS = [
    `https://masterapi.site/api/bkashf.php?number=${encodeURIComponent(number)}&transaction=${encodeURIComponent(txn)}&amount=${encodeURIComponent(amount)}`,
    `https://bk9.fun/fun/bkash?number=${encodeURIComponent(number)}&transaction=${encodeURIComponent(txn)}&amount=${encodeURIComponent(amount)}`,
  ];

  const wait = await api.sendMessage(`${bTop}\n📤 Generating...\n${bBot}`, threadID);
  let tmp = null;

  for (const url of APIS) {
    try {
      tmp = await downloadToTmp(url, `bkash_${Date.now()}.jpg`);
      if (tmp) break;
    } catch {}
  }

  await api.unsendMessage(wait.messageID).catch(()=>{});

  if (!tmp) return api.sendMessage("❌ Screenshot তৈরি ব্যর্থ! আবার চেষ্টা করুন।", threadID, messageID);

  try {
    await api.sendMessage({
      body:
`${bTop}
📸 FAKE BKASH SCREENSHOT ✅
━━━━━━━━━━━━━━━━━━
📱 Number : ${number}
🧾 TXN ID : ${txn}
💵 Amount : ৳${amount}
━━━━━━━━━━━━━━━━━━
${bBot}${sig}`,
      attachment: fs.createReadStream(tmp),
    }, threadID, messageID);
  } finally { cleanTmp(tmp); }
};
