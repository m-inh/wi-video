let http = require('http');
let https = require('https');
let request = require('request');
let fs = require('fs');
let config = require('config');
let path = require('path');

function downloadFile(streamUrl, callback) {
    let file = fs.createWriteStream(path.join(config.videoTmp, 'videoTemp.webm'));
    https.get(streamUrl, function (response) {
        fs.watchFile(path.join(config.videoTmp, 'videoTemp.webm'), function () {
            fs.stat(path.join(config.videoTmp, 'videoTemp.webm'), function (err, stats) {
                console.log("Downloaded : ", stats.size + 'kb');
            });
        });
        let stream = response.pipe(file);
        stream.on('finish', function () {
            callback();
        });
    });
}

module.exports = {
    downloadFile: downloadFile
}
