# PLS Commit Ticket

Commit the current working tree. If those changes belong to a Jira ticket, mark that ticket **Done**. Do not implement new work. Do not push unless the user explicitly asks.

1. Run `git status`, `git diff` (staged and unstaged), and `git log -8 --oneline`.
2. Decide whether the pending changes belong to a **PLS** ticket:
   - User named a key (e.g. PLS-12), or
   - Exactly one PLS task is **In Progress**, or
   - The files clearly match one To Do / In Progress ticket on the PLS board.
   Use the Atlassian MCP. If it is unclear which ticket (or none), commit without a key and **do not** change Jira.
3. Stage the files that belong to this commit. Do not stage secrets (`.env`, credentials). Do not stage unrelated leftover files.
4. Commit once, following this repo’s style:
   - Ticket: `[PLS-<n>] <Jira summary>` (Jira summary as the subject; square brackets around the key).
   - No ticket: one imperative sentence, no `feat:` / `fix:` prefix (same as `Hide dist, release, and node_modules from VS Code explorer`).
   Do not amend. Do not `--no-verify`.
5. If this commit was for a ticket, transition that issue to **Done**. Then walk up: for each parent, if every child of that parent is Done, mark the parent **Done**; stop when a parent still has an open child or there is no parent.
6. Run `git status` after the commit. Tell the user the commit subject, which Jira issues were closed (ticket and any parents), and if `master` is ahead of `origin` (do not push).
