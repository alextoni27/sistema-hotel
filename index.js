const path = require('path');
require('dotenv').config();
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session (in-memory suitable for single-user local use)
app.use(session({
	secret: process.env.SESSION_SECRET || 'dev-secret',
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// make currentUser available in views
app.use((req, res, next) => {
	res.locals.currentUser = req.session && req.session.user ? req.session.user : null;
	next();
});

// Routes
app.use('/', require('./src/routes/index'));
app.use('/rooms', require('./src/routes/rooms'));
app.use('/tenants', require('./src/routes/tenants'));
app.use('/leases', require('./src/routes/leases'));
app.use('/payments', require('./src/routes/payments'));
app.use('/users', require('./src/routes/users'));
app.use('/auth', require('./src/routes/auth'));
app.use('/houses', require('./src/routes/houses'));
app.use('/floors', require('./src/routes/floors'));
app.use('/room_types', require('./src/routes/room_types'));

// simple 404
app.use((req, res) => {
	res.status(404).render('404', { url: req.originalUrl });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));

module.exports = app;

