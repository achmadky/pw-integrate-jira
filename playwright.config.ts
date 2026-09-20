import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const reporters: any[] = [['html']];

if (process.env.AIO_API_KEY) {
  reporters.push([
    'aiotests-playwright-reporter',
    {
      aioConfig: {
        enableReporting: true,
        cloud: {
          apiKey: process.env.AIO_API_KEY
        },
        jiraProjectId: process.env.JIRA_PROJECT_KEY || 'KAN',
        cycleDetails: {
          createNewCycle: true,
          cycleName: `Execution Cycle - KAN-5`,
          tasks: ['KAN-5']
        },
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
