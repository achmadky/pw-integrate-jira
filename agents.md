# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via pure MCP tools (`jira` MCP, `playwright` MCP, `aio-tests` MCP).

---

## End-to-End QA Automation Workflow (Pure MCP Driven)

### Core Mandates & Execution Control
- **Strict Sequential Execution:** Every step below (Steps 1 through 9) is strictly mandatory and MUST be completed in exact sequential order.
- **PURE MCP MANDATE:** All Jira operations (fetching tickets, assigning, transitioning status, commenting) and AIO Tests operations (`create_test_case`, `update_test_case`, `search_test_cases`) MUST be executed strictly through MCP tools. No Node.js scripts in `src/`.
- **CSV DYNAMIC CYCLE RULE:** 
  1. In **Step 4**, test cases written to `tests/{issueKey}-test-cases.csv` MUST leave the `Test Case ID` column blank initially.
  2. In **Step 5**, the AI MUST parse the CSV rows dynamically, invoke AIO Tests MCP (`create_test_case`) to create each test case, retrieve the generated AIO key (e.g. `KAN-TC-X`), link the Jira requirement ID (`requirements: [numericJiraIssueId]`), set status to `Published`, and then **update the CSV file with the real AIO Test Case IDs**.
  3. Playwright test scripts generated in **Step 6** MUST map the dynamically generated AIO test keys (e.g. `{ tag: '@KAN-TC-X' }`) from the updated CSV.
- **STRICT STEP 5 BLOCKER:** You are STRICTLY FORBIDDEN from proceeding to Step 6 (Playwright script creation) or Step 9 (Ticket Completion) UNLESS the CSV has been updated with real AIO test keys, and test cases are published, explicitly linked to the Jira requirement ID, AND attached to the Test Cycle in AIO Tests.

---

### Step 1: Assign Jira Ticket to Self via Jira MCP Tool
- Use Jira MCP tool to assign `issueKey` to the logged-in user.

### Step 2: Transition Ticket to "In Progress" via Jira MCP Tool
- Use Jira MCP tool to update status to **"In Progress"**.

### Step 3: Fetch Ticket Details via Jira MCP Tool
- Fetch summary, description, numeric issue ID, and acceptance criteria via Jira MCP. Extract target URLs dynamically.

### Step 4: Perform Exploratory Smoke Testing & Generate Initial CSV (Blank Test Case IDs)
- Use Playwright MCP / web search tools to explore the target URL.
- Write feasible test cases to `tests/{issueKey}-test-cases.csv` with the `Test Case ID` column left blank.

### Step 5: [STRICT MANDATORY PREREQUISITE] Create Test Cases in AIO Tests via MCP & Update CSV with Generated AIO Keys
- Read `tests/{issueKey}-test-cases.csv` and dynamically parse every feasible test case row.
- For each row, invoke AIO Tests MCP tool (`create_test_case`) with `status: "Published"`, `requirements: [numericJiraIssueId]`, `stepType: "Classic"`, and `steps`.
- Retrieve the auto-generated AIO Test Case Key (e.g. `KAN-TC-6`, `KAN-TC-7`).
- Update `tests/{issueKey}-test-cases.csv` to fill in the `Test Case ID` column with the real AIO Test Case Keys.
- Verify creation via AIO Tests MCP (`search_test_cases`).

### Step 6: Generate Detailed Playwright E2E Test Script from Updated CSV
- Read the updated `tests/{issueKey}-test-cases.csv` containing real AIO Test Case Keys.
- Build `tests/{issueKey}.spec.ts` strictly mapped to the CSV test cases using the real AIO test tags (e.g. `{ tag: '@KAN-TC-6' }`).

### Step 7: Execute and Validate Playwright Test Suite with AIO Reporter
- Run `npx playwright test tests/{issueKey}.spec.ts`.
- Verify results are reported live to the AIO Tests Execution Cycle (`Execution Cycle - {issueKey}`).

### Step 8: Post Summary Comment to Jira Ticket via Jira MCP Tool
- Use Jira MCP tool to post a summary comment containing:
  - Total test cases created and their list of real AIO keys (from the updated CSV).
  - Number of passed tests.
  - AIO Tests creation & requirement linkage status (`requirements: [{issueKey}]`).
  - Playwright script execution status.

### Step 9: Complete & Transition Ticket via Jira MCP Tool
- Use Jira MCP tool to transition ticket status to **"Done"** or **"In Review"**.
