# identity
Experiments with connections to 3rd party Oauth providers

# Getting started
Install the dependencies
```
$ npm install
```
This step assumes you already have MongoDB installed and set up. Refer instructions below if you haven't already done so.
```
export MONGO_PASSWORD="XXX"
```

Start the server
```
$ npm start
```

# Setting up MongoDB
Set up MongoDB with some basic user accounts, db and data.

Start MongoDB server
```
mongod --dbpath ./data 
```

To set up basic authentication on MongoDB start MongoDB client and create admin user
```
mongo --host localhost --port 27017

use admin

db.createUser(
  {
    user: "superuser",
    pwd: "your-password",
    roles: [ "root" ]
  }
)

use accounts

db.createUser(
  {
    user: "root",
    pwd: "your-password",
    roles: [ "readWrite" ]
  }
)
```
Restart MongoDB server with auth enabled
```
mongod --dbpath ./data --auth

```

Restart MongoDB client with auth enabled (only required for stub data and debugging)
```
mongo --host localhost --port 27017 -u "root" -p "your-password" --authenticationDatabase accounts
```

Add some stub data with the client
```
db.accounts.insertMany( [
   { "username": "alice", "password": "wonderland" },
   { "username": "CheshireCat", "password": "wonderland" },
   { "username": "WhiteRabbit", "password": "wonderland" },
   { "username": "Walrus", "password": "wonderland" },
   { "username": "Carpenter", "password": "wonderland" },
]);
```

Query the stub data
```
myCursor = db.accounts.find( { } )
```