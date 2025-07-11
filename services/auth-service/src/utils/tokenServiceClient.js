const axios = require('axios');

const TOKEN_SERVICE_URL = process.env.TOKEN_SERVICE_URL || 'http://token:5001';

async function storeRefreshToken(token, userId, expiresInSec) {
  try {
    await axios.post(`${TOKEN_SERVICE_URL}/token/store`, { token, userId, expiresInSec });
    // console.log('[AUTH] Refresh token stored');
  } catch (err) {
    // console.error('[AUTH] Error storing refresh token:', err.message);
    throw err;
  }
}

async function isRefreshTokenValid(token) {
  try {
    const res = await axios.post(`${TOKEN_SERVICE_URL}/token/validate`, { token });
    return res.data.valid ? res.data.userId : null;
  } catch (err) {
    // console.error('[AUTH] Error validating refresh token:', err.message);
    return null;
  }
}

async function invalidateRefreshToken(token) {
  try {
    await axios.post(`${TOKEN_SERVICE_URL}/token/invalidate`, { token });
    // console.log('[AUTH] Refresh token invalidated');
  } catch (err) {
    // console.error('[AUTH] Error invalidating refresh token:', err.message);
  }
}

module.exports = {
  storeRefreshToken,
  isRefreshTokenValid,
  invalidateRefreshToken
};
