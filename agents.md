# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via pure MCP tools (`jira` MCP, `playwright` MCP, `aio-tests` MCP).

---

## End-to-End QA Automation Workflow (Pure MCP Driven)

### Core Mandates & Execution Control
- **Strict Sequential Execution:** Every step below (Steps 1 through 9) is strictly mandatory and MUST be completed in exact sequential order.
- **Assignee Rule:** Before transitioning a ticket from "To Do" to "In Progress", assign the Jira issue to yourself/current user via Jira MCP tool (`jira_update_issue` / `jira_assign_issue`).
- **PURE MCP MANDATE:** All Jira operations (assigning, transitioning status, commenting) and AIO Tests operations (`create_test_case`, `update_test_case`, `search_test_cases`, `get_test_case`) MUST be executed strictly through MCP tools. No custom runner/helper scripts.
- **STRICT STEP 5 MANDATORY VERIFICATION BLOCKER:**
  You are STRICTLY FORBIDDEN from proceeding to Step 6 (Playwright script creation), Step 7, or Step 9 (Ticket Completion) UNLESS ALL of the following 4 conditions are verified:
  1. **AIO Case Creation**: Test cases MUST be created in AIO Tests via MCP (`create_test_case`) with `status: "Published"`.
  2. **Jira Requirement Linkage**: Test cases MUST be verified to be linked to the numeric Jira requirement ID (`requirements: [numericJiraIssueId]`).
  3. **AIO Cycle Association**: Test cases MUST be attached to an Execution Cycle linked to `issueKey` (`tasks: [issueKey]`).
  4. **CSV Key Update**: The CSV file `tests/test-cases/{issueKey}-test-cases.csv` MUST be updated with the real verified AIO Test Case Keys.
  - **IF ANY OF THESE 4 CONDITIONS FAIL, STOP IMMEDIATELY, INFORM THE USER OF THE EXACT FAILURE, AND DO NOT PROCEED TO STEP 6.**

---

### Step 1: Assign Jira Ticket to Self via Jira MCP Tool
- Use Jira MCP tool to assign `issueKey` to the logged-in user.

### Step 2: Transition Ticket to "In Progress" via Jira MCP Tool
- Use Jira MCP tool to update status to **"In Progress"**.

### Step 3: Fetch Ticket Details via Jira MCP Tool
- Fetch summary, description, numeric issue ID, and acceptance criteria via Jira MCP.
- Dynamically parse the target URL and feature scope. Never assume or hardcode any domain or feature logic.

### Step 4: Perform Exploratory Smoke Testing & Generate Initial CSV (Blank Test Case IDs)
- Use Playwright MCP / web tools to navigate to and inspect the target URL's DOM elements and interactive components.
- Enumerate all feasible, grounded test cases covering **Happy Path**, **Negative**, and **Edge/Boundary** scenarios for the ticket's specific feature.
- Write feasible test cases to `tests/test-cases/{issueKey}-test-cases.csv` with the `Test Case ID` column left blank.

### Step 5: [ABSOLUTE MANDATORY PREREQUISITE & BLOCKER] Create Test Cases in AIO Tests, Link Jira Requirement, Attach to Cycle & Update CSV
- Read `tests/test-cases/{issueKey}-test-cases.csv` and dynamically parse every feasible test case row.
- For each row, invoke AIO Tests MCP tool (`create_test_case`) with `status: "Published"`, `requirements: [numericJiraIssueId]`, `stepType: "Classic"`, and `steps`.
- Verify each test case via AIO Tests MCP (`get_test_case`) to confirm requirement linkage (`requirements: [numericJiraIssueId]`) and published status.
- Update `tests/test-cases/{issueKey}-test-cases.csv` to fill in the `Test Case ID` column with the real AIO Test Case Keys.
- Ensure test cases are attached to the Execution Cycle linked to `issueKey`.
- **VERIFY ALL 4 CONDITIONS BEFORE MOVING TO STEP 6.**

### Step 6: Generate Standardized Playwright E2E Test Script from Updated CSV (POM, Fixtures, test.step)
- Read the updated `tests/test-cases/{issueKey}-test-cases.csv` containing verified real AIO Test Case Keys.
- Build feature page classes under `tests/pages/` (inheriting from `tests/pages/base.page.ts`), custom fixtures under `tests/fixtures/page.fixture.ts`, and test data under `tests/utils/test-data.ts`.
- Build `tests/e2e/{issueKey}.spec.ts` strictly mapped to all CSV test cases using the real AIO test tags (e.g. `{ tag: '@KAN-TC-12' }`), custom fixtures, and `test.step('...', async () => { ... })`.

### Step 7: Execute and Validate Playwright Test Suite with AIO Reporter
- Run `npx playwright test tests/e2e/{issueKey}.spec.ts`.
- Verify results are reported live to the AIO Tests Execution Cycle (`Execution Cycle - {issueKey}`).

### Step 8: Post Summary Comment to Jira Ticket via Jira MCP Tool
- Use Jira MCP tool to post the following concise summary comment format:
  ```text
  QA Execution Summary:

  - Status: PASSED
  - Environment: Staging / UAT
  - Results: {passedCount} Passed, {failedCount} Failed, {skippedCount} Skipped

  Test cases and execution cycle have been created and linked to this ticket in AIO Tests.

  Let me know if you have any question/clarification. Thanks!
  ```

### Step 9: Complete & Transition Ticket via Jira MCP Tool
- Use Jira MCP tool to transition ticket status to **"Done"** or **"In Review"**.
