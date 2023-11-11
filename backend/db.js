//import { MongoClient, ObjectId } from 'mongodb';
const { MongoClient, ObjectId } = require('mongodb');

let cachedDb = null;

async function connectToDatabase() {
  const uri = 'mongodb+srv://davis123:davis123@cluster0.hujqu.mongodb.net/test3';
  //const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const client = new MongoClient(uri);

  if (cachedDb) {
    console.log('Using cached database instance');
    return cachedDb;
  }

  try {
    await client.connect();
    const db = client.db('relaxProject');
    cachedDb = db;
    console.log('Successfully connected to MongoDB');
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

module.exports = connectToDatabase;
