"use strict";
const fs = require("fs-extra");
const { downloadToTmp, cleanTmp } = require("../../utils/apiHelper");

const IMGS = ["https://i.imgur.com/OnKpqzT.jpeg","https://i.imgur.com/06UOjIf.jpeg","https://i.imgur.com/mmdDBKc.jpeg","https://i.imgur.com/iErDfBr.jpeg","https://i.imgur.com/pSItJ3W.jpeg","https://i.imgur.com/CEZcfgx.jpeg","https://i.imgur.com/xaTMhY7.jpeg","https://i.imgur.com/TueSRG8.jpeg","https://i.imgur.com/crbYK0S.jpeg","https://i.imgur.com/jesx1KT.jpeg","https://i.imgur.com/GbPntYQ.jpeg","https://i.imgur.com/6zDrl8z.jpeg","https://i.imgur.com/Ns3AmXE.jpeg","https://i.imgur.com/jf3OcCa.jpeg","https://i.imgur.com/Jc6S7fV.jpeg","https://i.imgur.com/56kxnUh.jpeg","https://i.imgur.com/IfUjoK4.jpeg","https://i.imgur.com/Omr6f9R.jpeg","https://i.imgur.com/6V3gzFn.jpeg","https://i.imgur.com/nrW4t0X.jpeg","https://i.imgur.com/3UZsB9X.jpeg","https://i.imgur.com/4j27fPQ.jpeg","https://i.imgur.com/sCWMUx4.jpeg","https://i.imgur.com/YcBhFvw.jpeg","https://i.imgur.com/KJfsslz.jpeg","https://i.imgur.com/NHPqUDt.jpeg","https://i.imgur.com/0Y8MRNm.jpeg","https://i.imgur.com/zbibnLw.jpeg","https://i.imgur.com/QbeZHO7.jpeg","https://i.imgur.com/F9H360X.jpeg","https://i.imgur.com/IsPV93J.jpeg","https://i.imgur.com/27pIWoI.jpeg","https://i.imgur.com/0lvQ4CU.jpeg","https://i.imgur.com/EexrIcF.jpeg","https://i.imgur.com/zQ7ZNC3.jpeg","https://i.imgur.com/UW8tlFR.jpeg","https://i.imgur.com/VJxZcau.jpeg","https://i.imgur.com/XNVclHz.jpeg","https://i.imgur.com/6GteVmS.jpeg","https://i.imgur.com/vnU2rGA.jpeg","https://i.imgur.com/E06FfNR.jpeg","https://i.imgur.com/bjVFOVS.jpeg","https://i.imgur.com/U9pfRnL.jpeg","https://i.imgur.com/bglQS36.jpeg","https://i.imgur.com/9Lmfo9b.jpeg","https://i.imgur.com/MeMnFPn.jpeg","https://i.imgur.com/2UTz8Xo.jpeg","https://i.imgur.com/EKOVcxj.jpeg","https://i.imgur.com/8viQv3u.jpeg","https://i.imgur.com/Ni4uZQN.jpeg"];

module.exports.config = {
  name: "banarx", version: "2.0.0", hasPermssion: 0,
  credits: "BELAL BOTX666", description: "স্টাইল সাইট ব্যানার ছবি",
  commandCategory: "Random-IMG", usages: "banarx", cooldowns: 2,
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageID } = event;
  const url = IMGS[Math.floor(Math.random() * IMGS.length)];
  let tmp   = null;
  try {
    tmp = await downloadToTmp(url, `banarx_${Date.now()}.jpg`);
    await api.sendMessage({ body: "😎 স্টাইল সাইট ব্যানার 🤏\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄", attachment: fs.createReadStream(tmp) }, threadID, messageID);
  } catch { api.sendMessage("❌ ছবি লোড ব্যর্থ।", threadID, messageID); }
  finally { if (tmp) cleanTmp(tmp); }
};
