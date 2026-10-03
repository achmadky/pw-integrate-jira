# Jira to Playwright AI Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via pure MCP tools (`jira` MCP, `playwright` MCP, `aio-tests` MCP).

---

## 11-Step End-to-End QA Workflow

### Execution Mandates
- **Sequential Execution:** Steps 1 through 11 are strictly mandatory and must be executed in exact sequential order.
- **Pure MCP Mandate:** All Jira operations (assigning, transitioning status, commenting) and AIO Tests operations (`create_test_case`, `update_test_case`, `search_test_cases`, `get_test_case`) MUST be executed strictly through MCP tools. No custom runner/helper scripts.
- **Worktree Isolation:** Every ticket runs in its own git worktree at `.worktrees/{issueKey}/` branched from `origin/main`.
- **Protected Main:** Pushing directly to `main` is strictly forbidden.
- **Autonomous Feature Branch Pushes:** Committing and pushing to `agent/feat/{issueKey}-{kebab-summary}` and opening PRs via `gh pr create` is autonomous once all Playwright tests pass 100%.

---

### Step 1: Assign Jira Ticket to Self via Jira MCP Tool
- Use Jira MCP tool to assign `issueKey` to the logged-in user.

### Step 2: Transition Ticket to "In Progress" via Jira MCP Tool
- Use Jira MCP tool to update status to **"In Progress"**.

### Step 3: Fetch Ticket Details via Jira MCP Tool
- Fetch summary, description, numeric issue ID (`requirements: [numericJiraIssueId]`), and acceptance criteria via Jira MCP.
- Dynamically parse the target URL and feature scope. Never assume or hardcode any domain or feature logic.

### Step 4: Perform Exploratory Smoke Testing & Generate Detailed CSV Test Cases
- Use Playwright MCP / web tools to navigate to and inspect the target URL's DOM elements and interactive components.
- Enumerate all feasible, grounded test cases covering **Happy Path**, **Negative**, and **Edge/Boundary** scenarios for the ticket's specific feature.
- Write detailed test cases to `tests/test-cases/{issueKey}-test-cases.csv` with full context:
  - Columns: `Test Case ID`, `Title`, `Priority`, `Type`, `Preconditions`, `Steps`, `Expected Result`, `Test Data`, `Feasibility (Can/Cannot)`.
  - Include explicit data inputs (e.g. product names, quantities, form inputs, URLs) in `Test Data`.
  - The `Test Case ID` column is left blank initially until Step 5.

### Step 5: [BLOCKER] Create Detailed Test Cases in AIO Tests, Link Jira Requirement, Attach to Cycle & Update CSV
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
- **STOPPING BLOCKER: VERIFY ALL 4 CONDITIONS BEFORE PROCEEDING TO STEP 6.**

---

### Step 6: Generate Standardized Playwright E2E Test Suite (POM, Fixtures, test.step, Screenshots)
Read the updated `tests/test-cases/{issueKey}-test-cases.csv` containing verified real AIO Test Case Keys and implement test code following these strict engineering standards:

#### 1. Strict Page Object Model (POM) Encapsulation
- **Zero Raw Locators in Specs:** Spec files (`tests/e2e/{issueKey}.spec.ts`) are STRICTLY FORBIDDEN from calling `page.locator()`, `page.getByRole()`, or raw element selectors directly.
- All selectors, clicks, fills, and element waits MUST live inside dedicated Page Object methods under `tests/pages/` (e.g. `catalogPage.addToCart()`, `cartPage.proceedToCheckout()`).
- Every page class MUST extend `BasePage` (`tests/pages/base.page.ts`).
- Test specs must read like pure human acceptance criteria and business logic.

#### 2. Centralized Proof Capture (`BasePage.captureProof`)
- Proof screenshot capture is defined ONCE in `BasePage`:
  ```typescript
  async captureProof(testInfo: TestInfo, filename: string): Promise<string> {
    const fullPath = path.resolve('test-results', filename);
    await this.page.screenshot({ path: fullPath, fullPage: true });
    await testInfo.attach(filename, { path: fullPath, contentType: 'image/png' });
    return fullPath;
  }
  ```
- Spec files MUST capture execution proof using the clean one-liner:
  `await pageObj.captureProof(testInfo, '{testCaseKey}-proof.png');`
- Do NOT write duplicate 4-line screenshot boilerplate in spec files.

#### 3. Accessibility-First Semantic Locators & Resilient Fallback Chains (`.or()`)
- Follow Playwright's accessibility locator hierarchy:
  1. `page.getByRole(...)` (Primary for buttons, links, searchboxes, headings)
  2. `page.getByLabel(...)` (Primary for form inputs with labels)
  3. `page.getByPlaceholder(...)` (For inputs with clear placeholder text)
  4. `page.getByText(...)` (For non-interactive static text)
  5. `page.getByTestId(...)` (Fallback QA attribute)
  - Fragile CSS classes and arbitrary XPaths are strictly forbidden.
- **Fallback Chains for Resilience:** Where markup varies across themes or responsive views, combine locators with native `.or()` and `.first()`:
  ```typescript
  readonly addToCartButton = this.page.getByRole('button', { name: /add to cart|buy/i })
    .or(this.page.locator('input#add'))
    .first();
  ```
- This provides deterministic element resilience without flaky third-party plugins.

