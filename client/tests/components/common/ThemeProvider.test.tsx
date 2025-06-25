import { render, screen, waitFor } from "@testing-library/react";
import { useEffect } from "react";
import {
  ThemeProvider,
  useTheme,
} from "../../../src/components/common/ThemeProvider";

function TestComponent() {
  const { setTheme, theme } = useTheme();
  useEffect(() => setTheme("dark"), [theme]);
  return null;
}

function TestComponent2() {
  const { theme } = useTheme();
  return <p>{theme}</p>;
}

describe("<ThemeProvider/>", () => {
  it("sets the theme correctly", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );
    await waitFor(() => {
      expect(document.documentElement.classList.contains("theme-dark")).toBe(
        true,
      );
      expect(localStorage.getItem("theme")).toBe("dark");
    });
  });
  it("loads the localStorage on first render", async () => {
    localStorage.setItem("theme", "dark");
    render(
      <ThemeProvider>
        <TestComponent2 />
      </ThemeProvider>,
    );
    await waitFor(() => {
      const elem = screen.getByText(/dark/i);
      expect(elem).toBeInTheDocument();
      expect(elem.textContent).toBe("dark");
      expect(document.documentElement.classList.contains("theme-dark")).toBe(
        true,
      );
    });
  });
});
