import {
  LOAD_QUIZ,
  ADD_RESPONSE,
  RESET_ALL,
  RESET_RESPONSES,
} from "../actions/types";

const INITIAL_STATE = {};

/**
 * Sub reducer for portion of state related to quiz responses.
 * @param {Object} state object with keys corresponding to ids of visited quizzes
 * @param {Object} action object with key "type" and optional key "payload"
 */
function quizzes(state = INITIAL_STATE, action) {
  switch (action.type) {
    case RESET_ALL:
      return { ...INITIAL_STATE };

    case RESET_RESPONSES:
      return { ...state, [action.payload.quizId]: [] };

    case LOAD_QUIZ:
      return {
        ...state,
        [action.payload.id]: [],
      };

    case ADD_RESPONSE:
      const { quizId, questionNumber, response } = action.payload;
      const newState = { ...state };
      newState[quizId][questionNumber] = response;
      return newState;

    default:
      return state;
  }
}

export default quizzes;
