var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var DocumentUserSchema = new Schema({
	facebook:{
		profileid:{ type:String,unique:true},
		accesstoken: String,
		refreshtoken: String
	},
	twitter:{
		profileid:{ type:String,unique:true},
		accesstoken: String,
		refreshtoken: String
	},
	weibo:{
		profileid:{ type:String,unique:true},
		accesstoken: String,
		refreshtoken: String
	}
});

DocumentUserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('DocumentUser',DocumentUserSchema);