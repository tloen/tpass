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

//defining schemata
var UserDetail = new Schema(
    {
        _id: Number,
        name: String,
        username: String, 
        password: String,
        requestActive: Boolean,
        homeroom: {type: Number, ref: 'Teacher'},
        request_id: { type: Number, ref: 'Request' }
    },
    { collection: 'users' });
var RequestDetail = new Schema(
    {
        _id: Number,
        user_id: { type: Number, ref: 'User' },
        teacher_id: { type: Number, ref: 'Teacher' },
        date: Date
    },
    { collection: 'requests' }
);
var TeacherDetail = new Schema(
    {
        _id: Number,
        name: String,
        username: String,
        password: String,
        requestIds: [{type: Number, ref: 'Request'}]
    },
    { collection: 'teachers' }
);


var User = mongoose.model('User', UserDetail);
var Request = mongoose.model('Request', RequestDetail);
var Teacher = mongoose.model('Teacher', TeacherDetail);



// passport session setup
passport.serializeUser(function (user, done) {
    console.log('serializeUser called');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    console.log('deserializeUser called');
    User.findById(user._id, function (err, user) {
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

app.get('/register', function (req, res) {

});

app.get('/dashboard', function (req, res) {
    User.findById(req.user._id, 'requestActive', function (err, active) {
        if (active) Request.findById(req.user.request_id, function (err, request) {
            if (err) return console.log(err);
            res.render('user', {
                'user' : req.user, 
                'request_filed' : true,
                'request' : request
            });
            console.log(request);
        });
        else Teacher.find({}, function (err, teachers) {
            if (err) return console.log(err);
            
            var request = Request.findById(req.user._id);
            res.render('user', {
                'user' : req.user, 
                'request_filed' : false,
                'request' : request,
                'teachers' : teachers
            });
        });
    });
    console.log(req.user);
});

app.post('/dashboard', function (req, res) {
    var teacherId = req.param('teacher_id');

    //file the new request
    var pending = new Request( {
        'user_id': req.user._id,
        'teacher_id': teacherId,
        'date': new Date()
    });
    pending.save(function (err) {
        if (err) return console.error(err);
    });

    //put the request on the user's record
    User.update(
        { '_id': req.user._id }, 
        { $set: { 'request_id': pending._id , 'requestActive' : true} },
        function (err) {
            if (err) return console.error(err);
        }
    );
    
    //tell the teacher
    Teacher.update({ _id: teacherId }, { $push: { 'requestIds' : teacherId } }, function (err, raw) {
        return console.error(err);
    });
    res.render('user', { 'user' : req.user, 'request_filed' : true, 'request' : pending });
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
