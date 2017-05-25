var nodemailer = require("nodemailer");
var config = require("../config");

var transporter = nodemailer.createTransport(config.mail);

module.exports = transporter;