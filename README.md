# AI-Powered Jira to Playwright Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via Model Context Protocol (MCP) servers (`jira` MCP, `playwright` MCP, and `aio-tests` MCP). It enforces a strict 11-step QA workflow inspired by industry-standard QA skills (`manual-test-case-generator`, `playwright-e2e`, and `aiotests-playwright-reporter`).

---

## What is Required to Use This Agent

To run this agent autonomously end-to-end, the following tools, services, and credentials are required:

### 1. System Requirements & CLI Tools
- **Node.js**: v18.0.0 or higher.
- **Git**: Installed and configured with SSH authentication (`git@github.com:...`).
- **GitHub CLI (`gh`)**: Installed (`brew install gh`) and authenticated (`gh auth login`) with `repo` scope to enable automated Pull Request creation.
- **Package Manager**: `npm` (run `npm install` to install Playwright, Axios, AIO reporter, etc.).

### 2. Atlassian Jira Cloud Account
- **Jira Cloud Instance**: URL (e.g. `https://your-domain.atlassian.net`).
- **Jira User Email**: The email address of the account running the automation.
- **Jira API Token**: Generated from [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens).
- **Permissions**: The Jira user must have permission to view/assign/transition issues (*In Progress*, *In Review*), add attachments, and post comments.

### 3. AIO Tests (TCMS for Jira)
- **AIO Tests Plugin**: Installed in your Jira Cloud instance.
- **AIO API Key & Tenant ID**: Generated from Jira -> **Apps** -> **AIO Tests** -> **Gear/Settings** -> **MCP Authorization / API**.
- **Permissions**: Ability to create and publish test cases, create execution cycles, and report test execution results.

