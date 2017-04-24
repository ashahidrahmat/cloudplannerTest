/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var compression = require('compression')
var mongoose = require('mongoose')
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

//Setting up connection using mongo connect to mongoDB
mongoose.connect('mongodb://user:password@54.209.116.114:27017/Tweetdata');
var db = mongoose.connection;

//Checking connection status
db.on('connected', function(){
  console.log('Successfully connected to db');
});
db.on('error', function(){
  console.log('db Connection error', error);
});
db.on('disconnected', function(){
  console.log('Disconnected from db');
});
process.on('SIGINT', function(){
  db.close(function(){
    console.log('db connection closed due to process termination');
    process.exit(0);
  });
});

var port = process.env.PORT || 8081;

var server = app.listen(port, function() {
    console.log('Server running at http://127.0.0.1:' + port + '/');
});
