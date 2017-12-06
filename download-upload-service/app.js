'use strict';

const express = require("express");
const request = require("request");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const drive = require('./functions/drive');
const config = require('config');
const PORT = config.app.port;
const path = require('path');
const fs = require('fs');
let oauth2Client = require('./functions/OAuth2').oAuth2Client;
let url = require('./functions/OAuth2').url;

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

let getMediaStreamRouter = require('./router/get-media-stream');
let scanDriveFilesRouter = require('./router/scan-drive-files');


fs.watchFile(path.join(config.app.videoTmp, 'videoTemp.webm'), function () {
    fs.stat(path.join(config.app.videoTmp, 'videoTemp.webm'), function (err, stats) {
        console.log("Downloaded : ", stats.size + 'kb');
    });
});


app.get('/cb', function (req, res, next) {
    let code = req.query.code;
    oauth2Client.getToken(code, function (err, tokens) {
        // console.log(tokens);
        if (!err) {
            oauth2Client.credentials = tokens;
            res.redirect('/');
            // res.send("Authentication successful! Please return to the console.");
        } else {
            res.send("Authentication fail! Please return to the console.");
        }
    });
});

app.use(function (req, res, next) {
    let currentTime = Date.now();
    if (currentTime - oauth2Client.credentials.expiry_date > 0) {
        res.json({result: "Access Token Expired!"});
        delete req.auth;
    } else {
        if (oauth2Client.credentials.refresh_token) {
            oauth2Client.refreshAccessToken(function (err, tokens) {
                oauth2Client.credentials = tokens;
                req.auth = oauth2Client;
                next();
            });
        } else {
            req.auth = oauth2Client;
            next();
        }
    }
});

app.get('/', function (req, res) {
    if (req.auth.credentials.access_token) {
        res.send(req.auth);
    } else {
        // console.log(url);
        res.redirect(url);
    }
});

//
// app.use(function (req, res, next) {
//     setInterval(function (req, res) {
//         if (req.auth.credentials.refresh_token) {
//             console.log("SET refresh");
//             oauth2Client.refreshAccessToken(function (err, tokens) {
//                 oauth2Client.credentials = tokens;
//                 req.auth = oauth2Client;
//             });
//         }
//     }, 1000 * 5);
//     next();
// });


app.get('/test', function (req, res) {
    drive.uploadFile(req.auth, '1vl2UKPxoSqenNJxFWFQ0BpvxlXvgDhDz', 'D:/youtube/videoTemp.webm', 'test.mp4', function (err, result) {
        if (err) {
            console.log(err)
            res.send(err);
        } else {
            res.send(result);
        }
    });
    // drive.createFolder(req.auth, "NewFolder", function (err, result) {
    //     if (err) {
    //         console.log(err)
    //         res.send(err);
    //     } else {
    //         res.send(result);
    //     }
    // });
});

app.use('/media', getMediaStreamRouter);
app.use('/drive', scanDriveFilesRouter);

app.listen(PORT, (err) => {
    if (!err) console.log('server is listening on', PORT);
})
