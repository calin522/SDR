import fs from 'fs';
import csvParser from 'csv-parser';
import { ApiClient, requests } from 'recombee-api-client';

const token = JSON.parse(fs.readFileSync('../Lab1/data/token.json', 'utf-8')).tokenId;
const client = new ApiClient('politehnica-dev', token, { region: 'eu-west' });

async function defineUserProperties() {
  try {
    await client.send(new requests.AddUserProperty('name', 'string'));
    await client.send(new requests.AddUserProperty('team', 'string'));
    await client.send(new requests.AddUserProperty('location', 'string'));
    console.log('✅ Proprietăți de utilizator definite cu succes.');
  } catch (err) {
    console.error('❌ Eroare la definirea proprietăților:', err);
  }
}

async function createUser(row) {
  const userId = row['SP ID'];
  try {
    await client.send(new requests.AddUser(userId));
    console.log(`👤 Utilizator ${userId} creat.`);

    await client.send(
      new requests.SetUserValues(
        userId,
        {
          name: row['Sales person'],
          team: row['Team'],
          location: row['Location']
        },
        { cascadeCreate: true }
      )
    );

    console.log(`✅ Datele pentru ${row['Sales person']} (ID: ${userId}) au fost trimise.`);
  } catch (err) {
    console.error(`❌ Eroare la crearea/utilizarea utilizatorului ${userId}:`, err);
  }
}

async function uploadUsers() {
  const users = [];

  fs.createReadStream('./data/people.csv')
    .pipe(csvParser())
    .on('data', (row) => users.push(row))
    .on('end', async () => {
      console.log(`📄 ${users.length} utilizatori încărcați din CSV.`);
      await defineUserProperties();

      for (const user of users) {
        await createUser(user);
      }
        console.log('🎉 Toți utilizatorii au fost procesați.');
    })
    .on('error', (error) => {
      console.error('❌ Eroare la citirea fișierului CSV:', error);});
}

uploadUsers();