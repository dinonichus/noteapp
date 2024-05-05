const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// mendefinisikan struktur data User
const UserSchema = new mongoose.Schema({
	credentialId: {
		type: String,
		required: false,
	},
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	strategy: {
		type: String,
		required: true,
		enum: ['google', 'local'],
	},
	profileImage: {
		type: String,
		required: false,
	},
});

// fungsi melakukan pre-save sebelum disimpan ke dalam database
UserSchema.pre('save', function (next) {
	// melakukan hash pada password

	if (!this.isModified('password')) {
		return next();
	}

	bcrypt.hash(this.password, 10, (error, hash) => {
		if (error) return next(error);
		this.password = hash;
		next();
	});
});

// membandingkan password yang diinput dengan password hash yang tersimpan dalam database
UserSchema.methods.comparePassword = function (password) {
	return bcrypt.compareSync(password, this.password);
};

UserSchema.virtual('notes', {
	ref: 'Note',
	localField: '_id',
	foreignField: 'user',
});

module.exports = mongoose.model('User', UserSchema);
