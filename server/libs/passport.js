// mengimpor modul passport
const passport = require('passport');
// mengimport modul GoogleStrategy
const GoogleStrategy = require('passport-google-oauth20');

// mengimpor model user dari direktori models
const User = require('../models/user.model');

// mendaftarkan otentikasi
passport.use(
	// inisialisasi objek GoogleStrategy
	new GoogleStrategy(
		{
			// konfigurasi data otentikasi
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		// fungsi yang dijalankan saat pengguna menggunakan GoogleAuth
		async function (accessToken, refreshToken, profile, done) {
			let user = await User.findOne({
				strategy: 'google',
				credentialId: profile.id,
			});

			// memastikan user sudah terdaftar dalam Google database
			// jika user tidak terdaftar, akan dibuat akun baru
			if (!user) {
				user = await User.create({
					strategy: 'google',
					password: 'google',
					credentialId: profile.id,
					email: profile.emails[0].value,
					profileImage: profile.photos[0].value,
					name: `${profile.name.givenName} ${profile.name.familyName}`,
				});
			}
			done(null, user);
		}
	)
);

// ditentukan bahwa hanya ID pengguna yang diserialisasikan ke dalam sesi
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

// dari ID akan dicari user dalam database
passport.deserializeUser(async (id, done) => {
	// bila ditemukan, objek user direturn tanpa menyertakan password
	try {
		const user = await User.findById(id).select('-password');
		done(null, user);
	}
	// bila tidak ditemukan akan ditandakan adanya kesalahan
	catch (err) {
		done(err, null);
	}
});

// mengekspor modul pssport agar dapat diakses
module.exports = passport;
