require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const database = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// File paths
const CSV_FILES = [
  'antique_furniture_shopify_import-1.csv',
  'antique_furniture_shopify_import_table2.csv',
  'antique_furniture_shopify_import_table3.csv'
];

// Load and parse CSV files
function loadItems() {
  const items = new Map();

  CSV_FILES.forEach(file => {
    const filePath = path.join(__dirname, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    records.forEach(record => {
      const handle = record.Handle;
      if (handle && !items.has(handle)) {
        // Only store the first occurrence (main product data)
        items.set(handle, {
          handle: handle,
          title: record.Title,
          description: record['Body (HTML)'],
          price: record['Variant Price'],
          imageUrl: record['Image Src'],
          sku: record['Variant SKU'],
          type: record.Type,
          tags: record.Tags
        });
      }
    });
  });

  return Array.from(items.values());
}

// API Routes

// Get all items
app.get('/api/items', async (req, res) => {
  try {
    const items = loadItems();
    const decisions = await database.loadDecisions();

    // Attach decision status to each item
    const itemsWithStatus = items.map(item => ({
      ...item,
      decision: decisions[item.handle] || null
    }));

    res.json(itemsWithStatus);
  } catch (error) {
    console.error('Error loading items:', error);
    res.status(500).json({ error: 'Failed to load items' });
  }
});

// Get progress
app.get('/api/progress', async (req, res) => {
  try {
    const items = loadItems();
    const decisions = await database.loadDecisions();

    const total = items.length;
    const completed = Object.keys(decisions).length;
    const toDelete = Object.values(decisions).filter(d => d === 'delete').length;
    const toKeep = Object.values(decisions).filter(d => d === 'keep').length;

    res.json({
      total,
      completed,
      remaining: total - completed,
      toDelete,
      toKeep,
      percentComplete: Math.round((completed / total) * 100)
    });
  } catch (error) {
    console.error('Error getting progress:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Save decision
app.post('/api/decision', async (req, res) => {
  try {
    const { handle, decision } = req.body;

    if (!handle || !decision || !['keep', 'delete'].includes(decision)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    await database.saveDecision(handle, decision);

    res.json({ success: true });
  } catch (error) {
    console.error('Error saving decision:', error);
    res.status(500).json({ error: 'Failed to save decision' });
  }
});

// Export results as CSV
app.get('/api/export', async (req, res) => {
  try {
    const items = loadItems();
    const decisions = await database.loadDecisions();

    const itemsToDelete = items.filter(item => decisions[item.handle] === 'delete');

    // Create CSV content
    let csv = 'Handle,Title,SKU,Type,Decision\n';
    itemsToDelete.forEach(item => {
      csv += `"${item.handle}","${item.title}","${item.sku}","${item.type}","delete"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=items-to-delete.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting:', error);
    res.status(500).json({ error: 'Failed to export' });
  }
});

// Start server - connect to MongoDB first
async function startServer() {
  try {
    // Connect to MongoDB
    await database.connect();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);
      console.log(`\n📱 Client view: http://localhost:${PORT}/index.html`);
      console.log(`👀 Admin view: http://localhost:${PORT}/admin.html\n`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\nShutting down gracefully...');
      await database.close();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
