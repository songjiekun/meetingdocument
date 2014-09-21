var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET document page. */
router.get('/document/:documentid', function(req, res) {
   
  /*Send documentid to view*/
  res.render('document', { documentid: req.params.documentid});
});

module.exports = router;
