const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//Mongodb setup file
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      socketTimeoutMS: 30000,
      keepAlive: true,
      reconnectTries: 30000,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
