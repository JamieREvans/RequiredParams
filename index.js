module.exports = function(parametersKey, requiredParameters, defaultParameters) {
  return function(request, response, next) {
    var allParameters = request[parametersKey];
    var missingParameters = [];
    requiredParameters.forEach(function(parameterName) {
      if (!allParameters.hasOwnProperty(parameterName)) {
        missingParameters.push(parameterName);
      }
    });
    // return immediately if everything is okay
    if (!missingParameters.length) {
      next();
    }
    else {
      var responseBody = {
        "error_message": "Your request was missing one or more parameters",
        "missing_params": missingParameters,
        "status": 422
      };
      response.status(responseBody.status).json(responseBody);
    }
  };
};

module.exports.QUERY  = 'query';
module.exports.BODY   = 'body';
module.exports.PARAMS = 'params';
