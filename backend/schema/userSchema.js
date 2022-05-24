const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	phone: { type: Number, required: true },
	mail: { type: String, required: true },
	password: { type: String, required: true },
	notes: { type: [String], default: [] },
});

module.exports = mongoose.model('user', userSchema);
