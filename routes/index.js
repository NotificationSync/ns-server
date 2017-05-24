var express = require('express');
var router = express.Router();
var root = require('./root');
var notification  = require("./notification");
var user = require('./user');

router.use(root);
router.use("/notification",notification);
router.use("/user",user);

module.exports = router;
