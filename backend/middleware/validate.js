const jsonschema = require("jsonschema");
const ExpressError = require("../helpers/expressError");

function requireProperSchema(schema) {
  return function (req, res, next) {
    const schemaCheck = jsonschema.validate(req.body, schema);
    if (!schemaCheck.valid) {
      listOfErrors = schemaCheck.errors.map((error) => error.stack);
      return next(new ExpressError(listOfErrors, 400));
    }
    next();
  };
}

module.exports = { requireProperSchema };
