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
      <div className="grid gap-2">
        <p className="text-sm font-medium">Server URL</p>
        <code className="w-fit rounded-md bg-muted px-3 py-2 text-sm select-all">
          {endpoint}
        </code>
      </div>
      <dl className="grid gap-1 text-sm">
        <div className="flex gap-2">
          <dt className="font-mono text-muted-foreground">{MCP_READ_SCOPE}</dt>
          <dd>read entries, categories and totals</dd>
        </div>
        <div className="flex gap-2">
          <dt className="font-mono text-muted-foreground">{MCP_WRITE_SCOPE}</dt>
          <dd>create, change and delete entries and categories</dd>
        </div>
      </dl>
    </SettingsSection>
  );
}
