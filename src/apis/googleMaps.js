var request = require('request-promise');

var KEY = 'AIzaSyA5HRWlQ-DMlqEwPsUtvFpe_9OsbHVhnvI';
var BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

var options = {
    uri: BASE_URL,
    json: true
};

function getDirections(origin, destination) {
    var params = {
        origin: origin,
        destination: destination,
        key: KEY
    };
    options.qs = params;

    return request(options);
        // .then(function(res) {
        //     console.log(JSON.stringify(res));
        // }).catch(function(err) {
        //     console.log(err);
        // });
}

module.exports = {
    getDirections: getDirections
};

