'use strict';

const express = require("express");
const request = require("request");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const drive = require('./functions/drive');
const config = require('config');
const PORT = config.app.port;

let oauth2Client = require('./functions/OAuth2').oAuth2Client;
let url = require('./functions/OAuth2').url;

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

let getMediaStreamRouter = require('./router/get-media-stream');

app.get('/cb', function (req, res, next) {
    let code = req.query.code;
    oauth2Client.getToken(code, function (err, tokens) {
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
    req.auth = oauth2Client;
    next();
});

app.get('/', function (req, res) {
    if (req.auth.credentials.access_token) {
        res.send(req.auth);
    } else {
        res.redirect(url);
    }
});

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

app.listen(PORT, (err) => {
    if (!err) console.log('server is listening on', PORT);
})
