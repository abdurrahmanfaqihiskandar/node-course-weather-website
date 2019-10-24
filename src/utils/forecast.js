const request = require('request');

const forecast = (lat, long, callback) => {
    const url = `https://api.darksky.net/forecast/109be7122e66e4eb0aaf9ecb0e2b931e/${lat},${long}?units=si`;

    request({ url, json: true }, (error, { body } = {}) => {
        
        if (error) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            callback('Unable to find location', undefined);
        } else {
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain.`);
        }
    })
};

module.exports = forecast;