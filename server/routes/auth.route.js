// import modul
const express = require('express');
const AuthController = require('../controllers/auth.controller');
const Auth = require('../middleware/authenticate');
const passport = require('../libs/passport');
const router = express.Router();

// diarahkan ke Google Authentication
router.get(
	'/google/auth',
	Auth.unauthenticated,
	passport.authenticate('google', {
		scope: ['email', 'profile'],
	})
);

// callback setelah dilakukan otentikasi
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: '/google/failure',
		successRedirect: '/notes',
	})
);

// jika otentikasi gagal
router.get('/google/failure', (req, res) => {
	res.send('Failed to authenticate using google');
});

// proses signin user
router.post('/signin', AuthController.signin);
// proses signup user
router.post('/signup', AuthController.signup);
// proses logout user
router.get('/logout', AuthController.logout);

module.exports = router;
