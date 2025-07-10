const express = require('express');
const router = express.Router();
const { storeRefreshToken, isRefreshTokenValid, invalidateRefreshToken } = require('../token/refreshStore');

router.post('/store', async (req, res) => {
  const { token, userId, expiresInSec } = req.body;
  try {
    await storeRefreshToken(token, userId, expiresInSec);
    res.json({ message: 'Stored' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/validate', async (req, res) => {
  const { token } = req.body;
  try {
    const userId = await isRefreshTokenValid(token);
    if (userId) res.json({ valid: true, userId });
    else res.json({ valid: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/invalidate', async (req, res) => {
  const { token } = req.body;
  try {
    await invalidateRefreshToken(token);
    res.json({ message: 'Invalidated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
