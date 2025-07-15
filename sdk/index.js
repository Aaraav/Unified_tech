const auth = require('./auth');
const token = require('./token');
const oauth = require('./oauth');

module.exports = {
  ...auth,
  ...token,
  ...oauth,
};
