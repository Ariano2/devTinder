const mongoose = require('mongoose');

async function connectDB() {
  await mongoose.connect(
    'mongodb+srv://ariano:HARrSeWq6JwgkX0R@namastenode.z6wiv.mongodb.net/devTinder'
  );
}

module.exports = { connectDB };
