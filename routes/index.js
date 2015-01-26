var express = require('express');
var router = express.Router();
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

/* GET home page. */

function dbDraw(col, res) {
	col.find().toArray(function(err, items) {
		res.render('index', { title: "Tutorial Pass, Yo" , arr: items });
	});
	console.log("dbDraw function called");
}

passport.use(new LocalStrategy(
	function(username, password, done) {
		//BAD, CHANGE ASAP
		return done(null, user);
	}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});
 
passport.deserializeUser(function(user, done) {
  done(null, user);
});

router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/loginSuccess',
    failureRedirect: '/loginFailure'
  })
);

router.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});

router.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

router.get('/login', function(req, res) {
    res.render('login');
});
													
router.get('/', function(req, res) {
	MongoClient.connect("mongodb://bearcatprime:196884@ds031271.mongolab.com:31271/tpassdb", function(err, db) {
		if(!err) {
			console.log("Connection is working");
			var collection = db.collection('students');
			collection.find().toArray(function(err, items) {
				res.render('index', { title: "Tutorial Pass, Yo" , arr: items });
			});
		}
		else console.log("Connection failed!");
	});
});

router.post('/', function(req, res) {
	console.log(req.body)
	switch(req.body.pass_action) {
		case "Submit":
			MongoClient.connect("mongodb://bearcatprime:196884@ds031271.mongolab.com:31271/tpassdb", function(err, db) {
				if(!err) {
					var collection = db.collection('students');
					collection.insert({
						"firstname":req.body.firstname,
						"lastname":req.body.lastname,
						"homeroom":req.body.homeroom,
						"alternate":req.body.alternate,
						"sid":req.body.sid
					}, {w:1}, function(err, result) {});
					dbDraw(collection, res);
				}
			});
			break;
		case "Deny":
			MongoClient.connect("mongodb://bearcatprime:196884@ds031271.mongolab.com:31271/tpassdb", function(err, db) {
				if(!err) {
					var collection = db.collection('students');
					collection.remove({"_id":ObjectID(req.body.id)},{justOne:true},function(err,result){
						console.log("Complete!");
					});
					dbDraw(collection, res);
				}
			});
			break;
		default:
			MongoClient.connect("mongodb://bearcatprime:196884@ds031271.mongolab.com:31271/tpassdb", function(err, db) {
				if(!err) {
					var collection = db.collection('students');
					dbDraw(collection, res);
				}
			});
			console.log("Pass_action " + req.body.pass_action + " not implemented yet!");
	}
});

router.get('/teacher-login', function(req, res) {
  res.render('index', { title: 'Teacher Login' });
});

module.exports = router;
