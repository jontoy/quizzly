const express = require("express");
const jsonschema = require("jsonschema");
const newOptionSchema = require("../schemas/newOptionSchema.json");
const updateOptionSchema = require("../schemas/updateOptionSchema.json");
const router = new express.Router();
const Option = require("../dataAccess/option");
const ExpressError = require("../helpers/expressError");

/** GET /
 *
 * Get list of options.
 *
 * It returns basic info:
 *    {options: [{option_id, question_id, value, is_correct}, ...]}
 *
 */
router.get("/", async (req, res, next) => {
  try {
    const { question_id, value, is_correct } = req.query;
    console.log(req.query);
    const options = await Option.getAll({
      question_id,
      value,
      is_correct,
    });
    return res.json({ options });
  } catch (err) {
    return next(err);
  }
});

/** POST /
 *
 * Creates a new option.
 *
 * Accepts: {question_id, text, is_correct}
 *
 * Returns: {option: {option_id, question_id, value, is_correct}}
 *
 */
router.post("/", async (req, res, next) => {
  const schemaCheck = jsonschema.validate(req.body, newOptionSchema);
  if (!schemaCheck.valid) {
    listOfErrors = schemaCheck.errors.map((error) => error.stack);
    return next(new ExpressError(listOfErrors, 400));
  }
  try {
    const option = await Option.create(req.body);
    return res.status(201).json({ option });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]
 *
 * Gets details on a option, including its associated question.
 *
 * Returns:
 *  {option: { option_id,
 *          question_id,
 *          value,
 *          is_correct,
 *          question: {question_id, quiz_id, text, order_priority}}}
 *
 * If option is not found, raises 404 error
 *
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const option = await Option.getOne(id);
    return res.json({ option });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id]
 *
 * Updates a option.
 *
 * Accepts: {value, is_correct}
 *
 * Returns: {option: {option_id, question_id, value, is_correct}}
 *
 * If option cannot be found, raises 404 error.
 */
router.patch("/:id", async (req, res, next) => {
  const schemaCheck = jsonschema.validate(req.body, updateOptionSchema);
  if (!schemaCheck.valid) {
    listOfErrors = schemaCheck.errors.map((error) => error.stack);
    return next(new ExpressError(listOfErrors, 400));
  }
  try {
    const option = await Option.update(req.params.id, req.body);
    return res.json({ option });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]
 *
 * Deletes a option.
 *
 * Returns: {message: "Option deleted"}
 *
 * If option cannot be found, raises 404 error.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await Option.delete(req.params.id);
    return res.json({ message: "Option deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
