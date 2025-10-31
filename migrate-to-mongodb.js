require('dotenv').config();
const fs = require('fs');
const database = require('./database');

const DECISIONS_FILE = 'decisions.json';

async function migrate() {
  try {
    console.log('🔄 Starting migration from decisions.json to MongoDB...\n');

    // Check if decisions.json exists
    if (!fs.existsSync(DECISIONS_FILE)) {
      console.log('❌ decisions.json not found. Nothing to migrate.');
      return;
    }

    // Connect to MongoDB
    await database.connect();

    // Load decisions from JSON file
    const decisions = JSON.parse(fs.readFileSync(DECISIONS_FILE, 'utf-8'));
    const entries = Object.entries(decisions);

    if (entries.length === 0) {
      console.log('ℹ️  decisions.json is empty. Nothing to migrate.');
      await database.close();
      return;
    }

    console.log(`📦 Found ${entries.length} decisions to migrate\n`);

    let successCount = 0;
    let failCount = 0;

    // Migrate each decision
    for (const [handle, decision] of entries) {
      try {
        await database.saveDecision(handle, decision);
        successCount++;
        process.stdout.write(`✓ Migrated: ${handle}\r`);
      } catch (error) {
        console.error(`\n❌ Failed to migrate ${handle}:`, error.message);
        failCount++;
      }
    }

    console.log(`\n\n✅ Migration complete!`);
    console.log(`   - Successfully migrated: ${successCount}`);
    if (failCount > 0) {
      console.log(`   - Failed: ${failCount}`);
    }

    // Close connection
    await database.close();

    console.log('\n💡 Tip: You can now delete decisions.json or keep it as a backup.\n');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
