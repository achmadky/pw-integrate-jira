# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via pure MCP tools (`jira` MCP, `playwright` MCP, `aio-tests` MCP).

---

## End-to-End QA Automation Workflow (Pure MCP Driven)

### Core Mandates & Execution Control
- **Strict Sequential Execution:** Every step below (Steps 1 through 11) is strictly mandatory and MUST be completed in exact sequential order.
- **Assignee Rule:** Before transitioning a ticket from "To Do" to "In Progress", assign the Jira issue to yourself/current user via Jira MCP tool (`jira_update_issue` / `jira_assign_issue`).
- **PURE MCP MANDATE:** All Jira operations (assigning, transitioning status, commenting) and AIO Tests operations (`create_test_case`, `update_test_case`, `search_test_cases`, `get_test_case`) MUST be executed strictly through MCP tools. No custom runner/helper scripts.
- **EXPLICIT USER CONSENT & STRICT SCOPE FOR GIT / GH CLI:**
  - Operating on or pushing to ANY repository other than `pw-integrate-jira` (`achmadky/pw-integrate-jira`) is strictly forbidden. Any change of target project requires explicit user request and re-authorization.
  - The `gh` CLI may ONLY be used for opening Pull Requests (`gh pr create`) on `pw-integrate-jira`. No other `gh` commands are permitted.
  - NEVER commit (`git commit`), create branches (`git checkout -b`), push (`git push`), or open PRs (`gh pr create`) automatically or randomly. You MUST always ask and receive explicit confirmation from the user before executing ANY git commit, push, or PR command.
- **STRICT STEP 5 MANDATORY VERIFICATION BLOCKER:**
  You are STRICTLY FORBIDDEN from proceeding to Step 6 (Playwright script creation), Step 7, or Step 9 (Ticket Completion) UNLESS ALL of the following 4 conditions are verified:
  1. **AIO Case Creation**: Test cases MUST be created in AIO Tests via MCP (`create_test_case`) with `status: "Published"`.
  2. **Jira Requirement Linkage**: Test cases MUST be verified to be linked to the numeric Jira requirement ID (`requirements: [numericJiraIssueId]`).
  3. **AIO Cycle Association**: Test cases MUST be attached to an Execution Cycle linked to `issueKey` (`tasks: [issueKey]`).
  4. **CSV Key Update**: The CSV file `tests/test-cases/{issueKey}-test-cases.csv` MUST be updated with the real verified AIO Test Case Keys.
  - **IF ANY OF THESE 4 CONDITIONS FAIL, STOP IMMEDIATELY, INFORM THE USER OF THE EXACT FAILURE, AND DO NOT PROCEED TO STEP 6.**
- **STRICT STEP 7 PASSING EXECUTION BLOCKER (ZERO FAILURE TOLERANCE):**
  You are STRICTLY FORBIDDEN from proceeding to Step 8 (Jira Comment), Step 9 (Transition), Step 10 (PR Creation), or Step 11 (Slack Alert) if ANY Playwright test fails, encounters an assertion error, or crashes.
  - If a test fails: analyze the DOM failure empirically, fix the POM or test spec code, and re-run `npx playwright test tests/e2e/{issueKey}.spec.ts`.
  - Repeat until 100% of test cases pass with ZERO failures and ZERO errors. Only completely passing suites may advance.
- **STRICT STEP 10 PR CREATION VERIFICATION BLOCKER:**
  You are STRICTLY FORBIDDEN from proceeding to Step 11 (Slack Notification) unless:
  1. User gives explicit confirmation to commit, push, and create PR.
  2. Git branch is created with standardized format `agent/feat/{issueKey}-{kebab-summary}` (e.g. `agent/feat/KAN-9-search-feature`).
  3. Changes are committed with message `feat({issueKey}): {jiraSummary}` and pushed cleanly to `origin`.
  4. Pull Request is created via `gh pr create` with title `feat({issueKey}): {jiraSummary}` and outputs a valid live GitHub PR URL.
  5. If `gh pr create` fails or encounters any error (e.g. merge conflict, validation failure, network issue), STOP IMMEDIATELY, fix the error, and re-attempt until a valid PR URL is generated. DO NOT proceed to Step 11 without a verified live PR URL.

---

### Step 1: Assign Jira Ticket to Self via Jira MCP Tool
- Use Jira MCP tool to assign `issueKey` to the logged-in user.

### Step 2: Transition Ticket to "In Progress" via Jira MCP Tool
- Use Jira MCP tool to update status to **"In Progress"**.

### Step 3: Fetch Ticket Details via Jira MCP Tool
- Fetch summary, description, numeric issue ID, and acceptance criteria via Jira MCP.
- Dynamically parse the target URL and feature scope. Never assume or hardcode any domain or feature logic.

### Step 4: Perform Exploratory Smoke Testing & Generate Detailed CSV Test Cases
- Use Playwright MCP / web tools to navigate to and inspect the target URL's DOM elements and interactive components.
- Enumerate all feasible, grounded test cases covering **Happy Path**, **Negative**, and **Edge/Boundary** scenarios for the ticket's specific feature.
- Write detailed test cases to `tests/test-cases/{issueKey}-test-cases.csv` with full context:
  - Columns: `Test Case ID`, `Title`, `Priority`, `Type`, `Preconditions`, `Steps`, `Expected Result`, `Test Data`, `Feasibility (Can/Cannot)`.
  - Include explicit data inputs (e.g. product names, quantities, form inputs, URLs) in `Test Data`.
  - The `Test Case ID` column is left blank initially until Step 5.

