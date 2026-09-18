import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";

import { formatEur, formatShare } from "#/lib/money";

import { Breakdown } from "./Breakdown";

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
          category: "Utilities",
          categoryColor: "#123456",
        }))}
      />,
    );

    expect(html).toContain(`entries, ${period ?? "monthly"}`);
    for (const value of [240, 120]) {
      expect(html).toContain(formatEur(value * multiplier));
      expect(html).toContain(formatShare(value / 360));
    }
    expect(html).toContain("width:100%");
    expect(html).toContain("width:50%");
  },
);
