var q = require('q');

var engine = require('../estimationEngine');
var wApi = require('../apis/weatherUnderground');
var gmApi = require('../apis/googleMaps');
var gmProcessor = require('./../apis/googleMapsProcessor');

/**
 * This is a mapping between input param
 * to the reference of function handler
 */
var INPUT_PARAMS_TO_API_CALL = {
    directions: gmApi.getDirections
};

/**
 * This is a list of mappers that map from API responses
 * to time taken.
 */
var API_RESULT_TO_TRAVEL_TIME_MAPPERS = {
    directions: gmProcessor.getTotalTimeFromDirections
};

function testWeather() {
    return wApi.getWeather().then(function(result) {
        console.log(result);
        return result;
    });
}


function process(input) {
    var promises = [];
    var paramToIndex = {};
    var keys = Object.keys(input);
    keys.forEach(function(key, index) {
        var promiseHandler = INPUT_PARAMS_TO_API_CALL[key];
        promises.push(promiseHandler(input[key]));
        paramToIndex[key] = index;
    });

    return q.all(promises).then(function(data) {
        var paramToTotalTime = mapApiResponses(data, paramToIndex, keys);
        return engine.run(paramToTotalTime);
    }).catch(function(err) {
        throw err;
    });
}

function mapApiResponses(data, paramToIndex, keys) {
    var paramToTotalTime = {};
    keys.forEach(function(key) {
        var mapper = API_RESULT_TO_TRAVEL_TIME_MAPPERS[key];
        var dataIndex = paramToIndex[key];
        var apiResponse = data[dataIndex];
        paramToTotalTime[key] = mapper(apiResponse);
    });
    return paramToTotalTime;
}


module.exports = {
    process: process,
    testWeather: testWeather
};
