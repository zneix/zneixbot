const mongodb = require('mongodb');
const auth = require('../src/json/auth')();
let uri = `mongodb+srv://${auth.db.user}:${auth.db.pass}@${auth.db.host}?retryWrites=true&w=majority`;
let client = new mongodb.MongoClient(uri, {useUnifiedTopology: true});

module.exports = client;