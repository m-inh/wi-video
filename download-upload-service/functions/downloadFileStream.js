let http = require('http');
let https = require('https');
let request = require('request');
let fs = require('fs');
let config = require('config');
let path = require('path');

function downloadFile(streamUrl, callback) {
    let file = fs.createWriteStream(path.join(config.app.videoTmp, 'videoTemp.webm'));
    https.get(streamUrl, function (response) {
        let stream = response.pipe(file);
        stream.on('finish', function () {
            callback();
        });
    });
}

module.exports = {
    downloadFile: downloadFile
}
