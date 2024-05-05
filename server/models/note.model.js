const mongoose = require('mongoose');

// mendefinisikan struktur data untuk Note
const NoteSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
	},
	title: {
		type: String,
		required: true,
	},
	excerpt: {
		type: String,
		required: true,
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

// ref ke model 'User'
NoteSchema.virtual('owner', {
	ref: 'User',
	localField: 'user',
	foreignField: '_id',
});

// ref ke model 'Comment'
NoteSchema.virtual('comments', {
	ref: 'Comment',
	localField: '_id',
	foreignField: 'note',
});

// skema untuk pencarian konten Note
NoteSchema.index({ title: 'text', body: 'text' });

module.exports = mongoose.model('Note', NoteSchema);
