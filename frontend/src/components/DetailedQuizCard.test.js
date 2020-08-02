import React from "react";
import { render } from "@testing-library/react";
import DetailedQuizCard from "./DetailedQuizCard";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <DetailedQuizCard />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <DetailedQuizCard />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when there are non-zero questions", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <DetailedQuizCard numQuestions={5} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when there are non-zero questions and answers", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <DetailedQuizCard numQuestions={5} numResponses={3} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
