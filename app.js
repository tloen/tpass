var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');
var methodOverride = require("method-override");

var mongoose = require('mongoose');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var route = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login.js');

var db = require('./db')

// mongoose [http://www.sitepoint.com/local-authentication-using-passport-node-js/]
mongoose.connect(db.url);
var Schema = mongoose.Schema;
var UserDetail = new Schema(
    {
        username: String, 
        password: String,
        request_id: Schema.Types.ObjectId
    },
    { collection: 'users' });
var User = mongoose.model('users', UserDetail);

var RequestDetail = new Schema(
    {
        user_id: Schema.Types.ObjectId,
        teacher_id: Schema.Types.ObjectId,
        date: Date
    },
    { collection: 'requests' }
);
var Request = mongoose.model('requests', RequestDetail)


// passport session setup
passport.serializeUser(function (user, done) {
    console.log('serializeUser called');
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser called');
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// local strategy
passport.use(new LocalStrategy(
  function (username, password, done) {
      console.log('authentication in progress');
      process.nextTick(function () {
          User.findOne({ 'username': username }, function (err, user) {
              if (err) { return done(err); } //server exception
              if (!user) {
                  return done(null, false, { message: 'Incorrect username.' });
              }
              if (user.password != password) {
                  return done(null, false, { message: 'Incorrect password.' });
              }
              return done(null, user); //passed
          });
      })
  }
));

var app = express();

// configure
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'keyboard cat'
}));
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/', route);

//handlers!

app.get('/dashboard', function (req, res) {
    res.render('user', { 'user' : req.user, 'request_filed' : false });
    console.log(req.user);
});

app.post('/dashboard', function (req, res) {
    //file the new request
    var pending = new Request({
        'user_id': req.user._id,
        //'teacher_id': "",
        'date': new Date()
    });
    pending.save(function (err) {
        if (err) return console.error(err);
    });
    //put the request on the user's record
    User.update(
        { '_id': req.user._id }, 
        { $set: { 'request_id': pending._id } },
        function (err) {
            if (err) return console.error(err);
        }
    );
    var teacher = req.body.alternate;

    res.render('user', { 'user' : req.user, 'request_filed' : false });
});


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
