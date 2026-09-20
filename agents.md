# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via pure MCP tools (`jira` MCP, `playwright` MCP, `aio-tests` MCP).

---

## End-to-End QA Automation Workflow (Pure MCP Driven)

### Core Mandates & Execution Control
- **Strict Sequential Execution:** Every step below (Steps 1 through 9) is strictly mandatory and MUST be completed in exact sequential order.
- **Assignee Rule:** Before transitioning a ticket from "To Do" to "In Progress", assign the Jira issue to yourself/current user via Jira MCP tool (`jira_update_issue` / `jira_assign_issue`).
- **PURE MCP MANDATE:** All Jira operations (assigning, transitioning status, commenting) and AIO Tests operations (`create_test_case`, `update_test_case`, `search_test_cases`) MUST be executed strictly through MCP tools. No Node.js scripts in `src/`.
- **STANDARDIZED QA FOLDER ARCHITECTURE:**
  All test assets MUST be organized cleanly under the `tests/` directory:
  ```text
  tests/
  ├── e2e/                           # Playwright test specs (e.g. kan-5.spec.ts)
  ├── pages/                         # Page Object Model classes (e.g. base.page.ts, catalog.page.ts)
  ├── fixtures/                      # Custom Playwright fixtures (e.g. page.fixture.ts)
  ├── utils/                         # Test data & environment config (e.g. test-data.ts)
  └── test-cases/                    # CSV test case sheets (e.g. kan-5-test-cases.csv)
  ```
- **100% DYNAMIC FEATURE PARSING RULE:** 
  1. Never hardcode or assume any specific feature, domain, or flow (e.g. cart, checkout, login, search, forms). 
  2. Parse the target URL, feature scope, acceptance criteria, and user actions dynamically from the provided Jira ticket.
- **STRICT GROUNDING & ANTI-HALLUCINATION RULE:**
  1. Every test case, step, locator, and assertion MUST be grounded strictly in ticket requirements and empirical live browser inspection of the actual web app.
  2. Never fabricate non-existent buttons, inputs, pages, or API endpoints. If an element or flow is absent on the live web app, omit it or document it accurately.
- **ANTI-HALLUCINATION PLAYWRIGHT LOCATOR GUIDELINES:**
  1. **Mandatory Live DOM Inspection**: Before writing locators, the AI MUST inspect the live DOM tree of the target URL via Playwright MCP / web tools.
  2. **Locator Hierarchy**:
     - `page.getByRole('button', { name: 'Exact Button Text' })` for buttons/actions.
     - `page.getByLabel('Label Text')` or `page.getByRole('textbox', { name: 'Field Name' })` for form inputs.
     - `page.getByRole('link', { name: 'Link Text' })` for hyperlinks.
     - `page.getByText('Text Content')` for static text assertions.
     - `page.getByTestId('test-id')` for data-testid attributes.
  3. **Strict Prohibition**: Never guess element IDs, class names, or XPath routes (e.g. `#submit-btn-2`, `div.checkout > button`). Locators must match verified DOM attributes.
- **EXPANDED DYNAMIC TEST COVERAGE:** During exploratory testing of the target URL, generate comprehensive test cases for the ticket's feature across:
  1. **Happy Path**: Core feature flow and valid user journey as defined in acceptance criteria.
  2. **Negative Cases**: Missing required inputs, invalid formats, out-of-range values, unauthorized actions.
  3. **Edge & Boundary Cases**: Empty states, maximum input lengths, zero/null values, special characters, rapid interactions.
- **PLAYWRIGHT E2E STANDARDIZATION & BEST PRACTICES MANDATE:**
  All Playwright test scripts generated in **Step 6** MUST strictly adhere to the following 6 architecture standards:
  1. **Page Object Model (POM)**: Encapsulate page locators and actions inside feature page classes under `tests/pages/` (inheriting from `tests/pages/base.page.ts`). Test specs (`tests/e2e/{issueKey}.spec.ts`) call high-level page object methods without raw DOM locators.
  2. **Custom Playwright Fixtures**: Use custom fixtures (`tests/fixtures/page.fixture.ts`) for dependency injection of Page Objects into test specs (`test('...', async ({ catalogPage }) => ...)`).
  3. **User-Centric & Resilient Selectors**: Strictly prefer user-facing locators (`getByRole`, `getByText`, `getByLabel`, `getByTestId`). Fragile CSS or XPath locators (e.g. `div > span:nth-child(2)`) are forbidden.
  4. **Auto-Waiting & Web-First Assertions**: Use async `expect(locator).toBeVisible()`, `expect(locator).toHaveText()`, `expect(page).toHaveURL()`. Hardcoded static sleep (`waitForTimeout`) is strictly forbidden in test specs.
  5. **Structured Test Steps (`test.step`)**: Wrap logical action blocks inside `await test.step('Step Title', async () => { ... })` for step-level diagnostic HTML reports.
  6. **Test Data Utilities & Isolation**: Store environment URLs and input parameters in `tests/utils/test-data.ts`. Ensure total test isolation (`beforeEach`).
- **CSV DYNAMIC CYCLE RULE:** 
  1. In **Step 4**, test cases written to `tests/test-cases/{issueKey}-test-cases.csv` MUST leave the `Test Case ID` column blank initially.
  2. In **Step 5**, the AI MUST parse the CSV rows dynamically, invoke AIO Tests MCP (`create_test_case`) to create each test case, retrieve the generated AIO key (e.g. `KAN-TC-X`), link the Jira requirement ID (`requirements: [numericJiraIssueId]`), set status to `Published`, and then **update the CSV file with the real AIO Test Case IDs**.
  3. Playwright test scripts generated in **Step 6** MUST map the dynamically generated AIO test keys (e.g. `{ tag: '@KAN-TC-X' }`) from the updated CSV.
- **STRICT STEP 5 BLOCKER:** You are STRICTLY FORBIDDEN from proceeding to Step 6 (Playwright script creation) or Step 9 (Ticket Completion) UNLESS the CSV has been updated with real AIO test keys, and test cases are published, explicitly linked to the Jira requirement ID, AND attached to the Test Cycle in AIO Tests.

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

### Step 5: [STRICT MANDATORY PREREQUISITE] Create Test Cases in AIO Tests via MCP & Update CSV with Generated AIO Keys
- Read `tests/test-cases/{issueKey}-test-cases.csv` and dynamically parse every feasible test case row.
- For each row, invoke AIO Tests MCP tool (`create_test_case`) with `status: "Published"`, `requirements: [numericJiraIssueId]`, `stepType: "Classic"`, and `steps`.
- Retrieve the auto-generated AIO Test Case Key (e.g. `KAN-TC-6`, `KAN-TC-7`).
- Update `tests/test-cases/{issueKey}-test-cases.csv` to fill in the `Test Case ID` column with the real AIO Test Case Keys.
- Verify creation via AIO Tests MCP (`search_test_cases`).

### Step 6: Generate Standardized Playwright E2E Test Script from Updated CSV (POM, Fixtures, test.step)
- Read the updated `tests/test-cases/{issueKey}-test-cases.csv` containing real AIO Test Case Keys.
- Build feature page classes under `tests/pages/` (inheriting from `tests/pages/base.page.ts`), custom fixtures under `tests/fixtures/page.fixture.ts`, and test data under `tests/utils/test-data.ts`.
- Build `tests/e2e/{issueKey}.spec.ts` strictly mapped to all CSV test cases using the real AIO test tags (e.g. `{ tag: '@KAN-TC-6' }`), custom fixtures, and `test.step('...', async () => { ... })`.

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
