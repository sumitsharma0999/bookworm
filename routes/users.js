var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

router.post('/', function(req, res, next) {
	var userName = req.body.name;

	var user = new User({
		name: userName, 
	    password: 'password',
	    admin: true
	});

	// save the sample user
  	user.save(function(err) {
	    if (err) throw err;

	    console.log('User saved successfully');
	    res.json({ success: true });
  	});
})

module.exports = router;
