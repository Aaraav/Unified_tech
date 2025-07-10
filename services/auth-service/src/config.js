require('dotenv').config();

const required = ['DATABASE_URL', 'JWT_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing env variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  PORT: process.env.PORT || 4001,
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL
};
