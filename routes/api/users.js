var express = require('express');
var Exceptions = require('../../common/exceptions');
var userHelper = require('../../scripts/userHelper');
var User = require('../../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	User.find({}, function(err, users) {
		res.json(users);
	});
});

router.post('/authenticate', function(req, res, next) {
	// Authenticates the given credentials and gives a token on succes

	var user = getUserObjectFromJson(req.body);

	if(user) {
        userHelper.autheticate(user).then(function(token) {
		    console.log('User authenticated successfully');
		    res.json({ success: true, token: token });
	  	}, function(err) {
            // See the type of error and set status appropriately
            if(typeof err === Exceptions.InvalidCredentialsException) {
                res.status(403);
            }
            else {
                res.status(500);
            }
            res.json(err);
        });
	}
	else {
		res.status(400);
		res.send('Invalid parameters');
	}
});

router.post('/addUser', function(req, res, next) {
	// Adds the specified user

	var user = getUserObjectFromJson(req.body);

	if(user) {
        userHelper.addUser(user).then(function(modelUser) {
		    console.log('User added successfully');
            res.status(200);
		    res.json({ success: true, user: modelUser });
	  	}, function(err) {
            // See the type of error and set status appropriately
            if(typeof err === Exceptions.UserAlreadyExistsException) {
                res.status(400);
            }
            else {
                res.status(500);
            }
            res.json(err);
        });
	}
	else {
		res.status(400);
		res.send('Invalid parameters');
	}
});

function getUserObjectFromJson(jsonObj) {
	// Parses the jsonObj to check if it is in valid format
	if(jsonObj)
	{
		var userName, password;

		userName = jsonObj.userName;
		password = jsonObj.password;

		if(userName && password) {
			return {
				userName: userName, 
			    password: password,
			};
		}
	}
	return null;
}

module.exports = router;
