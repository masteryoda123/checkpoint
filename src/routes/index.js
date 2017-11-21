var express = require('express');
var HttpStatus = require('http-status-codes');

var controller = require('../controller');
var wt = require('./../apis/checkpointWaitTimes.js');
var wtp = require('./../apis/checkpointWaitTimesProcessor.js');
var estimationEngine = require('./../estimationEngine/index.js');

var router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/test', function(req, res) {
  res.send("Test Successful");
});

router.get('/checkpoint_wait_time', function(req, res) {
    var airport = 'ATL';

    wt.getCheckpointWaitTimes(airport).then(waitTimes => {
        res.send("wait time is: " + wtp.getCheckpointWaitTime(waitTimes).toPrecision(2) + " minutes for " + airport);
    }).catch(err => {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send("Server error: " + err);
    });

});

router.get('/calton', (req, res) => {
    var input = {
        directions: {
            origin: '120 North Ave NW, Atlanta, GA',
            destination: '6000 N Terminal Pkwy, Atlanta, GA'
        }, 
        weather: {
          airportCode: "LAS", 
          airportState: "NV",
          time: 1509553404000
        }, 
        waitTimes: "LAS",
    };

    var flightNumber = 'DL1580';


    controller.getFlight(flightNumber).then(function(flight) {
        input.weather.airportCode = flight.origin.code.slice(1)  ;
        input.weather.time = flight.estimated_departure_time.epoch;
        input.waitTimes = flight.origin.code.slice(1);
        console.log("ORIGIN CODE: " + flight.origin);
        controller.process(input, flight).then(function(timeToLeave) {
            res.status(HttpStatus.OK);
            res.send("YOU SHOULD LEAVE AT: " + timeToLeave);
        }).catch(function(err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            res.send("Server erro: " + err);
        });
    });

});

router.get('/est', function(req, res) {
  var someTime = 1509553404000;
  res.send(estimationEngine.formatOutput(someTime));
});

router.get('/weather', function(req, res) {
    //controller.testWeather().then(function(result) {
        res.send('test for weather');
    //});
});

router.get('/flight', function(req, res) {
    var flightNumber = {
        flightNumber: 'DL2611'
    };

    controller.getFlight(flightNumber).then(function(flight) {
        res.status(HttpStatus.OK);
        res.send(flight);
    }).catch(function(err) {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send('Server error: ' + err);
    });
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
        res.send('Server error: ' + err);
    });
});

module.exports = router;
