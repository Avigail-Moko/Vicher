// חיבור למונגו עם טיפול באירועי שגיאה והתנתקות

const mongoose = require('mongoose');
const { MONGO_USERNAME, MONGO_PASSWORD, CLUSTER_URL } = require('./env');

async function connectDB() {
    const uri = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${CLUSTER_URL}/?retryWrites=true&w=majority`;
    await mongoose.connect(uri);
  console.log('MongoDB Connected');

  mongoose.connection.on('error', err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
}

module.exports = { connectDB };
