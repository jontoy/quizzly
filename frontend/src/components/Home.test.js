import React from "react";
import { render } from "@testing-library/react";
import Home from "./Home";
import { MemoryRouter } from "react-router-dom";

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
});

it("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
