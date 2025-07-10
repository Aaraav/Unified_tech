const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/ratelimiter');
const { PORT } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
// app.use(rateLimiter); // Enable if needed

app.use('/auth', authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ Worker ${process.pid} started on port ${PORT}`);
});
