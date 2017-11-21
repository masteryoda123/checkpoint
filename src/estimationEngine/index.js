var millisecondsPerMinute = 60 * 1000;
var fourtyFiveMinutes = 45 * millisecondsPerMinute;

function run(paramToTotalTime, flight) {
    var keys = Object.keys(paramToTotalTime);
    var totalTime;
    var timeToArriveAtGate = (flight.estimated_departure_time.epoch * 1000) - fourtyFiveMinutes;
    console.log("EST DEPARTURE TIME IS: " + (flight.estimated_departure_time.epoch * 1000));
    console.log("IN PEOPLE TIME, THAT'S: " + formatOutput(flight.estimated_departure_time.epoch * 1000));
    console.log("TIME TO ARRIVE AT GATE IS: " + timeToArriveAtGate);
    console.log("IN PEOPLE TIME, THAT'S: " + formatOutput(timeToArriveAtGate));
    var multiplier;

    // TODO: for now, we're just adding all events up. Incomplete implementation
    totalTime = keys.reduce(function(runningSum, key) {
      // make sure this isn't the boarding time we're adding up. 
      console.log("RUNNING SUM IS: " + runningSum);
      console.log("KEY IS: " + key);
      console.log("PARAMTOTOTALTIME[" + key + "] IS: " + paramToTotalTime[key]);
      if ((key.toString() == "weather")) {
        multiplier = paramToTotalTime[key];
        console.log("MAPPING " + paramToTotalTime[key] + " TO MULTIPLIER");
        // + 0 to show intentionality. it's not "clean" but showing that we are just updating the multiplier
        return runningSum + 0;
      } else {
        return runningSum + paramToTotalTime[key];
      }
    }, 0);

    console.log("TOTAL TIME IS: " + totalTime);
    console.log("RETURNING: " + (timeToArriveAtGate - (totalTime * multiplier)));
    console.log("IN PEOPLE TERMS THAT'S: " + formatOutput(timeToArriveAtGate  - (totalTime * millisecondsPerMinute * multiplier))); 
    return formatOutput(timeToArriveAtGate  - (totalTime * millisecondsPerMinute * multiplier)); 
}

function formatOutput(timeToLeaveInMilliseconds) {
    return new Date(timeToLeaveInMilliseconds);
}

module.exports = {
    run: run, 
    formatOutput: formatOutput
};
