"use strict";
module.exports = function ({ sequelize, Sequelize }) {
  const Currencies = sequelize.define("Currencies", {
    num:     { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userID:  { type: Sequelize.STRING, unique: true },
    money:   { type: Sequelize.BIGINT, defaultValue: 0 },
    balance: { type: Sequelize.BIGINT, defaultValue: 0 },
    bank:    { type: Sequelize.BIGINT, defaultValue: 0 },
    exp:     { type: Sequelize.BIGINT, defaultValue: 0 },
    data:    { type: Sequelize.JSON, defaultValue: {} },
  });
  Currencies.getAll     = async (attr) => (await Currencies.findAll(attr ? { attributes: attr } : {})).map(e => e.get({ plain: true }));
  Currencies.getData    = async (id)   => { let c = await Currencies.findOne({ where: { userID: String(id) } }); if (!c) c = await Currencies.create({ userID: String(id), money: 0, balance: 0 }); return c.get({ plain: true }); };
  Currencies.setData    = async (id, o) => { if (o.money !== undefined) o.balance = o.money; if (o.balance !== undefined) o.money = o.balance; await Currencies.upsert({ userID: String(id), ...o }); };
  Currencies.createData = async (id, d) => { await Currencies.findOrCreate({ where: { userID: String(id) }, defaults: d }); return true; };
  Currencies.increaseMoney = async (id, n) => { const c = await Currencies.findOne({ where: { userID: String(id) } }); if (c) { const v = Number(c.money || 0) + Number(n); c.money = v; c.balance = v; await c.save(); } };
  Currencies.decreaseMoney = async (id, n) => { const c = await Currencies.findOne({ where: { userID: String(id) } }); if (c) { const v = Math.max(0, Number(c.money || 0) - Number(n)); c.money = v; c.balance = v; await c.save(); return true; } return false; };
  return Currencies;
};
