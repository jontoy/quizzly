import { LOAD_QUIZ } from "./types";
import QuizzlyApi from "../QuizzlyApi";

/**
 * Action creator to fetch details of a quiz from the Quizzly API.
 * Utilizes redux-thunk as it is asynchronous.
 * @param {Number} id ID of quiz in the Quizzly database
 */
function getQuizFromAPI(id) {
  return async function (dispatch) {
    const quiz = await QuizzlyApi.getQuiz(id);
    dispatch(gotQuiz(quiz));
  };
}

function gotQuiz(quiz) {
  return { type: LOAD_QUIZ, payload: quiz };
}

export { getQuizFromAPI };
