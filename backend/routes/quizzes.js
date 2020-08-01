const express = require("express");
const newQuizSchema = require("../schemas/newQuizSchema.json");
const updateQuizSchema = require("../schemas/updateQuizSchema.json");
const router = new express.Router();
const Quiz = require("../dataAccess/quiz");
const { requireProperSchema } = require("../middleware/validate");

/** GET /
 *
 * Get list of quizzes. Optional ability to filter by
 * name, min_difficulty and max_difficulty
 *
 * It returns basic info:
 *    {quizzes: [{id, name, difficulty}, ...]}
 *
 */
router.get("/", async (req, res, next) => {
  try {
    const { name, min_difficulty, max_difficulty } = req.query;
    const quizzes = await Quiz.getAll({
      name,
      min_difficulty,
      max_difficulty,
    });
    return res.json({ quizzes });
  } catch (err) {
    return next(err);
  }
});

/** POST /
 *
 * Creates a new quiz.
 *
 * Accepts: {name, difficulty}
 *
 * Returns: {quiz: {id, name, difficulty}}
 *
 */
router.post("/", requireProperSchema(newQuizSchema), async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    return res.status(201).json({ quiz });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]
 *
 * Gets details on a quiz including associated questions.
 *
 * Returns:
 *  {job: { id,
 *          name,
 *          difficulty,
 *          questions: [{question_id, quiz_id, text, is_correct}, ...]}}
 *
 * If quiz is not found, raises 404 error
 *
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.getOne(id);
    return res.json({ quiz });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id]
 *
 * Updates a quiz.
 *
 * Accepts: {name, difficulty}
 *
 * Returns: {quiz: {id, name, difficulty}}
 *
 * If quiz cannot be found, raises 404 error.
 */
router.patch(
  "/:id",
  requireProperSchema(updateQuizSchema),
  async (req, res, next) => {
    try {
      const quiz = await Quiz.update(req.params.id, req.body);
      return res.json({ quiz });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[id]
 *
 * Deletes a quiz.
 *
 * Returns: {message: "Quiz deleted"}
 *
 * If quiz cannot be found, raises 404 error.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    await Quiz.delete(req.params.id);
    return res.json({ message: "Quiz deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
