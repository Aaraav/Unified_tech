const axios = require('axios');
const { BASE_URL } = require('./config');

exports.refreshToken = async (refreshToken) => {
  const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  return res.data;
};
