// import module
const express = require('express');
const router = express.Router();

const Auth = require('../middleware/authenticate');
const IndexController = require('../controllers/index.controller');

// mengatur router homepage
router.get('/', IndexController.homepage);
// mengatur router aboutpage
router.get('/about', IndexController.about);

// mengatur rotuer signin page
router.get('/signin', Auth.unauthenticated, IndexController.signin);
// mengatur router signup page
router.get('/signup', Auth.unauthenticated, IndexController.signup);

module.exports = router;
