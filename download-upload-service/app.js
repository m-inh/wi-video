'use strict';

const express = require("express");
const request = require("request");

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/api', (req, res) => {
  res.end('Welcome you')
})

app.listen(PORT, (err) => {
  if (!err) console.log('server is listening on', PORT);
})
