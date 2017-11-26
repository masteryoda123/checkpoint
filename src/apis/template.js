var request = require('request-promise');

var KEY = 'YOUR_API_KEY_HERE';
var BASE_URL = 'API_BASE_URL_HERE';

function getCheckpointWaitTimes(input) {
    var uri = BASE_URL + 'YOUR_END_POINT_HERE';
    var options = {
        uri: uri,
        json: true
    };

    // This is what goes to your query params
    options.qs = {
        YOUR_PARAM_HERE: input.YOUR_PARAM_HERE
    };

    return request(options);
}


// export all your methods here
module.exports = {
    YOUR_GET_FUNCTION_NAME_HERE: YOUR_GET_FUNCTION_NAME_HERE,
};

