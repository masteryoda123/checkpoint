var _ = require('lodash');

/**
 * @typedef {Object} Flight
 * @property {string} ident - flight number (identification)
 * @property {boolean} cancelled - has flight been cancelled
 * @property {string} origin.code - origin airport code
 * @property {string} origin.city - origin airport city
 * @property {string} origin.airport_name - origin airport name
 * @property {string} destination.code - destination airport code
 * @property {string} destination.city - destination airport city
 * @property {string} destination.airport_name - destination airport name
 * @property {number} filed_departure_time.epoch - scheduled departure time (epoch)
 * @property {number} estimated_departure_time.epoch - estimated departure time (epoch)
 * @property {number} estimated_blockout_time.epoch - estimated time the plane will leave the gate (epoch)
 * @property {number} filed_blockout_time.epoch - scheduled departure time from gate (epoch)
 * @property {number} departure_delay - length of delay in seconds
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
 * @param {string} airportCode - Origin Airport Code
 * @returns {Flight} flightInfo
 */
function getFlightInfo(flightInfoResponse, airportCode) {
    if (flightInfoResponse.error) {
        throw new Error(flightInfoResponse.error);
    }

    /** @type {Flight[]} */
    var flights = flightInfoResponse.FlightInfoStatusResult.flights;
    /** @type {Flight[]} */
    var relevantFlights = flights.filter(function(flight) {
        /** @type {number} */
        var now = (new Date()).getTime() / 1000;
        return now < flight.estimated_departure_time.epoch &&
            flight.origin.code.toLowerCase().includes(airportCode.toLowerCase());
    });
    console.log('flights');
    console.log(flights);
    console.log('relevantFlights');
    console.log(relevantFlights);
    if (relevantFlights.length <= 0) {
        throw new Error('Flight not found for the given flight and airport code');
    }
    relevantFlights.sort(function(flight1, flight2) {
        return flight1.estimated_departure_time.epoch - flight2.estimated_departure_time.epoch;
    });
    /** @type {Flight} */
    var flight = relevantFlights[0];
    return flight;
}

/**
 * This process API result directions returned by Flight Aware
 * flight info API to get the relevant data to be displayed in
 * the UI
 *
 * @param {Flight} flight the relevant flight
 * @return {Object} object containing necessary data for the UI
 */
function getDataForUI(flight) {
    var output = {
        flightNumber: flight.ident,
        airportOriginCode: flight.origin.code,
        airportOriginCity: flight.origin.city,
        airportOriginName: flight.origin.airport_name,
        airportDestinationCode: flight.destination.code,
        airportDestinationCity: flight.destination.city,
        airportDestinationName: flight.destination.airport_name,
        estimatedDepartureTime: flight.estimated_departure_time.epoch,
        filedDepartureTime: flight.filed_departure_time,
        departureDelay: flight.departure_delay
    };
    return output;
}


module.exports = {
    getFlightInfo: getFlightInfo,
    getDataForUI: getDataForUI
};
