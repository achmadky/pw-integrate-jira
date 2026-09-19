import axios from 'axios';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER_EMAIL = process.env.JIRA_USER_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
const authHeader = `Basic ${Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`;

async function getTransitions(issueKey: string) {
  const res = await axios.get(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`, {
    headers: { 'Authorization': authHeader, 'Accept': 'application/json' }
  });
  return res.data.transitions;
}

async function transitionIssue(issueKey: string, transitionName: string) {
  const transitions = await getTransitions(issueKey);
  const target = transitions.find((t: any) => t.name.toLowerCase().includes(transitionName.toLowerCase()));
  if (!target) {
    console.log(`Transition matching "${transitionName}" not found. Available:`, transitions.map((t: any) => t.name));
    return;
  }
  await axios.post(`${JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/transitions`, {
    transition: { id: target.id }
  }, {
    headers: { 'Authorization': authHeader, 'Content-Type': 'application/json' }
  });
  console.log(`Successfully transitioned ${issueKey} to "${target.name}"`);
}

async function main() {
  const issueKey = process.argv[2] || 'KAN-4';
  const action = process.argv[3] || 'in-progress';

  if (action === 'in-progress') {
    await transitionIssue(issueKey, 'In Progress');
  } else if (action === 'done') {
    await transitionIssue(issueKey, 'Done');
  } else if (action === 'review') {
    await transitionIssue(issueKey, 'Review');
  }
}

main().catch(console.error);
