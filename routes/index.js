var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Document = require('../models/document');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* POST create document. */
router.post('/createdocument', function(req, res) {

	//var ObjectId = mongoose.Schema.Types.ObjectId;

	var Owner = req.body.owner;

	var newdocument = new Document({ content : '' , owner : Owner });

    newdocument.save(function (error,doc){

    	if (error) {

    		res.send(error);

    	}

    	else {

    		var DocumentId = doc.id;

    		res.redirect('/document/'+DocumentId);

    	}

    });

});

/* Post enter document. */
router.post('/enterdocument', function(req, res) {

	var DocumentId = req.body.documentid

	Document.findById(DocumentId,function (error,doc){

		if (error) {

			res.send(error);

		}
		else {

			res.redirect('/document/'+DocumentId);

		}


	});

});

/* GET document page. */
router.get('/document/:documentid', function(req, res) {

	var DocumentId = req.params.documentid;

	Document.findById(DocumentId,function (error,doc){

		if (error) {

			res.send(error);

		}
		else {

			/*Send documentid to view*/
            res.render('document', { documentid : DocumentId , content : doc.content });

		}


	});
   
    
});

module.exports = router;
