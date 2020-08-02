import React from "react";
import { render } from "@testing-library/react";
import ResultsList from "./ResultsList";

it("renders without crashing", () => {
  render(<ResultsList />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<ResultsList />);
  expect(asFragment()).toMatchSnapshot();
});
