const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");

function validateSchema(obj, schema) {
  const schemaCheck = jsonschema.validate(obj, schema);
  if (!schemaCheck.valid) {
    listOfErrors = schemaCheck.errors.map((error) => error.stack);
    return new ExpressError(listOfErrors, 400);
  }
}

function requireProperSchema(schema) {
  return function (req, res, next) {
    next(validateSchema(req.body, schema));
  };
}

module.exports = { validateSchema, requireProperSchema };
