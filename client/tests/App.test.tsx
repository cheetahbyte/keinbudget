import { render, screen } from "@testing-library/react";

describe("App", () => {
  it("renders headline", () => {
    render(<p>Test</p>);
    const headline = screen.getByText(/Test/i);
    expect(headline).toBeInTheDocument();
  });
});