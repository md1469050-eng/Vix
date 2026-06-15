"use strict";
const axios = require("axios");
const fs    = require("fs-extra");
const path  = require("path");
"use strict";
// ── apiHelper safe loader ──────────────────────────────────────
const _apiHelper = (() => {
  try { return require("../../utils/apiHelper"); } catch {}
  try { return require("../utils/apiHelper"); } catch {}
  try { return require(`${process.cwd()}/utils/apiHelper`); } catch {}
  return global._apiHelper || global.apiHelper || {};
})();
const { safeGet = async(u,o)=>(await require("axios").get(u,{timeout:30000,...(o||{})})),
        safePost = async(u,d,o)=>(await require("axios").post(u,d,{timeout:30000,...(o||{})})),
        safeStream = async(u,f)=>{ const r=await require("axios")({method:"GET",url:u,responseType:"stream",timeout:30000,maxRedirects:8}); if(f)r.data.path=f; return r.data; },
        downloadToTmp = async(url,filename)=>{
          const fs=require("fs-extra"),path=require("path"),axios=require("axios");
          const dir=path.join(process.cwd(),"tmp"); await fs.ensureDir(dir);
          const out=path.join(dir,filename||("dl_"+Date.now()+".mp4"));
          const r=await axios({method:"GET",url,responseType:"stream",timeout:35000,headers:{"User-Agent":getUA()},maxRedirects:8});
          await new Promise((res,rej)=>{const w=require("fs").createWriteStream(out);r.data.pipe(w);w.on("finish",res);w.on("error",rej);});
          return out;
        },
        cleanTmp=(f,ms=10000)=>f&&setTimeout(()=>require("fs-extra").remove(f).catch(()=>{}),ms),
        getUA=()=>(_apiHelper.getUA?_apiHelper.getUA():"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"),
        getBaseApi=()=>(_apiHelper.getBaseApi?_apiHelper.getBaseApi():null),
        jitter=(b=0)=>new Promise(r=>setTimeout(r,b+Math.random()*800))
      } = _apiHelper;
// ────────────────────────────────────────────────────────────

const rand = arr => arr[Math.floor(Math.random() * arr.length)];
const BOXES = [
  ["╔══『 🌻 BEST FRIEND 』══╗","╚════════════════════════╝"],
  ["«━━◤ 💛 BFF FOREVER ◢━━»","«━━━━━━━━━━━━━━━━━━━━━━━━»"],
  ["┏━━『 🫶 FRIENDSHIP 』━━┓","┗━━━━━━━━━━━━━━━━━━━━━━━━┛"],
  ["╔♡♡『 🌼 MY BFF 』♡♡╗","╚♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡♡╝"],
];

const CAPTIONS = [
  "🌼 বন্ধুত্ব মানে শুধু পাশে থাকা না,\nবন্ধুত্ব মানে মন খারাপেও হাসি এনে দেওয়া 💛\nসব সময় এমনই থাকিস আমার Best Friend 🫶",
  "একটা মানুষই যথেষ্ট,\nযার সাথে সব কথা বলা যায় 💛🌻\nBest Friend Forever 🫶",
  "তুই আছিস বলেই,\nজীবনটা এত সুন্দর লাগে 🫶🌸\nMy Best Friend 💛",
  "রক্তের সম্পর্ক না হয়েও,\nযে মানুষটা নিজের চেয়েও কাছের 💛\nসেই তো আসল Best Friend 🌻🫶",
  "কথা কম, বোঝাপড়া বেশি 😌💛\nএইটাই আমাদের বন্ধুত্ব 🫶",
];

module.exports.config = {
  name: "bestfriend", version: "2.0.0", hasPermssion: 0,
  credits: "BELAL BOTX666", description: "Best friend banner image",
  commandCategory: "banner", usages: "bestfriend [@mention]", cooldowns: 5,
};

module.exports.run = async function ({ event, api }) {
  const { threadID, messageID, senderID, mentions, messageReply } = event;
  const [bTop, bBot] = rand(BOXES);
  const sig = "\n┄┉❈চাঁদের~পাহাড়🪬❈┉┄";

  let targetID = Object.keys(mentions)[0] || messageReply?.senderID;
  if (!targetID) return api.sendMessage(`${bTop}\n❌ কাউকে mention বা reply করো!\n${bBot}`, threadID, messageID);

  try {
    const apiList = await safeGet("https://raw.githubusercontent.com/shahadat-sahu/SAHU-API/refs/heads/main/SAHU-API.json", { timeout:8000 });
    const BASE    = apiList?.data?.AvatarCanvas;
    if (!BASE) throw new Error("API URL নেই");

    const res = await axios.post(`${BASE}/api`, { cmd:"bestFriend", senderID, targetID },
      { responseType:"arraybuffer", timeout:30000 });

    const imgPath = path.join(__dirname,"cache",`bf_${senderID}_${targetID}.png`);
    await fs.ensureDir(path.join(__dirname,"cache"));
    fs.writeFileSync(imgPath, res.data);

    return api.sendMessage({
      body: `${bTop}\n${rand(CAPTIONS)}\n${bBot}${sig}`,
      attachment: fs.createReadStream(imgPath),
    }, threadID, () => fs.remove(imgPath).catch(()=>{}), messageID);

  } catch {
    return api.sendMessage(`${bTop}\n❌ API Error! আবার চেষ্টা করো।\n${bBot}`, threadID, messageID);
  }
};
