const Redis = require('ioredis');
const client = new Redis({ host: 'redis', port: 6379 });

client.on('connect', () => console.log('Redis connected'));
client.on('error', (err) => console.error('Redis error:', err));

const WINDOW_IN_SECONDS = 60;
const MAX_REQUESTS = 10;

const rateLimiter = async (req, res, next) => {
  try {
    const ip = req.ip;
    const key = `ratelimit:${ip}`;

    const count = await client.incr(key);

    if (count === 1) {
      await client.expire(key, WINDOW_IN_SECONDS);
    }

    if (count > MAX_REQUESTS) {
      return res.status(429).json({ message: 'Too many requests' });
    }

    next();
  } catch (err) {
    console.error('[RateLimiter Error]', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = rateLimiter;
