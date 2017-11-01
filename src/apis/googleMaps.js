var request = require('request-promise');

var KEY = 'AIzaSyA5HRWlQ-DMlqEwPsUtvFpe_9OsbHVhnvI';
var BASE_URL = 'https://maps.googleapis.com/maps/api/';

/**
 * @typedef {Object} Direction
 * @property {string} origin - origin address
 * @property {string} destination - destination address
 */

/**
 * Documentation:
 * {@link https://developers.google.com/maps/documentation/directions/intro}
 *
 * @param {Direction} input the input containing params for directions API.
 *        should contain 'origin' and 'destination', at the very least
 *
 * @returns {Promise} promise containing direction response
 */
function getDirections(input) {
    var uri = BASE_URL + 'directions/json';
    var options = {
        uri: uri,
        json: true
    };

    options.qs = {
        origin: input.origin,
        destination: input.destination,
        key: KEY
    };

    return request(options);
}


module.exports = {
    getDirections: getDirections
};

