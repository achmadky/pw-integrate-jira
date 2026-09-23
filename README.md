# AI-Powered Jira to Playwright Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via Model Context Protocol (MCP) servers (`jira` MCP, `playwright` MCP, and `aio-tests` MCP). It follows a strict 11-step QA workflow inspired by industry-standard QA skills (`manual-test-case-generator`, `playwright-e2e`, and `aiotests-playwright-reporter`).

---

## Key Features

- **Pure MCP-Driven Workflow**: Seamless integration with Jira Cloud and AIO Tests using standard MCP servers.
- **Jira Automation**: Automatically assigns tickets to the active user, transitions statuses (*In Progress*, *In Review*), uploads screenshot proofs, and posts structured 3 x N table summary comments.
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
└── tests/
    ├── e2e/              # Playwright E2E test specs (e.g. kan-5.spec.ts, kan-9.spec.ts)
    ├── pages/            # Page Object Model classes (base.page.ts, catalog.page.ts, search.page.ts)
    ├── fixtures/         # Custom Playwright fixtures (page.fixture.ts)
    ├── utils/            # Test data & environment configuration (test-data.ts)
    └── test-cases/       # Detailed CSV test case sheets (e.g. kan-5-test-cases.csv, kan-9-test-cases.csv)
```

---

## Prerequisites & Configuration (`.env`)

1. **Node.js** (v18+ recommended)
2. **GitHub CLI** (`gh auth login`)
3. Install dependencies:
   ```bash
   npm install
   ```

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

# Slack Configuration
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
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
7. **Execution & Reporting [Zero-Failure Blocker]**:
   - Runs `npx playwright test tests/e2e/{issueKey}.spec.ts` and reports results live to AIO Tests Execution Cycles.
   - Requires 100% pass rate before advancing.
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
