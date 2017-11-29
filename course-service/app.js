'use strict';

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./db');

//================== middleware ==================
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('client'));

app.get('/api', (req, res) => {
  res.end('Welcome you')
})

app.get('/api/courses/:name', (req, res) => {
  const name = req.params.name;

  getCourse(name, (err, body) => {
    if (!err) res.json(body);
  })
})

app.get('/api/courses', (req, res) => {
  db.courses.find({}, (err, courses) => {
    return res.json(courses);
  })
})

app.post('/api/courses/:name', (req, res) => {
  const name = req.params.name;

  getCourse(name, (err, body) => {
    if (!err) {
      if (body.code && body.message) {
        return res.json({success: false, message: body.message});
      } else {
        const course = {...body, alias: name, done: false};

        db.courses.find({alias: name}, (err, docs) => {
          if (err) throw new Error(err);

          if (docs.length > 0) {
            return res.json({success: true});
          }

          db.courses.insert(course, () => {
            return res.json({success: true});
          });
        })
      }
      // call to download service

    }
  })
})

app.post('/api/courses/:name/done', (req, res) => {
  const name = req.params.name;

  db.courses.findOne({alias: name}, (err, doc) => {
    if (err || !doc) throw new Error(err || 'Khong tim thay course');

    db.courses.update({_id: doc._id}, {$set: {done: true}}, {}, () => {
      return res.json({success: true});
    });
  })
})

app.get('/api/courses/:name/sources', (req, res) => {
  const name = req.params.name;

  getCourse(name, (err, body) => {
    if (err) throw new Error(err);

    const sourceVideos = body.lessonData
      .map(lession => lession.sourceBase)
      .map(sourceUrl => sourceUrl + '/source?r=720&f=webm');

    return res.json(sourceVideos);
  })
})

app.post('/api/sources', (req, res) => {
  const source_url = req.body.origin;

  getUtilSuccess(source_url)
    .then(url => {
      res.json({url: url});
    })
})

app.get('/api/courses/:course_name/uploaded-videos', (req, res) => {
  const course_name = req.params.course_name;

  db.videos.find({course_name: course_name}, (err, newVideo) => {
    if (err) return res.send('err');

    return res.json(newVideo);
  })
})

app.post('/api/courses/:course_name/uploaded-videos', (req, res) => {
  const video = {
    course_name: req.params.course_name,
    name: req.body.name,
    url: req.body.url
  }

  db.videos.insert(video, (err, newVideo) => {
    if (err) return res.send('err');

    return res.json(newVideo);
  })
})

app.get('*', (req, res) => {
 res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

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

const getCourse = (name, cb) => {
  const options = {...baseOptions};
  options.method = 'GET';
  options.url = 'https://api.frontendmasters.com/v1/kabuki/courses/' + name;

  request(options, function(error, response, body) {
    if (error) return cb(error);

    return cb(null, body);
  });
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

// https://api.frontendmasters.com/v1/kabuki/video/nn1q5tywuy/source?r=720&f=webm

// get list video from course name
//https://api.frontendmasters.com/v1/kabuki/courses/es6-right-parts
//https://api.frontendmasters.com/v1/kabuki/courses/functional-javascript-v2

app.listen(PORT, (err) => {
  if (!err) console.log('server is listening on', PORT);
})
