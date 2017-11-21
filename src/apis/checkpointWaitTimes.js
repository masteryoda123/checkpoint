var request = require('request-promise');

var BASE_URL = 'http://airports.whatsbusy.com/service/';
var defaultValueForCheckpointWaitTimes = 30;

function getCheckpointWaitTimes(input) {
    var todaysDate = new Date();
    var sevenDaysAgo = new Date((todaysDate.getTime() - (60 * 60 * 24 * 7 * 1000)));

    var oneYearAgoDate = (todaysDate.getFullYear() - 1).toString() + (todaysDate.getMonth() + 1).toString() + (todaysDate.getDate() < 10 ? "0" + todaysDate.getDate().toString() : todaysDate.getDate().toString());
    var oneWeekAgoDate = sevenDaysAgo.getFullYear().toString() + (sevenDaysAgo.getMonth() + 1).toString() + (sevenDaysAgo.getDate() < 10 ? "0" + sevenDaysAgo.getDate().toString() : sevenDaysAgo.getDate().toString());

    var oneWeekAgo = BASE_URL + 'airports/' + input + "/" + oneWeekAgoDate + "/";
    var oneYearAgo = BASE_URL + 'airports/' + input + "/" + oneYearAgoDate + "/";

    console.log("ONE WEEK AGO: " + oneWeekAgo);
    console.log("ONE YEAR AGO: " + oneYearAgo);

    var waitTimeResponseArray = [];

    return getEntriesFor(oneWeekAgo).then(weekEntries => {
        waitTimeResponseArray.push(weekEntries);
        return getEntriesFor(oneYearAgo).then(yearEntries => {
            waitTimeResponseArray.push(yearEntries);
            return waitTimeResponseArray;
        }).catch(function(err) {
          console.log("error fetching checkpoint wait times"); 
          return null;
        });
    }).catch(err => {
        console.log("error fetching checkpoint wait times");
        return null; 
    });

}

function getEntriesFor(fullUri) {
    var options = {
      uri: fullUri,
      json: true
    };

    return getTemporaryApiKey().then(key => {
        console.log("API KEY FOR CHECKPOINT WAIT TIMES IS: " + key);
        options.qs = {
          api_key: key
        }
        console.log("fullUri is: " + fullUri);
        return request(options);
    }).catch(function(err) {
      console.log("encountered a problem while attempting to get api key for checkpoint wait times");
    });
}

function getTemporaryApiKey() {
    var uri = BASE_URL + 'session_key';

    var options = {
      method: 'POST',
      uri: uri,
      json: true
    };

    console.log("GETTING TEMP API KEY");
    return request(options);
      

}

module.exports = {
    getCheckpointWaitTimes: getCheckpointWaitTimes
};

