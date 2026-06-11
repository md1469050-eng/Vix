"use strict";
module.exports = function ({ sequelize, Sequelize }) {
  const Threads = sequelize.define("Threads", {
    num:         { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    threadID:    { type: Sequelize.STRING, unique: true },
    name:        { type: Sequelize.STRING, defaultValue: "" },
    banned:      { type: Sequelize.JSON, defaultValue: { status: false, reason: "", dateAdded: "" } },
    threadInfo:  { type: Sequelize.JSON, defaultValue: {} },
    data:        { type: Sequelize.JSON, defaultValue: {} },
    memberCount: { type: Sequelize.INTEGER, defaultValue: 0 },
  });
  Threads.getAll     = async (attr) => (await Threads.findAll(attr ? { attributes: attr } : {})).map(e => e.get({ plain: true }));
  Threads.getData    = async (id)   => { let t = await Threads.findOne({ where: { threadID: String(id) } }); if (!t) t = await Threads.create({ threadID: String(id) }); return t.get({ plain: true }); };
  Threads.setData    = async (id, o) => { await Threads.upsert({ threadID: String(id), ...o }); };
  Threads.createData = async (id, d) => { await Threads.findOrCreate({ where: { threadID: String(id) }, defaults: d }); return true; };
  return Threads;
};
