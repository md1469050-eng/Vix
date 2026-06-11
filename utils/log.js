"use strict";
const chalk = require("chalk");
const rndColor = () => "#" + [...Array(6)].map(() => Math.floor(Math.random()*16).toString(16)).join("");
const logger = (msg, tag = "[ LOG ]") => {
  if (tag === "error") return console.log(chalk.bold.red("[ ERROR ] ") + msg);
  if (tag === "warn")  return console.log(chalk.bold.yellow("[ WARN ] ") + msg);
  console.log(chalk.bold.hex(rndColor())(tag + " » ") + msg);
};
logger.loader = (msg, tag = "[ LOADER ]") => {
  if (tag === "error") return console.log(chalk.bold.hex(rndColor())("[ BELAL BOTX666 ] ") + chalk.red(msg));
  if (tag === "warn")  return console.log(chalk.bold.hex(rndColor())("[ BELAL BOTX666 ] ") + chalk.yellow(msg));
  console.log(chalk.bold.hex(rndColor())("[ BELAL BOTX666 ] ") + chalk.hex(rndColor())(msg));
};
module.exports = logger;
