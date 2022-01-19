require('dotenv').config();

/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the database core configuration.
 * @param {null}
 * @name DatabaseConfig
 * @returns {Object}
 *
*/

module.exports = {
  default: process.env.DB_CONNECTION,

  connections: {
    MySql: {
      driver: "mysql",
      url: process.env.DB_URL,
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      charset: "utf8mb4",
      collation: "utf8mb4_unicode_ci",
      prefix_indexes: true,
      strict: true,
      engine: "innodb",
    },

    MongoDB: {
      driver: "mongodb",
      url: process.env.DB_URL,
      options: {
        family: 4,
        autoIndex: false,
        autoCreate: false,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        socketTimeoutMS: 30000,
        keepAlive: true,
      },
    },
  },
};