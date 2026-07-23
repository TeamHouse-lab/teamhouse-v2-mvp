/**
 * Script de test pour toutes les fonctions Airtable
 * Exécuter avec: npx tsx scripts/test-airtable.ts
 */

import {
  getHebergements,
  getHebergementById,
  getActivites,
  getActiviteById,
  getSejoursByClient,
  testConnection,
} from '../lib/airtable';

async function main() {
  console.log('🧪 Testing Airtable functions...\n');

  try {
    // Test 1: Connection
    console.log('1️⃣  Testing connection...');
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Connection failed');
      process.exit(1);
    }
    console.log('✅ Connection OK\n');

    // Test 2: getHebergements
    console.log('2️⃣  Testing getHebergements()...');
    const hebergements = await getHebergements({ limit: 3 });
    console.log(`✅ Found ${hebergements.length} hebergements`);
    if (hebergements[0]) {
      console.log(`   Example: ${hebergements[0].fields.Nom}`);
      console.log(`   Fields: ${Object.keys(hebergements[0].fields).slice(0, 5).join(', ')}...\n`);
    }

    // Test 3: getHebergementById
    if (hebergements[0]) {
      console.log('3️⃣  Testing getHebergementById()...');
      const heb = await getHebergementById(hebergements[0].id);
      console.log(`✅ Retrieved: ${heb.fields.Nom}\n`);
    }

    // Test 4: getActivites
    console.log('4️⃣  Testing getActivites()...');
    const activites = await getActivites({ limit: 3 });
    console.log(`✅ Found ${activites.length} activites`);
    if (activites[0]) {
      console.log(`   Example: ${activites[0].fields.Nom}`);
      console.log(`   Fields: ${Object.keys(activites[0].fields).slice(0, 5).join(', ')}...\n`);
    }

    // Test 5: getActiviteById
    if (activites[0]) {
      console.log('5️⃣  Testing getActiviteById()...');
      const act = await getActiviteById(activites[0].id);
      console.log(`✅ Retrieved: ${act.fields.Nom}\n`);
    }

    // Test 6: getSejoursByClient (won't find any, but should not error)
    console.log('6️⃣  Testing getSejoursByClient()...');
    const sejours = await getSejoursByClient('test@example.com');
    console.log(`✅ Query executed, found ${sejours.length} sejours\n`);

    console.log('✨ All Airtable tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main();
