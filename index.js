/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var compression = require('compression')
var app = express();

app.use(compression({ threshold: 0, level: 9 }));
app.use(function(req,res,next) {
    if(req.headers["x-forwarded-proto"] == "http") {
        res.redirect("https://cloudplanner.us-east-1.elasticbeanstalk.com" + req.url);
    } else {
        return next();
    } 
});
app.use('/', express.static('./'));

var port = process.env.PORT || 8081;

var server = app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});