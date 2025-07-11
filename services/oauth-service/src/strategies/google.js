const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const name = profile.displayName;
  done(null, { email, name });
}));
