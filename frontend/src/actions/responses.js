import { RESET_RESPONSES, ADD_RESPONSE } from "./types";

function addResponse(quizId, questionNumber, response) {
  return { type: ADD_RESPONSE, payload: { quizId, questionNumber, response } };
}

function resetResponses(quizId) {
  return { type: RESET_RESPONSES, payload: { quizId } };
}

export { addResponse, resetResponses };
