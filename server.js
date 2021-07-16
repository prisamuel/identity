const express = require("express");
var session = require('express-session');
var path = require('path');
let  app = express();
const mongoose = require('mongoose');

app.use(express.static('public'));
app.use(express.urlencoded({
	extended: true
}));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('view engine', 'pug')

mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.user = require("./user.js");
let dbConfig = require("./db.config.js")

db.mongoose
	.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		user: dbConfig.USER,
		pass: dbConfig.PASS,
		authSource: dbConfig.DB
	})
	.then(() => {
		console.log("Successfully connect to MongoDB.");
	})
	.catch(err => {
		console.error("Connection error", err);
		process.exit();
});

var accountsSchema = new mongoose.Schema({
	username: {
		type: String,
	},
	password: {
		type: String,
	}
});

var accounts = mongoose.model('accounts', accountsSchema)

app.listen(3000,  () => console.log("Example app listening on port 3000!"));

app.get('/', function(request, response) {
	response.render('login');
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		accounts.find().
		where('username').equals(username).
		where('password').equals(password).
		exec( 
			function(err, results) {
				if (err) throw new Error(err)
				if (results.length > 0) {
					request.session.loggedin = true;
					request.session.username = username;
					response.redirect('/home');
				} else {
					response.redirect("/")
				}			
				response.end();
			}
			)
		}
	});
	
	app.get('/home', function(request, response) {
		if (request.session.loggedin) {
			response.render('home', { title: 'Welcome back', message: 'Hello ' + request.session.username })
		} else {
			response.render('home', { title: 'Welcome', message: 'Please login to view this page!' })
		}
		response.end();
	});