import { combineReducers } from "redux";
import quizzes from "./quizzes";
import questions from "./questions";
import responses from "./responses";

/**
 * Root reducer, combines the quizzes and questions sub reducers
 */
export default combineReducers({
  quizzes,
  questions,
  responses,
});
