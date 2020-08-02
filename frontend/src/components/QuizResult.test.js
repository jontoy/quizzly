import React from "react";
import { render } from "@testing-library/react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import QuizzlyApi from "../QuizzlyApi";
import { createMemoryHistory } from "history";
import configureStore from "redux-mock-store";
import Routes from "./Routes";
const mockStore = configureStore([]);
jest.mock("../QuizzlyApi");

const quiz = {
  id: "abcdefg",
  name: "A quiz",
  difficulty: 6,
  questions: [
    { question_id: "q1id", text: "q1" },
    { question_id: "q2id", text: "q2" },
  ],
};

const answers = {
  id: "abcdefg",
  answers: [
    { question_id: "q1id", text: "q1", valid_options: ["opt1id"] },
    { question_id: "q2id", text: "q2", valid_options: ["opt2id"] },
  ],
};
QuizzlyApi.getQuiz.mockResolvedValue(quiz);
QuizzlyApi.getQuizAnswers.mockResolvedValue(answers);

describe("QuizResult tests", () => {
  let store;
  let component;
  beforeEach(() => {
    store = mockStore({
      quizzes: { [quiz.id]: quiz },
      responses: { [quiz.id]: ["opt1id", "opt3id"] },
    });
    const history = createMemoryHistory();
    history.push("/quizzes/abcdefg/results");
    component = render(
      <Provider store={store}>
        <Router history={history}>
          <Routes />
        </Router>
      </Provider>
    );
  });
  it("renders without crashing", () => {});
  it("matches snapshot", () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
