const mongoose = require('mongoose');
const passLocMongoose = require('passport-local-mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

UserSchema.plugin(passLocMongoose);

module.exports = mongoose.model('User', UserSchema);
