const { MongoClient } = require('mongodb');
const config = require('./config');

let db = null;
let client = null;

/**
 * Connect to MongoDB
 */
async function connect() {
  try {
    client = new MongoClient(config.mongoUri);
    await client.connect();
    db = client.db(config.dbName);
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

/**
 * Get the database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connect() first.');
  }
  return db;
}

/**
 * Load all decisions from MongoDB
 */
async function loadDecisions() {
  try {
    const db = getDb();
    const decisionsCollection = db.collection(config.decisionsCollection);
    const decisions = await decisionsCollection.find({}).toArray();

    // Convert array of decision documents to object format
    // { handle: decision }
    const decisionsObj = {};
    decisions.forEach(doc => {
      decisionsObj[doc.handle] = doc.decision;
    });

    return decisionsObj;
  } catch (error) {
    console.error('Error loading decisions from MongoDB:', error);
    throw error;
  }
}

/**
 * Save a single decision to MongoDB
 */
async function saveDecision(handle, decision) {
  try {
    const db = getDb();
    const decisionsCollection = db.collection(config.decisionsCollection);

    // Upsert: update if exists, insert if doesn't
    await decisionsCollection.updateOne(
      { handle: handle },
      {
        $set: {
          handle: handle,
          decision: decision,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return true;
  } catch (error) {
    console.error('Error saving decision to MongoDB:', error);
    throw error;
  }
}

/**
 * Get a single decision by handle
 */
async function getDecision(handle) {
  try {
    const db = getDb();
    const decisionsCollection = db.collection(config.decisionsCollection);
    const doc = await decisionsCollection.findOne({ handle: handle });
    return doc ? doc.decision : null;
  } catch (error) {
    console.error('Error getting decision from MongoDB:', error);
    throw error;
  }
}

/**
 * Delete a decision by handle
 */
async function deleteDecision(handle) {
  try {
    const db = getDb();
    const decisionsCollection = db.collection(config.decisionsCollection);
    await decisionsCollection.deleteOne({ handle: handle });
    return true;
  } catch (error) {
    console.error('Error deleting decision from MongoDB:', error);
    throw error;
  }
}

/**
 * Close MongoDB connection
 */
async function close() {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

module.exports = {
  connect,
  getDb,
  loadDecisions,
  saveDecision,
  getDecision,
  deleteDecision,
  close
};
