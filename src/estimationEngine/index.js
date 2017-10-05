
function run(paramToTotalTime) {
    var keys = Object.keys(paramToTotalTime);
    var totalTime;

    // TODO: for now, we're just adding all events up. Incomplete implementation
    totalTime = keys.reduce(function(runningSum, key) {
        return runningSum + paramToTotalTime[key];
    }, 0);

    console.log('totalTime');
    console.log(totalTime);
    return totalTime;
}

module.exports = {
    run: run
};