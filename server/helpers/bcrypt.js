const bcrypt = require("bcryptjs");

const hash = (password) => {
  return bcrypt.hashSync(password, 10);
};

const compare = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports = { hash, compare };
