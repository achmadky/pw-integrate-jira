# AI-Powered Jira to Playwright Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via Model Context Protocol (MCP) servers (`jira` MCP, `playwright` MCP, and `aio-tests` MCP). It follows a strict 11-step QA workflow inspired by industry-standard QA skills (`manual-test-case-generator`, `playwright-e2e`, and `aiotests-playwright-reporter`).

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
- **Permissions**: The Jira user must have permission to:
  - View, assign, and transition issues (*In Progress*, *In Review*).
  - Add attachments to issues.
  - Post issue comments.

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

## Key Features

- **Pure MCP-Driven Workflow**: Seamless integration with Jira Cloud and AIO Tests using standard MCP servers.
- **Jira Automation**: Automatically assigns tickets to the active user, transitions statuses (*In Progress*, *In Review*), uploads screenshot proofs, and posts structured 3 x N table summary comments with inline thumbnail images.
- **Dynamic Feature & URL Extraction**: Parses target URLs and feature scopes dynamically from ticket descriptions without hardcoding.
- **Detailed Manual Test Case Generation**: Produces CSV sheets with rich metadata (Priority, Type, Preconditions, Steps, Expected Result, Test Data), then creates and publishes test cases directly inside **AIO Tests** linked to Jira requirement IDs (`requirements: [numericJiraIssueId]`).
- **Standardized Playwright Architecture**:
  - **Page Object Model (POM)** (`tests/pages/`)
  - **Custom Fixtures** (`tests/fixtures/`)
  - **Centralized Test Data** (`tests/utils/`)
  - **Step-Level Diagnostic Tracing** (`test.step(...)`)
  - **Web-First Assertions & User-Centric Locators** (`getByRole`, `getByText`, etc.)
  - **Screenshot Proof Capture** (`testInfo.attach(...)`)
- **Automated AIO Cycle Reporting**: Executes Playwright test suites and reports results live to AIO Tests Execution Cycles (`aiotests-playwright-reporter`).
- **GitHub Pull Request Integration**: Automatically creates standardized branches (`agent/feat/{issueKey}-{kebab-summary}`) and opens Pull Requests via `gh pr create` after user confirmation.
- **Slack Alerting**: Automatically dispatches rich Block Kit notifications to Slack channels with Jira links, test results, AIO cycle keys, and live PR URLs.

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
    ├── pages/            # Page Object Model classes (base.page.ts, catalog.page.ts, search.page.ts, cart.page.ts)
    ├── fixtures/         # Custom Playwright fixtures (page.fixture.ts)
    ├── utils/            # Test data & environment configuration (test-data.ts)
    └── test-cases/       # Detailed CSV test case sheets (e.g. kan-5-test-cases.csv, kan-9-test-cases.csv, kan-10-test-cases.csv)
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
JIRA_ISSUE_KEY=KAN-10
```

---

## 11-Step End-to-End QA Workflow

1. **Assign Ticket**: Assigns the Jira issue to the current user via Jira MCP / API.
2. **Transition Status**: Updates ticket status from "To Do" to **"In Progress"**.
3. **Fetch & Parse**: Retrieves issue details and extracts the target URL dynamically.
4. **Exploratory Testing & CSV**: Explores the target URL and writes detailed test cases (with Priority, Type, Steps, Expected Result, Test Data) to `tests/test-cases/{issueKey}-test-cases.csv` (leaving `Test Case ID` blank).
5. **AIO Tests MCP Sync [Mandatory Blocker]**:
   - Creates rich test cases in AIO Tests via MCP (`status: "Published"`, `priority`, `type`, `requirements: [numericJiraIssueId]`, `automationStatus: "Automated"`).
   - Verifies requirement linkage via `get_test_case`.
   - Updates `tests/test-cases/{issueKey}-test-cases.csv` with the generated AIO keys (e.g., `KAN-TC-20`).
6. **Generate Playwright Architecture**:
   - Builds POM classes (`tests/pages/`), custom fixtures (`tests/fixtures/`), test data (`tests/utils/`), and test specs (`tests/e2e/{issueKey}.spec.ts`) tagged with AIO keys (`@KAN-TC-20`).
   - Adds full-page screenshot capture as execution proof.
7. **Execution & Reporting [Zero-Failure Blocker & Cycle Reuse]**:
   - Runs `JIRA_ISSUE_KEY={issueKey} npx playwright test tests/e2e/{issueKey}.spec.ts`.
   - Automatically creates an execution cycle on the first run, and reuses that same cycle (`AIO_CYCLE_KEY`) across retries to prevent duplicate data in Jira.
   - If a test fails, posts a diagnostic failure comment to the Jira ticket immediately, applies fixes, and re-executes against the same cycle until 100% pass rate is achieved.
8. **Upload Screenshots & Post 3 x N Table with Inline Proof Images**:
   - Uploads screenshot proofs to Jira ticket as attachments (`POST /rest/api/3/issue/{issueKey}/attachments`).
   - Posts a summary comment containing a **3 x N Table** with the actual inline thumbnail images embedded directly in the `Proof` column (`!filename.png|thumbnail!`).
9. **Review Transition**: Transitions the Jira ticket status to **"In Review"**.
10. **GitHub PR Creation [User Confirmation Blocker]**:
    - Asks user for explicit confirmation before git/PR actions.
    - Creates branch `agent/feat/{issueKey}-{kebab-summary}`.
    - Commits with `feat({issueKey}): {jiraSummary}` and pushes to remote.
    - Opens Pull Request via `gh pr create` strictly scoped to `pw-integrate-jira`.
11. **Automated Slack Alert**: Dispatches a structured Block Kit card to `SLACK_WEBHOOK_URL` containing Jira link, test results, AIO cycle key, and verified PR URL.
