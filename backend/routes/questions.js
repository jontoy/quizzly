const express = require("express");
const newQuestionSchema = require("../schemas/newQuestionSchema.json");
const updateQuestionSchema = require("../schemas/updateQuestionSchema.json");
const questionResponseSchema = require("../schemas/questionResponseSchema.json");
const router = new express.Router();
const Question = require("../dataAccess/question");
const {
  requireProperSchema,
  validateSchema,
} = require("../middleware/validate");

/** GET /
 *
 * Get list of questions.
 *
 * It returns basic info:
 *    {questions: [{question_id, quiz_id, text, order_priority}, ...]}
 *
 */
router.get("/", async (req, res, next) => {
  try {
    const { quiz_id, text, order_priority } = req.query;
    const questions = await Question.getAll({
      quiz_id,
      text,
      order_priority,
    });
    return res.json({ questions });
  } catch (err) {
    return next(err);
  }
});

/** POST /
 *
 * Creates a new question.
 *
 * Accepts: {quiz_id, text, order_priority}
 *
 * Returns: {question: {question_id, quiz_id, text, order_priority}}
 *
 */
router.post(
  "/",
  requireProperSchema(newQuestionSchema),
  async (req, res, next) => {
    try {
      const question = await Question.create(req.body);
      return res.status(201).json({ question });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[id]
 *
 * Gets details on a question, including its associated quiz and options.
 *
 * Returns:
 *  {question: { question_id,
 *          quiz_id,
 *          text,
 *          order_priority,
 *          quiz: {id, name, difficulty},
 *          options: [{option_id, question_id, value, is_correct}, ...]}}
 *
 * If question is not found, raises 404 error
 *
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const question = await Question.getOne(id);
    return res.json({ question });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id]
 *
 * Updates a question.
 *
 * Accepts: {text, order_priority}
 *
 * Returns: {question: {question_id, quiz_id, text, order_priority}}
 *
 * If question cannot be found, raises 404 error.
 */
router.patch(
  "/:id",
  requireProperSchema(updateQuestionSchema),
  async (req, res, next) => {
    try {
      const question = await Question.update(req.params.id, req.body);
      validateSchema(question, questionResponseSchema);
      return res.json({ question });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[id]
 *
 * Deletes a question.
 *
 * Returns: {message: "Question deleted"}
 *
 * If question cannot be found, raises 404 error.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await Question.delete(req.params.id);
    return res.json({ message: "Question deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
