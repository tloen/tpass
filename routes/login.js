var express = require('express');
var router = express.Router();

// okay, the following code is copied from the website 
// http://passportjs.org/guide/username-password/
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

// okay, the following code is copied from the website 
// http://passportjs.org/guide/username-password/
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

router.post('/login',
    function (req, res) {
        console.log('login request recieved from ', req.param('username'), req.param('password'));
        debugger;
        passport.authenticate('local', {
            successRedirect: '/win',
            failureRedirect: '/fail'
        })
    }
);

//(end of copying)

router.get('/login',
    function (req, res) {
        console.log('okay');
        res.render('login');
    }
);

router.get('/win', function (req, res, next) {
    res.send('yes');
});

router.get('/fail', function (req, res, next) {
    res.send('no');
});

module.exports = router;