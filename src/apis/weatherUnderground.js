var request = require('request-promise');

var KEY = '5aaa23a384a79bf8';
var BASE_URL = 'http://api.wunderground.com/api/' + KEY;

function getWeather(input) {
    var uri = BASE_URL + '/hourly/q/ATL.json';
    var options = {
        uri: uri,
        json: true
    };

    return request(options);
}


// export all your methods here
module.exports = {
    getWeather: getWeather
};

