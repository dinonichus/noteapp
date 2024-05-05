// mengimpor library mongoose
const mongoose = require('mongoose');

// mengimpor model Note
const Note = require('../models/note.model');
// mengimpor model Todo
const Todo = require('../models/todo.model');

const NodeController = {
	index: async (req, res) => {
		// batas jumlah Note yang ditampilkan pada index halaman
		const limit = 12;
		// mengambil nomor halaman dari query page, deafultnya 1
		const page = req.query.page || 1;
		// mengambil kata kunci pencarian dari query string
		const search = req.query.search || '';

		// merender tampilan halaman
		const locals = {
			title: 'Notes',
			description: 'Free NodeJS Notes App.',
		};

		// menentukan notes mana milik user siapa pada database
		const notes = await Note.aggregate([
			{ $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'owner' } },
			{ $unwind: '$owner' },
			{ $sort: { updatedAt: -1 } },
			{
				$match: {
					$and: [
						{ user: mongoose.Types.ObjectId(req.user.id) },
						{
							$or: [
								{ title: { $regex: search, $options: 'i' } },
								{ body: { $regex: search, $options: 'i' } },
								{ excerpt: { $regex: search, $options: 'i' } },
							],
						},
					],
				},
			},
			{
				$project: {
					// batas judul yang ditampilkan pada halaman indeks adalah 30 karakter
					title: { $substr: ['$title', 0, 30] },
					// batas excerpt yang ditampilkan pada halaman indeks adalah 100 karakter
					excerpt: { $substr: ['$excerpt', 0, 100] },
					// hanya menampilkan ID dari field owner
					owner: { _id: 1, name: 1 },
					// menampilkan field updateAt
					updatedAt: 1,
				},
			},
		])
			// pengaturan paginasi pada hasil pencarian
			.skip(limit * page - limit)
			.limit(limit)
			.exec();

		// counter
		const count = await Note.count();

		// menampilkan halaman indeks pada layout dashboard
		return res.render('notes/index', {
			locals,
			notes,
			query: search,
			user: req.user,
			current: page,
			pages: Math.ceil(count / limit),
			layout: '../views/layouts/dashboard',
		});
	},

	// menampilkan halaman detail Note
	view: async (req, res) => {
		// mengambil ID dari Note
		const { id } = req.params;

		// mencari Note dengan ID yang sesuai dan memastikan pemilik Note merupakan milik user
		const note = await Note.findById({ _id: id }).where({ user: req.user.id }).lean();
		// error handling
		if (!note) return res.status(404).render('404');

		// mencari todo list yang terkandung dalam Note dan memastikan toto list merupakan milik user
		const todos = await Todo.find({ note: id }).where({ user: req.user.id }).lean();

		// merender halaman view Note
		return res.render('notes/view', {
			id,
			note,
			todos,
			error: req.flash('error'),
			layout: '../views/layouts/dashboard',
		});
	},

	// mengupdate Note
	update: async (req, res) => {
		const { id } = req.params;
		// menagmbil data baru dari permintaan POST
		const { title, excerpt, body } = req.body;

		// memastikan data baru sudah diupdate dengan body minimal 20 karakter
		if (!title || !excerpt || !body || body.length < 20) {
			req.flash('error', 'All fields are required, and body must be at least 20 characters long');
			return res.redirect(`/notes/${id}`);
		}

		// mencari ID catatan yang akan diupdate
		const note = await Note.findById({ _id: id }).where({ user: req.user.id });
		// error handling
		if (!note) return res.status(404).render('404');

		// melakukan update pada catatan tersebut
		await Note.updateOne({ _id: id }, { title, excerpt, body, updatedAt: Date.now() }).where({ user: req.user.id });
		return res.redirect('/notes');
	},

	// menghapus Note
	delete: async (req, res) => {
		const { id } = req.params;

		const note = await Note.findById({ _id: id }).where({ user: req.user.id }).lean();
		if (!note) return res.status(404).render('404');

		// menemukan dan memastikan ID Note milik user
		await Note.findByIdAndDelete({ _id: id }).where({ user: req.user.id });
		// Todos yang terkandung dalam catatan yang akan dihapus juga ikut dihapuskan
		await Todo.deleteMany({ note: id }).where({ user: req.user.id });
		res.redirect('/notes');
	},

	// membuat Note baru
	create: async (req, res) => {
		// merender halaman Create
		res.render('notes/create', {
			// error handling
			error: req.flash('error'),
			layout: '../views/layouts/dashboard',
		});
	},

	// menyimpan Note yang baru dibuat ke database
	insert: async (req, res) => {
		const { title, excerpt, body } = req.body;

		// memeriksa kelengkapan data
		if (!title || !excerpt || !body || body.length < 20) {
			req.flash('error', 'All fields are required, and body must be at least 20 characters long');
			return res.redirect('/notes/create');
		}
		// membuat Note baru berdasarkan data yang diinput beserta ID user sebagai pemilik dari Note tersebut
		await Note.create({
			title,
			body,
			excerpt,
			user: req.user.id,
		});

		res.redirect('/notes');
	},

	// mencari Note yang pernah dibuat
	search: async (req, res) => {
		// menagmbil kata kunci pencarian dari query String
		const { query } = req.body;
		// jika tidak ditemukan, diarahkan ke halaman Notes
		if (!query) return res.redirect('/notes');
		res.redirect(`/notes?search=${query}`);
	},
};

// ekspor modul NodeController agar dapat diakses
module.exports = NodeController;
