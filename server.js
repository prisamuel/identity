const express = require('express')
const session = require('express-session')
const db = require('./db.js')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}))

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.set('view engine', 'pug')

db.connect()
const accounts = db.accounts

app.listen(3000, () => console.log('Example app listening on port 3000!'))

app.get('/', function (request, response) {
  response.render('login')
})

app.post('/auth', function (request, response) {
  const username = request.body.username
  const password = request.body.password
  if (username && password) {
    accounts.find()
      .where('username').equals(username)
      .where('password').equals(password)
      .exec(
        function (err, results) {
          if (err) throw new Error(err)
          if (results.length > 0) {
            request.session.loggedin = true
            request.session.username = username
            response.redirect('/home')
          } else {
            response.redirect('/')
          }
          response.end()
        }
      )
  }
})

app.get('/home', function (request, response) {
  if (request.session.loggedin) {
    response.render('home', { title: 'Welcome back', message: 'Hello ' + request.session.username })
  } else {
    response.render('home', { title: 'Welcome', message: 'Please login to view this page!' })
  }
  response.end()
})
