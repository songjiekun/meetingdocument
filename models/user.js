var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var DocumentUserSchema = new Schema({});

DocumentUserSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model('DocumentUser',DocumentUserSchema);