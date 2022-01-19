/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file returns the log core configuration.
 * @param {null}
 * @name LogConfig
 * @returns {Object}
 *
*/
const Os = require('os');

module.exports = {
  default: "file",

  connections: {
    file: {
      sizeLimit: "10M" /* 10MB Max */,
      writes: ["info", "error", "success", "warning", "http"],
      notification: {
        channel: "mail" /* slack, sms, push-notifications */,
      },
      recipient: [] /* Email, phone Or Slack ID */,
    },
    database: {
      sizeLimit: 50000 /* Flushed On 50K Records */,
      writes: ["info", "error", "success", "warning", "http"],
      notification: {
        channel: "mail" /* slack, sms, push-notifications */,
      },
      recipient: [] /* Email, phone Or Slack ID */,
    },
    paperTrail: {
      sizeLimit: 100000,
      writes: ["info", "error", "success", "warning", "http"],
      notification: {
        channel: "mail" /* slack, sms, push-notifications */,
      },
      recipient: [] /* Email, phone Or Slack ID */,
      host: "logs2.papertrailapp.com",
      port: 103943,
      protocol: "tls4",
      localhost: Os.hostname(),
      eol: "\n",
    },
  },

};
