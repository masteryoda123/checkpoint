var _ = require('lodash');

/**
 * @typedef {Object} Leg
 * @property {number} duration.value - time taken in minutes for this leg (sub-route)
 */

/**
 * @typedef {Object} Route
 * @property {Leg[]} legs - the legs, or sub-routes, of this route.
 */

/**
 * @typedef {Object} DirectionResponse
 * @property {Route[]} routes - all possible routes to destination
 */

/**
 * This processes API result directions returned by Google Maps
 * directions API
 *
 * Documentation:
 * {@link https://developers.google.com/maps/documentation/directions/intro}
 *
 * @param {DirectionResponse} directionResponse directions response
 * @returns {number} minimum travel time in minutes among all possible routes
 */
function getTotalTimeFromDirections(directionResponse) {
    var routes = directionResponse.routes;
    var totalTimes = routes.map(function(route) {
        var totalTime = route.legs.reduce(function(runningSum, leg) {
            return runningSum + leg.duration.value;
        }, 0);
        return totalTime;
    });

    return _.min(totalTimes);
}

module.exports = {
    getTotalTimeFromDirections: getTotalTimeFromDirections
};