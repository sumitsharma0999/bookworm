var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Are you a bookworm ?' , starterFile: 'scripts/Home.View'});
});


module.exports = router;
