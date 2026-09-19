# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI, incorporating explicit rules and steps from `manual-test-case-generator`, `playwright-e2e`, and `agent-browser`.

---

## End-to-End QA Automation Workflow

When given a Jira ticket, follow this exact step-by-step framework to prevent hallucinations and maintain efficiency:

### Step 1: Transition Ticket to "In Progress"
- Call Jira REST API to update the given issue key status to **"In Progress"**.

### Step 2: Generate Manual Test Cases (CSV)
- **Rules (from Manual Test Case Generator):**
  1. Grounded strictly in ticket requirements and codebase behavior.
  2. Enumerate behaviors across:
     - **Happy path** (valid input, expected flow)
     - **Negative** (invalid input, missing fields, wrong types)
     - **Edge/boundary** (empty, max length, zero, null)
     - **Permission/security** (auth/role/validation)
  3. Never mark anything as "Passed" or "Verified" prior to execution. Leave actual result blank or note verification status.
  4. Save output at `tests/{issueKey}-test-cases.csv`.

### Step 3: Verify with Playwright MCP / Browser Automation
- Execute checks using browser/Playwright tools against the target feature URL.
- Test actual behavior and distinguish between what **can** and **cannot** be automated (e.g., frontend validations vs. restricted admin backend actions).
- Update the CSV test cases with empirical findings.

### Step 4: Generate Playwright E2E Test Script
- **Rules (from Playwright E2E Skill):**
  1. User-centric testing mirroring real user journeys.
  2. Resilient selectors: prefer `getByRole`, `getByText`, `getByLabel`, `getByTestId` over CSS/XPath.
  3. Auto-waiting: leverage built-in auto-waiting, avoid explicit `waitForTimeout`.
  4. Isolation: each test must be independent.
  5. Implement Page Object Model (POM) or clean test structure in `tests/{issueKey}.spec.ts`.

### Step 5: Execute and Validate Test Suite
- Run `npx playwright test tests/{issueKey}.spec.ts`.
- Ensure zero errors or failures. Debug and fix any flaky or failing locators.

### Step 6: Complete & Transition Ticket
- Transition the Jira ticket status to **"Done"** or **"In Review"**.
