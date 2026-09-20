// Better Auth redirects to the login page with the signed authorize query when
// an OAuth client (for example an MCP client) needs a session. After sign-in,
// sending the browser back to the authorize endpoint resumes that flow.
export function oauthResumeUrl(search: string): string | null {
  const params = new URLSearchParams(search);
  if (!params.has("client_id") || !params.has("sig")) return null;
  return `/api/auth/oauth2/authorize?${params.toString()}`;
}
