const express = require('express');
const passport = require('passport');
const { generateTokens } = require('../utils/jwt');
const router = express.Router();

// Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
  const { email, name } = req.user;
  const tokens = generateTokens({ id: email, email }); // Use DB in production
  const redirect = `${process.env.OAUTH_CALLBACK_URL}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
  res.redirect(redirect);
});

// LinkedIn
router.get('/linkedin', passport.authenticate('linkedin'));

router.get('/linkedin/callback', passport.authenticate('linkedin', { session: false }), async (req, res) => {
  const { email, name } = req.user;
  const tokens = generateTokens({ id: email, email });
  const redirect = `${process.env.OAUTH_CALLBACK_URL}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`;
  res.redirect(redirect);
});

module.exports = router;
