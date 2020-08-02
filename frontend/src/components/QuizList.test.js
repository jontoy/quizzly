import React from "react";
import { render } from "@testing-library/react";
import QuizList from "./QuizList";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <QuizList />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <QuizList />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when passed quizzes", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <QuizList
        quizzes={[{ id: "abcdefg", name: "test quiz", difficulty: 5 }]}
      />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
