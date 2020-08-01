import axios from "axios";
import config from "./config";
const DATABASE_URL =
  process.env.REACT_APP_BASE_URL ||
  config.DATABASE_URL ||
  "http://localhost:3001";

class QuizzlyApi {
  static async request(endpoint, paramsOrData = {}, verb = "get") {
    console.debug("API Call:", endpoint, paramsOrData, verb);

    try {
      return (
        await axios({
          method: verb,
          url: `${DATABASE_URL}/${endpoint}`,
          [verb === "get" ? "params" : "data"]: paramsOrData,
        })
      ).data;
      // axios sends query string data via the "params" key,
      // and request body data via the "data" key,
      // so the key we need depends on the HTTP verb
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.message;
      throw Array.isArray(message) ? message : [message];
    }
  }
  static async getQuizzes({ name, min_difficulty, max_difficulty }) {
    let res = await this.request(`quiz`, {
      name,
      min_difficulty,
      max_difficulty,
    });
    return res.quizzes;
  }
  static async getQuiz(id) {
    let res = await this.request(`quiz/${id}`);
    return res.quiz;
  }
  static async getQuizAnswers(id) {
    let res = await this.request(`quiz/${id}/answers`);
    return res.answers;
  }
  static async getQuestions({ text, quiz_id }) {
    let res = await this.request(`question`, {
      text,
      quiz_id,
    });
    return res.quizzes;
  }
  static async getQuestionsByQuizId(quiz_id) {
    return await this.getQuestions({ quiz_id });
  }
  static async getQuestion(question_id) {
    let res = await this.request(`question/${question_id}`);
    return res.question;
  }
  static async getOptions({ value, question_id, is_correct }) {
    let res = await this.request(`option`, {
      value,
      question_id,
      is_correct,
    });
    return res.quizzes;
  }
  static async getOptionsByQuestionId(question_id) {
    return await this.getOptions({ question_id });
  }
  static async getOption(option_id) {
    let res = await this.request(`option/${option_id}`);
    return res.option;
  }
}

export default QuizzlyApi;
