var express = require('express');
var authenticate = require('./authenticate');
var router = express.Router();

router.get('/authenticate/google', authenticate.google);
router.get('/authenticate/facebook', authenticate.facebook);

module.exports = router;