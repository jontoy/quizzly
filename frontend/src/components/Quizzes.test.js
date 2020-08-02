import React from "react";
import { render } from "@testing-library/react";
import Quizzes from "./Quizzes";
import { MemoryRouter } from "react-router-dom";
import QuizzlyApi from "../QuizzlyApi";

jest.mock("../QuizzlyApi");
QuizzlyApi.getQuizzes.mockResolvedValue([]);

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <Quizzes />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <Quizzes />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
