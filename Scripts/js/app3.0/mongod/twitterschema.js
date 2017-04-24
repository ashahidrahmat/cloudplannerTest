/**-------------------------------------------------------------------------------------------------
 * PROGRAM ID      : twitterschema.js
 * DESCRIPTION     : Defining mongoose data schema
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
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var twitterschema = new Schema({
  twitd: String,
  displayname: String,
  date: Date,
  displayimage: String,
  Sentiment: String
});

module.exports = mongoose.model('tweetschema', twitterschema)
