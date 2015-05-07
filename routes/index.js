var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function (req, res) {
    // redirect to index.html to use angular.js
    res.redirect('/index.html');
});

module.exports = router;
