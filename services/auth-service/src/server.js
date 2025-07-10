const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter=require('./middleware/ratelimiter');
const { PORT } = require('./config');

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(errorHandler);

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Auth service running on port ${PORT}`);
});

// const cluster = require('cluster');
// const os = require('os');

// const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   console.log(`👑 Primary process ${process.pid} is running`);
//   console.log(`🚀 Starting ${numCPUs} workers...`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   // Optional: Log if a worker dies
//   cluster.on('exit', (worker, code, signal) => {
//     console.warn(`⚠️ Worker ${worker.process.pid} died. Spawning a new one.`);
//     cluster.fork();
//   });
// } else {
//   require('./app'); // worker runs your Express app
// }
