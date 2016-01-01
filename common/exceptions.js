module.exports = {
	DataInvalidException: function DataInvalidException(message) {
		this.name = "DataInvalidException";
		this.message = message || "";
	} 
};