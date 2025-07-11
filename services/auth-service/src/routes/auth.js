const express = require('express');
const prisma = require('../../shared/db');
const jwt = require('jsonwebtoken');
const { hashPassword, verifyPassword } = require('../utils/hash');
const { success, error } = require('../utils/response');
const { JWT_SECRET } = require('../config');
const {sendTokenMessage}=require('../../kafka/producer')
const router = express.Router();



function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
}


// const {
//   storeRefreshToken,
//   isRefreshTokenValid,
//   invalidateRefreshToken
// } = require('../utils/tokens');

const {
  storeRefreshToken,
  isRefreshTokenValid,
  invalidateRefreshToken
} = require('../utils/tokenServiceClient'); // ✅ now uses axios to token-service


router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return error(res, 'No refresh token provided', 401);

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // One-way Kafka message for validation (no response expected)
    await sendTokenMessage('validate', { token: refreshToken });

    // Also rotate old token
    await sendTokenMessage('invalidate', { token: refreshToken });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return error(res, 'User not found', 404);

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    await sendTokenMessage('store', {
      token: newRefreshToken,
      userId: user.id,
      expiresInSec: 60 * 60 * 24 * 7
    });

    return success(res, {
      accessToken,
      refreshToken: newRefreshToken,
      user: { id: user.id, email: user.email }
    }, 201);
  } catch (err) {
    return error(res, 'Token expired or invalid', 403);
  }
});



router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return error(res, 'User already exists', 409);

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, name }
    });

    const { accessToken, refreshToken } = generateTokens(user);
await sendTokenMessage('store', { token: refreshToken, userId: user.id, expiresInSec: 60 * 60 * 24 * 7 });

return success(res, {
  accessToken,
  refreshToken,
  user: { id: user.id, email: user.email }
}, 201);

  } catch (err) {
    return error(res, 'Signup failed');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(password, user.password))) {
      return error(res, 'Invalid credentials', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user);
await sendTokenMessage('store', { token: refreshToken, userId: user.id, expiresInSec: 60 * 60 * 24 * 7 });

    return success(res, { accessToken, refreshToken });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return error(res, 'Login failed', 500);
  }
});


router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await sendTokenMessage('invalidate', { token: refreshToken });
  }
  return success(res, { message: 'Logged out' });
});

module.exports = router;
