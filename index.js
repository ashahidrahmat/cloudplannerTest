/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var compression = require('compression')
var app = express();

app.use('/', express.static('./'));
app.use(compression())

app.listen(8080);