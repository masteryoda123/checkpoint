var request = require('request-promise');
var _ = require('lodash');

var KEY = '5aaa23a384a79bf8';
var BASE_URL = 'http://api.wunderground.com/api/' + KEY;

function getWeather(input) {
    var uri = BASE_URL + '/hourly/q/' + input.airportState + '/' + input.airportCode + '.json';
    var time = input.time; 
    var options = {
        uri: uri,
        json: true
    };

    return request(options).then(response => {
        try {
          return calcWeatherDelays(response, time)
        } catch (err) {
          console.log("problem parsing weather delay response, return defualt value");
          return 1.25;
        }
    }).catch(function(err) {
      console.log("problem fetching weather underground api");
    });
}


/**
 * @typedef {Object} Leg
 * @property {number} duration.value - time taken in minutes for this leg (sub-route)
 */

/**
 * @typedef {Object} Route
 * @property {Leg[]} legs - the legs, or sub-routes, of this route.
 */

/**
 * @typedef {Object} DirectionResponse
 * @property {Route[]} routes - all possible routes to destination
 */

/**
 * This processes API result directions returned by Google Maps
 * directions API
 *
 * Documentation:
 * {@link https://developers.google.com/maps/documentation/directions/intro}
 *
 * @param {DirectionResponse} directionResponse directions response
 * @returns {number} minimum travel time in minutes among all possible routes
 */
function calcWeatherDelays(weatherResponse, timeToArrive) {

    //var current = new Date();
    //var hours = ((timeToArrive * 1000) - current.getTime()) / (60 * 60 * 1000);
    
    var hours = 3;

    console.log("weather response: " + weatherResponse);

    //var originTime = weatherResponse.hourly_forecast[0]["FCTTIME"]["hour"];
    //var destinationTime = weatherResponse.hourly_forecast[hours]["FCTTIME"]["hour"];
    //var originWeather = weatherResponse.hourly_forecast[0]["condition"];
    //console.log("current time: " + current.getTime());
    //console.log("time to arrive: " + timeToArrive);
    //console.log("HOURS: " + hours);
    var destinationWeather = weatherResponse.hourly_forecast[hours]["condition"];

    //var originEffect = getEffectFromCondition(originWeather);
    return destinationEffect = getEffectFromCondition(destinationWeather);

    //if (originEffect > destinationWeather) {
    //    return originEffect;
    //} else {
    //    return destinationEffect;
    //}

}



function getEffectFromCondition(weatherCondition) {

    var noEffect = 1;
    var someEffect = 1.25;
    var bigEffect = 1.5;

    if (weatherCondition.includes("Heavy")) {
        if ((weatherCondition.includes("Drizzle") && !weatherCondition.includes("Freezing"))
            || weatherCondition.includes("Heavy Mist") || weatherCondition.includes("Rain Mist")) {
            return someEffect;
        } else if (weatherCondition.includes("Spray")) {
            return noEffect;
        } else {
            return bigEffect;
        }
    } else if (weatherCondition.includes("Light")) {
        if ((weatherCondition.includes("Drizzle") && !weatherCondition.includes("Freezing"))
            || (weatherCondition.includes("Mist") && !weatherCondition.includes("Rain Mist"))
            || weatherCondition.includes("Spray")) {
            return noEffect;
        } else if (weatherCondition.includes("Thunderstorm") || weatherCondition.includes("Freezing")
                   || weatherCondition.includes("Snow Blowing Snow Mist")){
            return bigEffect;
        } else {
            return someEffect;
        }
    } else if (weatherCondition.includes("Thunderstorms")) {
        return bigEffect;
    } else if (weatherCondition.includes("Freezing")) {
        return bigEffect;
    } else if (weatherCondition.includes("Drizzle")) {
        return someEffect;
    } else if (weatherCondition.includes("Rain")) {
        return someEffect;
    } else if (weatherCondition.includes("Snow Blowing")) {
        return bigEffect;
    } else if (weatherCondition.includes("Snow")) {
        return someEffect;
    } else if (weatherCondition.includes("Blowing")) {
        return someEffect;
    } else if (weatherCondition.includes("Shallow Fog")) {
        return noEffect;
    } else if (weatherCondition.includes("Low")) {
        return someEffect;
    } else if (weatherCondition.includes("Dust")) {
        return someEffect;
    } else if (weatherCondition.includes("Sandstorm")) {
        return bigEffect;
    } else if (weatherCondition.includes("Partial Fog")) {
        return noEffect;
    } else if (weatherCondition.includes("Fog")) {
        return someEffect;
    } else if (weatherCondition.includes("Hail")) {
        return someEffect;
    } else if (weatherCondition.includes("Ice")) {
        return someEffect;
    } else if (weatherCondition.includes("Cloud")) {
        return noEffect;
    } else if (weatherCondition.includes("Squalls")) {
        return noEffect;
    } else if (weatherCondition.includes("Unknown")) {
        return noEffect;
    } else if (weatherCondition.includes("Mist")) {
             return noEffect;
    } else if (weatherCondition.includes("Smoke")) {
             return someEffect;
    } else if (weatherCondition.includes("Volcanic Ash")) {
             return someEffect;
    } else if (weatherCondition.includes("Sand")) {
             return someEffect;
    } else if (weatherCondition.includes("Haze")) {
             return someEffect;
    } else if (weatherCondition.includes("Spray")) {
             return noEffect;
    } else if (weatherCondition.includes("Overcast")) {
             return noEffect;
    } else if (weatherCondition.includes("Clear")) {
            return noEffect;
    }
    return noEffect;
}


// export all your methods here
module.exports = {
    getWeather: getWeather
};
