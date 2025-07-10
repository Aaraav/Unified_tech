const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(6);
  return bcrypt.hash(password, salt);
}

async function verifyPassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}

module.exports = { hashPassword, verifyPassword };
