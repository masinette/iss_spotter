const request = require('request');
const fetchISSFlyOverTimes = require('./fetchISSFlyOverTimes');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org/?format=json', (error, response) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${response.body}`;
      callback(Error(msg), null);
      return;
    }
    // if we get here, all's well and we got the data
    const ip = (JSON.parse(response.body).ip); // Print the HTML for web homepage.
    callback(null, ip);
  });
};

console.log("--------------------");

const fetchCoordsByIP = function (ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, data) => {
    if (error) {
      return callback(error, null);
    }
    // if non-200 status, assume server error
    if (data.statusCode !== 200) {
      const msg = `Status Code ${data.statusCode} when fetching IP. Response: ${data.body}`;
      callback(Error(msg), null);
      return;
    }

    let body = JSON.parse(data.body);
    let latitude = body.latitude;
    let longitude = body.longitude;
    let coords = {};
    coords.latitude = latitude;
    coords.longitude = longitude;
    callback(null, coords);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming
 * ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });

};

module.exports = { nextISSTimesForMyLocation };