var mysql = require("mysql");
var config = require("../config");

var conn = mysql.createPool(config.database);

module.exports = conn;