import { expect, it } from "vitest";

import { oauthResumeUrl } from "#/lib/oauth-resume";

it("resumes only signed authorize queries", () => {
  expect(oauthResumeUrl("")).toBeNull();
  expect(oauthResumeUrl("?client_id=abc")).toBeNull();
  expect(
    oauthResumeUrl("?client_id=abc&response_type=code&sig=xyz&exp=1"),
  ).toBe(
    "/api/auth/oauth2/authorize?client_id=abc&response_type=code&sig=xyz&exp=1",
  );
});
