var debug = require("debug");

module.exports = function (moduleName) {
  return debug(`ns-server:${moduleName}`);
};