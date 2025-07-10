const express = require('express');
const app = express();
const tokenRoutes = require('./routes/token');
const { initConsumer } = require('./kafka/consumer.js');

const cleanExpiredTokens = require('./tokenCleaner.js');
const cron = require('node-cron');

// Run every hour
cron.schedule('0 * * * *', cleanExpiredTokens);
initConsumer().catch(console.error);

app.use(express.json());
app.use('/token', tokenRoutes);

app.listen(5001, () => {
//   console.log('Token service running on port 5001');
});
