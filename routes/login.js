var express = require('express');
var router = express.Router();
//var passport = require('passport');

router.get('/',
    function (req, res) {
        console.log('okay');
        res.render('login');
    }
);


console.log('hello?');

module.exports = router;