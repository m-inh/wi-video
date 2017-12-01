'use strict';

const request = require("request");

const baseOptions = {
  headers: {
    'postman-token': '205d5329-d628-7702-2e8a-afb8865330ef',
     'cache-control': 'no-cache',
     cookie: 'edd_wp_session=b96a513742a94b4392c7eb6dc452ea59%7C%7C1512158120%7C%7C1512156320; wordpress_logged_in_323a64690667409e18476e5932ed231e=bdhoang.ht_gmail.com%7C1513324520%7Cetu85nH27kcZ1BOBTOqOMkaEIq0IevB6OR1wBBjXgPU%7C6897bece951a21180c4e85421be5032dff03d940c2602b5ce7c7be26f4f11318; _ga=GA1.2.1047265518.1512114861; _gid=GA1.2.1839940612.1512114861; intercom-id-w1ukcwje=8320388d-9b77-445b-a2bf-6232bfdb442d',
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
        console.log('retry', times);
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
