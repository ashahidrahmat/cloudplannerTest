/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var compression = require('compression')
var app = express();

app.use(compression({ threshold: 0, level : 9 }));
app.use('/', express.static('./'));

var port = process.env.PORT || 8080;

var server = app.listen(port, function () {
	console.log('Server running at http://127.0.0.1:' + port + '/');
});