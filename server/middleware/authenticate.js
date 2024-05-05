const Guard = {
	// memeriksa apakah user telah diotentikasi
	//jika sudah, dialihkan ke halaman notes
	// jika belum, dialihkan ke halaman sign in
	authenticated: (req, res, next) => {
		if (req.user) next();
		else res.redirect('/signin');
	},
	unauthenticated: (req, res, next) => {
		if (!req.user) next();
		else res.redirect('/notes');
	},
};

// ekspor modul guard agar dapat diakses
module.exports = Guard;
