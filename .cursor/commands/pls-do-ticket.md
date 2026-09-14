# PLS Do Ticket

Implement one Jira ticket end to end. Do not start a second ticket in the same run.

If the user named a key (e.g. PLS-11), use that. Otherwise take the next To Do ticket in board order that is unblocked by code and git history.

Workflow:

1. Open the ticket in Jira (Atlassian MCP). Read the full description. Read linked Confluence pages if the ticket points at them.
2. Transition the ticket to **In Progress**.
3. If anything in the ticket is ambiguous, ask and wait. If it is clear, implement without waiting.
4. Change only what the ticket requires. Do not steal work from later tickets. Stick to the CRXJS layout (`manifest.config.ts` at repo root, `src/sidepanel`, `src/background`, `src/store`, `src/database`, `src/types`).
5. Verify with `npm run build` (and the smallest check that matches the ticket).
6. Do **not** create a git commit unless the user explicitly asks. Do **not** mark the ticket Done unless the user asks.

Last message in the chat must be exactly the commit subject, nothing after it:

`[PLS-<n>] <Jira summary>`

Example: `[PLS-9] Manifest, icons, and open the side panel from the toolbar`

Use the Jira summary as the subject. Square brackets around the key. One key, one commit name.
