import { LOAD_QUESTION } from "./types";
import QuizzlyApi from "../QuizzlyApi";

/**
 * Action creator to fetch details of a question from the Quizzly API.
 * Utilizes redux-thunk as it is asynchronous.
 * @param {Number} question_id ID of question in the Quizzly database
 */
function getQuestionFromAPI(question_id) {
  return async function (dispatch) {
    const question = await QuizzlyApi.getQuestion(question_id);
    dispatch(gotQuestion(question));
  };
}

function gotQuestion(question) {
  return { type: LOAD_QUESTION, payload: question };
}

export { getQuestionFromAPI };
