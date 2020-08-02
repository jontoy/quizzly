import React from "react";
import { render } from "@testing-library/react";
import QuizCard from "./QuizCard";

it("renders without crashing", () => {
  render(<QuizCard />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<QuizCard />);
  expect(asFragment()).toMatchSnapshot();
});
