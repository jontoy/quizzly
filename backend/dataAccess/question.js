const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const Option = require("./option");

/** The data access layer relating to question queries */
class Question {
  /** Returns list of basic quiz info:
   *
   * [{question_id, quiz_id, text, order_priority}, ...]
   *
   * Optionally allows filtering by quiz_id and text
   * Results are sorted by order_priority
   * */
  static async getAll({ quiz_id, text }) {
    let baseQuery =
      "SELECT question_id, quiz_id, text, order_priority FROM questions";
    const whereExpressions = [];
    const queryValues = [];
    if (quiz_id && quiz_id.length > 0) {
      queryValues.push(quiz_id);
      whereExpressions.push(`quiz_id = $${queryValues.length}`);
    }
    if (text && text.length > 0) {
      queryValues.push(`%${text}%`);
      whereExpressions.push(`text ILIKE $${queryValues.length}`);
    }
    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }
    const finalQuery =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY order_priority";
    const results = await db.query(finalQuery, queryValues);

    return results.rows;
  }

  /** Creates a question and returns full question info:
   * {question_id, quiz_id, text, order_priority}
   * **/
  static async create({ quiz_id, text, order_priority }) {
    const result = await db.query(
      `INSERT INTO questions
            (quiz_id, text, order_priority)
            VALUES ($1, $2, $3)
            RETURNING question_id, quiz_id, text, order_priority`,
      [quiz_id, text, order_priority]
    );
    return result.rows[0];
  }
  /** Returns question info: {question_id, quiz_id, text, order_priority,
   *                      quiz: {id, name, difficulty},
   *                      options:[option1,...]}
   *
   * If question cannot be found, raises a 404 error.
   *
   **/
  static async getOne(question_id) {
    const result = await db.query(
      `SELECT question_id, quiz_id, text, order_priority 
        FROM questions
        WHERE question_id = $1`,
      [question_id]
    );
    const question = result.rows[0];
    if (!question) {
      throw new ExpressError(
        `No question found with question_id ${question_id}`,
        404
      );
    }
    const quizResult = await db.query(
      `SELECT id, name, difficulty
            FROM quizzes
            WHERE id = $1`,
      [question.quiz_id]
    );
    question.quiz = quizResult.rows[0];
    question.options = await Option.getAll({
      question_id: question.question_id,
    });
    return question;
  }

  /** Selectively updates question from given data
   *
   * Returns all data about question.
   *
   * If question cannot be found, raises a 404 error.
   *
   **/
  static async update(question_id, data) {
    let { query, values } = sqlForPartialUpdate(
      "questions",
      data,
      "question_id",
      question_id
    );
    const result = await db.query(query, values);
    const question = result.rows[0];
    if (!question) {
      throw new ExpressError(
        `No question found with question_id ${question_id}`,
        404
      );
    }
    return question;
  }
  /** Deletes question. Returns true.
   *
   * If question cannot be found, raises a 404 error.
   *
   **/
  static async delete(question_id) {
    const result = await db.query(
      `DELETE FROM questions 
        WHERE question_id = $1
        RETURNING question_id`,
      [question_id]
    );
    if (!result.rows[0]) {
      throw new ExpressError(
        `No question found with question_id ${question_id}`,
        404
      );
    }
    return true;
  }
}

module.exports = Question;
