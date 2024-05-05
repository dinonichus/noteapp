const mongoose = require('mongoose');

// mendefinisikan struktur data untuk Todo
const TodoSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	note: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Note',
	},
	body: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
});

TodoSchema.virtual('owner', {
	ref: 'User',
	localField: 'user',
	foreignField: '_id',
});

TodoSchema.virtual('post', {
	ref: 'Note',
	localField: 'note',
	foreignField: '_id',
});

TodoSchema.index({ body: 'text' });

module.exports = mongoose.model('Todo', TodoSchema);
