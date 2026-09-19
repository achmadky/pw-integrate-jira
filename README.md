# AI-Powered Jira to Playwright Automation Framework

This project bridges Jira issue tracking with Playwright test automation using AI. It follows a structured, non-hallucination workflow inspired by industry-standard QA skills (`manual-test-case-generator`, `playwright-e2e`, and `agent-browser`).

---

## Features

- **Jira Integration**: Automatically fetches ticket details (Summary, Description, Acceptance Criteria) and manages issue state transitions (e.g., *In Progress*, *In Review*, *Done*).
- **Dynamic URL Extraction**: Automatically parses target URLs and environment links from Jira tickets without hardcoding.
- **Feasible Manual Test Case Generation**: Produces detailed CSV test case sheets (`tests/{issueKey}-test-cases.csv`) covering happy paths, negatives, edge cases, and boundaries while omitting impossible/skipped cases.
- **Exploratory Smoke Testing**: Validates live UI elements and locators prior to writing test scripts.
- **Robust Playwright E2E Testing**: Generates and executes reliable TypeScript test scripts using the Page Object Model (POM) and semantic locators (`getByRole`, `getByText`, etc.).

---

## Project Structure

```text
├── agents.md             # Core workflow rules and agent guidelines
├── package.json          # Dependencies and scripts
├── playwright.config.ts  # Playwright configuration
├── src/                  # Core source code
│   ├── aiGenerator.ts    # AI test generation logic
│   ├── jiraClient.ts     # Jira REST API client
│   ├── jiraTransition.ts # Jira issue state transition manager
│   └── runAutomation.ts  # Main automation pipeline runner
└── tests/                # Generated test scripts and CSV test case sheets
```

---

## Prerequisites & Installation

1. **Node.js** (v18+ recommended)
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Configuration (`.env`)

Create or update your `.env` file at the root of the project with your credentials:

```env
# Jira Configuration
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_USER_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=KAN

# OpenAI Configuration (Optional if using fallback/local generation)
OPENAI_API_KEY=your-openai-api-key
```

---

## How to Use

Run the automation workflow script for any Jira issue key (e.g., `KAN-5`):

```bash
npm run generate-test KAN-5
```

### What happens during execution:
1. **Transition**: Automatically moves the Jira ticket to **"In Progress"**.
2. **Fetch & Parse**: Retrieves issue details and extracts the target URL dynamically.
3. **Exploration & CSV**: Performs exploratory smoke testing and generates feasible test cases at `tests/{issueKey}-test-cases.csv`.
4. **Test Script Generation**: Writes the detailed Playwright TypeScript test script to `tests/{issueKey}.spec.ts`.
5. **Execution**: Runs the Playwright test suite (`npx playwright test`) to verify correctness.
6. **Review**: Transitions the Jira ticket to **"In Review"** upon successful execution.
