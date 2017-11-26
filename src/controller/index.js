var q = require('q');

var engine = require('../estimationEngine');

var wApi = require('../apis/weatherUnderground');
var wProcessor = require('../apis/weatherUndergroundProcessor');

var flightAwareApi = require('../apis/flightAware');
var flightAwareProcessor = require('./../apis/flightAwareProcessor');

var gmApi = require('../apis/googleMaps');
var gmProcessor = require('./../apis/googleMapsProcessor');

var wtApi = require('./../apis/checkpointWaitTimes.js');
var wtProcessor = require('./../apis/checkpointWaitTimesProcessor.js');

/**
 * This is a mapping between input param
 * to the reference of function handler
 */
var INPUT_PARAMS_TO_API_CALL = {
    directions: gmApi.getDirections,
    weather: wApi.getWeather, 
    waitTimes: wtApi.getCheckpointWaitTimes
};

/**
 * This is a list of mappers that map from API responses
 * to time taken.
 */
var API_RESULT_TO_TRAVEL_TIME_MAPPERS = {
    directions: gmProcessor.getTotalTimeFromDirections,
    weather: wProcessor.calcWeatherDelays, 
    waitTimes: wtProcessor.getCheckpointWaitTime
};

var GET_DATA_FOR_UI_MAPPERS = {
    directions: gmProcessor.getDataForUI,
    weather: wProcessor.getDataForUI,
    waitTimes: wtProcessor.getDataForUI
};


/**
 * Uses FlightAware API to get flight details, given a flight number
 * @param {FlightInput} flightInput
 * @return {Promise} promise containing flight
 */
function getFlight(flightInput) {
    return flightAwareApi.getFlightInfo(flightInput).then(function(flightInfoResponse) {
        return flightAwareProcessor.getFlightInfo(flightInfoResponse, flightInput.airportCode);
    });
}


function process(input, flight, checkIn, baggage) {
    var promises = [];
    var paramToIndex = {};
    var keys = Object.keys(input);
    keys.forEach(function(key, index) {
        var promiseHandler = INPUT_PARAMS_TO_API_CALL[key];
        promises.push(promiseHandler(input[key]));
        paramToIndex[key] = index;
    });

    return q.all(promises).then(function(data) {
        var mappedResponses = mapApiResponses(data, paramToIndex, keys);
        var estimatedLeaveTime = engine.run(mappedResponses.paramToTotalTime, flight, checkIn, baggage);
        return {
            estimatedLeaveTime: estimatedLeaveTime,
            dataForUI: mappedResponses.dataForUI
        };
    }).catch(function(err) {
        throw err;
    });
}

function mapApiResponses(data, paramToIndex, keys) {
    var output = {
        paramToTotalTime: null,
        dataForUI: null
    };
    var paramToTotalTime = {};
    var dataForUI = {};
    keys.forEach(function(key) {
        var mapper = API_RESULT_TO_TRAVEL_TIME_MAPPERS[key];
        var uiDataMapper = GET_DATA_FOR_UI_MAPPERS[key];
        var dataIndex = paramToIndex[key];
        var apiResponse = data[dataIndex];
        paramToTotalTime[key] = mapper(apiResponse);
        dataForUI[key] = uiDataMapper(apiResponse);
    });
    output.paramToTotalTime = paramToTotalTime;
    output.dataForUI = dataForUI;
    return output;
}


module.exports = {
    process: process,
    getFlight: getFlight
};
