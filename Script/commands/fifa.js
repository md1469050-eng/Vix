"use strict";
// ── apiHelper safe loader ──────────────────────────────────────
const _apiHelper = (() => {
  try { return require("../../utils/apiHelper"); } catch {}
  try { return require(`${process.cwd()}/utils/apiHelper`); } catch {}
  return global._apiHelper || global.apiHelper || {};
})();
const { safeGet = async(u,o)=>(await require("axios").get(u,{timeout:30000,...(o||{})})),
        getUA = ()=>(_apiHelper.getUA?_apiHelper.getUA():"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
      } = _apiHelper;
// ─────────────────────────────────────────────────────────────

const moment = require("moment-timezone");

module.exports.config = {
  name: "fifa",
  aliases: ["worldcup","wc","বিশ্বকাপ","wc2026","fifa2026"],
  version: "1.0.0",
  hasPermssion: 0,
  credits: "BELAL BOTX666 🪬",
  description: "FIFA World Cup 2026 — সব তথ্য, গ্রুপ, ম্যাচ, গোলদাতা",
  commandCategory: "⚽ FIFA 2026",
  usages: "fifa | fifa match | fifa group | fifa top | fifa team [দেশ]",
  cooldowns: 5,
};

const rand = arr => arr[Math.floor(Math.random() * arr.length)];

const BOXES = [
  ["╔══『 ⚽ FIFA WORLD CUP 2026 』══╗","╚═══════════════════════════════════╝"],
  ["«━━◤ 🏆 WORLD CUP 2026 ◢━━»","«━━━━━━━━━━━━━━━━━━━━━━━━━━━━━»"],
  ["┏━━『 🌍 FIFA WC 2026 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔🏆🏆『 FIFA 2026 』🏆🏆╗","╚🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆🏆╝"],
];

// ── Groups ────────────────────────────────────────────────────
const GROUPS = {
  "A": ["🇺🇸 USA","🇵🇹 Portugal","🇧🇷 Brazil","🇹🇳 Tunisia"],
  "B": ["🇦🇷 Argentina","🇩🇪 Germany","🇯🇵 Japan","🇲🇦 Morocco"],
  "C": ["🏴󠁧󠁢󠁥󠁮󠁧󠁿 England","🇫🇷 France","🇨🇴 Colombia","🇸🇳 Senegal"],
  "D": ["🇪🇸 Spain","🇧🇪 Belgium","🇰🇷 South Korea","🇨🇲 Cameroon"],
  "E": ["🇳🇱 Netherlands","🇲🇽 Mexico","🇦🇺 Australia","🇳🇬 Nigeria"],
  "F": ["🇺🇾 Uruguay","🇨🇭 Switzerland","🇷🇸 Serbia","🇨🇷 Costa Rica"],
  "G": ["🇮🇹 Italy","🇨🇱 Chile","🇨🇦 Canada","🇪🇨 Ecuador"],
  "H": ["🇭🇷 Croatia","🇩🇰 Denmark","🇸🇦 Saudi Arabia","🇬🇭 Ghana"],
  "I": ["🇵🇱 Poland","🇦🇹 Austria","🇨🇩 Congo","🇵🇦 Panama"],
  "J": ["🇵🇹 Portugal","🇺🇾 Uruguay","🇰🇿 Kazakhstan","🇾🇪 Yemen"],
  "K": ["🇶🇦 Qatar","🇳🇿 New Zealand","🇰🇪 Kenya","🇸🇻 El Salvador"],
  "L": ["🇮🇷 Iran","🇨🇿 Czech Republic","🇹🇿 Tanzania","🇭🇳 Honduras"],
};

// ── Top Scorers ───────────────────────────────────────────────
const TOP_SCORERS = [
  { name: "Kylian Mbappé", country: "🇫🇷 France", goals: 4, flag: "⚽⚽⚽⚽" },
  { name: "Erling Haaland", country: "🇳🇴 Norway", goals: 3, flag: "⚽⚽⚽" },
  { name: "Vinicius Jr.", country: "🇧🇷 Brazil", goals: 3, flag: "⚽⚽⚽" },
  { name: "Lionel Messi", country: "🇦🇷 Argentina", goals: 2, flag: "⚽⚽" },
  { name: "Harry Kane", country: "🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", goals: 2, flag: "⚽⚽" },
  { name: "Lamine Yamal", country: "🇪🇸 Spain", goals: 2, flag: "⚽⚽" },
  { name: "Pedri", country: "🇪🇸 Spain", goals: 2, flag: "⚽⚽" },
  { name: "Rodri", country: "🇪🇸 Spain", goals: 1, flag: "⚽" },
];

// ── Team Info ──────────────────────────────────────────────────
const TEAMS = {
  "argentina": {
    flag: "🇦🇷", name: "Argentina", group: "B", rank: 1,
    coach: "Lionel Scaloni", captain: "Lionel Messi",
    stars: ["Messi","Di María","De Paul","Martínez","Romero"],
    info: "বিশ্বকাপ চ্যাম্পিয়ন 🏆 (1978, 1986, 2022)",
  },
  "brazil": {
    flag: "🇧🇷", name: "Brazil", group: "A", rank: 5,
    coach: "Dorival Júnior", captain: "Marquinhos",
    stars: ["Vinicius Jr.","Rodrygo","Endrick","Militão","Alisson"],
    info: "সর্বোচ্চ ৫বার বিশ্বকাপ চ্যাম্পিয়ন 🏆🏆🏆🏆🏆",
  },
  "france": {
    flag: "🇫🇷", name: "France", group: "C", rank: 2,
    coach: "Didier Deschamps", captain: "Kylian Mbappé",
    stars: ["Mbappé","Griezmann","Camavinga","Tchouaméni","Saliba"],
    info: "বিশ্বকাপ চ্যাম্পিয়ন 🏆 (1998, 2018)",
  },
  "germany": {
    flag: "🇩🇪", name: "Germany", group: "B", rank: 13,
    coach: "Julian Nagelsmann", captain: "Ilkay Gündoğan",
    stars: ["Musiala","Wirtz","Kane","Kimmich","Rüdiger"],
    info: "বিশ্বকাপ চ্যাম্পিয়ন 🏆🏆🏆🏆 (1954, 1974, 1990, 2014)",
  },
  "england": {
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", name: "England", group: "C", rank: 4,
    coach: "Gareth Southgate", captain: "Harry Kane",
    stars: ["Kane","Bellingham","Saka","Foden","Alexander-Arnold"],
    info: "বিশ্বকাপ চ্যাম্পিয়ন 🏆 (1966)",
  },
  "spain": {
    flag: "🇪🇸", name: "Spain", group: "D", rank: 8,
    coach: "Luis de la Fuente", captain: "Álvaro Morata",
    stars: ["Yamal","Pedri","Morata","Rodri","Carvajal"],
    info: "বিশ্বকাপ চ্যাম্পিয়ন 🏆 (2010)",
  },
  "portugal": {
    flag: "🇵🇹", name: "Portugal", group: "A", rank: 6,
    coach: "Roberto Martínez", captain: "Cristiano Ronaldo",
    stars: ["Ronaldo","Bruno Fernandes","Leão","Rúben Dias","Bernardo Silva"],
    info: "FIFA বিশ্বকাপ ১৯৬৬ তৃতীয় স্থান",
  },
  "usa": {
    flag: "🇺🇸", name: "USA", group: "A", rank: 14,
    coach: "Gregg Berhalter", captain: "Tyler Adams",
    stars: ["Pulisic","Reyna","McKennie","Turner","Dest"],
    info: "স্বাগতিক দেশ 🏟️ (কানাডা ও মেক্সিকোর সাথে)",
  },
  "morocco": {
    flag: "🇲🇦", name: "Morocco", group: "B", rank: 12,
    coach: "Walid Regragui", captain: "Romain Saïss",
    stars: ["Hakimi","En-Nesyri","Ounahi","Bounou","Amrabat"],
    info: "কাতার ২০২২ এ সেমিফাইনাল — আফ্রিকার গর্ব 🌍",
  },
};

// ── Upcoming Matches ──────────────────────────────────────────
const MATCHES = [
  { team1:"🇦🇷 Argentina", team2:"🇩🇪 Germany", date:"26 Jun", time:"02:00 AM", group:"B", venue:"MetLife, NY" },
  { team1:"🇧🇷 Brazil", team2:"🇵🇹 Portugal", date:"27 Jun", time:"05:00 AM", group:"A", venue:"Rose Bowl, LA" },
  { team1:"🇫🇷 France", team2:"🏴󠁧󠁢󠁥󠁮󠁧󠁿 England", date:"28 Jun", time:"02:00 AM", group:"C", venue:"AT&T, Dallas" },
  { team1:"🇪🇸 Spain", team2:"🇧🇪 Belgium", date:"28 Jun", time:"05:00 AM", group:"D", venue:"SoFi, LA" },
  { team1:"🇺🇸 USA", team2:"🇹🇳 Tunisia", date:"25 Jun", time:"11:00 PM", group:"A", venue:"Levi's, SF" },
  { team1:"🇳🇱 Netherlands", team2:"🇲🇽 Mexico", date:"29 Jun", time:"02:00 AM", group:"E", venue:"BC Place" },
];

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const [bTop, bBot] = rand(BOXES);
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";
  const time = moment().tz("Asia/Dhaka").format("hh:mm A | DD MMM YYYY");
  const cmd = (args[0] || "").toLowerCase();

  // ── /fifa group ──────────────────────────────────────────────
  if (cmd === "group" || cmd === "গ্রুপ") {
    let msg = `${bTop}\n⚽ FIFA WC 2026 — গ্রুপ তালিকা\n━━━━━━━━━━━━━━━━━━\n`;
    for (const [g, teams] of Object.entries(GROUPS)) {
      msg += `\n🔵 গ্রুপ ${g}:\n`;
      teams.forEach(t => msg += `   ${t}\n`);
    }
    msg += `━━━━━━━━━━━━━━━━━━\n⏰ ${time}${bBot}${sig}`;
    return api.sendMessage(msg, threadID, messageID);
  }

  // ── /fifa match ──────────────────────────────────────────────
  if (cmd === "match" || cmd === "ম্যাচ") {
    let msg = `${bTop}\n📅 আসন্ন ম্যাচসমূহ\n━━━━━━━━━━━━━━━━━━\n`;
    MATCHES.forEach((m, i) => {
      msg += `\n${i+1}️⃣ ${m.team1}\n   🆚 ${m.team2}\n   📅 ${m.date} | ⏰ ${m.time} BD\n   📍 ${m.venue} | গ্রুপ ${m.group}\n`;
    });
    msg += `━━━━━━━━━━━━━━━━━━\n⏰ ${time}${bBot}${sig}`;
    return api.sendMessage(msg, threadID, messageID);
  }

  // ── /fifa top ────────────────────────────────────────────────
  if (cmd === "top" || cmd === "গোলদাতা" || cmd === "scorer") {
    let msg = `${bTop}\n🥇 শীর্ষ গোলদাতা — FIFA WC 2026\n━━━━━━━━━━━━━━━━━━\n`;
    TOP_SCORERS.forEach((p, i) => {
      const medals = ["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣"];
      msg += `\n${medals[i]} ${p.name}\n   ${p.country} | গোল: ${p.goals} ${p.flag}\n`;
    });
    msg += `━━━━━━━━━━━━━━━━━━\n⏰ ${time}${bBot}${sig}`;
    return api.sendMessage(msg, threadID, messageID);
  }

  // ── /fifa team [name] ────────────────────────────────────────
  if (cmd === "team" || cmd === "দল") {
    const teamName = args[1]?.toLowerCase();
    const team = TEAMS[teamName];
    if (!team) {
      const list = Object.keys(TEAMS).join(", ");
      return api.sendMessage(`${bTop}\n❌ দল পাওয়া যায়নি!\n📝 লিখুন: fifa team [দেশ]\n🌍 পাওয়া যাবে:\n${list}\n${bBot}`, threadID, messageID);
    }
    return api.sendMessage(
`${bTop}
${team.flag} ${team.name.toUpperCase()}
━━━━━━━━━━━━━━━━━━
🌍 গ্রুপ    » ${team.group}
📊 র‌্যাংক  » ${team.rank}
👨‍💼 কোচ     » ${team.coach}
🎖️ অধিনায়ক » ${team.captain}
⭐ তারকারা » ${team.stars.join(", ")}
━━━━━━━━━━━━━━━━━━
📝 ${team.info}
━━━━━━━━━━━━━━━━━━
⏰ ${time}${bBot}${sig}`, threadID, messageID);
  }

  // ── /fifa (main menu) ────────────────────────────────────────
  return api.sendMessage(
`${bTop}
🌍 FIFA বিশ্বকাপ ২০২৬
📍 USA 🇺🇸 | Canada 🇨🇦 | Mexico 🇲🇽
━━━━━━━━━━━━━━━━━━
📋 কমান্ড সমূহ:
━━━━━━━━━━━━━━━━━━
⚽ fifa group  → গ্রুপ দেখো
📅 fifa match  → আসন্ন ম্যাচ
🥇 fifa top    → শীর্ষ গোলদাতা
🌍 fifa team [দেশ] → দলের তথ্য
━━━━━━━━━━━━━━━━━━
🏆 দল        » ৪৮টি
🌍 ভেন্যু     » ১৬টি
📅 শুরু       » ১১ জুন ২০২৬
🏁 ফাইনাল    » ১৯ জুলাই ২০২৬
📍 ফাইনাল ভেন্যু » MetLife Stadium, NJ
━━━━━━━━━━━━━━━━━━
⏰ ${time}${bBot}${sig}`, threadID, messageID);
};
