"use strict";
module.exports = function (input) {
  const Users      = require("./models/users")(input);
  const Threads    = require("./models/threads")(input);
  const Currencies = require("./models/currencies")(input);
  Users.sync({ force: false });
  Threads.sync({ force: false });
  Currencies.sync({ force: false });
  return {
    use: (n) => ({ Users, Threads, Currencies }[n]),
    Users, Threads, Currencies,
    model: { Users, Threads, Currencies },
  };
};
