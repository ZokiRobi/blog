//TODO: Implementirati mogucnost dodavanja novog bloga, brisanje starog
var User = require('./user');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var hbs = require('hbs');
var blogEngine = require('./blog');
var fs = require('fs');
var passport = require('passport');
var port = process.env.PORT || 3000;
var usrname = '';
var LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
	function (username, password, cb) {
		User.findByUsername(username, function (err, user) {
			if (err) {
				console.log('Error', err.message);
				return cb(err);
			}
			if (!user) {
				console.log('Wrong Username');
				return cb(null, false);
			}
			if (user.password != password) {
				console.log('Wrong password');
				return cb(null, false);
			}
			console.log('Everything ok');
			return cb(null, user);
		});
	}));

passport.serializeUser(function (user, cb) {
	cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
	db.users.findById(id, function (err, user) {
		if (err) { return cb(err); }
		cb(null, user);
	});
});
app.use(passport.initialize());
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
	extended: true
}));


app.get('/', function (req, res) {
	
	res.render('index',
		{
			title: "My Blog",
			entries: blogEngine.getBlogEntries(),
			username: usrname
		});
});

app.get('/about', function (req, res) {
	res.render('about', { title: "About Me" ,username:usrname});
});
app.get('/login', function (req, res) {
	res.render('login');
});

app.post('/login', function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) { return next(err); }
		if (!user) { return res.redirect('/login'); }
		req.logIn(user, function (err) {
			if (err) { return next(err); }
			usrname = user.username;
			res.render('index',
				{
					title: "My Blog",
					entries: blogEngine.getBlogEntries(),
					username: usrname
				}, () => {
					res.redirect('/');
				});
		});
	})(req, res, next);
});


app.get('/article/:id', function (req, res) {
	var entry = blogEngine.getBlogEntry(req.params.id);
	res.render('article', { title: entry.title, blog: entry , username:usrname});
});

app.get('/addBlog', function (req, res) {
	res.render('addBlog',{username : usrname});
});
app.get('/logout', function (req, res) {
	usrname = '';
	res.render('index',{username : usrname},() => { res.redirect('/')});
});
app.post('/addBlog', function (req, res) {
	var date = new Date();
	var entries = blogEngine.getBlogEntries();
	if (req.body.naziv && req.body.sadrzaj) {
		entries.push({
			id: entries.length + 1,
			title: req.body.naziv,
			body: req.body.sadrzaj,
			published: date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
		})
	}
	blogEngine.saveBlogs(entries);
	res.render('index', { title: "My Blog", entries: blogEngine.getBlogEntries(),username:usrname });
});

app.post('/deleteBlog/:id', function (req, res) {
	var id = req.params.id;
	var entries = blogEngine.getBlogEntries();
	var newarray = [];
	for (var i = 0; i < entries.length; i++) {
		if (entries[i].id.toString() !== id) {
			newarray.push(entries[i]);
		}
	}
	blogEngine.saveBlogs(newarray);

	res.render('index', { title: "My Blog", entries: blogEngine.getBlogEntries(),username:usrname },
		(e, h) => {
			res.redirect('/');
		});
});
app.listen(port);



