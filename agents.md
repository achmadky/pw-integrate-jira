# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI, incorporating explicit rules and steps from `manual-test-case-generator`, `playwright-e2e`, and `agent-browser`.

---

## End-to-End QA Automation Workflow (Strict AIO Tests MCP & Playwright Integration)

### Core Mandates & Execution Control
- **Strict Sequential Execution:** Every single step below (Steps 1 through 8) is strictly mandatory and MUST be completed in exact sequential order. Proceeding to a subsequent step without fully completing and verifying the previous step is strictly forbidden.
- **Immediate Notification on Blocker/Issue:** If any error, API failure, missing dependency, or unexpected behavior occurs at any step, you MUST immediately inform the user with clear details before attempting any workaround or proceeding further.

---

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

### Step 4: [ABSOLUTE MANDATORY PREREQUISITE] Create Test Cases & Test Cycle via AIO Tests MCP
- **Strict Enforcement Rule:** 
  1. You **MUST** use AIO Tests MCP / tools to create the test cases in AIO Tests.
  2. You **MUST** create a Test Cycle in AIO Tests, attach the created test cases to it, and link them to the Jira ticket (`issueKey`).
  3. You **MUST** execute the test cases within AIO Tests.
  4. **BLOCKER:** **You are strictly forbidden from proceeding to Step 5 (Playwright test script creation) unless AIO test case creation, cycle creation, and test execution have been successfully completed and confirmed via AIO Tests MCP.**

### Step 5: Generate Detailed Playwright E2E Test Script
- **Rules:**
  1. Build the Playwright test script (`tests/{issueKey}.spec.ts`) strictly mapped to the feasible, verified test steps from the AIO-linked test cases.
  2. Implement user-centric testing mirroring real user journeys with resilient locators (`getByRole`, `getByText`, `getByLabel`, `getByTestId`).
  3. Ensure every test in the script is fully runnable and actionable—**no skipped tests or impossible stubs**.

### Step 6: Execute and Validate Playwright Test Suite
- Run `npx playwright test tests/{issueKey}.spec.ts`.
- Ensure zero errors, failures, or skipped tests. Debug and fix any locators or assertion mismatches.

### Step 7: Post Summary Comment to Jira Ticket
- **Mandatory Reporting Rule:** Before transitioning the ticket, add a detailed comment to the Jira ticket containing:
  - Total test cases created and their list.
  - Number of passed tests.
  - AIO Tests creation & cycle linkage status (Confirmed via AIO MCP).
  - Playwright test script creation status.

### Step 8: Complete & Transition Ticket
- Transition the Jira ticket status to **"Done"** or **"In Review"**.
