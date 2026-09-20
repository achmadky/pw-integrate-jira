# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via pure MCP tools (`jira` MCP, `playwright` MCP, `aio-tests` MCP).

---

## End-to-End QA Automation Workflow (Pure MCP Driven)

### Core Mandates & Execution Control
- **Strict Sequential Execution:** Every step below (Steps 1 through 9) is strictly mandatory and MUST be completed in exact sequential order.
- **Assignee Rule:** Before transitioning a ticket from "To Do" to "In Progress", assign the Jira issue to yourself/current user via Jira MCP tool (`jira_update_issue` / `jira_assign_issue`).
- **PURE MCP MANDATE:** All Jira operations (assigning, transitioning status, commenting) and AIO Tests operations (`create_test_case`) MUST be executed strictly through MCP tools. No custom runner/helper scripts.
- **STRICT STEP 5 BLOCKER:** You are STRICTLY FORBIDDEN from proceeding to Step 6 (Playwright script creation) or Step 9 (Ticket Completion) UNLESS both the Test Cases AND the Test Cycle have been successfully created and linked to the Jira ticket via **AIO Tests MCP**.

---

### Step 1: Assign Jira Ticket to Self via Jira MCP Tool
- Use Jira MCP tool to assign `issueKey` to the logged-in user.

### Step 2: Transition Ticket to "In Progress" via Jira MCP Tool
- Use Jira MCP tool to update status to **"In Progress"**.

### Step 3: Fetch Ticket Details via Jira MCP Tool
- Fetch summary, description, and acceptance criteria via Jira MCP. Extract target URLs dynamically.

### Step 4: Perform Exploratory Smoke Testing & Generate Feasible Test Cases (CSV)
- Use Playwright MCP / web search tools to explore the target URL.
- Write feasible test cases to `tests/{issueKey}-test-cases.csv`.

### Step 5: [STRICT MANDATORY PREREQUISITE] Create Test Cases & Test Cycle via AIO Tests MCP Server
- Invoke AIO Tests MCP tool (`create_test_case`) to create test cases directly in AIO Tests.
- Attach test cases to an execution cycle linked to `issueKey`.

### Step 6: Generate Detailed Playwright E2E Test Script
- Build `tests/{issueKey}.spec.ts` strictly mapped to the feasible test cases from Step 5.

### Step 7: Execute and Validate Playwright Test Suite
- Run `npx playwright test tests/{issueKey}.spec.ts`.

### Step 8: Post Summary Comment to Jira Ticket via Jira MCP Tool
- Use Jira MCP tool to post a summary comment containing:
  - Total test cases created and their list.
  - Number of passed tests.
  - AIO Tests creation & cycle status.
  - Playwright script execution status.

### Step 9: Complete & Transition Ticket via Jira MCP Tool
- Use Jira MCP tool to transition ticket status to **"Done"** or **"In Review"**.
