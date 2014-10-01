var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/data');
//configure passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
//facebook login
var FacebookStrategy = require('passport-facebook').Strategy;




var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//setup passport
app.use(expressSession({secret: '43983983',
    saveUninitialized:true,
    resave:true}));
app.use(passport.initialize());
app.use(passport.session());
var DocumentUser = require('./models/user');
passport.use(new LocalStrategy(DocumentUser.authenticate()));
passport.serializeUser(DocumentUser.serializeUser());
passport.deserializeUser(DocumentUser.deserializeUser());
//facebook passport
passport.use(new FacebookStrategy({
    clientId:'',
    clientSecret:'',
    callbackUrl:"/facebook/callback",
    passReqToCallback:true
},
function(req,accessToken,refreshToken,profile,done){

    if (!req.user) {
      // Not logged-in.
      DocumentUser.findOne({ facebook.profileid: profile.id }, function(error, user) {

        if (error) { return done(error); }

        if (user) { 

            return done(null, user); 

        }

        var newuser = new DocumentUser();
        newuser.username = profile.emails[0].value; //can this be unique??
        newuser.facebook.profileid = profile.id;
        newuser.facebook.accesstoken = accessToken;
        newuser.facebook.refreshtoken = refreshToken;
        newuser.save(function(error){

            if (error) return done(error);

            //new user
            req.session.newu = true;
            return done(null, newuser); 

        });

    }


}

else {
      // Logged in. Associate facebook account with user.  Preserve the login
      // state by supplying the existing user after association.
      // return done(null, req.user);
      if (!req.user.facebook.profileid ) {

        //没有facebook profile

        req.user.facebook.profileid = profile.id;
        req.user.facebook.accesstoken = accessToken;
        req.user.facebook.refreshtoken = refreshToken;
        req.user.save(function(error){

            if (error) return done(error);

            return done(null, req.user);


        });

    }

    else if (req.user.facebook.profileid != profile.id) {

        //和原先不同的profile

        req.user.facebook.profileid = profile.id;
        req.user.facebook.accesstoken = accessToken;
        req.user.facebook.refreshtoken = refreshToken;
        req.user.save(function(error){

            if (error) return done(error);

            return done(null, req.user);


        });

    }

    else {

        return done(null, req.user);

    }

}


}));



app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
