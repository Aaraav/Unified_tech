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
 * Also check if it was already used.
 * @param {string} token - The refresh token to validate.
 * @returns {Promise<string|null>} - User ID if valid, null otherwise.
 */
async function isRefreshTokenValid(token) {
  const key = `refresh:${token}`;
  const usedKey = `used:${token}`;
  try {
    const [userId, isUsed] = await Promise.all([
      redisClient.get(key),
      redisClient.exists(usedKey)
    ]);

    if (isUsed) {
      // console.warn(`[REDIS] Token has already been used: ${usedKey}`);
      return null;
    }

    if (userId) {
      // console.log(`[REDIS] Valid refresh token for user: ${userId}`);
    } else {
      // console.warn(`[REDIS] Refresh token not found or expired: ${key}`);
    }

    return userId || null;
  } catch (err) {
    console.error(`[REDIS] Error validating refresh token [${key}]:`, err.message);
    return null;
  }
}

/**
 * Invalidate a refresh token (delete from Redis and mark it as used).
 * @param {string} token - The refresh token to invalidate.
 */
async function invalidateRefreshToken(token) {
  const key = `refresh:${token}`;
  const usedKey = `used:${token}`;
  try {
    await redisClient.del(key);
    await redisClient.set(usedKey, '1', { EX: 60 * 60 * 24 }); // 24h block for reuse
    // console.log(`[REDIS] Refresh token invalidated and marked as used: ${key}`);
  } catch (err) {
    // console.error(`[REDIS] Error invalidating token [${key}]:`, err.message);
  }
}

module.exports = {
  storeRefreshToken,
  isRefreshTokenValid,
  invalidateRefreshToken,
};
