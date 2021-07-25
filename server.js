const express = require('express')
const session = require('express-session')
const axios = require('axios')
const path = require('path')

const db = require('./db.js')
const app = express()
const clientID = process.env.GITHUB_OAUTH_CLI_ID
const clientSecret = process.env.GITHUB_OAUTH_CLI_SECRET

if (!clientID || !clientSecret) {
  console.error('Error: Export GITHUB_OAUTH_CLI_ID and GITHUB_OAUTH_CLI_SECRET to proceed')
  process.exit()
}

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
  response.render('login', { message: 'Welcome to Identity' })
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
            response.render('login', { message: 'Incorrect credentials, try again' })
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

app.get('/auth/github/callback', (request, response) => {
  const body = {
    client_id: clientID,
    client_secret: clientSecret,
    code: request.query.code
  }
  const opts = { headers: { accept: 'application/json' } }
  axios.post('https://github.com/login/oauth/access_token', body, opts)
    .then(response => response.data.access_token)
    .then(_token => {
      console.log('My token:', _token)
      response.redirect('/home')
    })
    .catch(err => response.status(500).json({ message: err.message }))
})

app.get('/github', (request, response) => {
  response.redirect(`https://github.com/login/oauth/authorize?client_id=${clientID}`)
})
