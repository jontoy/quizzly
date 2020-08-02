import React from "react";
import { render } from "@testing-library/react";
import Quiz from "./Quiz";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store";
import QuizzlyApi from "../QuizzlyApi";

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

QuizzlyApi.getQuiz.mockResolvedValue(quiz);

it("renders without crashing", () => {
  render(
    <Provider store={store}>
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    </Provider>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <Provider store={store}>
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>
    </Provider>
  );
  expect(asFragment()).toMatchSnapshot();
});
