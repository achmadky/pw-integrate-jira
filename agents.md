# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI, incorporating explicit rules and steps from `manual-test-case-generator`, `playwright-e2e`, and `agent-browser`.

---

## End-to-End QA Automation Workflow

When given a Jira ticket, follow this exact step-by-step framework to prevent hallucinations and ensure thorough test coverage:

### Step 1: Transition Ticket to "In Progress"
- Call Jira REST API to update the given issue key status to **"In Progress"**.

### Step 2: Fetch Ticket & Extract Target URL dynamically
- Fetch the Jira issue details (summary, description, acceptance criteria) via the Jira API.
- Dynamically parse any target URL, endpoints, or environment links provided inside the ticket description/criteria. Never hardcode URLs.

### Step 3: Generate Detailed Manual Test Cases (CSV)
- **Rules & Requirements:**
  1. Parse all acceptance criteria, summary, and description thoroughly. Do not abbreviate or summarize steps—write out every detailed action, input, and expected outcome.
  2. Enumerate detailed behaviors across:
     - **Happy path** (valid input, expected flow, complete multi-step user journey)
     - **Negative** (invalid input, missing fields, wrong types, incorrect formats)
     - **Edge/boundary** (empty fields, max length, zero, null, special characters)
     - **Permission/security** (auth/role/validation)
  3. Never mark anything as "Passed" or "Verified" prior to execution.
  4. Save output at `tests/{issueKey}-test-cases.csv` with explicit, granular test steps.

### Step 4: Explore and Verify via Playwright Browser Automation (MCP / Browser)
- Use browser automation / Playwright MCP to actively visit the **dynamically extracted target URL** from the Jira ticket.
- Perform live exploratory testing on the UI to discover actual locators, element structures, form fields, and behaviors.
- Update `tests/{issueKey}-test-cases.csv` with empirical findings (detailing explicitly what **can** and **cannot** be automated or tested based on live app inspection).

### Step 5: Generate Detailed Playwright E2E Test Script
- **Rules:**
  1. Build the Playwright test script (`tests/{issueKey}.spec.ts`) strictly mapped to the detailed steps, dynamic URL, and empirical findings from the updated CSV test cases.
  2. Implement user-centric testing mirroring real user journeys with resilient locators (`getByRole`, `getByText`, `getByLabel`, `getByTestId`).
  3. Avoid generic placeholders or empty test implementations; write fully realized, actionable test steps matching the app's real DOM structure.

### Step 6: Execute and Validate Test Suite
- Run `npx playwright test tests/{issueKey}.spec.ts`.
- Ensure zero errors or failures. Debug and fix any locators or assertion mismatches.

### Step 7: Complete & Transition Ticket
- Transition the Jira ticket status to **"Done"** or **"In Review"**.
