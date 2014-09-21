var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET document page. */
router.get('/document', function(req, res) {
  res.render('document', { title: 'Express' });
});

module.exports = router;
