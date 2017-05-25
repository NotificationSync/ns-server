var process = require("process");

// whole config form
//
// {
//   "mail": {
//     "service": "",
//     "auth": {
//       "user": "",
//       "pass": ""
//     }
//   },
//   "database": {
//     "host": "",
//     "user": "",
//     "password": "",
//     "database": ""
//   }
// }

module.exports = {
  "mail": JSON.parse(process.env["MAIL"]),
  "database": JSON.parse(process.env["DATABASE"])
}