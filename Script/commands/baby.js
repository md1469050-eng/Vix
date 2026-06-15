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
const axios = require('axios');


const baseApiUrl = async () => await getBaseApi();


module.exports.config = {

  name: "baby",

  version: "7.0.0",

  credits: "dipto",

  cooldowns: 0,

  hasPermssion: 0,

  description: "better than all sim simi",

  commandCategory: "chat",

  category: "chat",

  usePrefix: true,

  prefix: true,

  usages: `[anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2]...\nteach react [YourMessage] - [react1], [react2]...\nremove [YourMessage]\nrm [YourMessage] - [indexNumber]\nmsg [YourMessage]\nlist OR list all\nedit [YourMessage] - [NewMessage]`,

};


module.exports.run = async function ({ api, event, args, Users }) {

  try {

    const link = `${await baseApiUrl()}/baby`;

    const dipto = args.join(" ").toLowerCase();

    const uid = event.senderID;


    if (!args[0]) {

      const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];

      return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);

    }


    // REMOVE

    if (args[0] === 'remove') {

      const fina = dipto.replace("remove ", "");

      const respons = await axios.get(`${link}?remove=${encodeURIComponent(fina)}&senderID=${uid}`);

      return api.sendMessage(respons.data.message, event.threadID, event.messageID);

    }


    // REMOVE by index

    if (args[0] === 'rm' && dipto.includes('-')) {

      const [fi, f] = dipto.replace("rm ", "").split(' - ');

      const respons = await axios.get(`${link}?remove=${encodeURIComponent(fi)}&index=${f}`);

      return api.sendMessage(respons.data.message, event.threadID, event.messageID);

    }


    // LIST

    if (args[0] === 'list') {

      if (args[1] === 'all') {

        const res = await axios.get(`${link}?list=all`);

        const data = res.data.teacher.teacherList || [];

        const teachers = await Promise.all(data.map(async (item) => {

          const number = Object.keys(item)[0];

          const value = item[number];

          const name = await Users.getName(number) || "unknown";

          return { name, value };

        }));

        teachers.sort((a, b) => b.value - a.value);

        const output = teachers.map((teacher, index) => `${index + 1}/ ${teacher.name}: ${teacher.value}`).join('\n');

        return api.sendMessage(`Total Teach = ${data.length}\n\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);

      } else {

        const respo = await axios.get(`${link}?list=all`);

        const data = respo.data.teacher.teacherList || [];

        return api.sendMessage(`Total Teach = ${data.length}`, event.threadID, event.messageID);

      }

    }


    // MESSAGE

    if (args[0] === 'msg' || args[0] === 'message') {

      const fuk = dipto.replace(/^(msg|message) /, "");

      const respo = await axios.get(`${link}?list=${encodeURIComponent(fuk)}`);

      return api.sendMessage(`Message ${fuk} = ${respo.data.data}`, event.threadID, event.messageID);

    }


    // EDIT

    if (args[0] === 'edit') {

      const [oldMsg, newMsg] = dipto.replace("edit ", "").split(' - ');

      if (!oldMsg || !newMsg) {

        return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);

      }

      const res = await axios.get(`${link}?edit=${encodeURIComponent(oldMsg)}&replace=${encodeURIComponent(newMsg)}`);

      return api.sendMessage(`✅ Changed: ${res.data.message}`, event.threadID, event.messageID);

    }


    // TEACH normal

    if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {

      const [comd, command] = dipto.split(' - ');

      const final = comd.replace("teach ", "");

      if (!command || command.length < 2) {

        return api.sendMessage('❌ | Invalid format! Use [YourMessage] - [Reply1], [Reply2]...', event.threadID, event.messageID);

      }

      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(command)}&senderID=${uid}`);

      const name = await Users.getName(re.data.teacher) || "unknown";

      return api.sendMessage(`✅ Replies added: ${re.data.message}\nTeacher: ${name}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);

    }


    // TEACH intro

    if (args[0] === 'teach' && args[1] === 'amar') {

      const [comd, command] = dipto.split(' - ');

      const final = comd.replace("teach ", "");

      if (!command || command.length < 2) {

        return api.sendMessage('❌ | Invalid format! Use teach amar [YourMessage] - [Reply]', event.threadID, event.messageID);

      }

      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&senderID=${uid}&reply=${encodeURIComponent(command)}&key=intro`);

      return api.sendMessage(`✅ Replies added ${re.data.message}`, event.threadID, event.messageID);

    }


    // TEACH react

    if (args[0] === 'teach' && args[1] === 'react') {

      const [comd, command] = dipto.split(' - ');

      const final = comd.replace("teach react ", "");

      if (!command || command.length < 1) {

        return api.sendMessage('❌ | Invalid format! Use teach react [YourMessage] - [react1], [react2]...', event.threadID, event.messageID);

      }

      const re = await axios.get(`${link}?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(command)}`);

      return api.sendMessage(`✅ Reacts added ${re.data.message}`, event.threadID, event.messageID);

    }


    // Special keyword

    if (['amar name ki', 'amr nam ki', 'amar nam ki', 'amr name ki'].some(phrase => dipto.includes(phrase))) {

      const response = await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`);

      return api.sendMessage(response.data.reply, event.threadID, event.messageID);

    }


    // DEFAULT CHAT

    const a = (await axios.get(`${link}?text=${encodeURIComponent(dipto)}&senderID=${uid}&font=1`)).data.reply;

    return api.sendMessage(a, event.threadID, (error, info) => {

      global.client.handleReply.push({

        name: this.config.name,

        type: "reply",

        messageID: info.messageID,

        author: event.senderID,

        lnk: a,

        apiUrl: link

      });

    }, event.messageID);


  } catch (e) {

    console.error('Error in command execution:', e);

    return api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);

  }

};


// HANDLE REPLY

module.exports.handleReply = async function ({ api, event, handleReply }) {

  try {

    if (event.type === "message_reply") {

      const reply = event.body.toLowerCase();

      if (isNaN(reply)) {

        const b = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`)).data.reply;

        return api.sendMessage(b, event.threadID, (error, info) => {

          global.client.handleReply.push({

            name: this.config.name,

            type: "reply",

            messageID: info.messageID,

            author: event.senderID,

            lnk: b

          });

        }, event.messageID);

      }

    }

  } catch (err) {

    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);

  }

};


// HANDLE EVENT

module.exports.handleEvent = async function ({ api, event }) {

  try {

    const body = event.body ? event.body.toLowerCase() : "";

    if (body.startsWith("baby") || body.startsWith("bot") || body.startsWith("বট")) {

      const arr = body.replace(/^\S+\s*/, "");

      if (!arr) {

        return api.sendMessage("এই যে আমি এখানে 🥰", event.threadID, (error, info) => {

          global.client.handleReply.push({

            name: this.config.name,

            type: "reply",

            messageID: info.messageID,

            author: event.senderID

          });

        }, event.messageID);

      }

      const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;

      return api.sendMessage(a, event.threadID, (error, info) => {

        global.client.handleReply.push({

          name: this.config.name,

          type: "reply",

          messageID: info.messageID,

          author: event.senderID,

          lnk: a

        });

      }, event.messageID);

    }

  } catch (err) {

    return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);

  }

};
