# AI-Powered Jira to Playwright Automation Framework

This project integrates Jira issue tracking with Playwright test automation using AI via Model Context Protocol (MCP) servers (`jira` MCP, `playwright` MCP, and `aio-tests` MCP). It follows a strict 9-step QA workflow inspired by industry-standard QA skills (`manual-test-case-generator`, `playwright-e2e`, and `aiotests-playwright-reporter`).

---

## Key Features

- **Pure MCP-Driven Workflow**: Seamless integration with Jira Cloud and AIO Tests using standard MCP servers.
- **Jira Automation**: Automatically assigns tickets to the active user, transitions statuses (*In Progress*, *In Review*), and posts structured summary comments.
- **Dynamic Feature & URL Extraction**: Parses target URLs and feature scopes dynamically from ticket descriptions without hardcoding.
- **Feasible Manual Test Case Generation**: Produces initial CSV sheets with blank IDs, then creates and publishes test cases directly inside **AIO Tests** linked to Jira requirement IDs (`requirements: [numericJiraIssueId]`).
- **Standardized Playwright Architecture**:
  - **Page Object Model (POM)** (`tests/pages/`)
  - **Custom Fixtures** (`tests/fixtures/`)
  - **Centralized Test Data** (`tests/utils/`)
  - **Step-Level Diagnostic Tracing** (`test.step(...)`)
  - **Web-First Assertions & User-Centric Locators** (`getByRole`, `getByText`, etc.)
- **Automated AIO Cycle Reporting**: Executes Playwright test suites and reports results live to AIO Tests Execution Cycles (`aiotests-playwright-reporter`).

---

## Project Structure

```text
├── agents.md             # Core workflow rules and agent guidelines
├── opencode.json         # MCP servers configuration (jira, playwright, aio-tests)
├── package.json          # Dependencies and test runner scripts
├── playwright.config.ts  # Playwright & AIO Tests reporter configuration
└── tests/
    ├── e2e/              # Playwright E2E test specs (e.g. kan-5.spec.ts)
    ├── pages/            # Page Object Model classes (base.page.ts, catalog.page.ts)
    ├── fixtures/         # Custom Playwright fixtures (page.fixture.ts)
    ├── utils/            # Test data & environment configuration
    └── test-cases/       # CSV test case sheets (e.g. kan-5-test-cases.csv)
```

---

## Prerequisites & Configuration (`.env`)

1. **Node.js** (v18+ recommended)
2. Install dependencies:
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
AIO_TENANT_ID=your_aio_tenant_id
AIO_API_KEY=your_aio_public_api_token
```

---

## 9-Step End-to-End QA Workflow

1. **Assign Ticket**: Assigns the Jira issue to the current user via Jira MCP / API.
2. **Transition Status**: Updates ticket status from "To Do" to **"In Progress"**.
3. **Fetch & Parse**: Retrieves issue details and extracts the target URL dynamically.
4. **Exploratory Testing & CSV**: Explores the target URL and writes initial test cases to `tests/test-cases/{issueKey}-test-cases.csv` (leaving `Test Case ID` blank).
5. **AIO Tests MCP Sync [Mandatory Blocker]**:
   - Searches/creates test cases in AIO Tests via MCP.
   - Sets status to `Published` and links the Jira requirement ID (`requirements: [numericJiraIssueId]`).
   - Updates `tests/test-cases/{issueKey}-test-cases.csv` with the generated AIO keys (e.g., `KAN-TC-12`).
6. **Generate Playwright Architecture**:
   - Builds POM classes (`tests/pages/`), custom fixtures (`tests/fixtures/`), test data (`tests/utils/`), and test specs (`tests/e2e/{issueKey}.spec.ts`) tagged with AIO keys (`@KAN-TC-12`).
7. **Execution & Reporting**: Runs `npx playwright test tests/e2e/{issueKey}.spec.ts` and reports results live to AIO Tests Execution Cycles.
8. **Summary Comment**: Posts a concise execution summary comment directly to the Jira ticket.
9. **Review Transition**: Transitions the Jira ticket status to **"In Review"**.
