require('rootpath')();
var express = require('express');
var app = express();
var router = express.Router();
var required = require('index.js');
var bodyParser = require('body-parser');

// Route Actions
var index = function(request, response, next) {
  response.json('hello world');
};

var create = function(request, response, next) {
  response.status(201).json('created');
};

// Required Params
var indexRequired  = required(required.QUERY, ['q', 'offset', 'limit']);
var createRequired = required(required.BODY, ['username', 'email']);

router.route('/')
  .get(indexRequired, index)
  .post(createRequired, create);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/endpoint', router);

module.exports = app;
