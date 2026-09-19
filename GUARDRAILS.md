# Project Guardrails (`pw-integrate-jira`)

To ensure safe development and prevent accidental destructive actions, the following guardrails are enforced:

## 1. Destructive Command Restrictions
- **No `rm -rf`** on root, system directories, or `.git`.
- **No Force Pushes** (`git push --force` / `git push -f`).
- **No Hard Resets** (`git reset --hard`) without explicit user sign-off.

## 2. File Modification & Deletion Rules
- **Never delete user code, test suites, or configuration files** (`package.json`, `playwright.config.ts`, etc.) without explicit instruction.
- **Environment variables** (`.env`) are sensitive; never commit `.env` files to git (enforced via `.gitignore`).

## 3. Execution & Verification Rules
- Always verify dependencies and configurations before running test suites.
- Use non-destructive operations and follow safe git workflows.
