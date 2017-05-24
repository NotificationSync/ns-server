var mysql = require("mysql-as-promised").mysqlAsPromised;
var config = require("../config");

var pool = mysql.createPool(config.database);

module.exports = pool;