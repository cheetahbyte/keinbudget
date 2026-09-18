import type { ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { formatEur } from "#/lib/money";
import { StatsSection } from "./StatsSection";

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    search,
    ...props
  }: ComponentProps<"a"> & { to: string; search?: { period: string } }) => (
    <a href={search ? `${to}?period=${search.period}` : to} {...props} />
  ),
}));

it("server-renders all animated amounts as readable, labelled text", () => {
  const projections = {
    income: 2000,
    expenses: 1800,
    savings: 300,
    remaining: -100,
  };
  const html = renderToStaticMarkup(<StatsSection projections={projections} />);
  const amounts = [
    ...html.matchAll(/<scritto-text\b([^>]*)>(.*?)<\/scritto-text>/g),
  ];

  expect(amounts).toHaveLength(4);
  expect(amounts.map((match) => match[2])).toEqual(
    [-100, 2000, 1800, 300].map(formatEur),
  );
  for (const [, attributes, value] of amounts) {
    expect(attributes).toContain(`aria-label="${value}"`);
  }
  expect(html).toContain('href="/breakdown"');
});

it.each([
  ["daily", 12 / 365, "Daily average"],
  ["monthly", 1, "Left after fixed costs"],
  ["yearly", 12, "Yearly projection"],
] as const)(
  "renders %s projections and the selected period during SSR",
  (period, factor, label) => {
    const html = renderToStaticMarkup(
      <StatsSection
        projections={{
          income: 2000,
          expenses: 1800,
          savings: 300,
          remaining: -100,
        }}
        period={period}
      />,
    );
    const amounts = [
      ...html.matchAll(/<scritto-text\b[^>]*>(.*?)<\/scritto-text>/g),
    ];
    expect(amounts.map((match) => match[1])).toEqual(
      [-100, 2000, 1800, 300].map((value) => formatEur(value * factor)),
    );
    expect(html).toContain(label);
    expect(html).toContain(`href="/?period=${period}" aria-current="page"`);
    expect(html).toContain(`Expenses ${formatEur(1800 * factor)}`);
  },
);
