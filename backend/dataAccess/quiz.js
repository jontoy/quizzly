const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const Question = require("./question");

/** The data access layer relating to quiz queries */
class Quiz {
  /** Returns list of basic quiz info:
   *
   * [{id, name, difficulty}, ...]
   *
   * Optionally allows filtering by name, min_difficulty and max_difficulty
   * If min_difficulty > max_difficulty, a 400 error is raised.
   * Results are sorted by name
   * */
  static async getAll({ name, min_difficulty, max_difficulty }) {
    let baseQuery = "SELECT id, name, difficulty FROM quizzes";
    const whereExpressions = [];
    const queryValues = [];
    if (name && name.length > 0) {
      queryValues.push(`%${name}%`);
      whereExpressions.push(`name ILIKE $${queryValues.length}`);
    }
    if (min_difficulty && !isNaN(min_difficulty)) {
      queryValues.push(min_difficulty);
      whereExpressions.push(`difficulty >= $${queryValues.length}`);
    }
    if (max_difficulty && !isNaN(max_difficulty)) {
      if (min_difficulty && Number(min_difficulty) > Number(max_difficulty)) {
        throw new ExpressError(
          "min_difficulty must be less than max_difficulty",
          400
        );
      }
      queryValues.push(max_difficulty);
      whereExpressions.push(`difficulty <= $${queryValues.length}`);
    }
    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }
    const finalQuery =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY name";
    const results = await db.query(finalQuery, queryValues);
    return results.rows;
  }

  /** Creates a quiz and returns full quiz info: {id, name, difficulty} **/
  static async create({ name, difficulty }) {
    const result = await db.query(
      `INSERT INTO quizzes
            (name, difficulty)
            VALUES ($1, $2)
            RETURNING id, name, difficulty`,
      [name, difficulty]
    );
    return result.rows[0];
  }
  /** Returns quiz info: {id, name, difficulty, questions:[question1,...]}
   *
   * If quiz cannot be found, raises a 404 error.
   *
   **/
  static async getOne(id) {
    const result = await db.query(
      `SELECT id, name, difficulty 
        FROM quizzes
        WHERE id = $1`,
      [id]
    );
    const quiz = result.rows[0];
    if (!quiz) {
      throw new ExpressError(`No quiz found with id ${id}`, 404);
    }
    quiz.questions = await Question.getAll({ quiz_id: quiz.id });
    return quiz;
  }

  /** Selectively updates quiz from given data
   *
   * Returns all data about quiz.
   *
   * If quiz cannot be found, raises a 404 error.
   *
   **/
  static async update(id, data) {
    let { query, values } = sqlForPartialUpdate("quizzes", data, "id", id);
    const result = await db.query(query, values);
    const quiz = result.rows[0];
    if (!quiz) {
      throw new ExpressError(`No quiz found with id ${id}`, 404);
    }
    return quiz;
  }
  /** Deletes quiz. Returns true.
   *
   * If quiz cannot be found, raises a 404 error.
   *
   **/
  static async delete(id) {
    const result = await db.query(
      `DELETE FROM quizzes 
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    if (!result.rows[0]) {
      throw new ExpressError(`No quiz found with id ${id}`, 404);
    }
    return true;
  }

  /** Returns answers to specified quiz:
   * {id, answers:[{question_id1, text1, valid_options:[opt1, opt2, ...]},...]}
   **/
  static async getAnswers(id) {
    const result = await db.query(
      `SELECT qz.id, qz.name, qz.difficulty, 
        qstn.question_id, qstn.text, qstn.order_priority, 
        JSON_AGG(o.option_id) AS "valid_options"
        FROM quizzes qz
        JOIN questions qstn ON qz.id = qstn.quiz_id
        JOIN options o ON qstn.question_id = o.question_id
        WHERE qz.id = $1 AND o.is_correct = $2
        GROUP BY (qz.id, qstn.question_id)
        ORDER BY qstn.order_priority`,
      [id, true]
    );

    const quizAnswers = { quiz_id: result.rows[0].id };
    quizAnswers.answers = result.rows.map(
      ({ question_id, text, valid_options }) => ({
        question_id,
        text,
        valid_options,
      })
    );
    return quizAnswers;
  }
}

module.exports = Quiz;
