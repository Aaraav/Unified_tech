const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  callbackURL: '/oauth/linkedin/callback',
  scope: ['r_emailaddress', 'r_liteprofile']
}, (accessToken, refreshToken, profile, done) => {
  const email = profile.emails[0].value;
  const name = profile.displayName;
  done(null, { email, name });
}));