#### 4. Web-First Polling Assertions & Zero-Flakiness Synchronization
- Always assert UI states using Playwright's web-first polling assertions: `await expect(locator).toBeVisible()`, `await expect(locator).toHaveText()`, `await expect(page).toHaveURL()`.
- **Strictly Banned:**
  - `page.waitForTimeout(...)` (Hardcoded sleeps are forbidden).
  - Non-polling checks like `if (await locator.isVisible())` or `expect(await locator.isVisible()).toBe(true)`.

#### 5. Dependency Injection via Custom Fixtures
- All Page Objects MUST be registered as typed fixtures in `tests/fixtures/page.fixture.ts`.
- Specs MUST receive page instances via dependency injection in the test parameter (`{ catalogPage, cartPage }`). No manual `new PageObject(page)` instantiations in specs.

#### 6. Authentication & Session Strategy
- **Post-Auth Features:** Reuse authenticated sessions via `storageState` to bypass repetitive UI logins.
- **Login Testing (Negative/Edge/Forms):** Use isolated guest contexts (`test.use({ storageState: { cookies: [], origins: [] } })`) to explicitly test credentials and error banners.

#### 7. Spec File Structure
Build `tests/e2e/{issueKey}.spec.ts` strictly mapped to all CSV test cases using:
- Real AIO test tags (e.g. `{ tag: '@KAN-TC-16' }`).
- Injected Page Object fixtures.
- Granular `test.step('...', async () => { ... })` wrapping each action and assertion.
- One-liner proof screenshot capture at the end of each test scenario.

---

### Step 7: Execute & Validate Playwright Test Suite with AIO Reporter
- Run `JIRA_ISSUE_KEY={issueKey} npx playwright test tests/e2e/{issueKey}.spec.ts`.
- **Cycle Reuse Policy:**
  - On the first run, the reporter automatically creates `Execution Cycle - {issueKey}` (e.g. `KAN-CY-35`).
  - Capture this created cycle key from the reporter console output.
  - If any test fails: DO NOT create a new cycle on retry! Set `AIO_CYCLE_KEY={cycleKey}` (e.g. `AIO_CYCLE_KEY=KAN-CY-35 JIRA_ISSUE_KEY={issueKey} npx playwright test ...`) so the reporter updates the existing cycle instead of cluttering Jira.
- **Failure Commenting in Jira:**
  - If a test fails during execution: post an immediate diagnostic comment to the Jira ticket with the failure details:
    ```text
    QA Test Execution Alert - Failure Detected:
    - Failed Case: {testCaseKey} - {title}
    - Error Message: {errorMessage}
    - Cycle: {cycleKey}
    Investigating DOM state, applying fix, and re-running...
    ```
- **Zero-Failure Blocker:** If any test fails, fix the POM or test spec code, re-run with `AIO_CYCLE_KEY={cycleKey}`, and repeat until 100% pass before proceeding to Step 8.

---

### Step 8: Upload Screenshots as Jira Attachments & Post 3 x N Table with Inline Proof Images
- For each executed test case, upload the captured screenshot proof to the Jira issue as an attachment via `POST /rest/api/3/issue/{issueKey}/attachments` with filename `{testCaseKey}-proof.png`.
- Post a structured summary comment via Jira API with wiki markup (or ADF) containing a **3 x N Table** with the actual inline thumbnail image in the Proof column:
  ```text
  QA Execution Summary:

  || Case Name || Proof || Result ||
  | {testCaseKey}: {title} | !{testCaseKey}-proof.png|thumbnail! | *PASSED* |

  Test cases and execution cycle ({cycleKey}) have been created and linked to this ticket in AIO Tests.
  Proof screenshots are embedded above and attached directly to this Jira issue.

  Let me know if you have any question/clarification. Thanks!
  ```
- Verify the comment renders the inline thumbnail image directly inside the table cell on the Jira ticket.

---

### Step 9: Complete & Transition Ticket via Jira MCP Tool
- Use Jira MCP tool to transition ticket status to **"Done"** or **"In Review"**.

---

### Step 10: [BLOCKER] Commit, Push & Create GitHub PR from Isolated Worktree
- Inside the dedicated ticket worktree (`workdir=.worktrees/{issueKey}`):
  1. Pull latest `main` to ensure zero merge conflicts: `git pull origin main --rebase`
  2. Stage and commit: `git add tests/ tests/test-cases/ && git commit -m "feat({issueKey}): {jiraSummary}"`
  3. Push to remote: `git push -u origin agent/feat/{issueKey}-{kebab-summary}`
  4. Create PR via `gh` CLI strictly scoped to `pw-integrate-jira`:
     ```bash
     gh pr create --repo achmadky/pw-integrate-jira --base main --head agent/feat/{issueKey}-{kebab-summary} --title "feat({issueKey}): {jiraSummary}" --body "..."
     ```
  5. Parse the returned PR URL. If `gh pr create` fails, diagnose, fix, and re-attempt until a valid PR URL is obtained.
  - **DO NOT PROCEED TO STEP 11 WITHOUT A VERIFIED PR URL.**

---

### Step 11: Send Automated Notification to Slack Channel
- Dispatch a structured Slack Block Kit message to `SLACK_WEBHOOK_URL` containing:
  - Mention: `<!here>`
  - Jira ticket link & title
  - Execution status & test pass counts
  - AIO Tests cycle info
  - Git branch name
  - List of executed test cases with individual pass/fail status
  - Verified GitHub Pull Request URL
- Confirm HTTP 200 response from the webhook.
- After PR is merged: clean up the worktree via `git worktree remove .worktrees/{issueKey}`.
