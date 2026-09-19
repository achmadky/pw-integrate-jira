import * as fs from 'fs';
import * as path from 'path';
import { fetchJiraIssue } from './jiraClient';
import { generatePlaywrightTest } from './aiGenerator';

async function main() {
  const issueKey = process.argv[2];
  if (!issueKey) {
    console.error('Please provide a Jira Issue Key (e.g., npm run generate-test PROJ-123)');
    process.exit(1);
  }

  console.log(`Fetching Jira issue ${issueKey}...`);
  // For demonstration or fallback if Jira credentials aren't configured yet
  let issue;
  try {
    issue = await fetchJiraIssue(issueKey);
  } catch (e) {
    console.log('Falling back to mock issue data for demonstration purposes.');
    issue = {
      key: issueKey,
      summary: `User login feature for ${issueKey}`,
      description: 'Given user is on login page, when entering valid credentials, then user should see dashboard.',
      acceptanceCriteria: '1. Navigate to /login\n2. Enter username and password\n3. Click Login button\n4. Verify dashboard URL and welcome message.'
    };
  }

  console.log('Generating Playwright test via AI...');
  const testCode = await generatePlaywrightTest(issue);

  const testFilePath = path.resolve(__dirname, `../tests/${issue.key.toLowerCase()}.spec.ts`);
  fs.writeFileSync(testFilePath, testCode);
  console.log(`Successfully generated Playwright test at: ${testFilePath}`);
}

main().catch(console.error);
