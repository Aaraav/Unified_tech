const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('[OAUTH] /oauth/google route hit ✅');
  next();
}, passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/callback', passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
}), (req, res) => {
  // Redirect with tokens
  const user = req.user;
  res.send(user);
  // const redirectUrl = `http://localhost/auth/success?accessToken=${user.accessToken}&refreshToken=${user.refreshToken}`;
  // res.redirect(redirectUrl);
});

module.exports = router;
