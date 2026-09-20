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

### Step 3: Perform Exploratory Smoke Testing & Generate Feasible Test Cases (CSV)
- **Rules & Requirements:**
  1. Perform a live exploratory smoke test using Playwright browser automation on the dynamically extracted target URL first.
  2. Based on actual empirical findings during exploration, generate detailed manual test cases (CSV) at `tests/{issueKey}-test-cases.csv`.
  3. **Crucial Rule on Feasibility:** Only include test cases that are actually possible and feasible to execute in the automated test environment. **Do not include skipped cases or impossible scenarios** (e.g. external payment gateway APIs requiring live sandbox credentials, admin backend controls without auth tokens, etc.). If a case requires external dependencies that are not possible to automate, **omit it entirely** from both the CSV test cases and the test script.

### Step 4: Upload / Sync Test Cases to Test Case Management (AIO Tests)
- Since the project uses **AIO Tests** (which is free for up to 10 users on Jira Cloud), upload or synchronize the finalized CSV test cases (`tests/{issueKey}-test-cases.csv`) to AIO Tests (either via AIO Tests REST API or Jira-native integration) so they are stored centrally in the TCM.

### Step 5: Generate Detailed Playwright E2E Test Script
- **Rules:**
  1. Build the Playwright test script (`tests/{issueKey}.spec.ts`) strictly mapped to the feasible, verified test steps from the updated CSV test cases.
  2. Implement user-centric testing mirroring real user journeys with resilient locators (`getByRole`, `getByText`, `getByLabel`, `getByTestId`).
  3. Ensure every test in the script is fully runnable and actionable—**no skipped tests or impossible stubs**.

### Step 6: Execute and Validate Test Suite
- Run `npx playwright test tests/{issueKey}.spec.ts`.
- Ensure zero errors, failures, or skipped tests. Debug and fix any locators or assertion mismatches.

### Step 7: Complete & Transition Ticket
- Transition the Jira ticket status to **"Done"** or **"In Review"**.
