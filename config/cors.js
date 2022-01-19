/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the cors base configuration.
 * @param {null}
 * @name CorsConfig
 * @returns {Object}
 *
 */

/* Add IP You Wish To Whitelist */
const Whitelist = [
  /* IP ADDRESS GOES HERE */
];

module.exports = (req, callback) => {
  let corsOptions;

  if (Whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }

  callback(null, corsOptions);
};

