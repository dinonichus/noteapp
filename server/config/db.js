// import modul mongoose
const mongoose = require('mongoose');

// fungsi untuk menghubungkan database
function connecting() {
	// memastikan operasi kueri mongoose sudah tepat dan tidak ada kesalahan
	mongoose.set('strictQuery', true);
	// menghubungkan dengan mongoDB
	mongoose.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	// instansi connection
	const connection = mongoose.connection;
	// error ahndling
	connection.on('error', console.error.bind(console, 'connection error:'));
	// jika berhasil terkoneksi
	connection.once('open', function () {
		console.log('Database is connected on ' + process.env.MONGODB_URI);
	});
}

// terkoneksi dengan modul
module.exports = connecting;
