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

router.get('/estimationResult', function(req, res) {
    var data = {
        flightNumber: 'DL1053',
        airportOriginCode: 'ATL',
        airportOriginCity: 'Atlanta',
        airportOriginName: 'Hartsfield Jackson Intl',
        airportDestinationCode: 'LAX',
        airportDestinationCity: 'Los Angeles',
        airportDestinationName: 'Los Angeles Intl',
        estimatedDepartureTime: new Date(1511561340000),
        filedDepartureTime: new Date(1511561040000),
        departureDelay: 300 / 60,
        checkpointWaitTime: 10,
        estimatedTravelTime: 25,
        estimatedLeaveTime: '2017-11-24T20:59:13.062Z'
    };
    res.status(HttpStatus.OK);
    res.render('estimationResult', data);
});

router.post('/getEstimate', function(req, res) {
    var body = req.body;
    var flightInput = {
        flightNumber: body.flightNumber.replace(/\s/g, "").toUpperCase(),
        airportCode: body.airportCode
    };
    
    var address = body.streetAddress + ', ' + body.city + ', ' + body.state + ' ' + body.zip;
    var transportMode = body.transit ? 'transit' : body.walking ? 'walking' : 'driving';
    var checkIn = body.onlineCheckIn ? false : true;
    var baggage = body.noBaggage ? false : true;
    
    var input = {
        directions: {
            origin: address,
            destination: null,
            mode: transportMode
        }, 
        weather: {
          airportCode: null,
          airportState: body.state,
          time: null
        }, 
        waitTimes: {
            waitTime: null,
            flightDateTime: null
        }
    };

    controller.getFlight(flightInput).then(function(flight) {
        input.directions.destination = flight.origin.code;
        input.weather.airportCode = flight.origin.code.slice(1);
        input.weather.time = flight.estimated_departure_time.epoch;
        input.directions.arrivalTime = flight.estimated_departure_time.epoch - (45 * 60);
        input.waitTimes.waitTime = flight.origin.code.slice(1);
        input.waitTimes.flightDate = new Date((flight.estimated_departure_time.epoch - (45 * 60)) * 1000);
        controller.process(input, flight, checkIn, baggage).then(function(output) {
            var dataForUI = output.dataForUI;
            var data = {
                flightNumber: flight.ident,
                airportOriginCode: flight.origin.code.slice(1),
                airportOriginCity: flight.origin.city,
                airportOriginName: flight.origin.airport_name,
                airportDestinationCode: flight.destination.code.slice(1),
                airportDestinationCity: flight.destination.city,
                airportDestinationName: flight.destination.airport_name,
                estimatedDepartureTime: new Date(flight.estimated_departure_time.epoch * 1000),
                filedDepartureTime: new Date(flight.filed_departure_time.epoch * 1000),
                departureDelay: Math.round(flight.departure_delay / 60),
                checkpointWaitTime: Math.round(dataForUI.waitTimes.checkpointWaitTime),
                estimatedTravelTime: Math.round(dataForUI.directions.travelTime),
                estimatedLeaveTime: output.estimatedLeaveTime,
                baggage: baggage ? 'Yes' : 'No',
                checkIn: checkIn ? 'Desk' : 'Online'
            };
            res.status(HttpStatus.OK);
            res.render('estimationResult', data);
        }).catch(function(err) {
            throw err;
        });
    }).catch(function(err) {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send("Server error: " + err);
    });
});

router.get('/test', function(req, res) {
  res.send("Test Successful");
});

router.get('/checkpoint_wait_time', function(req, res) {
    var airport = 'ATL';

    wt.getCheckpointWaitTimes(airport).then(function(waitTimes) {
        res.send("wait time is: " + wtp.getCheckpointWaitTime(waitTimes).toPrecision(2) + " minutes for " + airport);
    }).catch(function(err) {
        console.log(err);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        res.send("Server error: " + err);
    });

});

router.get('/integrationTest', function(req, res) {
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

    var flightNumber = {
        flightNumber: 'DL1580'
    };
    
    controller.getFlight(flightNumber).then(function(flight) {
        input.weather.airportCode = flight.origin.code.slice(1);
        input.weather.time = flight.estimated_departure_time.epoch;
        input.waitTimes = flight.origin.code.slice(1);
        input.directions.arrivalTime = flight.estimated_departure_time.epoch - (45 * 60);
        console.log("ORIGIN CODE: " + flight.origin);
        controller.process(input, flight).then(function(timeToLeave) {
            res.status(HttpStatus.OK);
            res.send("YOU SHOULD LEAVE AT: " + timeToLeave);
        }).catch(function(err) {
            console.log(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            res.send("Server error: " + err);
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
            destination: 'KATL'
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
