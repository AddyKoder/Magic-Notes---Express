// Importing packages
const express = require('express');
const router = express.Router();
const path = require('path');

const connector = require('./mongoose');

// Declaring constants
const fnd = path.join(__dirname, '../../frontend/');

// Importing middlewares
urlencoded = express.urlencoded({ extended: true });
jsonparser = express.json();

// Creating routes / endpoints
// Creating route for the home page
router.get('/', (req, res) => {
	res.sendFile(fnd + 'templates/home_page.html');
});

// Creating route for User Dashboard
router.get('/dashboard', (req, res) => {
	res.sendFile(fnd + 'templates/dashboard_page.html');
});

// Creating get route for getting SignUp page
router.get('/signup', (req, res) => {
	res.sendFile(fnd + 'templates/signup_page.html');
});

// Creating get route for getting LogIn page
router.get('/login', (req, res) => {
	res.sendFile(fnd + 'templates/login_page.html');
});

// Creating post route for SignUp
router.post('/signup', urlencoded, (req, res) => {
	if (
		req.body.name &&
		req.body.phone &&
		req.body.mail &&
		req.body.pwd &&
		req.body.cpwd &&
		req.body.pwd === req.body.cpwd
	) {
		connector
			.createUser(req.body.name, req.body.phone, req.body.mail, req.body.pwd)
			.then(() => {
				res.render('create_entry', { mail: `${req.body.mail}`, pwd: `${req.body.pwd}` });
			})
			.catch(e => res.send('Error : ' + e));
	} else res.send('Inconsistent Information given');
});

// Creating post route for LogIn
router.post('/login', urlencoded, (req, res) => {
	if (req.body.pwd && req.body.mail) {
		connector
			.verifyUser(req.body.mail, req.body.pwd)
			.then(name => {
				res.render('create_entry', { mail: `${req.body.mail}`, pwd: `${req.body.pwd}` });
			})
			.catch(e => res.send('Error : ' + e));
	} else res.send('Inconsistent Information given');
});

// Creating route for verifying users
router.get('/verify', (req, res) => {
	mail = req.query.mail;
	pwd = req.query.pwd;
	if (mail && pwd) {
		connector
			.verifyUser(mail, pwd)
			.then(() => res.send('true'))
			.catch(() => res.send('false'));
	} else res.send('false');
});

// Creating route for fetching user Notes
router.post('/getnotes', jsonparser, (req, res) => {
	mail = req.body.mail;
	pwd = req.body.pwd;

	if (mail && pwd) {
		connector
			.verifyUser(mail, pwd)
			.then(() => {
				connector
					.getNotes(mail)
					.then(notes => {
						res.json(JSON.stringify({ status: 'success', notes }));
					})
					.catch(e => res.status(401).send(e));
			})
			.catch(e => res.status(401).send(e));
	} else res.status(401).send('incorrect information');
});

router.post('/setnotes', jsonparser, (req, res) => {
	notes = req.body.notes;
	mail = req.body.mail;
	pwd = req.body.pwd;
	if (mail && pwd && typeof notes === 'object') {
		connector
			.verifyUser(mail, pwd)
			.then(() => {
				connector
					.setNotes(mail, notes)
					.then(() => {
						res.json(JSON.stringify({ status: 'success', notes }));
					})
					.catch(e => res.status(401).send(e));
			})
			.catch(e => res.status(401).send(e));
	} else res.status(401).send('incorrect information');
});

router.post('/userinfo', jsonparser, (req, res) => {
	mail = req.body.mail;
	pwd = req.body.pwd;
	if (mail && pwd) {
		connector
			.verifyUser(mail, pwd)
			.then(() => {
				connector
					.getInfo(mail)
					.then(info => {
						res.json({ success: true, info });
					})
					.catch(e => {
						res.send(e);
					});
			})
			.catch(e => {
				res.send(e);
			});
	} else {
		res.send('inconsistent information');
	}
});
module.exports = router;
