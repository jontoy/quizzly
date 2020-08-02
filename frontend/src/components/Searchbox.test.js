import React from "react";
import { render } from "@testing-library/react";
import Searchbox from "./Searchbox";

it("renders without crashing", () => {
  render(<Searchbox />);
});

it("matches snapshot", () => {
  const { asFragment } = render(<Searchbox />);
  expect(asFragment()).toMatchSnapshot();
});
