import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

if (!JIRA_BASE_URL || !JIRA_USER_EMAIL || !JIRA_API_TOKEN) {
  console.warn('Warning: Jira credentials are not fully set in environment variables.');
}

const authHeader = `Basic ${Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`;

export interface JiraIssueDetails {
  key: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;
}

export async function fetchJiraIssue(issueKey: string): Promise<JiraIssueDetails> {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}`, {
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    const data = response.data;
    const summary = data.fields.summary || '';
    // Jira Cloud description is ADF (Atlassian Document Format) or plain text depending on configuration
    const description = JSON.stringify(data.fields.description || {});
    // Assuming customfield or description contains acceptance criteria, or parse description
    const acceptanceCriteria = description;

    return {
      key: issueKey,
      summary,
      description,
      acceptanceCriteria
    };
  } catch (error: any) {
    console.error(`Error fetching Jira issue ${issueKey}:`, error.response?.data || error.message);
    throw error;
  }
}
