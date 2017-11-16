var _ = require('lodash');

/**
 * @typedef {Object} Flight
 * @property {string} ident - flight number (identification)
 * @property {boolean} cancelled - has flight been cancelled
 * @property {string} origin.code - origin airport code
 * @property {string} origin.city - origin airport city
 * @property {string} origin.name - origin airport name
 * @property {string} destination.code - destination airport code
 * @property {string} destination.city - destination airport city
 * @property {string} destination.name - destination airport name
 * @property {number} filed_departure_time.epoch - scheduled departure time (epoch)
 * @property {number} estimated_departure_time.epoch - estimated departure time (epoch)
 * @property {number} estimated_blockout_time.epoch - estimated time the plane will leave the gate (epoch)
 */

/**
 * @typedef {Object} FlightInfoResponse
 * @property {Flight[]} FlightInfoStatusResult.flights
 * @property {string} error - error message (only exists if there is an error in the API call)
 */

/**
 * This processes API result directions returned by Google Maps
 * directions API
 *
 * Documentation:
 * {@link https://flightaware.com/commercial/flightxml/v3/content.rvt}
 *
 * @param {FlightInfoResponse} flightInfoResponse - flightInfoResponse from FlightAware
 * @returns {Flight} flightInfo
 */
function getFlightInfo(flightInfoResponse) {
    if (flightInfoResponse.error) {
        throw new Error(flightInfoResponse.error);
    }

    /** @type {Flight} */
    var flight = flightInfoResponse.FlightInfoStatusResult.flights[0];
    return flight.estimated_blockout_time.epoch;
}

module.exports = {
    getFlightInfo: getFlightInfo
};
