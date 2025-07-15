const GoogleStrategy = require('passport-google-oauth20').Strategy;
const axios = require('axios');
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: "929042959933-hud46f5hack7cqmdnkcqccq1cv42dmb1.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: 'http://localhost:8003/oauth/google/callback', // exposed via NGINX
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // POST to your actual exposed signup/login endpoint
    console.log("hit hit hit");
   const res = await axios.post('http://nginx/auth/oauth-sync', {
  email: profile.emails?.[0]?.value || '',
  name: profile.displayName || '',
  provider: 'google',
  providerId: profile.id,
  // password: 'google_oauth_default', // optional if your schema requires it
});

console.log(res);
    const user = res.data.user;
    return done(null, {
      accessToken: res.data.accessToken,
      refreshToken: res.data.refreshToken,
      ...user,
    });
  } catch (err) {
    console.error('[GOOGLE STRATEGY ERROR]', err.response?.data || err.message);
    return done(err, null);
  }
}));
