/**
 * Checks if all required parameters exist in a property hash. If the properties
 * are found, the method returns. Otherwise, it will return the array of missing
 * parameters. If a response is given, it will render a 422 with an error.
 *
 * @param  allParameters        {Object}    the hash of parameters to validate, usually req.query, req.body or req.parameters
 * @param  requiredParameters   [String]    an array of required parameters
 * @param  response             {Object}    optional - the controller response
 */
module.exports.requireParameters = function(allParameters, requiredParameters, response) {
  var missingParameters = [];
  for (var index in requiredParameters) {
    var parameterName = requiredParameters[index];
    if (!allParameters.hasOwnProperty(parameterName)) {
      missingParameters.push(parameterName);
    }
  }
  // return immediately if everything is okay
  if (!missingParameters.length) return null;

  // if given a response, send the error
  if (response) {
    var responseBody = {
      "error_message": "Your request was missing one or more parameters",
      "missing_params": missingParameters,
      "status": 422
    }
    response.status(responseBody.status).json(responseBody);
  }

  // return a failure
  return missingParameters;
}
