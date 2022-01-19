/**
 * @author Ilori Stephen A <stephenilori458@gmail.com>
 * @description The entry point into the application
 * @param {null}
 * @name Index
 * @returns {Null}
 *
*/

const Kernel = require('./bootstrap/Kernel');

/* Run The Application */
const Metacare = Kernel.application();

Metacare.app.listen(process.env.PORT || Metacare.appPort, () => {
  console.log(Metacare.appName + ' is running on ' + Metacare.appUrl);
});