const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
