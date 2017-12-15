var express = require('express');
var router = express.Router();
let drive = require('../functions/drive');

router.get('/info/:id', function (req, res) {
    drive.findInfoById(req.auth, req.params.id, function (err, result) {
        res.send(result);
    });
});

module.exports = router;