// Local (client-only) collection
Errors = new Mongo.Collection(null);

throwError = function(message) { 
	Errors.insert({message: message});
};

successMsg = function(message) {
	console.log("It should now alert: ", message);
	sAlert.success(message);
}