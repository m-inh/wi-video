'use strict';

const express = require("express");
const request = require("request");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.end('Welcome you')
})

app.get('/api/courses/:name', (req, res) => {
  const name = req.params.name;

  getCourse(name, (err, body) => {
    if (!err) res.json(body);
  })
})

app.get('/api/courses/:name/sources', (req, res) => {
  const name = req.params.name;

  getCourse(name, (err, body) => {
    if (err) throw new Error(err);

    const sourceVideos = body.lessonData
      .map(lession => lession.sourceBase)
      .map(sourceUrl => sourceUrl + '?r=720&f=webm');

    res.json(sourceVideos);
  })
})

const getCourse = (name, cb) => {
  const options = {
    method: 'GET',
    url: 'https://api.frontendmasters.com/v1/kabuki/courses/' + name,
    headers: {
      'postman-token': '310f63cf-b02b-a869-84e4-9ae3bb35f733',
      'cache-control': 'no-cache',
      cookie: 'wordpress_logged_in_323a64690667409e18476e5932ed231e=tienminh.uet_gmail.com%7C1513052977%7CaqBB6q8PnFrrAFDlPtUwDMpua22N1fW1wDid1u6SFtf%7C6fe69a420b8283f2db350c353633f5b2256ed8b2690b365cf00650b2519aac06; __stripe_mid=338b2aee-c462-4079-bca8-8e9105c7fdd2; _ga=GA1.2.1520826322.1511842839; _gid=GA1.2.373345617.1511941425; intercom-id-w1ukcwje=bf8d93d3-a13a-40a4-b76c-0952b00770d7; wordpress_logged_in_323a64690667409e18476e5932ed231e=tienminh.uet_gmail.com%7C1513052977%7CaqBB6q8PnFrrAFDlPtUwDMpua22N1fW1wDid1u6SFtf%7C6fe69a420b8283f2db350c353633f5b2256ed8b2690b365cf00650b2519aac06; __stripe_mid=338b2aee-c462-4079-bca8-8e9105c7fdd2; _gat=1; _ga=GA1.2.1520826322.1511842839; _gid=GA1.2.373345617.1511941425; intercom-id-w1ukcwje=bf8d93d3-a13a-40a4-b76c-0952b00770d7',
      'accept-language': 'en-US,en;q=0.9,vi;q=0.8,la;q=0.7',
      referer: 'https://frontendmasters.com/courses/es6-right-parts/introduction/',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
      'x-devtools-emulate-network-conditions-client-id': '3cdb618b-a28c-48b7-8158-4308785489c6',
      origin: 'https://frontendmasters.com',
      accept: 'application/json, text/*'
    },
    json: true
  };

  request(options, function(error, response, body) {
    if (error) return cb(error);

    return cb(null, body);
  });
}

// https://api.frontendmasters.com/v1/kabuki/video/nn1q5tywuy/source?r=720&f=webm

// get list video from course name
//https://api.frontendmasters.com/v1/kabuki/courses/es6-right-parts
//https://api.frontendmasters.com/v1/kabuki/courses/functional-javascript-v2

app.listen(PORT, (err) => {
  if (!err) console.log('server is listening on', PORT);
})
