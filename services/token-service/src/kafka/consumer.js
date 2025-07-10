const { Kafka } = require('kafkajs');
const {
  storeRefreshToken,
  invalidateRefreshToken,
  isRefreshTokenValid,
} = require('../token/refreshStore');

const kafka = new Kafka({
  clientId: 'token-service',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'token-consumers' });

async function initConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'refresh-token-events', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const key = message.key.toString();
      const data = JSON.parse(message.value.toString());

      if (key === 'store') {
        await storeRefreshToken(data.token, data.userId, data.expiresInSec);
        // console.log('[TOKEN] Stored token via Kafka');
      } else if (key === 'invalidate') {
        await invalidateRefreshToken(data.token);
        // console.log('[TOKEN] Invalidated token via Kafka');
      } else if (key === 'validate') {
        const isValid = await isRefreshTokenValid(data.token);
        // console.log(`[TOKEN] Validation check for token ${data.token}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      }
    },
  });
}

module.exports = { initConsumer };