### Step 5: [ABSOLUTE MANDATORY PREREQUISITE & BLOCKER] Create Detailed Test Cases in AIO Tests, Link Jira Requirement, Attach to Cycle & Update CSV
- Read `tests/test-cases/{issueKey}-test-cases.csv` and dynamically parse every feasible test case row.
- For each row, invoke AIO Tests MCP tool (`create_test_case`) with rich, complete fields:
  - `title`: Descriptive, concise scenario summary.
  - `status`: `"Published"` (mandatory).
  - `priority`: `"High"` / `"Medium"` / `"Critical"` based on scenario severity.
  - `type`: `"Functional"` / `"Integration"` / `"Unit"`.
  - `automationStatus`: `"Automated"`.
  - `requirements`: `[numericJiraIssueId]` (mandatory requirement traceability).
  - `description`: Comprehensive summary of the test scenario, target URL, and scope.
  - `precondition`: Explicit prerequisites and environment setup.
  - `stepType`: `"Classic"`.
  - `steps`: Array of granular steps with `{ type: "TEXT", action: "...", data: "...", expectedResult: "..." }` containing the exact action, test data used, and clear expected result.
- Verify each test case via AIO Tests MCP (`get_test_case`) to confirm requirement linkage (`requirements: [numericJiraIssueId]`) and published status.
- Update `tests/test-cases/{issueKey}-test-cases.csv` to fill in the `Test Case ID` column with the real AIO Test Case Keys.
- Ensure test cases are attached to the Execution Cycle linked to `issueKey`.
- **VERIFY ALL 4 CONDITIONS BEFORE MOVING TO STEP 6.**

### Step 6: Generate Standardized Playwright E2E Test Script from Updated CSV (POM, Fixtures, test.step, Screenshots)
- Read the updated `tests/test-cases/{issueKey}-test-cases.csv` containing verified real AIO Test Case Keys.
- Build feature page classes under `tests/pages/` (inheriting from `tests/pages/base.page.ts`), custom fixtures under `tests/fixtures/page.fixture.ts`, and test data under `tests/utils/test-data.ts`.
- Build `tests/e2e/{issueKey}.spec.ts` strictly mapped to all CSV test cases using:
  - Real AIO test tags (e.g. `{ tag: '@KAN-TC-16' }`).
  - Page Object fixtures.
  - `test.step('...', async () => { ... })` wrapping each logical action and assertion.
  - **MANDATORY SCREENSHOT ATTACHMENT AS PROOF:** Each test MUST capture and attach full-page screenshots as proof of execution using `await testInfo.attach('evidence-screenshot', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })` or `await page.screenshot({ path: ... })`.

### Step 7: Execute and Validate Playwright Test Suite with AIO Reporter & Evidence Verification
- Run `npx playwright test tests/e2e/{issueKey}.spec.ts`.
- Verify results are reported live to the AIO Tests Execution Cycle (`Execution Cycle - {issueKey}`).
- Ensure test execution screenshots and evidence are captured for every test run.
- **ZERO FAILURE TOLERANCE:** If any test fails, fix it immediately until 100% pass before proceeding.

### Step 8: Upload Screenshots as Jira Attachments & Post 3 x N Table Summary Comment
- For each executed test case, upload the captured screenshot proof to the Jira issue as an attachment via `POST /rest/api/3/issue/{issueKey}/attachments` with filename `{testCaseKey}-proof.png`.
- Post a structured summary comment containing a **3 x N Table** (`Case Name`, `Proof (Attachment)`, `Result`):
  - Column 1: `Case Name` (`{testCaseKey}: {title}`)
  - Column 2: `Proof (Attachment)` (`{testCaseKey}-proof.png (attached to ticket)`)
  - Column 3: `Result` (`PASSED` / `FAILED`)
- Below the table, include:
  - Mention that test cases and execution cycle have been created and linked in AIO Tests.
  - Confirmation that proof screenshots are attached directly to the Jira ticket.
  - Final polite closing: `"Let me know if you have any question/clarification. Thanks!"`

### Step 9: Complete & Transition Ticket via Jira MCP Tool
- Use Jira MCP tool to transition ticket status to **"Done"** or **"In Review"**.

### Step 10: Ask User Confirmation, Commit, Push & Create GitHub PR via gh CLI [STRICT BLOCKER]
- Ask the user for explicit confirmation before taking any git/PR action:
  `"Playwright tests passed with 0 failures. May I commit the changes to branch agent/feat/{issueKey}-{kebab-summary}, push to origin, and create a Pull Request for pw-integrate-jira?"`
- Once confirmed:
  1. Create branch: `git checkout -b agent/feat/{issueKey}-{kebab-summary}`
  2. Stage and commit: `git add tests/ tests/test-cases/ && git commit -m "feat({issueKey}): {jiraSummary}"`
  3. Push to remote: `git push -u origin agent/feat/{issueKey}-{kebab-summary}`
  4. Create PR via `gh` CLI strictly scoped to `pw-integrate-jira`:
     ```bash
     gh pr create --repo achmadky/pw-integrate-jira --base main --head agent/feat/{issueKey}-{kebab-summary} --title "feat({issueKey}): {jiraSummary}" --body "..."
     ```
  5. Parse the returned PR URL. If `gh pr create` fails, diagnose, fix, and re-attempt until a valid PR URL is obtained.
  - **DO NOT PROCEED TO STEP 11 WITHOUT A VERIFIED PR URL.**

### Step 11: Send Automated Notification to Slack Channel
- Dispatch a structured Slack Block Kit message to `SLACK_WEBHOOK_URL` containing:
  - Jira ticket link & title
  - Execution status & test pass counts
  - AIO Tests cycle info
  - Verified GitHub Pull Request URL
- Confirm HTTP 200 response from the webhook.
