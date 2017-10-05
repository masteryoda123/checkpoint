var express = require('express');
var maps = require('../apis/googleMaps');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/test', function(req, res) {
    res.send('Test success!');
});

router.get('/maps', function(req, res) {
    var mapsPromise = maps.getDirections('120 North Ave NW, Atlanta, GA', '1111 Mecaslin St NW, Atlanta, GA');
    mapsPromise
        .then(function(response) {
            res.send(JSON.stringify(response));
        }).catch(function(err) {
            console.log(err);
        });
});

module.exports = router;
