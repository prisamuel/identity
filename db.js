const mongoose = require('mongoose')
const dbConfig = require('./db.config.js')

mongoose.Promise = global.Promise
const db = {}
db.mongoose = mongoose

function connect () {
  if (!process.env.MONGO_PASSWORD) {
    console.error('Error: MongoDB env credential not set up. Export MONGO_PASSWORD')
    process.exit()
  }

  db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      user: dbConfig.USER,
      pass: dbConfig.PASS,
      authSource: dbConfig.DB
    })
    .then(() => {
      console.log('Successfully connect to MongoDB.')
    })
    .catch(err => {
      console.error('Connection error', err)
      process.exit()
    })
}

const accountsSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
})

const accounts = mongoose.model('accounts', accountsSchema)

module.exports = {
  connect: connect,
  accounts: accounts
}
