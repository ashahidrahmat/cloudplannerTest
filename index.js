/**
 * Module dependencies.
 */
var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static('./'));
app.use(compression())


app.listen(8080);