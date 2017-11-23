var request = require('request-promise');

var USER_NAME = 'yudaawinata';
var KEY = '03ec8343cd8301171b5fd2317a225827c14e9567';
var BASE_URL = 'http://flightxml.flightaware.com/json/FlightXML3/';


// WARNING: our key only has 500 calls a month, so please make API calls conservatively

/**
 * @typedef {Object} FlightInput
 * @property {string} flightNumber - Flight Number
 * @property {string} airportCode - Airport Code
 */

/**
 * Documentation:
 * {@link https://flightaware.com/commercial/flightxml/v3/content.rvt}
 *
 * @param {FlightInput} input the input containing params for directions API.
 * should contain 'origin' and 'destination', at the very least
 *
 * @returns {Promise} Promise containing flight info object (refer to doc)
 */
function getFlightInfo(input) {
    var uri = BASE_URL + 'FlightInfoStatus';
    var options = {
        uri: uri,
        json: true,
        auth: {
            user: USER_NAME,
            pass: KEY
        }
    };

    options.qs = {
        ident: input.flightNumber
    };
    console.log("FLIGHT AWARE: " + options.uri);
    return request(options);
}


module.exports = {
    getFlightInfo: getFlightInfo
};

