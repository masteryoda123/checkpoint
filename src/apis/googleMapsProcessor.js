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
    console.log('directionResponse');
    console.log(directionResponse);
    var routes = directionResponse.routes;
    console.log('routes');
    console.log(routes);
    var totalTimes = routes.map(function(route) {
        console.log('route');
        console.log(route);
        var totalTime = route.legs.reduce(function(runningSum, leg) {
            console.log('leg');
            console.log(leg);
            return runningSum + leg.duration.value;
        }, 0);
        return totalTime;
    });

    return _.min(totalTimes) / 60;
}

/**
 * This process API result directions returned by Google Maps
 * directions API to get the relevant data to be displayed in
 * the UI
 *
 * @param directionResponse
 * @return {Object} object containing necessary data for the UI
 */
function getDataForUI(directionResponse) {
    var output = {
        travelTime: getTotalTimeFromDirections(directionResponse)
    };
    return output;
}

module.exports = {
    getTotalTimeFromDirections: getTotalTimeFromDirections,
    getDataForUI: getDataForUI
};