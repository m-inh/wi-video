let express = require('express');
let router = express.Router();
let asyncEach = require('node-async-loop');
let drive = require('../functions/drive');
let path = require('path');

router.get('/list/all', function (req, res) {
    let response = new Object();
    response.result = new Array();
    let folderName = "course";
    drive.findFolderByName(req.auth, folderName, function (err, folderId) {
        if (err) console.log("Search folder failed : ", err);
        if (folderId) {
            console.log("Found folder : ", folderId);
            drive.findFiles(req.auth, folderId, function (err, folders) {
                if (err) console.log(err);
                asyncEach(folders.files, function (folder, next) {
                    let myFolder = new Object();
                    myFolder.name = folder.name;
                    myFolder.mimeType = folder.mimeType;
                    myFolder.id = folder.id;
                    myFolder.url = "https://drive.google.com/drive/folders/" + folder.id;
                    myFolder.files = new Array();
                    drive.findFiles(req.auth, folder.id, function (err, files) {
                        asyncEach(files.files, function (file, next) {
                            let myFile = new Object();
                            myFile.name = file.name;
                            myFile.mimeType = file.mimeType;
                            myFile.id = file.id;
                            myFile.url = "https://drive.google.com/file/d/" + file.id + "/view";
                            myFolder.files.push(myFile);
                            next();
                        }, function () {
                            next();
                        });
                    });
                    response.result.push(myFolder);
                }, function () {
                    res.send(response);
                });
            });
        } else {
            res.json({result: "NO FOLDER FOUND BY NAME " + folderName});
        }
    });
});

router.get('/list/:folderName', function (req, res) {
    let response = {};
    response.result = new Array();
    let folderName = req.params.folderName;
    drive.findFolderByName(req.auth, folderName, function (err, folderId) {
        if (err) return res.send(err);
        if (folderId) {
            drive.findFiles(req.auth, folderId, function (err, files) {
                asyncEach(files.files, function (file, next) {
                    let myFile = new Object();
                    myFile.name = file.name;
                    myFile.mimeType = file.mimeType;
                    myFile.id = file.id;
                    myFile.url = "https://drive.google.com/open?id=" + file.id;
                    response.result.push(myFile);
                    next();
                }, function () {
                    res.send(response);
                })
            });
        } else {
            res.json({result: "No folder found by name : " + folderName});
        }

    })
});

module.exports = router;