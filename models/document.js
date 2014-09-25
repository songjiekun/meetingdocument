var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
	content: String,
	owner: String,
	users: [String]
});

DocumentSchema.methods.addUser = function (user) {

	this.users.push(user);
}

DocumentSchema.methods.removeUser = function (user) {

	var i = this.users.indexOf(user);

    if(i > -1) {

        this.users.splice(i,1);

    }
}


module.exports = mongoose.model('Document',DocumentSchema);