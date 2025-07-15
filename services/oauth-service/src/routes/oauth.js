const express = require('express');
const googleRoutes = require('./google');

const router = express.Router();

router.use('/google', googleRoutes);  // now handles /oauth/google/*

module.exports = router;
