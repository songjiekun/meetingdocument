var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Document = require('../models/document');
var DocumentUser = require('../models/user');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index'/*, { user : req.user }*/);
});

//check user authentication middleware
var isAuthenticated = function (req,res,next) {

	if (req.isAuthenticated()) return next();

	res.redirect('/login');
}

//user login error handler middleware
var loginErrorHandler = function (error,req,res,next) {

	if (error) res.render('login',{error : error.message});

	return next();;
}

module.exports = router;

/*Login*/
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', /*passport.authenticate('local') ,loginErrorHandler,*/ function(req, res) {
  res.redirect('/');
});

/*Registration*/
router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  DocumentUser.register(new DocumentUser({username : req.body.username}), req.body.password , function(error , documentuser ){
  	if (error) {

  		return res.render('register',{ error : error.message });

  	}

  	res.redirect('/');


  })
});

/*Logout*/
router.get('/logout', function(req, res) {
  res.logout();
  res.redirect('/');
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
router.get('/document/:documentid/:user', /*isAuthenticated ,*/ function(req, res) {

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





