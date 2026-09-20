import { MCP_PATH, MCP_READ_SCOPE, MCP_WRITE_SCOPE } from "#/lib/mcp-scopes";

import { SettingsSection } from "./SettingsSection";

export function McpSettings({ baseUrl }: { baseUrl: string }) {
  const endpoint = `${baseUrl}${MCP_PATH}`;
  return (
    <SettingsSection title="MCP">
      <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
        Connect an AI assistant (Claude, Cursor, ChatGPT and others that speak
        the Model Context Protocol) to your budget. Add this server URL in the
        assistant; it will open keinbudget in your browser to sign in and ask
        which permissions to grant.
      </p>
      <dl className="divide-y divide-border text-sm">
        <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <dt className="shrink-0 font-medium">Server URL</dt>
          <dd className="min-w-0">
            <code className="block rounded-md border border-input px-3 py-2 break-all select-all">
              {endpoint}
            </code>
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-4">
          <dt className="font-medium">{MCP_READ_SCOPE}</dt>
          <dd className="leading-6 text-muted-foreground">
            read entries, categories and totals
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-4">
          <dt className="font-medium">{MCP_WRITE_SCOPE}</dt>
          <dd className="leading-6 text-muted-foreground">
            create, change and delete entries and categories
          </dd>
        </div>
      </dl>
    </SettingsSection>
  );
}
