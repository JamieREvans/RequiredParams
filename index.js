var JSONPlus = require('json-plus');

/**
 * @param parametersKey       String    The key for parameters on the request object - use one of the keys provided below
 * @param requiredParameters  [String]  Keys for all required parameters
 * @param options             {Object}  Options for the required parameters
 *          nestedKeys        Bool      Should lookup nested keys using JSONPlus nestedString - keys split with '.'
 *          defaultParameters {Object}  Parameters on the request will default to these values, so long as the key is included in requiredParams and it is not found in the existing parameters body
 */
function requiredParameters(parametersKey, requiredParameters, options) {
  // select key lookup type
  function keyLookup(object, key) {
    if (options && options.nestedKeys) {
      return JSONPlus.nestedString(object, key) !== undefined;
    }
    else {
      return object.hasOwnProperty(key);
    }
  }
  // create local var for default parameters
  var defaultParameters;
  if (options && options.defaultParameters) {
    defaultParameters = options.defaultParameters;
  }
  else {
    defaultParameters = {};
  }
  // required params middleware
  return function(request, response, next) {
    var allParameters = request[parametersKey];
    var missingParameters = [];
    requiredParameters.forEach(function(parameterName) {
      if (!keyLookup(allParameters, parameterName)) {
        if (keyLookup(defaultParameters, parameterName)) {
          request[parametersKey][parameterName] = defaultParameters[parameterName];
        }
        else {
          missingParameters.push(parameterName);
        }
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
}

module.exports        = requiredParameters;
module.exports.QUERY  = 'query';
module.exports.BODY   = 'body';
module.exports.PARAMS = 'params';
