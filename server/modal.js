
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userDetails = new Schema({

	name: String,
	email: String,
	password: String,	

});

module.exports = mongoose.model('Users', userDetails);