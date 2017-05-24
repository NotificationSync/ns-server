var nodemailer = require("nodemailer");
var config = require("../config.json");

var transporter = nodemailer.createTransport(config.mail);

module.exports = transporter;