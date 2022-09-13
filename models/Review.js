const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
	body: String,
	rating: {
		type: Number,
		enum: [1, 2, 3, 4, 5],
	},
});

module.exports = mongoose.model('Review', ReviewSchema);
