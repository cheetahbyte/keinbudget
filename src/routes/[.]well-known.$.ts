import { createFileRoute } from "@tanstack/react-router";

import { getAuth } from "#/lib/auth";

// OAuth discovery documents (RFC 8414 / RFC 9728) must live at the site root,
// outside the /api/auth prefix, so forward them to the Better Auth handler.
const forward = async ({ request }: { request: Request }) =>
  getAuth().handler(request);

export const Route = createFileRoute("/.well-known/$")({
  server: {
    handlers: {
      GET: forward,
      HEAD: forward,
    },
  },
});
