export const MCP_READ_SCOPE = "budget:read";
export const MCP_WRITE_SCOPE = "budget:write";

export const MCP_SCOPES = [
  "openid",
  "profile",
  "email",
  "offline_access",
  MCP_READ_SCOPE,
  MCP_WRITE_SCOPE,
] as const;

export const MCP_PATH = "/api/mcp";

// Short-lived JWT access tokens cannot be revoked, so revocation is bounded
// by this lifetime plus the consent check in the MCP route.
export const MCP_ACCESS_TOKEN_TTL_SECONDS = 10 * 60;
export const MCP_REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;
