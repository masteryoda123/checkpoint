var fourtyFiveMinutes = 45 * 60 * 1000;

function run(paramToTotalTime) {
    var keys = Object.keys(paramToTotalTime);
    var totalTime;
    var timeToArriveAtGate = paramToTotalTime[planeDepartureTime] - fourtyFiveMinutes;
    var multiplier = paramToTotalTime[weather];

    // TODO: for now, we're just adding all events up. Incomplete implementation
    totalTime = keys.reduce(function(runningSum, key) {
      // make sure this isn't the boarding time we're adding up. 
      if ((key != planeDepartureTime) || (key != weather)) {
        return runningSum + paramToTotalTime[key];
      } 
    }, 0);

    return planeBoardingTime - (totalTime * multiplier); 
}

function formatOutput(timeToLeaveInMilliseconds) {
    return new Date(timeToLeaveInMilliseconds);
}

module.exports = {
    run: run, 
    formatOutput: formatOutput
};
