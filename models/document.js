var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
	content: String,
	owner: { type: Schema.Types.ObjectId, ref: 'DocumentUser' , required:true },
	users: [{ type: Schema.Types.ObjectId, ref: 'DocumentUser'}]
});

DocumentSchema.methods.addUser = function (userid) {

	//确保没有重复添加用户

	for (var i=0; i<this.users.length;i++) {

		if (String(this.users[i]) == String(userid)) return false;
	}

	this.users.push(userid);

	return true;
}

DocumentSchema.methods.removeUser = function (userid) {

	var i = this.users.indexOf(userid);

    if(i > -1) {

        this.users.splice(i,1);

    }
}


module.exports = mongoose.model('Document',DocumentSchema);