let express = require('express');
let router = express.Router();
let request = require('request');
let asyncEach = require('node-async-loop');
let downloadFile = require('../functions/downloadFileStream');

function getMedia(driveAuth, callback) {
    var options = {
        method: 'GET',
        url: 'http://localhost:3001/api/courses/functional-javascript-v2/sources',
        headers:
            {
                'postman-token': '617efd23-e777-cce3-27a5-56715d99adc9',
                'cache-control': 'no-cache'
            }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let links = JSON.parse(body);
        asyncEach(links, function (link, next) {
            let op = {
                method: 'POST',
                url: 'http://localhost:3001/api/sources',
                headers: {
                    'postman-token': '617efd23-e777-cce3-27a5-56715d99adc9',
                    'cache-control': 'no-cache'
                },
                form: {
                    'origin': link
                }
            }
            request(op, function (error, response, body) {
                body = JSON.parse(body);
                if (body.url) {
                    console.log("Successful : ", body);
                    downloadFile.downloadFile(body.url, function () {
                        next();
                    });
                } else {
                    console.log("Can't get : ", link);
                    next();
                }
            });

        }, function (err) {
            if (err) {
                console.log("Got error : ", err);
            } else {
                console.log("All DONE");
                callback();
            }
        });
    });

}

router.get('/', function (req, res) {
    getMedia(req.auth, function () {
        res.send("Done");
    });
});

module.exports = router;