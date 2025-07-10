const { createClient } = require('redis');

const redisClient = createClient({
  url: 'redis://redis:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err.message);
});

const connectWithRetry = async (retries = 5, delay = 2000) => {
  while (retries) {
    try {
      await redisClient.connect();
    //   console.log('[REDIS] Connected!');
      break;
    } catch (err) {
    //   console.error(`[REDIS] Connection failed. Retrying in ${delay / 1000}s...`);
      retries--;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  if (!redisClient.isOpen) {
    throw new Error('Failed to connect to Redis after multiple attempts.');
  }
};

connectWithRetry();

module.exports = redisClient;
