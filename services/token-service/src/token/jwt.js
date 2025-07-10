const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';

function generateAccessToken(user) {
  return jwt.sign({ userId: user.id, email: user.email }, SECRET, { expiresIn: '15m' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { generateAccessToken, verifyToken };
