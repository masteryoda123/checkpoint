var express = require('express');
var HttpStatus = require('http-status-codes');

var controller = require('../controller');

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/test', function(req, res) {
    res.send('Test success!');
});

router.get('/maps', function(req, res) {
    var input = {
        directions: {
            origin: '120 North Ave NW, Atlanta, GA',
            destination: '1111 Mecaslin St NW, Atlanta, GA'
        }
    };
    
    var controllerPromise = controller.process(input);
    controllerPromise.then(function(timeEstimationResult) {
        res.status(HttpStatus.OK);
        res.send('Total Time: ' + timeEstimationResult);
    }).catch(function(err) {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send('Server error');
    });
});

module.exports = router;
