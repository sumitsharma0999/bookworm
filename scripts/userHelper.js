var Exceptions = require('../common/exceptions');
var User = require('../models/User');
var Q = require('q');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var SALT_WORK_FACTOR = 10;
var JWT_EXPIRATION_TIME = '2h';

// All the public(exposed) methods work on Promises

function addUser(user) {
    // Adds the given user

    var deferred = Q.defer();

    if(user && user.userName && user.userName) {
        // Check if the user already exists
        User.findOne({userName: user.userName}, function(err, existingUser) {
            if(err) {
                deferred.reject(err);
            }
            if(existingUser) {
                deferred.reject(new Exceptions.UserAlreadyExistsException());
            }
            else {
                encrypt(user.password).then(function(encryptedStr) {
                    var modelUser = new User({
                        userName: user.userName,
                        password: encryptedStr,
                    });

                    modelUser.save(function(err) {
                        if(err) {
                            deferred.reject(err);
                        }
                        // TODO: We may not need to pass the model object while resolving.
                        deferred.resolve(modelUser.toObject());
                    });
                });
            }
        });
    }
    else {
        deferred.reject("Invalid user object");
    }

    return deferred.promise;
}

function encrypt(str) {
    // encrypt the given str. It is asynchronous since encyption is compute intensive
    var deferred = Q.defer();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            deferred.reject(err);
        }

        // hash the password along with our new salt
        bcrypt.hash(str, salt, function(err, hash) {
            if (err) {
                deferred.reject(err);
            }

            deferred.resolve(hash);
        });
    });

    return deferred.promise;
}

function getTokenForUser(user, expiresIn) {
    // creates a token for the given user object
    var token = jwt.sign({userName: user.userName}, config.jwtSecret, {
          expiresIn: expiresIn
        });

    return token;
}

function autheticate(user) {
    // Given a user(which has userName and password), verifies the user.
    // If authetication succeeds, returns a token

    var deferred = Q.defer();

    // fetch user and test password verification
    User.findOne({ userName: user.userName }, function(err, storedUser) {
        if (err){
            deferred.reject(err);
        }
        else if(storedUser) {
            // Test if passwords match
            bcrypt.compare(user.password, storedUser.password, function(err, isMatch) {
                if(err){
                    deferred.reject(err);
                }
                if(isMatch) {
                    // password is correct, generate the token
                    var token = getTokenForUser(storedUser, JWT_EXPIRATION_TIME);
                    deferred.resolve(token);
                }
                else {
                    deferred.reject(new Exceptions.InvalidCredentialsException());
                }
            });
        }
        else {
            // No user was found with the given userName
            deferred.reject(new Exceptions.InvalidCredentialsException());
        }
    });

    return deferred.promise;
}

module.exports = {
    addUser: addUser,
    autheticate: autheticate
};
