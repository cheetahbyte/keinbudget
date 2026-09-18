import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { formatEur } from "#/lib/money";
import { StatsSection } from "./StatsSection";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => (
    <a href={to}>{children}</a>
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
