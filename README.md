# Work Mate

Build a modern, professional, and fully responsive web application called “WorkMate AI”.

WorkMate AI must be one integrated AI-powered workplace productivity platform that helps professionals complete common workplace tasks quickly, accurately, and efficiently. All features must be contained within one dashboard rather than being separate applications.

DESIGN AND LAYOUT

Create a clean, modern SaaS-style dashboard with:

- A fixed sidebar navigation menu on desktop

- A collapsible navigation menu on mobile

- A professional dashboard home page

- A top navigation bar with a search field, notification icon, profile section, and light/dark mode toggle

- A clean sky-blue, white, and light-grey colour scheme

- Modern cards, professional icons, rounded corners, clear spacing, subtle shadows, and readable typography

- Responsive layouts for desktop, tablet, and mobile devices

The sidebar must include:

- Dashboard

- Smart Email Generator

- Meeting Notes Summarizer

- AI Task Planner

- AI Research Assistant

- Workplace Chatbot

- Prompt Library

- History

- Settings

DASHBOARD HOME PAGE

Create a welcoming dashboard showing:

- “Welcome to WorkMate AI”

- A short explanation of how the platform improves workplace productivity

- Quick-access cards for all five AI tools

- Number of tasks completed

- Number of emails generated

- Number of meetings summarized

- Estimated time saved

- Recent activity

- A weekly productivity overview

- A “Start a New Task” section

1. SMART EMAIL GENERATOR

Create a professional email-generation form with the following fields:

- Recipient name

- Recipient position or role

- Email subject

- Purpose of the email

- Important information to include

- Additional context

- Audience type: manager, client, colleague, employee, supplier, or general recipient

- Tone: formal, friendly, persuasive, apologetic, confident, or concise

- Email length: short, standard, or detailed

Add a “Generate Email” button.

The generated email must include:

- Subject line

- Professional greeting

- Well-structured email body

- Clear call to action where appropriate

- Professional closing

The generated email must be editable.

Include these functional buttons:

- Copy

- Edit

- Regenerate

- Save

- Download

- Clear

2. MEETING NOTES SUMMARIZER

Allow users to enter:

- Meeting title

- Meeting date

- Participants

- Long meeting notes

- Summary length: brief, standard, or detailed

Add a “Summarize Meeting” button.

Display the generated results in separate sections:

- Executive Summary

- Key Discussion Points

- Decisions Made

- Action Items

- Responsible Person

- Deadlines

- Follow-up Requirements

Display action items in a clear table with columns for:

- Task

- Assigned Person

- Deadline

- Priority

- Status

Include these functional buttons:

- Copy

- Edit

- Regenerate

- Save

- Export

- Clear

3. AI TASK PLANNER

Allow users to enter:

- Task name

- Task description

- Deadline

- Estimated duration

- Priority level

- Working start time

- Working end time

- Break preferences

- Daily or weekly schedule option

Allow users to add multiple tasks.

When the user selects “Generate Plan”, create a structured schedule showing:

- Date

- Start time

- End time

- Task

- Duration

- Priority

- Suggested break

- Task status

The AI planner must:

- Prioritize urgent and important tasks

- Identify possible scheduling conflicts

- Recommend suitable working times

- Include rest breaks

- Provide time-management recommendations

- Suggest which tasks can be postponed or delegated

Include these functional buttons:

- Generate Plan

- Edit Schedule

- Regenerate

- Save

- Mark as Complete

- Clear

4. AI RESEARCH ASSISTANT

Allow users to enter:

- Research topic

- Research question

- Article, report, or information to summarize

- Target audience: beginner, professional, or executive

- Research depth: quick overview, standard analysis, or detailed report

Add an “Analyse Topic” button.

Display results in separate professional sections:

- Topic Overview

- Key Findings

- Important Insights

- Recommendations

- Opportunities

- Risks and Limitations

- Suggested Next Steps

- Information That Requires Verification

Include these functional buttons:

- Copy

- Edit

- Regenerate

- Save

- Export

- Clear

Display a visible reminder that users must verify important facts and references.

5. WORKPLACE CHATBOT

Create an interactive workplace chatbot interface containing:

- Professional chat message bubbles

- User and AI message labels

- Message timestamps

- A typing indicator

- A message input field

- Send button

- New Chat button

- Clear Chat button

- Chat history panel

Add suggested prompts such as:

- “Write a professional email”

- “Plan my workday”

- “Summarize meeting notes”

- “Explain a workplace topic”

- “Create an action plan”

- “Help me prepare for a meeting”

The chatbot must provide realistic workplace assistance for writing, planning, summarizing, brainstorming, explaining, and decision support.

PROMPT LIBRARY

Create a Prompt Library page containing reusable workplace prompts for:

- Professional emails

- Meeting summaries

- Task planning

- Research

- Brainstorming

- Reports

- Presentations

- Customer communication

Each prompt must follow this structure:

- Role

- Context

- Task

- Input

- Constraints

- Output Format

Allow users to:

- View the prompt

- Copy the prompt

- Edit the prompt

- Save the prompt

- Create a custom prompt



For each AI feature, create structured prompts using:

- Role

- Context

- Task

- User Input

- Instructions

- Constraints

- Required Output Format



HISTORY PAGE

Create a History page that stores generated:

- Emails

- Meeting summaries

- Task schedules

- Research results

- Chatbot conversations

Allow users to filter history by:

- Feature

- Date

- Keyword

- Saved status

Include these actions:

- View

- Edit

- Copy

- Download

- Delete

SETTINGS PAGE

Create a Settings page containing:

- Profile settings

- Appearance settings

- Notification settings

- Privacy settings

- Responsible AI information

- Data Usage information

- Clear History option

RESPONSIBLE AI

Display this responsible AI disclaimer in the footer and on all AI output pages:

“WorkMate AI may produce incomplete, inaccurate, or biased information. Users must review and verify AI-generated content before using it for professional, financial, legal, medical, or important workplace decisions.”

Add a checkbox saying:

“I have reviewed and verified this AI-generated output.”

Require the user to select this checkbox before saving important outputs.

Clearly explain that WorkMate AI:

- Does not guarantee accuracy

- May generate biased or incorrect information

- Should not replace professional judgement

- Must not expose confidential workplace information

- Requires users to verify important facts, dates, names, and recommendations

FUNCTIONALITY

Make all of the following functional:

- Sidebar navigation

- Mobile navigation

- Forms

- Dropdown menus

- Tabs

- Generate buttons

- Copy buttons

- Edit buttons

- Save buttons

- Regenerate buttons

- Clear buttons

- Delete buttons

- Download or export buttons

- Light and dark mode

- Search

- History filters

- Confirmation messages

- Error messages

- Loading animations

Where a live AI API is not connected, use realistic simulated AI responses so the application can still be demonstrated successfully.

Add loading messages such as:

- “WorkMate AI is generating your response.”

- “Analysing your information.”

- “Preparing your workplace solution.”

Include proper form validation. Show clear error messages when required fields are empty.

Add realistic sample information to the dashboard and History page so the application does not appear empty during the presentation.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://workmate-ai-buddy-00.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/676a1058-cf63-4cc1-bd1d-f285680bf564).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
