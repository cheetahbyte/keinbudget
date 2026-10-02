// @vitest-environment jsdom
import { Scritto as ScrittoElement } from "@scritto/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";

import { formatEur, formatShare } from "#/lib/money";

import { Breakdown } from "./Breakdown";

afterEach(cleanup);

// jsdom does not implement Web Animations API and matchMedia used by Scritto transitions
Element.prototype.getAnimations ??= () => [];
Element.prototype.animate ??= () =>
  ({
    cancel() {},
    finish() {},
    onfinish: null,
    oncancel: null,
  }) as unknown as Animation;
window.matchMedia ??= (() => ({
  matches: false,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
})) as unknown as typeof window.matchMedia;

it("cycles monthly → daily → yearly → monthly on click", () => {
  function Example() {
    const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">(
      "monthly",
    );
    return <Breakdown items={[]} period={period} onPeriodChange={setPeriod} />;
  }
  render(<Example />);
  for (const next of ["daily", "yearly", "monthly"]) {
    fireEvent.click(screen.getByRole("button", { name: /^Breakdown period:/ }));
    expect(
      screen.getByRole("button", { name: /^Breakdown period:/ }).textContent,
    ).toBe(next);
  }
});

it("configures Scritto numeric transitions matching StatsSection", () => {
  const items = [
    {
      name: "Entry 0",
      value: 120,
      color: "#123456",
      category: "Category 0",
      categoryColor: "#123456",
    },
  ];
  const { container } = render(<Breakdown items={items} period="monthly" />);
  const scrittoEl = container.querySelector("scritto-text") as HTMLElement & {
    transition?: { duration: number; easing: string };
  };

  expect(scrittoEl).not.toBeNull();
  expect(scrittoEl.getAttribute("role")).toBe("img");
  expect(scrittoEl.getAttribute("aria-label")).toBe(formatEur(120));
  expect(scrittoEl.transition).toEqual({ duration: 300, easing: "ease-out" });
});

it("transitions amounts when switching projection periods", () => {
  const updateSpy = vi.spyOn(ScrittoElement.prototype, "update");
  const items = [
    {
      name: "Subscription 1",
      value: 240,
      color: "#123456",
      category: "Cat 1",
      categoryColor: "#123456",
    },
    {
      name: "Subscription 2",
      value: 120,
      color: "#654321",
      category: "Cat 2",
      categoryColor: "#654321",
    },
  ];

  function ControlledBreakdown() {
    const [period, setPeriod] = useState<"daily" | "monthly" | "yearly">(
      "monthly",
    );
    return (
      <Breakdown items={items} period={period} onPeriodChange={setPeriod} />
    );
  }

  const { container } = render(<ControlledBreakdown />);

  const getAmountLabels = () =>
    Array.from(container.querySelectorAll("scritto-text")).map((el) =>
      el.getAttribute("aria-label"),
    );

  // Initial monthly amounts (rendered without animation on initial mount)
  expect(getAmountLabels()).toEqual([formatEur(240), formatEur(120)]);
  expect(updateSpy).toHaveBeenCalledWith(formatEur(240), false);
  expect(updateSpy).toHaveBeenCalledWith(formatEur(120), false);

  updateSpy.mockClear();

  // Switch to daily (triggers animated transition)
  fireEvent.click(screen.getByRole("button", { name: /^Breakdown period:/ }));
  expect(getAmountLabels()).toEqual([
    formatEur((240 * 12) / 365),
    formatEur((120 * 12) / 365),
  ]);
  expect(updateSpy).toHaveBeenCalledWith(formatEur((240 * 12) / 365), true);
  expect(updateSpy).toHaveBeenCalledWith(formatEur((120 * 12) / 365), true);

  updateSpy.mockClear();

  // Switch to yearly (triggers animated transition)
  fireEvent.click(screen.getByRole("button", { name: /^Breakdown period:/ }));
  expect(getAmountLabels()).toEqual([formatEur(240 * 12), formatEur(120 * 12)]);
  expect(updateSpy).toHaveBeenCalledWith(formatEur(240 * 12), true);
  expect(updateSpy).toHaveBeenCalledWith(formatEur(120 * 12), true);

  updateSpy.mockClear();

  // Switch back to monthly (triggers animated transition)
  fireEvent.click(screen.getByRole("button", { name: /^Breakdown period:/ }));
  expect(getAmountLabels()).toEqual([formatEur(240), formatEur(120)]);
  expect(updateSpy).toHaveBeenCalledWith(formatEur(240), true);
  expect(updateSpy).toHaveBeenCalledWith(formatEur(120), true);

  updateSpy.mockRestore();
});

