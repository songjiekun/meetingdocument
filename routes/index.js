var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Document = require('../models/document');
var DocumentUser = require('../models/user');
var passport = require('passport');

//check user authentication middleware
var isAuthenticated = function (req,res,next) {

	if (req.isAuthenticated()) return next();

	res.redirect('/login');
}


/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { user : req.user });
});

/*Login*/
router.get('/login', function(req, res) {
    res.render('login',{error:''});
});

router.post('/login', function(req,res,next) {

	passport.authenticate('local',function(error ,user ,info) {

		if (error) {return next(error);}

		if (!user) {console.log(info); return res.render('login',{error:info.message}); }

		req.logIn(user,function(error){

			if (error) { return next(error); }

			return res.redirect('/');

		});

	})(req,res,next); 

}); 


/*Registration*/
router.get('/register', function(req, res) {
  res.render('register',{error:''});
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
  req.logout();
  res.redirect('/');
});




/* POST create document. */
router.post('/createdocument',isAuthenticated, function(req, res) {

	var Owner = req.user.username;

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
router.post('/enterdocument',isAuthenticated, function(req, res) {

	var DocumentId = req.body.documentid;

	res.redirect('/document/'+DocumentId);

});

/* GET document page. */
router.get('/document/:documentid', isAuthenticated , function(req, res) {

	var DocumentId = req.params.documentid;

	var User = req.user.username;

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


