// id,movie_name,rating,runtime,genre,metascore,plot,directors,stars,votes,gross

import fs from 'fs';
import csv from 'csv-parser';
import token from './data/token.json' assert { type: 'json' };

const recombee = require('recombee-api-client');

const client = new recombee.ApiClient(
  'politehnica-dev',  
  token.tokenId,
// Show public token
{ 'region': 'eu-west' }
);

// console.log(client._getBaseUri());