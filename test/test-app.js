require('rootpath')();
var express = require('express');
var app = express();
var router = express.Router();
var required = require('index.js');
var bodyParser = require('body-parser');

// Route Actions
function index(request, response, next) {
  response.json('hello world - ' + request.query.offset + ' - ' + request.query.limit);
}

function create(request, response, next) {
  response.status(201).json('created');
}

function nestedCreate(request, response, next) {
  response.status(201).json('hola');
}

// Required Params
var indexRequired        = required(required.QUERY, ['q', 'offset', 'limit'], { defaultParameters: { offset: 0, limit: 30 } });
var createRequired       = required(required.BODY, ['username', 'email']);
var nestedCreateRequired = required(required.BODY, ['user.first_name', 'user.email'], { nestedKeys: true });

router.route('/')
  .get(indexRequired, index)
  .post(createRequired, create);

router.route('/nested')
  .post(nestedCreateRequired, nestedCreate);

// JSON Body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Routes
app.use('/endpoint', router);

module.exports = app;
