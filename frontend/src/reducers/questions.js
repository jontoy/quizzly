import { LOAD_QUESTION, RESET_ALL } from "../actions/types";

const INITIAL_STATE = {};

/**
 * Sub reducer for portion of state related to quizzes. Stores relevant question
 * details pulled from the API for every visited question
 * @param {Object} state object with keys corresponding to question_ids of visited questions
 * @param {Object} action object with key "type" and optional key "payload"
 */
function questions(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RESET_ALL:
      return { ...INITIAL_STATE };

    case LOAD_QUESTION:
      return {
        ...state,
        [action.payload.question_id]: { ...action.payload },
      };

    default:
      return state;
  }
}

export default questions;
