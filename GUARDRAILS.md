# Project Guardrails (`pw-integrate-jira`)

To ensure safe development and prevent accidental destructive actions, the following guardrails are enforced:

## 1. Secrets & Token Protection
- **Never read out loud, print, log, display, or save API keys, tokens, or credentials anywhere.**
- Always reference secrets via environment variables (`process.env.AIO_API_KEY`, `process.env.JIRA_API_TOKEN`, etc.) directly without echoing or writing them to output, files, logs, or commits.
- Environment variables (`.env`) are sensitive; never commit `.env` files to git (enforced via `.gitignore`).

## 2. Destructive Command & Git Restrictions
- **Strict Scope Constraint:** All git operations (`git commit`, `git push`, branch operations) and GitHub CLI commands (`gh`) are STRICTLY limited to the current repository (`pw-integrate-jira` / `achmadky/pw-integrate-jira`). Operating on or pushing to ANY other project or repository is strictly forbidden unless the user explicitly requests and approves changing the target repository.
- **Single Action Restriction for `gh`:** The `gh` CLI may ONLY be used to create Pull Requests (`gh pr create`) for `pw-integrate-jira`. No other `gh` commands (issue manipulation, release deletion, repo creation, secret modification) are permitted.
- **Strict Branch Naming Standard:** All agent-generated branches MUST follow the standard pattern: `agent/feat/{issueKey}-{kebab-summary}` (e.g. `agent/feat/KAN-9-search-feature`).
- **Strict Commit & PR Standard:** Commits and PR titles MUST follow Conventional Commits: `feat({issueKey}): {jiraSummary}` (e.g. `feat(KAN-9): Search Feature`).
- **No Unsolicited Commits, Pushes, or PRs:** NEVER run `git commit`, `git push`, branch creation, or `gh pr create` automatically or randomly. You MUST always prompt and receive explicit confirmation from the user before executing ANY git commit, push, or PR command.
- **No Force Pushes** (`git push --force` / `git push -f`).
- **No Hard Resets** (`git reset --hard`) without explicit user sign-off.
- **No `rm -rf`** on root, system directories, or `.git`.

## 3. File Modification & Deletion Rules
- **Never delete user code, test suites, or configuration files** (`package.json`, `playwright.config.ts`, etc.) without explicit instruction.

## 4. Execution & Verification Rules
- Always verify dependencies and configurations before running test suites.
- Use non-destructive operations and follow safe git workflows.
- **Zero-Tolerance Execution Blocker:** Cannot proceed to PR creation or Slack alerts if any test fails or has errors. Any failure must be investigated, fixed, and verified passing 100% first.
- **PR URL Blocker:** Cannot proceed to Slack alert without a verified, live GitHub PR URL returned by `gh pr create`.
