//id,movie_name,rating,runtime,genre,metascore,plot,directors,stars,votes,gross


import fs from 'fs';
import * as csv from 'csv';
import csvParser from 'csv-parser';
import { ApiClient, requests } from 'recombee-api-client';

const token = JSON.parse(fs.readFileSync('./data/token.json', 'utf-8')).tokenId;

const client = new ApiClient(
    'politehnica-dev',
    token,
    { region: 'eu-west' }
);

async function createData(row) {
        const addRow = new requests.AddItem(row.id);
        const addItem = new requests.SetItemValues(row.id, {
            movie_name: row.movie_name,
            index: row.id,
            rating: parseFloat(row.rating),
            runtime: row.runtime,
            genre: row.genre,
            metascore: parseInt(row.metascore) || null,
            plot: row.plot,
            directors: row.directors,
            stars: row.stars,
            votes: parseInt(row.votes) || null,
            gross: row.gross
        }, { cascadeCreate: true });

        await client.send(addRow)
            .then(() => {
                console.log(`Item ${row.id} created.`);
            })
            .catch((error) => {
                console.error(`Error ensuring item ${row.id}:`, error);
            });

        await client.send(addItem)
            .then(() => {
                console.log(`Movie ${row.movie_name} with id ${row.id} added successfully!`);
            })
            .catch((error) => {
                console.error(`Error adding item ${row.id}:`, error);
            });
}

const rows = [];

fs.createReadStream("data/Top_Movies.csv", { encoding: "utf-8" })
    .pipe(csvParser())
    .on("data", (row) => {
        rows.push(row);
    })
    .on("end", async () => {
        for (const row of rows) {
            await createData(row);
        }
        console.log("Final!");
    })
    .on("error", (error) => {
        console.error("Error reading CSV file:", error);
    });