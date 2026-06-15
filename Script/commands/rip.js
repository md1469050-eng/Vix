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
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => await getBaseApi();

/**
* @author MahMUD
* @author: do not delete it
*/

module.exports = {
  config: {
    name: "rip",
    aliases: [],
    version: "1.7",
    author: "MahMUD",
    role: 0,
    category: "fun",
    cooldown: 10,
    guide: "rip [mention-reply-UID]",
  },

  onStart: async function ({ api, event, args }) {
     const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
     if (module.exports.config.author !== obfuscatedAuthor) {
     return api.sendMessage(
     "You are not authorized to change the author name.", event.threadID, event.messageID );
   }

    const { threadID, messageID, messageReply, mentions } = event;
    let id2; if (messageReply) { id2 = messageReply.senderID; } else if (Object.keys(mentions).length > 0) {
    id2 = Object.keys(mentions)[0];  } else if (args[0]) {  id2 = args[0]; } else {
    return api.sendMessage( "baby, Mention, reply, or provide UID of the target.", threadID, messageID );
  }

   try {
    const url = `${await baseApiUrl()}/api/dig?type=rip&user=${id2}`;
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const filePath = path.join(__dirname, `rip_${id2}.png`);
    fs.writeFileSync(filePath, response.data);

     
    api.sendMessage({ attachment: fs.createReadStream(filePath),
    body: ` rip  🐸`,
     },
    threadID, () => fs.unlinkSync(filePath),  messageID );
  } catch (err) {
    console.error(err);
    api.sendMessage(`🥹error, contact MahMUD.`, threadID, messageID);
    }
  },
};
