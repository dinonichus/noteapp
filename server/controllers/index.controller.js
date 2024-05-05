// mengatur informasi halaman homepage, about, signin, signup,
// seperti judul halaman dan deskripsi
const IndexController = {
	homepage: (req, res) => {
		const locals = {
			title: 'Brain Canvas',
			description: 'Free Note-Taking App.',
		};
		res.render('index', locals);
	},

	about: (req, res) => {
		const locals = {
			title: 'About - Brain Canvas',
			description: 'Free Note-Taking App.',
		};
		res.render('about', locals);
	},

	signin: (req, res) => {
		const locals = {
			title: 'Sign In - Brain Canvas',
			description: 'Free Note-Taking App.',
			error: req.flash('error'),
		};
		res.render('auth/signin', locals);
	},

	signup: (req, res) => {
		const locals = {
			title: 'Sign Up - Brain Canvas',
			description: 'Free Note-Taking App.',
			error: req.flash('error'),
		};
		res.render('auth/signup', locals);
	},
};
// ekspor modul IndexController agar dapat diakses
module.exports = IndexController;
