// konfigurasi file env
require('dotenv').config();

// import packages
const express = require('express');
const layouts = require('express-ejs-layouts');
const override = require('method-override');
const session = require('express-session');
const passport = require('passport');
const store = require('connect-mongo');
const morgan = require('morgan');
const flash = require('connect-flash');

// menghubungkan ke database
const connecting = require('./server/config/db');
// website auto-update saat perubahan kode tanpa perlu refresh halaman
const reloader = require('livereload');
const connector = require('connect-livereload');

// mengimpor modul guard
const Guard = require('./server/middleware/authenticate');

// menginstansi objek ExpressJS
const app = express();
connecting();

// mengonfigurasi server
const PORT = process.env.PORT || 3000;
const HOST = process.env.DOMAIN || 'localhost';

app.use(
	session({
		// pengamanan cookie
		secret: 'keyboard cat',
		// sesi akan disimpang ulang hanya jika terjadi perubahan
		resave: false,
		// menyimpan sesi bahkan sebelum diinisialisasi
		saveUninitialized: true,
		// menggunakan MongoDB untuk database
		store: store.create({
			mongoUrl: process.env.MONGODB_URI,
		}),
	})
);

// konfigurasi morgan
app.use(morgan('dev'));
// konfigurasi passport.js
app.use(passport.session());
// inisialisasi passport
app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(override('_method'));
//untuk mengakses file-file static pada direktori public
app.use(express.static('public'));

// mengakses express-ejs-layouts untuk mempermudah pengaturan layout
app.use(layouts);
// mengakses flash untuk menampilkan pesan singkat
app.use(flash());
// pengaturan view engine menggunakan template ejs
app.set('view engine', 'ejs');
// tampilan utama terdapat pada file layouts/main.ejs
app.set('layout', './layouts/main');

// menentukan bahwa software dalam mode development
if (process.env.NODE_ENV === 'development') {
	console.log('Development mode');

	const reload = reloader.createServer();
	reload.server.once('connection', () => {
		setTimeout(() => {
			reload.refresh('/');
		}, 100);
	});

	reload.watch('public');
	reload.watch('views');
	app.use(connector());
}

// mengakses rute
app.use('/', require('./server/routes/index.route'));
app.use('/', require('./server/routes/auth.route'));

app.use(Guard.authenticated);
app.use('/', require('./server/routes/notes.route'));
app.use('/', require('./server/routes/todo.route'));

// error handling
app.all('*', (req, res, next) => {
	res.status(404).render('404');
});

// error handling
app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).render('500');
});

// menjalankan server
app.listen(PORT, () => {
	console.log(`Server is running on http://${HOST}:${PORT}`);
});
