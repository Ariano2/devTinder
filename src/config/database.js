const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING2);
}

module.exports = { connectDB };
