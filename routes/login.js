var express = require('express');
var router = express.Router();

// okay, the following code is copied from the website 
// http://passportjs.org/guide/username-password/
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

router.post('/',
    passport.authenticate('local',
    {
        failureRedirect: '/fail',
        successRedirect: '/win',
        failureFlash: true
    }),
    function (req, res) {
        res.redirect('/');
    }
);


//(end of copying)

router.get('/',
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