import OpenAI from 'openai';
import dotenv from 'dotenv';
import { JiraIssueDetails } from './jiraClient';

dotenv.config();

export async function generatePlaywrightTest(issue: JiraIssueDetails): Promise<string> {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('dummy')) {
    // Fallback template when valid OpenAI API key is not provided
    return `import { test, expect } from '@playwright/test';

test('${issue.key}: ${issue.summary}', async ({ page }) => {
  // Test generated for Jira Ticket: ${issue.key}
  // Description: ${issue.description}
  
  await page.goto('https://example.com');
  
  // Acceptance Criteria implementation steps
  // 1. Navigate and perform actions
  await expect(page).toHaveTitle(/Example Domain/);
});
`;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `
You are an expert SDET and QA Automation Engineer.
Given the following Jira ticket details, write a robust Playwright TypeScript test script using '@playwright/test'.

Jira Issue Key: ${issue.key}
Summary: ${issue.summary}
Acceptance Criteria / Description: ${issue.acceptanceCriteria}

Requirements:
1. Return ONLY valid TypeScript code block enclosed in \`\`\`typescript ... \`\`\` with no extra conversational text.
2. Use Page Object Model or clean locator patterns.
3. Include proper assertions.
4. Name the test file appropriately.
`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2,
  });

  const content = response.choices[0].message.content || '';
  const match = content.match(/```(?:typescript|ts)?([\s\S]*?)```/);
  return match ? match[1].trim() : content.trim();
}
