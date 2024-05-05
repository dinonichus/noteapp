// mengimpor mdoel user dari direktori models
const User = require('../models/user.model');

const AuthController = {
	// mengahpus current session saat user logout
	logout: async (req, res) => {
		req.session.destroy((error) => {
			if (error) res.send('Error loggin out');
			else res.redirect('/');
		});
	},
	//menangani proses sign in
	signin: async (req, res) => {
		const { email, password } = req.body;
		// memberikan peringatan untuk mengisi email dan password
		if (!email || !password) {
			req.flash('error', 'All fields are required');
			return res.redirect('/signin');
		}

		// mencari user dalam database berdasrkan email yang diinput
		const user = await User.findOne({ email });
		// jika user tidak ditemukan, diredirect kembali untuk sign in
		if (!user) {
			req.flash('error', `User with email ${email} not found`);
			return res.redirect('/signin');
		}
		// menandakan bahwa akun terotentikasi dengan Google, bkn local
		if (user.strategy !== 'local') {
			req.flash('error', `Email ${email} is connected to a ${user.strategy} account`);
			return res.redirect('/signin');
		}
		// jika password yang diinput salah
		if (!user.comparePassword(password)) {
			req.flash('error', 'Invalid password');
			return res.redirect('/signin');
		}
		// passport benar, dialihkan ke halaman notes
		req.session.passport = { user: user.id };
		res.redirect('/notes');
	},
	// menangani proses sign up
	signup: async (req, res, next) => {
		// mewajibkan untuk mengisi nama, email dan password
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			req.flash('error', 'All fields are required');
			return res.redirect('/signup');
		}
		// pemberitahuan jika email yang dimasukan sudah terdaftar
		const user = await User.findOne({ email });
		if (user) {
			req.flash('error', `User with email ${email} already exists`);
			return res.redirect('/signup');
		}

		// inisialisasi objek newUser dengan kelengkapan input nama, email dan password
		const newUser = new User({
			name,
			email,
			password,
			strategy: 'local',
		});
		// menyimpan data user yang baru daftar
		await newUser.save();
		// menyimpan id otentikasi yang baru
		req.session.passport = { user: newUser.id };
		res.redirect('/notes');
	},
};
// ekspor modul AuthController agar dapat diakses
module.exports = AuthController;
