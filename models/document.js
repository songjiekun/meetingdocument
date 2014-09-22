var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DocumentSchema = new Schema({
	//documentid: Schema.Types.ObjectId,
	content: String,
	owner: String,
	users: [String]
});

module.exports = mongoose.model('Document',DocumentSchema);