### 4. Slack Workspace (Optional for Alerts)
- **Slack Incoming Webhook URL**: Created via [Slack Apps](https://api.slack.com/apps) -> *Incoming Webhooks* -> *Add New Webhook to Workspace* pointing to your alert channel (e.g. `#qa-automation`).

### 5. AI / Agent Environment
- An MCP-compatible agent runtime (such as **antigravity** or **opencode**) with `opencode.json` configured to provide:
  - `jira` MCP server (`@modelcontextprotocol/server-jira`).
  - `playwright` MCP server (`@playwright/mcp`).
  - `aio-tests` remote MCP server (`https://tcms-prod-us.aiojiraapps.com/aiotcms-mcp/v1/...`).

---

## Playwright Architecture & Engineering Standards

The framework enforces industry best practices for resilience, accessibility, and maintainability:

### 1. Strict Page Object Model (POM) Encapsulation
- **Zero Raw Locators in Specs**: Spec files (`tests/e2e/{issueKey}.spec.ts`) are strictly forbidden from calling `page.locator()`, `page.getByRole()`, or CSS selectors directly.
- **Business-Level Test Specs**: All element definitions, actions, clicks, fills, and element-level waits live inside dedicated Page Object classes under `tests/pages/` (e.g. `catalogPage.addToCart()`, `cartPage.proceedToCheckout()`). Spec files read like pure human acceptance criteria.
- **BasePage Inheritance**: Every page object class extends `BasePage` (`tests/pages/base.page.ts`).

### 2. Accessibility-First Semantic Locators & Resilient Fallback Chains (`.or()`)
- **Accessibility Hierarchy**: Elements are queried via the browser's Accessibility Tree rather than fragile DOM classes:
  1. `page.getByRole(...)` (Primary: buttons, links, searchboxes, headings)
  2. `page.getByLabel(...)` (Primary: inputs with accessible form labels)
  3. `page.getByPlaceholder(...)` (Inputs with placeholder text)
  4. `page.getByText(...)` (Non-interactive static text)
  5. `page.getByTestId(...)` (Fallback QA attribute)
- **Native Fallback Chains (`.or()` & `.first()`)**: To withstand responsive layout differences and theme redesigns without flaky third-party AI plugins:
  ```typescript
  readonly addToCartButton = this.page.getByRole('button', { name: /add to cart|buy/i })
    .or(this.page.locator('input#add'))
    .first();
  ```

### 3. Centralized Proof Capture (`BasePage.captureProof`)
- Proof screenshot capture is centralized in `BasePage`:
  ```typescript
  async captureProof(testInfo: TestInfo, filename: string): Promise<string> {
    const fullPath = path.resolve('test-results', filename);
    await this.page.screenshot({ path: fullPath, fullPage: true });
    await testInfo.attach(filename, { path: fullPath, contentType: 'image/png' });
    return fullPath;
  }
  ```
- Spec files capture evidence using a clean one-liner: `await pageObj.captureProof(testInfo, '{testCaseKey}-proof.png')`.

### 4. Mandatory State Assertions & Anti-False-Positive Mandate
- **Zero Surface-Level Assertions**: Never claim a test step succeeded merely because a button was clicked or a form was submitted.
- **Explicit Post-Condition Verification**: Every action must empirically verify the resulting state before advancing (e.g. state change indicator, success banner, destination page element, counter update, or rendered output).
- **Captcha / Bot-Blocker Honesty**: If a step is blocked by Captcha, Cloudflare, rate limits, or bot protection, the test must fail immediately at that step. Bypassing or masking blocked steps as passing is strictly forbidden.

### 5. Web-First Polling Assertions & Zero-Flakiness Synchronization
- Always assert UI states using Playwright's web-first polling assertions: `await expect(locator).toBeVisible()`, `await expect(locator).toHaveText()`, `await expect(page).toHaveURL()`.
- **Strictly Banned**:
  - `page.waitForTimeout(...)` (Hardcoded static sleeps).
  - Non-polling checks like `if (await locator.isVisible())`.

### 6. Dependency Injection via Custom Fixtures
- All Page Objects are registered as typed fixtures in `tests/fixtures/page.fixture.ts`.
- Specs receive page instances via dependency injection in test parameters: `test('scenario', async ({ catalogPage, cartPage }) => { ... })`.

### 7. Authentication & Session Strategy
- **Post-Auth Features**: Reuse pre-authenticated sessions via `storageState` to bypass repetitive UI logins.
- **Login Testing (Negative/Edge/Forms)**: Use isolated guest contexts (`test.use({ storageState: { cookies: [], origins: [] } })`) to explicitly test credentials and error banners.

---

## Project Structure

```text
├── agents.md             # Core workflow rules and agent guidelines (11-step flow)
├── GUARDRAILS.md         # Safety rules, git scope constraints & execution blockers
├── opencode.json         # MCP servers configuration (jira, playwright, aio-tests)
├── package.json          # Dependencies and test runner scripts
├── playwright.config.ts  # Playwright & AIO Tests reporter configuration
├── .env.example          # Environment variable template
└── tests/
    ├── e2e/              # Playwright E2E test specs (e.g. kan-5.spec.ts, kan-9.spec.ts, kan-10.spec.ts)
    ├── pages/            # Page Object Model classes (base.page.ts, catalog.page.ts, search.page.ts, cart.page.ts, register.page.ts)
    ├── fixtures/         # Custom Playwright fixtures (page.fixture.ts)
    ├── utils/            # Test data & environment configuration (test-data.ts)
    └── test-cases/       # Comprehensive CSV test case sheets (e.g. kan-5-test-cases.csv, kan-12-test-cases.csv)
```

---

## Environment Configuration (`.env`)

Create your `.env` file at the root of the project:

```env
# Jira Configuration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=KAN

# AIO Tests Configuration
AIO_BASE_URL=https://tcms-prod-us.aiojiraapps.com/aiotcms-mcp/v1/{tenant_id}/mcp
AIO_API_KEY=your_aio_public_api_token

# Slack Configuration (Incoming Webhook URL)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...

# Target Jira issue key (optional fallback)
JIRA_ISSUE_KEY=KAN-12
```

---

## 11-Step End-to-End QA Workflow

1. **Assign Ticket**: Assigns the Jira issue to the current user via Jira MCP / API.
2. **Transition Status**: Updates ticket status from "To Do" to **"In Progress"**.
3. **Fetch & Parse**: Retrieves issue details, acceptance criteria, and extracts the target URL dynamically.
4. **Comprehensive Exploratory Testing & CSV Generation**:
   - Explores the target URL and generates non-redundant test cases covering:
     1. Core Happy Path / Primary Acceptance
     2. Negative & Error Handling
     3. Boundary & Edge Scenarios
     4. State Persistence & Cross-View Consistency
   - Writes detailed test cases to `tests/test-cases/{issueKey}-test-cases.csv` (with Priority, Type, Steps, Expected Result, Test Data, and Feasibility).
5. **AIO Tests MCP Sync [Mandatory Blocker]**:
   - Creates rich test cases in AIO Tests via MCP (`status: "Published"`, `priority`, `type`, `requirements: [numericJiraIssueId]`, `automationStatus: "Automated"`).
   - Verifies requirement linkage via `get_test_case`.
   - Updates `tests/test-cases/{issueKey}-test-cases.csv` with the generated AIO keys (e.g., `KAN-TC-36`).
6. **Generate Standardized Playwright Architecture**:
   - Builds POM classes (`tests/pages/`) extending `BasePage`.
   - Registers custom fixtures (`tests/fixtures/page.fixture.ts`).
   - Builds test spec (`tests/e2e/{issueKey}.spec.ts`) tagged with AIO keys, using `test.step(...)`, strict POM encapsulation, and one-liner `captureProof(...)`.
7. **Execution & Reporting [Zero-Failure Blocker & Cycle Reuse]**:
   - Runs `JIRA_ISSUE_KEY={issueKey} npx playwright test tests/e2e/{issueKey}.spec.ts`.
   - Automatically creates an execution cycle on the first run, and reuses that same cycle (`AIO_CYCLE_KEY`) across retries to prevent duplicate data in Jira.
   - If a test fails, posts a diagnostic failure comment to the Jira ticket immediately, applies fixes, and re-executes against the same cycle until 100% pass rate is achieved.
8. **Upload Screenshots & Post 3 x N Table with Inline Proof Images**:
   - Uploads screenshot proofs to Jira ticket as attachments (`POST /rest/api/3/issue/{issueKey}/attachments`).
   - Posts a summary comment containing a **3 x N Table** with the actual inline thumbnail images embedded directly in the `Proof` column (`!filename.png|thumbnail!`).
9. **Review Transition**: Transitions the Jira ticket status to **"In Review"**.
10. **GitHub PR Creation via Isolated Git Worktree**:
    - Runs in a dedicated git worktree (`.worktrees/{issueKey}/`) branched from latest `main`.
    - Automatically pulls latest `main` via rebase to ensure zero conflicts.
    - Commits (`feat({issueKey}): {jiraSummary}`) and pushes directly to `agent/feat/{issueKey}-{kebab-summary}`.
    - Opens Pull Request via `gh pr create` strictly scoped to `pw-integrate-jira`.
11. **Automated Slack Alert**: Dispatches a structured Block Kit card with `<!here>` to `SLACK_WEBHOOK_URL` containing Jira link, test results, AIO cycle key, executed test breakdown, and verified PR URL. Once the PR is merged, the worktree is cleaned up via `git worktree remove .worktrees/{issueKey}`.
