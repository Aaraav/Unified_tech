const redisClient = require('../shared/redis');

async function cleanExpiredTokens() {
  const pattern = 'refresh:*';
  let cursor = 0;

//   console.log('[CLEANER] Running Redis cleaner job...');

  do {
    const [nextCursor, keys] = await redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
    cursor = parseInt(nextCursor);

    for (const key of keys) {
      const ttl = await redisClient.ttl(key);
      if (ttl === -1) {
        console.warn(`[CLEANER] No TTL on ${key}, deleting...`);
        await redisClient.del(key);
      }
    }
  } while (cursor !== 0);

//   console.log('[CLEANER] Job completed.');
}

module.exports = cleanExpiredTokens;
