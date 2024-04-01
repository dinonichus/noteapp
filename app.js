require('dotenv').config();

const express = require('express');
// ejs-layout membantu dalam membuat layout berbeda yang bisa digunakan dalam berbagai halaman tanpa perlu mengcopy halaman
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const port = 5000 || process.env.PORT;

app.use(passport.initialize());
app.use(express.json());

// middleware
// membantu pemindahan data dari form ke halaman web
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// menghubungkan database
connectDB();

// static files
app.use(express.static('public'));

// templating engine
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Routes
app.use('/', require('./server/routes/auth'));
app.use('/', require('./server/routes/index'));
app.use('/', require('./server/routes/dashboard'));

// Handle 404
app.get('*', function(req, res){
    res.status(404).render('404')
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})