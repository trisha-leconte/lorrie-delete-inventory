module.exports = {
  // MongoDB connection string
  // Replace this with your actual MongoDB connection string
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory-decisions',

  // Database name
  dbName: 'inventory-decisions',

  // Collection name for decisions
  decisionsCollection: 'decisions'
};
