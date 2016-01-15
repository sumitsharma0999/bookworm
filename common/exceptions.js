module.exports = {
	DataInvalidException: function DataInvalidException(message) {
		this.name = "DataInvalidException";
		this.message = message || "The data provided is not valid";
	},
    InvalidCredentialsException: function InvalidCredentialsException(message) {
        this.name = "InvalidCredentialsException";
        this.message = message || "User name and passowrd do not match";
    },
    UserAlreadyExistsException: function InvalidCredentialsException(message) {
        this.name = "UserAlreadyExistsException";
        this.message = message || "The userName already exists";
    }
};
