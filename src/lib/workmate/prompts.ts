export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  role: string;
  context: string;
  task: string;
  input: string;
  constraints: string;
  output: string;
}

export const LIBRARY: PromptTemplate[] = [
  {
    id: "email-pro",
    title: "Professional email draft",
    category: "Emails",
    role: "You are an executive communication assistant.",
    context: "The user needs to send a professional workplace email.",
    task: "Draft a clear, well-structured email that achieves the stated purpose.",
    input: "Recipient, role, purpose, key points, tone, length.",
    constraints: "Keep tone professional; avoid jargon; no confidential data; verify facts.",
    output: "Subject line, greeting, structured body, clear CTA, professional closing.",
  },
  {
    id: "meeting-summary",
    title: "Meeting notes summary",
    category: "Meetings",
    role: "You are a meeting-notes analyst.",
    context: "Transform long meeting notes into a structured summary.",
    task: "Extract executive summary, discussion points, decisions, and action items.",
    input: "Meeting title, date, participants, raw notes.",
    constraints: "Be faithful to the source; do not invent decisions; flag ambiguities.",
    output: "Executive summary, key points, decisions, action-item table, follow-ups.",
  },
  {
    id: "task-planner",
    title: "AI task planner",
    category: "Planning",
    role: "You are a productivity coach and scheduler.",
    context: "Plan a realistic daily or weekly schedule from a list of tasks.",
    task: "Sequence tasks by priority, add breaks, and recommend improvements.",
    input: "Task list with duration, priority, deadlines; working hours; break prefs.",
    constraints: "Respect working hours; include breaks; flag conflicts.",
    output: "Structured schedule, prioritization rationale, time-management tips.",
  },
  {
    id: "research",
    title: "Research topic analysis",
    category: "Research",
    role: "You are a research analyst.",
    context: "Produce a structured analysis of a workplace topic.",
    task: "Summarize the topic and provide insights, opportunities, and risks.",
    input: "Topic, research question, optional source material, audience, depth.",
    constraints: "Distinguish fact from opinion; call out items requiring verification.",
    output: "Overview, findings, insights, recommendations, risks, next steps, verify list.",
  },
  {
    id: "brainstorm",
    title: "Brainstorming session",
    category: "Brainstorming",
    role: "You are a creative facilitator.",
    context: "Generate diverse ideas for a workplace challenge.",
    task: "Produce 5–8 varied ideas across different angles.",
    input: "Challenge in one sentence, constraints, target outcome.",
    constraints: "Include contrarian and low-cost options; no duplicates.",
    output: "Numbered list with a one-line rationale for each idea.",
  },
  {
    id: "report",
    title: "Business report outline",
    category: "Reports",
    role: "You are a business analyst.",
    context: "Draft the outline of a formal business report.",
    task: "Structure the report with clear sections and key questions to answer.",
    input: "Report topic, audience, key questions, available data.",
    constraints: "Executive-friendly; concise; evidence-driven.",
    output: "Title, executive summary, sections with bullet-point talking points.",
  },
  {
    id: "presentation",
    title: "Presentation outline",
    category: "Presentations",
    role: "You are a presentation coach.",
    context: "Build a compelling slide outline for a workplace presentation.",
    task: "Produce a slide-by-slide outline with talking points.",
    input: "Topic, audience, duration, key messages, desired outcome.",
    constraints: "Max 10 slides; one core idea per slide; clear narrative arc.",
    output: "Slide list with titles, bullets, and speaker notes.",
  },
  {
    id: "customer",
    title: "Customer communication",
    category: "Customer",
    role: "You are a customer success writer.",
    context: "Respond to a customer message professionally and empathetically.",
    task: "Acknowledge, clarify, resolve, and set expectations.",
    input: "Customer message, product context, resolution options.",
    constraints: "Empathetic; solution-oriented; no over-promising.",
    output: "Response with acknowledgement, clarification, resolution, next steps.",
  },
];

export const SUGGESTED_CHATS = [
  "Write a professional email",
  "Plan my workday",
  "Summarize meeting notes",
  "Explain a workplace topic",
  "Create an action plan",
  "Help me prepare for a meeting",
];