var express = require('express');
var router = express.Router();
var youtubeStream = require('youtube-audio-stream');
var fs = require('fs');
var config = require('config');

router.get('/', function (req, res) {
    console.log(req.auth);
    res.status(200).send('Youtube API');
});

router.get('/stream/:videoId', function (req, res) {
    var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId
    try {
        youtubeStream(requestUrl).pipe(res)
    } catch (exception) {
        res.status(500).send(exception)
    }
});

router.get('/download/:videoId', function (req, res) {
    var fetchVideoInfo = require('youtube-info');
    fetchVideoInfo(req.params.videoId, function (err, videoInfo) {
        if (err) throw new Error(err);
        // console.log(videoInfo);
        var requestUrl = 'http://youtube.com/watch?v=' + req.params.videoId
        try {
            let stream = youtubeStream(requestUrl).pipe(fs.createWriteStream(config.videoTmp + videoInfo.title + '.mp3'));
            stream.on('close', function () {
                res.status(200).sendFile(config.videoTmp + videoInfo.title + '.mp3');
            });
            require('fs').watchFile(config.videoTmp + videoInfo.title + '.mp3', function () {
                fs.stat(config.videoTmp + videoInfo.title + '.mp3', function (err, stats) {
                    console.log(stats.size + 'kb');
                });
            });
        } catch (exception) {
            res.status(500).send(exception)
        }
    });
});

module.exports = router;