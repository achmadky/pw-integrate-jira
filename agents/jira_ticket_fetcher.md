---
name: jira-ticket-fetcher
description: Fetches ticket details (summary, description, acceptance criteria) from Jira REST API given an issue key.
compatibility: Requires Node.js, Axios, and valid Jira Cloud API credentials (JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN).
---

# Jira Ticket Fetcher Agent

## Purpose
Retrieves structured ticket information from Jira to be used as requirements for automated test generation.

## Steps
1. Parse the command line argument for the Jira issue key (e.g., `PROJ-123`).
2. Construct HTTP Basic Auth headers using `JIRA_USER_EMAIL` and `JIRA_API_TOKEN`.
3. Call Jira REST API endpoint `/rest/api/3/issue/{issueKey}`.
4. Extract summary, description, and acceptance criteria.
5. Pass the structured object to the AI test generator.
