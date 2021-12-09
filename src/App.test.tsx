import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders", () => {
  render(<App />);
  const linkElement = screen.getByText(/hook/i);
  expect(linkElement).toBeInTheDocument();
});
