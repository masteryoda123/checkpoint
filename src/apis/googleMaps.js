var request = require('request-promise');

var KEY = 'AIzaSyA5HRWlQ-DMlqEwPsUtvFpe_9OsbHVhnvI';
var BASE_URL = 'https://maps.googleapis.com/maps/api/';

/**
 * Documentation:
 * {@link https://developers.google.com/maps/documentation/directions/intro}
 *
 * @param input the input containing params for directions API.
 * should contain 'origin' and 'destination', at the very least
 *
 * @returns directions object (refer to doc)
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

