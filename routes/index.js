var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

var config = require('../config');

/* GET home page. */
router.get('/', function (req, res) {
    // redirect to index.html to use angular.js
    res.redirect('/index.html');
});

router.post('/add', function (req, res) {

    var time = req.body.time + '';
    var station = req.body.station + '';
    var report = req.body.report + '';

    MongoClient.connect(config.mongodb, {
        db: {
            native_parser: true,
            w: 1
        }
    }, function (err, db) {
        if (err) {
            throw err;
        }

        var collection = db.collection('reports');

        // TODO integrity check

        collection.insertOne({
            time: time,
            station: station,
            report: report
        }, function(err) {
            if (err) {
                res.status(500);
            } else {
                res.status(200);
            }
        });

    });
});

router.get('/recent', function(req, res) {

    MongoClient.connect(config.mongodb, {
        db: {
            native_parser: true,
            w: 1
        }
    }, function (err, db) {
        if (err) {
            throw err;
        }

        var collection = db.collection('reports');

        collection.find().sort({
            time: -1
        }).limit(10).toArray(function(err, reports) {
            if (err) {
                res.status(500);
            } else {
                res.status(200).send(reports);
            }
        });

    });

});

router.get('/q/:time/:station', function(req, res) {

    var time = req.params.time + '';
    var station = req.params.station + '';

    MongoClient.connect(config.mongodb, {
        db: {
            native_parser: true,
            w: 1
        }
    }, function (err, db) {
        if (err) {
            throw err;
        }

        var collection = db.collection('reports');

        // TODO integrity check

        collection.findOne({
            time: time,
            station: station
        }, function(err, report) {
            if (err) {
                res.status(500);
            } else {
                res.status(200).send(report);
            }
        });

    });

});

module.exports = router;
