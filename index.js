const { nextISSTimesForMyLocation } = require('./iss');

// index.js
// const { fetchMyIP, fetchCoordsByIP } = require('./iss');
// const fetchISSFlyOverTimes = require("./fetchISSFlyOverTimes");

// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log("It didn't work!" , error);
//     return;
//   }
//   console.log('It worked! Returned IP:' , ip);
// });

// fetchCoordsByIP("142.114.189.48", (error, data) => {
//   if (error) {
//     console.log("It doesn't work");
//     return;
//   }
//   console.log('It worked! Returned coordinates:' , data);
// });

// fetchISSFlyOverTimes({ latitude: 43.5698, longitude: -80.2421 }, (error, data) => {
//   if (error) {
//     console.log("It doesn't work");
//     return;
//   }
//   console.log('It worked! Returned pass times:', data);
// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});