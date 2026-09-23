import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const reporters: any[] = [['html']];

// Dynamically determine current Jira issue key from environment or fallback
const issueKey = process.env.JIRA_ISSUE_KEY || 'KAN-5';

if (process.env.AIO_API_KEY) {
  // If an existing cycle is supplied, reuse it. Otherwise, create one for this ticket.
  const hasExistingCycle = !!process.env.AIO_CYCLE_KEY;

  const cycleDetails: any = {
    createNewCycle: !hasExistingCycle,
    tasks: [issueKey]
  };

  if (hasExistingCycle) {
    cycleDetails.cycleKeyToReportTo = process.env.AIO_CYCLE_KEY;
  } else {
    cycleDetails.cycleName = `Execution Cycle - ${issueKey}`;
  }

  reporters.push([
    'aiotests-playwright-reporter',
    {
      aioConfig: {
        enableReporting: true,
        cloud: {
          apiKey: process.env.AIO_API_KEY
        },
        jiraProjectId: process.env.JIRA_PROJECT_KEY || 'KAN',
        cycleDetails: cycleDetails,
        addNewRun: true,
        addAttachmentToFailedCases: true
      }
    }
  ]);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: reporters,
  use: {
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
