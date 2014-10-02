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

var isNotAuthenticated = function (req,res,next) {

	if (req.isAuthenticated()) res.redirect('/');

	return next();

}

//facebook login or connect
router.get('/facebook/login', isNotAuthenticated , passport.authenticate('facebook',{ scope:'email'}));

router.get('/facebook/connect', isAuthenticated, passport.authenticate('facebook',{ scope:'email'}));

router.get('/facebook/callback', function(req,res,next) {

	

	passport.authenticate('facebook',function(error ,user ,info) {

		if (error) {return next(error);}

		if (!user) {console.log(info); return res.render('login',{error:info.message}); }

		if (req.isAuthenticated()) {

			return res.redirect('/'); //已经登录，说明是authorization，返回授权成功信息

		} 
		else {

			req.logIn(user,function(error){

				if (error) { return next(error); }

				if (req.session.newu) console.log("new user!!!!");

				return res.redirect('/'); //刚登录，说明是authentication，返回登录认证成功信息

			});

		}

		

	})(req,res,next); 

}); 



/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { user : req.user });
});

/*Login*/
router.get('/login', isNotAuthenticated , function(req, res) {
	res.render('login',{error:''});
});

router.post('/login', isNotAuthenticated , function(req,res,next) {

	passport.authenticate('local',function(error ,user ,info) {

		if (error) {return next(error);}

		if (!user) {return res.render('login',{error:info.message}); }

		req.logIn(user,function(error){

			if (error) { return next(error); }

			return res.redirect('/');

		});

	})(req,res,next); 

}); 


/*Registration*/
router.get('/register', isNotAuthenticated , function(req, res) {
	res.render('register',{error:''});
});

router.post('/register', isNotAuthenticated , function(req, res) {
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

	//var Owner = req.user.username;
	var OwnerId = req.user.id;

	var newdocument = new Document({ content : '' , owner : OwnerId });

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

	var UserId = req.user.id;

	Document.findById(DocumentId)
	.populate('owner')
	.exec(function (error,doc){

		if (error) {

			res.send(error);

		}
		else {

			var Content = doc.content;

			var OwnerId = doc.owner.id;

			var Owner = doc.owner.username;

			var IsOwner;

			if (OwnerId === UserId) {

				IsOwner = 'true';

			}
			else {

				IsOwner = 'false';
			}

			/*Send documentid to view*/
			res.render('document', { documentid : DocumentId , content : Content , owner : Owner , username : User ,userid : UserId , isowner : IsOwner });

		}


	});


});


module.exports = router;


