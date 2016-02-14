var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('loginMember', { title: 'Express' });
});

router.get('/kitchen', function(req, res, next) {
  res.render('kitchen');
});


module.exports = router;
