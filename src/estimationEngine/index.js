
function run(paramToTotalTime) {
    var keys = Object.keys(paramToTotalTime);
    var totalTime;
    var planeBoardingTime = paramToTotalTime[boardingTime];

    // TODO: for now, we're just adding all events up. Incomplete implementation
    totalTime = keys.reduce(function(runningSum, key) {
      // make sure this isn't the boarding time we're adding up. 
      if (keys.indexOf(boardingTime) != -1)
        return runningSum + paramToTotalTime[key];
    }, 0);

    // we need to format this at some point. military time is probably easiest to work with, then output the result. 
    // we could also convert to millis, do the math, then convert back to regular time
    return planeBoardingTime - totalTime;
}

module.exports = {
    run: run
};
