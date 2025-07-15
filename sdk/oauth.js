const open = require('open');

exports.loginWithGoogle = async () => {
  // Will open Google OAuth page
  await open('http://localhost/oauth/google');
};
