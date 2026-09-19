---
name: playwright-executor
description: Executes generated Playwright test specs and manages test reports.
compatibility: Playwright test runner, Node.js.
---

# Playwright Executor Agent

## Purpose
Runs generated test scripts against target web applications and validates correctness.

## Steps
1. Execute `npx playwright test` or run specific spec file (`npx playwright test tests/proj-123.spec.ts`).
2. Capture test execution results (pass/fail, logs, screenshots, traces).
3. (Optional) Report test results or attach logs back to the Jira ticket via REST API.
