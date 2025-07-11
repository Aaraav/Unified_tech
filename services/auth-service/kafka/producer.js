// services/auth-service/kafka/producer.js

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

async function initProducer() {
  await producer.connect();
}

async function sendTokenMessage(type, payload) {
  await producer.send({
    topic: 'refresh-token-events',
    messages: [
      {
        key: type, // 'store', 'validate', 'invalidate'
        value: JSON.stringify(payload),
      },
    ],
  });
}

module.exports = { initProducer, sendTokenMessage };
