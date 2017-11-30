'use strict';

const request = require("request");

const baseOptions = {
  headers: {
    'postman-token': '205d5329-d628-7702-2e8a-afb8865330ef',
     'cache-control': 'no-cache',
     cookie: 'wordpress_logged_in_323a64690667409e18476e5932ed231e=tienminh.uet_gmail.com%7C1513052977%7CaqBB6q8PnFrrAFDlPtUwDMpua22N1fW1wDid1u6SFtf%7C6fe69a420b8283f2db350c353633f5b2256ed8b2690b365cf00650b2519aac06; __stripe_mid=338b2aee-c462-4079-bca8-8e9105c7fdd2; _ga=GA1.2.1520826322.1511842839; _gid=GA1.2.373345617.1511941425; intercom-id-w1ukcwje=bf8d93d3-a13a-40a4-b76c-0952b00770d7',
     'accept-language': 'en-US,en;q=0.9,vi;q=0.8,la;q=0.7',
     referer: 'https://frontendmasters.com/courses/functional-javascript-v2/functional-programming/',
     'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
     'x-devtools-emulate-network-conditions-client-id': '3cdb618b-a28c-48b7-8158-4308785489c6',
     origin: 'https://frontendmasters.com',
     accept: 'application/json, text/*'
  },
  json: true
}

const getRedirectUrl = (originUrl) => {
  const options = {...baseOptions};
  options.method = 'GET';
  options.url = originUrl;
  options.followAllRedirects = false;

  return new Promise((resolve, reject) => {
    request(options, function(error, response, body) {
      if (error) return reject(error);

      // console.log('response', response);
      // console.log('=========================');
      // console.log('body', body);

      return resolve(body);
    });
  })
}

const getUtilSuccess = (originUrl, times = 0) => {
  return getRedirectUrl(originUrl)
    .then(body => {
      console.log('body', body);
      if (parseInt(body.code / 100) === 4) {
        console.log('retry', times++);
        return getUtilSuccess(originUrl, times + 1);
      } else {
        return Promise.resolve(body.url);
      }
    })
    .catch(err => {
      console.log(err);
    })
}

exports.getUtilSuccess = getUtilSuccess;
