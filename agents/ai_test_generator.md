---
name: ai-test-generator
description: Takes Jira ticket requirements and uses OpenAI/LLM to generate robust Playwright TypeScript test scripts.
compatibility: Requires OpenAI SDK, OPENAI_API_KEY environment variable.
---

# AI Test Generator Agent

## Purpose
Translates human-readable acceptance criteria and Jira requirements into executable Playwright test automation scripts.

## Steps
1. Receive Jira issue details (Key, Summary, Acceptance Criteria).
2. Construct a prompt instructing the LLM to act as an expert SDET.
3. Call OpenAI Chat Completions API with low temperature (0.2) for code generation.
4. Parse the markdown code block response from the LLM.
5. Save the resulting test code into `playwright/tests/{issueKey}.spec.ts`.
