/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : mongoose.js
 * DESCRIPTION     : Receive data from mongo, store and static query methods returning subsets of data
 * AUTHOR          : Thomas Lee
 * DATE            : April 21, 2017
 * VERSION NO      : 1.0
 * PARAMETERS      :
 * RETURN          :
 * USAGE NOTES     :
 * COMMENTS        :
---------------------------------------------------------------------------------------------------
 * CHANGE LOG      :
 * CHANGED BY      :
 * DATE            :
 * VERSION NO      :
 * CHANGES         :
--------------------------------------------------------------------------------------------------*/
// var mongoose = require('mongoose');

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

//Defining a model schema for twitter data
var tweetschema = new mongoose.schema({
  twid : String,
  active : Boolean,
  avatar : String
});
var twittermodel = mongoose.model('twittermodel',tweetschema);
moule.exports = twittermodel;
