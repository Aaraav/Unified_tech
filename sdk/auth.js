const axios = require('axios');
const { BASE_URL } = require('./config');

async function signup({ email, password, name }) {
  const res = await axios.post(`${BASE_URL}/auth/signup`, { email, password, name });
  return res.data;
}

async function login({ email, password }) {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
}

async function logout(refreshToken) {
  const res = await axios.post(`${BASE_URL}/auth/logout`, { refreshToken });
  return res.data;
}

async function refresh(refreshToken) {
  const res = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
  return res.data;
}

async function oauthSync({ email, name, provider, providerId }) {
  const res = await axios.post(`${BASE_URL}/auth/oauth-sync`, {
    email,
    name,
    provider,
    providerId
  });
  return res.data;
}

module.exports = {
  signup,
  login,
  logout,
  refresh,
  oauthSync
};
