var config = require("../config");
var bluebird = require("bluebird");
var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport(config.mail);

module.exports = bluebird.promisifyAll(transporter);