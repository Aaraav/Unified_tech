const redisClient = require('../../shared/redis');

/**
 * Store refresh token in Redis with expiration.
 * @param {string} token - The refresh token.
 * @param {string} userId - Associated user ID.
 * @param {number} expiresInSec - Expiration time in seconds.
 */
async function storeRefreshToken(token, userId, expiresInSec) {
  const key = `refresh:${token}`;
  const start = Date.now();
  try {
await redisClient.set(key, userId, { EX: expiresInSec });
    // console.log(`[REDIS] Stored refresh token for user ${userId} in ${Date.now() - start}ms`);
  } catch (err) {
    // console.error(`[REDIS] Error storing refresh token [${key}]:`, err.message);
    throw err;
  }
}

/**
 * Check if a refresh token is valid (exists in Redis).
 * @param {string} token - The refresh token to validate.
 * @returns {Promise<string|null>} - User ID if valid, null otherwise.
 */
async function isRefreshTokenValid(token) {
  const key = `refresh:${token}`;
  try {
    const userId = await redisClient.get(key);
    if (userId) {
    //   console.log(`[REDIS] Valid refresh token for user: ${userId}`);
    } else {
    //   console.warn(`[REDIS] Refresh token not found or expired: ${key}`);
    }
    return userId || null;
  } catch (err) {
    console.error(`[REDIS] Error validating refresh token [${key}]:`, err.message);
    return null;
  }
}

/**
 * Invalidate a refresh token (delete from Redis).
 * @param {string} token - The refresh token to invalidate.
 */
async function invalidateRefreshToken(token) {
  const key = `refresh:${token}`;
  try {
    await redisClient.del(key);
    // console.log(`[REDIS] Refresh token invalidated: ${key}`);
  } catch (err) {
    console.error(`[REDIS] Error invalidating token [${key}]:`, err.message);
  }
}

module.exports = {
  storeRefreshToken,
  isRefreshTokenValid,
  invalidateRefreshToken,
};
