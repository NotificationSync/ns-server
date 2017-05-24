var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.json({
    server: "Notification Sync API"
  });
});

module.exports  = router;