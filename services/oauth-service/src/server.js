require('dotenv').config();
const express = require('express');
const passport = require('passport');
const oauthRoutes = require('./routes/oauth');

require('./strategies/google');
require('./strategies/linkedin');

const app = express();

app.use(passport.initialize());
app.use('/oauth', oauthRoutes);

app.get('/', (_, res) => res.send('OAuth Service Running ✅'));

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => console.log(`[OAUTH] running on port ${PORT}`));
