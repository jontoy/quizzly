import React from "react";
import { render } from "@testing-library/react";
import ResultsBanner from "./ResultsBanner";

it("renders without crashing", () => {
  render(<ResultsBanner />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<ResultsBanner />);
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when user scores moderately", () => {
  const { asFragment } = render(
    <ResultsBanner numberCorrect={3} totalQuestions={5} />
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when user scores well", () => {
  const { asFragment } = render(
    <ResultsBanner numberCorrect={19} totalQuestions={20} />
  );
  expect(asFragment()).toMatchSnapshot();
});

it("matches snapshot when user scores badly", () => {
  const { asFragment } = render(
    <ResultsBanner numberCorrect={1} totalQuestions={5} />
  );
  expect(asFragment()).toMatchSnapshot();
});
