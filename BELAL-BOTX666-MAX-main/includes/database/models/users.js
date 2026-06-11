"use strict";
module.exports = function ({ sequelize, Sequelize }) {
  const Users = sequelize.define("Users", {
    num:    { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    userID: { type: Sequelize.STRING, unique: true },
    name:   { type: Sequelize.STRING, defaultValue: "" },
    banned: { type: Sequelize.JSON, defaultValue: { status: false, reason: "", dateAdded: "" } },
    data:   { type: Sequelize.JSON, defaultValue: {} },
    exp:    { type: Sequelize.BIGINT, defaultValue: 0 },
    level:  { type: Sequelize.INTEGER, defaultValue: 1 },
  });
  Users.getAll      = async (attr) => (await Users.findAll(attr ? { attributes: attr } : {})).map(e => e.get({ plain: true }));
  Users.getData     = async (id)   => { let u = await Users.findOne({ where: { userID: String(id) } }); if (!u) u = await Users.create({ userID: String(id) }); return u.get({ plain: true }); };
  Users.setData     = async (id, o) => { await Users.upsert({ userID: String(id), ...o }); };
  Users.createData  = async (id, d) => { await Users.findOrCreate({ where: { userID: String(id) }, defaults: d }); return true; };
  Users.updateExp   = async (id, n = 1) => { const u = await Users.findOne({ where: { userID: String(id) } }); if (u) { u.exp = (u.exp || 0) + n; await u.save(); } };
  return Users;
};
