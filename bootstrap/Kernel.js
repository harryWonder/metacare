/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description This file loads in all the Config file configuration.
 * @param {null}
 * @name Kernel
 * @returns {Object}
 *
*/

/* Config Based Configurations */
const AppConfig = require("../config/app");
const LogConfig = require('../config/log');
const CorsConfig = require("../config/cors");
const DatabaseConfig = require("../config/database");

/* NPM Based Imports */
const Cors = require("cors");
const Morgan = require("morgan");
const Helmet = require("helmet");
const Express = require("express");
const Winston = require("winston");
const BodyParser = require("body-parser");

/* Load In Routes */
const ApiRoutes = require("../routes/api");

class Kernel {
  static #express() {
    try {
      const App = new Express();

      /* Set The Global TimeZone */
      process.env.TZ = AppConfig.appTimezone;

      /* Hook In The Application Middlewares */
      App.use(Helmet());
      App.use(Cors(CorsConfig));
      App.set("trust proxy", 1);
      App.use(BodyParser.json());
      App.use(Morgan("combined"));
      App.use(Express.static("public"));
      App.use(BodyParser.urlencoded({ extended: false }));

      return App;
    } catch (err) {
      throw new Error(`Framework Failed To Initialize: ${err.name}`);
    }
  }

  static #database() {
    const DbType = DatabaseConfig.default;

    try {
      if (DbType == "Mysql") {
        let sqlDatabase = null;

        if (DatabaseConfig.connections.MySql.url) {
          const Sequelize = require("sequelize");
          sqlDatabase = new Sequelize(DatabaseConfig.connections.MySql.url, 
            {
            /* Sequelize DB */
            dialect: "mysql",

            /* Mysql Configurations */
            define: {
              underscored: false,
              freezeTableName: false,
              charset: DatabaseConfig.connections.MySql.charset,
              dialectOptions: {
                collate: DatabaseConfig.connections.MySql.collation,
              },
              timestamps: true,
              engine: DatabaseConfig.connections.MySql.engine,
            },

            /* Force Sync Mysql Models */
            sync: { force: true },

            // pool configuration used to pool database connections
            pool: {
              max: 5,
              idle: 30000,
              acquire: 60000,
            },
          });

          /* Test The Connection */
          sqlDatabase
            .authenticate()
            .then(() => {
              console.log("Connection has been established successfully.");

              /* Sync The Defined Models To The Database */
              sqlDatabase.sync({ force: true }).then(() => {
                console.log(`Database & tables synced successfully!`);
              });
            })
            .catch((err) => {
              console.error("Unable to connect to the database:", err);
              throw new Error(
                `Express Framework Failed To Initialize: ${err.name}`
              );
            });
        }
      }

      return;
    } catch (err) {
      console.log(err);
      this.#database(); /* Re-initialize the database */
      throw new Error(`Framework Failed To Initialize: ${err.name}`);
    }
  }

  static #log() {
    try {

      if (LogConfig.default == 'file') {
        const logger = Winston.createLogger({
          transports: [
            new Winston.transports.Console(),
            new Winston.transports.File({
              filename: "../storage/logs/martian.log",
              timestamp: function () {
                return Date.now();
              },
            }),
          ],
        });
      }
    } catch (err) {
      throw new Error(`Framework Failed To Initialize: ${err.name}`);
    }
  }

  static fileDriver() {
    if (FileConfig.driver == 'aws') {
      return FileConfig.connections.aws;
    }

    return null;
  }

  static redis() {}

  static mail() {
    try {
      const mailService = MailConfig.mailService;

      if (mailService == "smtp") {
        const Transporter = Nodemailer.createTransport({
          host: MailConfig.smtp.mailHost,
          port: MailConfig.smtp.mailPort,
          secureConnection: true,
          auth: MailConfig.smtp.auth,
        });
        
        return { transporter: Transporter, mailConfig: MailConfig };
      } else if (mailService == "sendInBlue") {
        const Transporter = Nodemailer.createTransport({
          service: "sendinblue",
          auth: MailConfig.sendInBlue,
        });

        return { transporter: Transporter, mailConfig: MailConfig };
      }

      /* Attach Extra Mail Service As Required */
    } catch (err) {
      throw new Error(`Framework Failed To Initialize: ${err.name}`);
    }
  }

  application(requiredModule = "all") {
    
    /* Load In All The Application Modules */
    if (requiredModule == "all") {
      const App = Kernel.#express();

      /* Load In The Database */
      Kernel.#database();

      /* Attach The Application Routes */
      ApiRoutes(App);

      return {
        app: App,
        appUrl: AppConfig.appUrl,
        appName: AppConfig.appName,
        appPort: AppConfig.appPort,
      };
    }

    /* Load In Only The Express Module */
    if (requiredModule == "express") {
      const App = Kernel.#express();

      /* Attach The Application Routes */
      ApiRoutes(App);

      return { app: App };
    }

    /* Load In Only The Database Module */
    if (requiredModule == "database") {
      /* Load In The Database */
      Kernel.#database();
    }
    
    return;
  }
}

module.exports = new Kernel();
