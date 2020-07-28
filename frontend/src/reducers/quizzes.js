import { LOAD_QUIZ, RESET_ALL } from "../actions/types";

const INITIAL_STATE = {};

/**
 * Sub reducer for portion of state related to quizzes. Stores relevant quiz
 * details pulled from the API for every visited quiz
 * @param {Object} state object with keys corresponding to ids of visited quizzes
 * @param {Object} action object with key "type" and optional key "payload"
 */
function quizzes(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RESET_ALL:
      return { ...INITIAL_STATE };

    case LOAD_QUIZ:
      return {
        ...state,
        [action.payload.id]: { ...action.payload },
      };

    default:
      return state;
  }
}

export default quizzes;
