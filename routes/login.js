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
        successRedirect: '/dashboard',
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

module.exports = router;