var request = require('request-promise');

var BASE_URL = 'http://airports.whatsbusy.com/service/';
var defaultValueForCheckpointWaitTimes = 30;

function getCheckpointWaitTimes(input) {
    var todaysDate = new Date();
    var sevenDaysAgo = new Date((todaysDate.getTime() - (60 * 60 * 24 * 7 * 1000)));

    var oneYearAgoDate = (todaysDate.getFullYear() - 1).toString() + (todaysDate.getMonth() + 1).toString() + (todaysDate.getDate() < 10 ? "0" + todaysDate.getDate().toString() : todaysDate.getDate().toString());
    var oneWeekAgoDate = sevenDaysAgo.getFullYear().toString() + (sevenDaysAgo.getMonth() + 1).toString() + (sevenDaysAgo.getDate() < 10 ? "0" + sevenDaysAgo.getDate().toString() : sevenDaysAgo.getDate().toString());

    var oneWeekAgo = BASE_URL + 'airports/' + input.weather.airportCode + "/" + oneWeekAgoDate + "/";
    var oneYearAgo = BASE_URL + 'airports/' + input.weather.airportCode + "/" + oneYearAgoDate + "/";

    var waitTimeResponseArray = [];

    return getEntriesFor(oneWeekAgo).then(weekEntries => {
        waitTimeResponseArray.push(weekEntries);
        return getEntriesFor(oneYearAgo).then(yearEntries => {
            waitTimeResponseArray.push(yearEntries);
            return waitTimeResponseArray;
        });
    }).catch(err => {
      return defaultValueForCheckpointWaitTimes; 
    });

}

function getEntriesFor(fullUri) {
    var options = {
      uri: fullUri,
      json: true
    };

    return getTemporaryApiKey().then(key => {
        options.qs = {
          api_key: key
        }
        return request(options);
    });
}

function getTemporaryApiKey() {
    var uri = BASE_URL + 'session_key';

    var options = {
      method: 'POST',
      uri: uri,
      json: true
    };

    return request(options);
      

}

module.exports = {
    getCheckpointWaitTimes: getCheckpointWaitTimes
};

