var express = require('express');
var User = require('../../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});


router.post('/addUser', function(req, res, next) {
	// Adds the specified user

	// TODO: create a token for the user and return the token

	var user = getUserObjectFromJson(req.body);
	if(user) {
		// save the sample user
	  	user.save(function(err) {
		    if (err) {
		    	throw err;
		    }

		    console.log('User saved successfully');
		    res.json({ success: true });
	  	});
	}
	else {
		res.status(400);
		res.send('Invalid parameters');
	}
})

function getUserObjectFromJson(jsonObj) {
	// Parses the jsonObj to check if it is in valid format
	if(jsonObj)
	{
		var userName, password;

		userName = jsonObj.userName;
		password = jsonObj.password;

		if(userName && password) {
			return new User({
				userName: userName, 
			    password: password,
			})
		}
	}
	return null;
}

module.exports = router;
