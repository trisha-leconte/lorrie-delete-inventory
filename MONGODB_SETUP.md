# MongoDB Setup Guide

This application now uses MongoDB to store decisions instead of a local JSON file.

## Quick Setup

### 1. Set up your MongoDB connection

Create a `.env` file in the root directory of the project:

```bash
cp .env.example .env
```

### 2. Add your MongoDB connection string

Edit the `.env` file and add your MongoDB connection string:

**For local MongoDB:**
```
MONGODB_URI=mongodb://localhost:27017/inventory-decisions
```

**For MongoDB Atlas (cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory-decisions?retryWrites=true&w=majority
```

### 3. Start the server

```bash
npm start
```

## MongoDB Atlas Setup (Recommended)

If you don't have MongoDB installed locally, you can use MongoDB Atlas (free tier available):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Click "Connect" on your cluster
5. Add your IP address to the whitelist (or use 0.0.0.0/0 for development)
6. Create a database user with a username and password
7. Choose "Connect your application"
8. Copy the connection string
9. Replace `<password>` with your database user password
10. Add the connection string to your `.env` file

## Database Structure

The application creates the following:

- **Database:** `inventory-decisions`
- **Collection:** `decisions`

### Document Schema

Each decision is stored as a document:

```json
{
  "_id": ObjectId("..."),
  "handle": "item-handle",
  "decision": "keep" | "delete",
  "updatedAt": ISODate("...")
}
```

## Migration from JSON

If you have existing decisions in `decisions.json`, you can migrate them:

```javascript
// Run this once in node or create a migration script
const fs = require('fs');
const database = require('./database');

async function migrate() {
  await database.connect();
  const decisions = JSON.parse(fs.readFileSync('decisions.json', 'utf-8'));

  for (const [handle, decision] of Object.entries(decisions)) {
    await database.saveDecision(handle, decision);
  }

  console.log('Migration complete!');
  await database.close();
}

migrate();
```

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string (required)
- `PORT`: Server port (optional, defaults to 3000)

## Features

- Automatic connection handling
- Graceful shutdown on SIGINT (Ctrl+C)
- Upsert operations (insert or update)
- Indexed queries for fast lookups
