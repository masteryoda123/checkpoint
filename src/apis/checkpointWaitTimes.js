var request = require('request-promise');
var q = require('q');

var BASE_URL = 'http://airports.whatsbusy.com/service/';
var defaultValueForCheckpointWaitTimes = 30;

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

/**
 * This converts a JavaScript date into a string of acceptable
 * format by checkpoint API
 * 
 * @param date {Date} date to convert
 * @returns {string} formatted date string for checkpoint API
 */
function dateToString(date) {
    return '' + date.getFullYear() + pad(date.getMonth() + 1, 2) + pad(date.getDate(), 2) + 'T' + pad(date.getHours(), 2) +
      pad(date.getMinutes(), 2) + pad(date.getSeconds());
}

function getCheckpointWaitTimes(input) {
    var flightDate = input.flightDate;
    // var sevenDaysAgo = new Date((todaysDate.getTime() - (60 * 60 * 24 * 7 * 1000)));
    var sevenDaysAgoMilliseconds = 60 * 60 * 24 * 7 * 1000;
    var aYearAgoMilliseconds = 60 * 60 * 24 * 365 * 1000;

    // var oneYearAgoDate = (todaysDate.getFullYear() - 1).toString() + (todaysDate.getMonth() + 1).toString() + (todaysDate.getDate() < 10 ? "0" + todaysDate.getDate().toString() : todaysDate.getDate().toString()) + 'T' + input.flightDateTime.getHours() + ;
    // var oneWeekAgoDate = sevenDaysAgo.getFullYear().toString() + (sevenDaysAgo.getMonth() + 1).toString() + (sevenDaysAgo.getDate() < 10 ? "0" + sevenDaysAgo.getDate().toString() : sevenDaysAgo.getDate().toString());
    var oneYearAgoDate = dateToString(new Date(flightDate.getTime() - aYearAgoMilliseconds));
    var oneWeekAgoDate = dateToString(new Date(flightDate.getTime() - sevenDaysAgoMilliseconds));

    var oneWeekAgoUri = BASE_URL + 'airports/' + input.waitTime + "/" + oneWeekAgoDate + "/";
    var oneYearAgoUri = BASE_URL + 'airports/' + input.waitTime + "/" + oneYearAgoDate + "/";

    console.log("ONE WEEK AGO: " + oneWeekAgoUri);
    console.log("ONE YEAR AGO: " + oneYearAgoUri);

    var waitTimeResponseArray = [];
    

    return getTemporaryApiKey().then(function(key) {
        console.log("API KEY FOR CHECKPOINT WAIT TIMES IS: " + key);
        var optionsYearAgo = {
            uri: oneYearAgoUri,
            json: true,
            qs: {
                api_key: key
            }
        };
        var optionsWeekAgo = {
            uri: oneWeekAgoUri,
            json: true,
            qs: {
                api_key: key
            }
        };
        var promises = [];
        promises.push(request(optionsWeekAgo));
        promises.push(request(optionsYearAgo));
        return q.all(promises).then(function(data) {
            return data;
        }).catch(function(err) {
            console.log(err);
            return null;
        });
    }).catch(function(err) {
        console.log(err);
      console.log("encountered a problem while attempting to get api key for checkpoint wait times");
        return null;
    });

    // return getEntriesFor(oneWeekAgo).then(function(weekEntries) {
    //     waitTimeResponseArray.push(weekEntries);
    //     return getEntriesFor(oneYearAgo).then(function(yearEntries) {
    //         waitTimeResponseArray.push(yearEntries);
    //         return waitTimeResponseArray;
    //     }).catch(function(err) {
    //       console.log("error fetching checkpoint wait times"); 
    //       return null;
    //     });
    // }).catch(function(err) {
    //     console.log("encountered an error");
    //     return null; 
    // });

}

function getEntriesFor(fullUri) {
    var options = {
      uri: fullUri,
      json: true
    };

    return getTemporaryApiKey().then(function (key) {
        console.log("API KEY FOR CHECKPOINT WAIT TIMES IS: " + key);
        options.qs = {
          api_key: key
        };
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
      json: true,
        timeout: 2000
    };

    console.log("GETTING TEMP API KEY");
    return request(options);
      

}

module.exports = {
    getCheckpointWaitTimes: getCheckpointWaitTimes
};

