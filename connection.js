const mongoose = require('mongoose');
const config = require('./src/config');
const {
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbUser,
  maUser,
  maPassword,
  maServer,
} = config;

mongoose.set('strictQuery', false);
const mongodb = `mongodb://${maUser}:${maPassword}@${maServer}`;

const localConnection = `mongodb://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', async () => {
  console.log('database connect');
});

module.exports = db;