it("transitions amounts when toggling between category and entry views", () => {
  const items = [
    {
      name: "Gym",
      value: 50,
      color: "#0000ff",
      category: "Health",
      categoryColor: "#000099",
    },
    {
      name: "Netflix",
      value: 15,
      color: "#ff0000",
      category: "Entertainment",
      categoryColor: "#990000",
    },
    {
      name: "Spotify",
      value: 10,
      color: "#00ff00",
      category: "Entertainment",
      categoryColor: "#990000",
    },
  ];

  const { container } = render(<Breakdown items={items} period="monthly" />);

  const getAmountLabels = () =>
    Array.from(container.querySelectorAll("scritto-text")).map((el) =>
      el.getAttribute("aria-label"),
    );

  // Default is "By category": Health = 50, Entertainment = 15 + 10 = 25
  expect(getAmountLabels()).toEqual([formatEur(50), formatEur(25)]);

  // Switch to "By entry": Gym = 50, Netflix = 15, Spotify = 10
  fireEvent.click(screen.getByRole("button", { name: "By entry" }));
  expect(getAmountLabels()).toEqual([
    formatEur(50),
    formatEur(15),
    formatEur(10),
  ]);

  // Switch back to "By category"
  fireEvent.click(screen.getByRole("button", { name: "By category" }));
  expect(getAmountLabels()).toEqual([formatEur(50), formatEur(25)]);
});

it.each([
  [undefined, 1],
  ["monthly", 1],
  ["daily", 12 / 365],
  ["yearly", 12],
] as const)(
  "server-renders %s costs without changing shares",
  (period, multiplier) => {
    const html = renderToStaticMarkup(
      <Breakdown
        period={period}
        items={[240, 120].map((value, index) => ({
          name: `Entry ${index}`,
          value,
          color: "#123456",
          category: `Category ${index}`,
          categoryColor: "#123456",
        }))}
      />,
    );

    expect(html).toContain("categories, <button");
    expect(html).toContain(`Breakdown period: ${period ?? "monthly"}.`);
    for (const value of [240, 120]) {
      expect(html).toContain(formatEur(value * multiplier));
      expect(html).toContain(formatShare(value / 360));
    }
    expect(html).toContain("width:100%");
    expect(html).toContain("width:50%");
  },
);

it("server-renders all animated amounts as readable, labelled text", () => {
  const items = [
    {
      name: "Entry 0",
      value: 240,
      color: "#123456",
      category: "Category 0",
      categoryColor: "#123456",
    },
    {
      name: "Entry 1",
      value: 120,
      color: "#123456",
      category: "Category 1",
      categoryColor: "#123456",
    },
  ];
  const html = renderToStaticMarkup(<Breakdown items={items} />);
  const amounts = [...html.matchAll(/<scritto-text\b([^>]*)>/g)];

  expect(amounts).toHaveLength(2);
  for (const [, attributes] of amounts) {
    expect(attributes).toContain('role="img"');
  }
  expect(amounts[0][1]).toContain(`aria-label="${formatEur(240)}"`);
  expect(amounts[1][1]).toContain(`aria-label="${formatEur(120)}"`);
});
