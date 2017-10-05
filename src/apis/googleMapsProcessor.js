var _ = require('lodash');

/**
 * This processes API result directions returned by Google Maps
 * directions API
 *
 * Documentation:
 * {@link https://developers.google.com/maps/documentation/directions/intro}
 *
 * @param directions directions response
 * @returns {number} minimum travel time from all possible routes
 */
function getTotalTimeFromDirections(directions) {
    var routes = directions.routes;
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