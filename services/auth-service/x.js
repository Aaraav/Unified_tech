const redisClient = require('./shared/redis');

(async () => {
  await redisClient.set('refresh:test', 'user123', { EX: 60 });
  const value = await redisClient.get('refresh:test');
  // console.log('Redis test:', value); // should be "user123"
})();
