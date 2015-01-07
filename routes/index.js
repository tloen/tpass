var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function(req, res) {
  var col=[{firstname:"fail"}];
  MongoClient.connect("mongodb://bearcatprime:196884@ds031271.mongolab.com:31271/tpassdb", function(err, db) {
    if(!err) {
      console.log("Connection is working");
	  var collection = db.collection('students');
	  collection.find().toArray(function(err, items) {
	    col = items;
		res.render('index', { title: "Tutorial Pass, Yo" , arr: col });
		console.log(items); });
    }
	else console.log("Connection failed!");
  });
  console.log(col);
});

router.post('/', function(req, res) {
	console.log(req.body)
	var col;
	if("record" in req.body) {
		MongoClient.connect("mongodb://bearcatprime:196884@ds031271.mongolab.com:31271/tpassdb", function(err, db) {
			if(!err) {
				console.log("We are connected");
				var collection = db.collection('students');
				collection.insert({
					"firstname":req.body.firstname,
					"lastname":req.body.lastname,
					"homeroom":req.body.homeroom,
					"alternate":req.body.alternate,
					"sid":req.body.sid
				}, {w:1}, function(err, result) {});
				collection.find().toArray(function(err, items) {
				col = items;
				res.render('index', { title: "Tutorial Pass, Yo" , arr: col });
				console.log(items); });
			}
		});
	}
});

router.get('/teacher-login', function(req, res) {
  res.render('index', { title: 'Teacher Login' });
});

module.exports = router;
