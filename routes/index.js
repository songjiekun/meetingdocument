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

	var Owner = req.body.owner;

	var newdocument = new Document({ content : '' , owner : Owner });

    newdocument.save(function (error,doc){

    	if (error) {

    		res.send(error);

    	}

    	else {

    		var DocumentId = doc.id;

    		res.redirect('/document/'+DocumentId+'/'+Owner);

    	}

    });

});

/* Post enter document. */
router.post('/enterdocument', function(req, res) {

	var DocumentId = req.body.documentid;

	var User = req.body.username;

	Document.findById(DocumentId,function (error,doc){

		if (error) {

			res.send(error);

		}
		else {

			res.redirect('/document/'+DocumentId+'/'+User);

		}


	});

});

/* GET document page. */
router.get('/document/:documentid/:user', function(req, res) {

	var DocumentId = req.params.documentid;

	var User = req.params.user;

	Document.findById(DocumentId,function (error,doc){

		if (error) {

			res.send(error);

		}
		else {

			var Content = doc.content;

			var Owner = doc.owner;

			var IsOwner;

			if (Owner === User) {

				IsOwner = 'true';

			}
			else {

				IsOwner = 'false';
			}

			/*Send documentid to view*/
            res.render('document', { documentid : DocumentId , content : Content , owner : Owner , username : User , isowner : IsOwner });

		}


	});
   
    
});

module.exports = router;
