import Database from "@replit/database";
import fs from 'fs';

const db = new Database();

async function exportDatabase() {
  try {
    const keys = await db.list();
    const allData = {};

    console.log(`Found ${keys.length} keys in database`);

    for (const key of keys) {
      allData[key] = await db.get(key);
    }

    fs.writeFileSync('db_export.json', JSON.stringify(allData, null, 2));
    console.log(`✓ Successfully exported ${keys.length} items to db_export.json`);
    console.log('You can now download this file from the Files panel');
  } catch (error) {
    console.error('Error exporting database:', error);
  }
}

exportDatabase();