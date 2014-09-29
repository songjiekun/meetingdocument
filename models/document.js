var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
	content: String,
	owner: { type: Schema.Types.ObjectId, ref: 'DocumentUser' , required:true },
	users: [{ type: Schema.Types.ObjectId, ref: 'DocumentUser'}]
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