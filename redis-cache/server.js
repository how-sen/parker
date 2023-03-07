const express = require('express');
const responseTime = require('response-time')
const axios = require('axios');
const redis = require('redis');

const app = express();

// create and connect redis client to local instance.
const client = redis.createClient();

// Print redis errors to the console
client.on('error', (err) => {
  console.log("Error " + err);
});

// use response-time as a middleware
app.use(responseTime());