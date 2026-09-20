# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via pure MCP tools (`jira` MCP, `playwright` MCP, `aio-tests` MCP).

---

## End-to-End QA Automation Workflow (Pure MCP Driven)

### Core Mandates & Execution Control
- **Strict Sequential Execution:** Every step below (Steps 1 through 9) is strictly mandatory and MUST be completed in exact sequential order.
- **Assignee Rule:** Before transitioning a ticket from "To Do" to "In Progress", assign the Jira issue to yourself/current user via Jira MCP tool (`jira_update_issue` / `jira_assign_issue`).
- **PURE MCP MANDATE:** All Jira operations (assigning, transitioning status, commenting) and AIO Tests operations (`create_test_case`, `update_test_case`) MUST be executed strictly through MCP tools. No custom runner/helper scripts.
- **STRICT AIO REQUIREMENT & CYCLE MANDATE:** 
  1. Test cases created in AIO Tests MUST be explicitly linked to the Jira requirement (`requirements: [numericJiraIssueId]`) via AIO Tests MCP (`update_test_case`).
  2. Test cases MUST be set to `Published` status via MCP.
  3. Test cases MUST be attached to an execution cycle explicitly linked to `issueKey` (`tasks: [issueKey]`), and executed/reported inside that cycle.
- **STRICT STEP 5 BLOCKER:** You are STRICTLY FORBIDDEN from proceeding to Step 6 (Playwright script creation) or Step 9 (Ticket Completion) UNLESS the Test Cases are published, explicitly linked to the Jira requirement ID, AND attached to the Test Cycle inside AIO Tests.

---

### Step 1: Assign Jira Ticket to Self via Jira MCP Tool
- Use Jira MCP tool to assign `issueKey` to the logged-in user.

### Step 2: Transition Ticket to "In Progress" via Jira MCP Tool
- Use Jira MCP tool to update status to **"In Progress"**.

### Step 3: Fetch Ticket Details via Jira MCP Tool
- Fetch summary, description, numeric issue ID, and acceptance criteria via Jira MCP. Extract target URLs dynamically.

### Step 4: Perform Exploratory Smoke Testing & Generate Feasible Test Cases (CSV)
- Use Playwright MCP / web search tools to explore the target URL.
- Write feasible test cases to `tests/{issueKey}-test-cases.csv`.

### Step 5: [STRICT MANDATORY PREREQUISITE] Create & Publish Test Cases, Link Jira Requirement & Create Cycle via AIO Tests MCP Server
- Invoke AIO Tests MCP tool (`create_test_case`) to create test cases directly in AIO Tests.
- Link test cases to the Jira requirement ID (`requirements: [numericJiraIssueId]`) and set status to `Published` via AIO Tests MCP (`update_test_case`).
- Attach test cases to an execution cycle explicitly linked to `issueKey` (`KAN-CY-X`).

### Step 6: Generate Detailed Playwright E2E Test Script
- Build `tests/{issueKey}.spec.ts` strictly mapped to the feasible test cases from Step 5 with exact test keys (e.g. `{ tag: '@KAN-TC-2' }`).

### Step 7: Execute and Validate Playwright Test Suite with AIO Reporter
- Run `npx playwright test tests/{issueKey}.spec.ts`.
- Verify results are reported live to the AIO Tests Execution Cycle (`KAN-CY-X`).

### Step 8: Post Summary Comment to Jira Ticket via Jira MCP Tool
- Use Jira MCP tool to post a summary comment containing:
  - Total test cases created and their list.
  - Number of passed tests.
  - AIO Tests creation & requirement linkage status (`requirements: [KAN-5]`).
  - Playwright script execution status.

### Step 9: Complete & Transition Ticket via Jira MCP Tool
- Use Jira MCP tool to transition ticket status to **"Done"** or **"In Review"**.
