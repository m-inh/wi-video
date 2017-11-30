let express = require('express');
let router = express.Router();
let request = require('request');
let asyncEach = require('node-async-loop');
let config = require('config');
let drive = require('../functions/drive');
let downloadFile = require('../functions/downloadFileStream');
let path = require('path');
let apiSender = require('../functions/api-sender');

function getMedia(folderName, driveAuth, callback) {
    let url = config.app.courseService + '/api/courses/' + folderName + '/lessions';
    var options = {
        method: 'GET',
        url: url,
        headers:
            {
                'postman-token': '617efd23-e777-cce3-27a5-56715d99adc9',
                'cache-control': 'no-cache'
            }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        let obj = JSON.parse(body);
        console.log(obj);
        asyncEach(obj, function (ob, next) {
            let link = ob.sourceBase;
            let title = ob.title;
            let slug = ob.slug;

            apiSender.getUtilSuccess(config.app.courseService + '/api/sources').then(url => {
                console.log("Successful : ", url);
                downloadFile.downloadFile(url, function () {
                    drive.createFolder(driveAuth, folderName, function (err, folderId) {
                        let filePath = path.join(config.app.videoTmp, 'videoTemp.webm');
                        drive.uploadFile(driveAuth, folderId, filePath, slug + '.mp4', function (err, result) {
                            console.log("DONE ======================= ", folderName + " : " + slug);
                            next();
                        });
                    });
                });
            }).catch(err => {
                console.log("API SENDER ERROR : ", err);
            });
            // let op = {
            //     method: 'POST',
            //     url: config.app.courseService + '/api/sources',
            //     headers: {
            //         'postman-token': '617efd23-e777-cce3-27a5-56715d99adc9',
            //         'cache-control': 'no-cache'
            //     },
            //     form: {
            //         'origin': link
            //     }
            // }
            // request(op, function (error, response, body) {
            //     body = JSON.parse(body);
            //     if (body.url) {
            //         console.log("Successful : ", body);
            //         downloadFile.downloadFile(body.url, function () {
            //             drive.createFolder(driveAuth, folderName, function (err, folderId) {
            //                 let filePath = path.join(config.app.videoTmp, 'videoTemp.webm');
            //                 drive.uploadFile(driveAuth, folderId, filePath, slug + '.mp4', function (err, result) {
            //                     console.log("DONE ======================= ", folderName + " : " + slug);
            //                     next();
            //                 });
            //             });
            //         });
            //     } else {
            //         console.log("Can't get : ", link);
            //         next();
            //     }
            // });

        }, function (err) {
            if (err) {
                console.log("Got error : ", err);
                callback();
            } else {
                console.log("All DONE");
                callback();
            }
        });
    });

}

router.get('/:topic', function (req, res) {
    let folderName = req.params.topic;
    res.status(200).json({success: true});
    getMedia(folderName, req.auth, function () {
        let myURL = config.app.courseService + '/api/courses/' + folderName + '/done';
        var options = {
            method: 'POST',
            url: myURL,
            headers:
                {
                    'postman-token': '4988ad6a-c616-19ea-ad27-e47ce554b869',
                    'cache-control': 'no-cache',
                    'content-type': 'application/x-www-form-urlencoded'
                },
            form: {}
        };
        request(options, function (error, response, body) {
            if (error) console.log(error);
            console.log("DONE ALL");
        });
    });
});

module.exports = router;