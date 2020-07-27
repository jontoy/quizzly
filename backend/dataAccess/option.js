const db = require("../db");
const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");

/** The data access layer relating to option queries */
class Option {
  /** Returns list of basic option info:
   *
   * [{option_id, question_id, value, is_correct}, ...]
   *
   * Optionally allows filtering by question_id value, and is_correct
   * Results are sorted by value
   * */
  static async getAll({ question_id, value, is_correct }) {
    let baseQuery =
      "SELECT option_id, question_id, value, is_correct FROM options";
    const whereExpressions = [];
    const queryValues = [];
    if (question_id && question_id.length > 0) {
      queryValues.push(question_id);
      whereExpressions.push(`question_id = $${queryValues.length}`);
    }
    if (value && value.length > 0) {
      queryValues.push(`%${value}%`);
      whereExpressions.push(`value ILIKE $${queryValues.length}`);
    }
    if (["true", "false"].includes(String(is_correct))) {
      queryValues.push(is_correct);
      whereExpressions.push(`is_correct = $${queryValues.length}`);
    }
    if (whereExpressions.length > 0) {
      baseQuery += " WHERE ";
    }
    const finalQuery =
      baseQuery + whereExpressions.join(" AND ") + " ORDER BY value";
    const results = await db.query(finalQuery, queryValues);
    console.log(finalQuery);
    return results.rows;
  }

  /** Creates an option and returns full option info:
   * {option_id, question_id, value, is_correct}
   * **/
  static async create({ question_id, value, is_correct }) {
    const result = await db.query(
      `INSERT INTO options
            (question_id, value, is_correct)
            VALUES ($1, $2, $3)
            RETURNING option_id, question_id, value, is_correct`,
      [question_id, value, is_correct]
    );
    return result.rows[0];
  }
  /** Returns option info: {option_id, question_id, value, is_correct,
   *                      question: {question_id, quiz_id, text, order_priority}}
   * If option cannot be found, raises a 404 error.
   **/
  static async getOne(option_id) {
    const result = await db.query(
      `SELECT option_id, question_id, value, is_correct
        FROM options
        WHERE option_id = $1`,
      [option_id]
    );
    const option = result.rows[0];
    if (!option) {
      throw new ExpressError(
        `No option found with option_id ${option_id}`,
        404
      );
    }
    const questionResult = await db.query(
      `SELECT question_id, quiz_id, text, order_priority
            FROM questions
            WHERE question_id = $1`,
      [option.question_id]
    );
    option.question = questionResult.rows[0];
    return option;
  }

  /** Selectively updates option from given data
   *
   * Returns all data about option.
   *
   * If option cannot be found, raises a 404 error.
   *
   **/
  static async update(option_id, data) {
    let { query, values } = sqlForPartialUpdate(
      "options",
      data,
      "option_id",
      option_id
    );
    const result = await db.query(query, values);
    const option = result.rows[0];
    if (!option) {
      throw new ExpressError(
        `No option found with option_id ${option_id}`,
        404
      );
    }
    return option;
  }
  /** Deletes option. Returns true.
   *
   * If option cannot be found, raises a 404 error.
   *
   **/
  static async delete(option_id) {
    const result = await db.query(
      `DELETE FROM options 
        WHERE option_id = $1
        RETURNING option_id`,
      [option_id]
    );
    if (!result.rows[0]) {
      throw new ExpressError(
        `No option found with option_id ${option_id}`,
        404
      );
    }
    return true;
  }
}

module.exports = Option;
