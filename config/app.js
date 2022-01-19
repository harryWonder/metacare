require('dotenv').config();

/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the application base configurations.
 * @param {null}
 * @name ApplicationConfig
 * @type {Object}
 * 
 */

module.exports = {
  appKey: process.env.APP_SECRET_KEY,
  appUrl: process.env.APP_URL,
  appPort: process.env.APP_PORT,
  appName: process.env.APP_NAME,
  appTimezone: process.env.APP_TIMEZONE,
  appEnvironment: process.env.APP_ENV
}