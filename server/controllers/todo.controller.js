const mongoose = require('mongoose');
const Todo = require('../models/todo.model');
const Note = require('../models/note.model');

const TodoController = {
	// menyimpan todo baru ke database
	insert: async (req, res, next) => {
		const { id } = req.params;
		const { body } = req.body;

		if (!body) {
			req.flash('error', 'Please enter a todo.');
			return res.redirect(`/notes/${id}`);
		}

		// memastikan Note milik user berdasarkan ID yg tertera
		const note = await Note.findById(id).where({ user: req.user.id }).lean();
		if (!note) return res.status(404).render('404');

		// membuat objek todo baru
		const todo = new Todo({
			user: req.user.id,
			note: id,
			body,
		});

		// menyimpan todo yang telah dibuat
		await todo.save();
		return res.redirect(`/notes/${id}`);
	},

	// menghapus todo
	delete: async (req, res, next) => {
		const { id, todoId } = req.params;

		const note = await Note.findById(id).where({ user: req.user.id }).lean();
		if (!note) return res.status(404).render('404');

		await Todo.deleteOne({ _id: todoId }).where({ user: req.user.id });
		return res.redirect(`/notes/${id}`);
	},
};

// ekspor TodoController agar dapat diakses
module.exports = TodoController;
