// Simulated AI response generator - realistic mocked outputs for demos.

export async function simulateDelay(ms = 1200) {
  return new Promise((r) => setTimeout(r, ms));
}

export interface EmailInput {
  recipientName: string;
  recipientRole: string;
  subject: string;
  purpose: string;
  info: string;
  context: string;
  audience: string;
  tone: string;
  length: string;
}

export function generateEmail(i: EmailInput): string {
  const greeting =
    i.tone === "friendly" ? `Hi ${i.recipientName || "there"},` : `Dear ${i.recipientName || "there"},`;
  const opener =
    i.tone === "apologetic"
      ? "I hope you're well. I wanted to reach out to address an important matter."
      : i.tone === "persuasive"
      ? "I hope this message finds you well. I'm writing to share an opportunity I believe deserves your attention."
      : i.tone === "concise"
      ? "I hope you're well."
      : "I hope this message finds you well.";

  const body = [
    opener,
    "",
    `${i.purpose || "I wanted to follow up regarding our recent discussion."}`,
    i.info ? `\nKey points to note:\n• ${i.info.split(/\n|\./).filter(Boolean).slice(0, 4).map((s) => s.trim()).join("\n• ")}` : "",
    i.context ? `\nAdditional context: ${i.context}` : "",
    "",
    "Please let me know if you have any questions or need further clarification. I'd be happy to schedule a quick call at your convenience.",
  ]
    .filter(Boolean)
    .join("\n");

  const closing =
    i.tone === "friendly" ? "Thanks so much,\nAlex" : i.tone === "confident" ? "Best regards,\nAlex Morgan" : "Kind regards,\nAlex Morgan";

  const subject = i.subject || `Regarding ${i.purpose?.slice(0, 40) || "our recent discussion"}`;
  return `Subject: ${subject}\n\n${greeting}\n\n${body}\n\n${closing}`;
}

export interface MeetingInput {
  title: string;
  date: string;
  participants: string;
  notes: string;
  length: string;
}

export interface ActionItem {
  task: string;
  assignee: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Complete";
}

export interface MeetingSummary {
  executive: string;
  keyPoints: string[];
  decisions: string[];
  actions: ActionItem[];
  followUps: string[];
}

export function summarizeMeeting(i: MeetingInput): MeetingSummary {
  const notes = i.notes || "General discussion covered project updates.";
  const first = notes.split(/[.\n]/).filter(Boolean).slice(0, 5).map((s) => s.trim());
  const parts = (i.participants || "team members").split(",").map((p) => p.trim()).filter(Boolean);

  return {
    executive: `The ${i.title || "team meeting"} on ${i.date || "today"} focused on aligning the team on priorities and next steps. ${first[0] ?? ""} Key stakeholders included ${parts.slice(0, 3).join(", ") || "the team"}.`,
    keyPoints: first.length ? first : [
      "Reviewed current project status and blockers.",
      "Aligned on Q4 objectives and priorities.",
      "Discussed resource allocation and timelines.",
      "Identified risks and mitigation strategies.",
    ],
    decisions: [
      "Proceed with proposed timeline for launch.",
      "Increase weekly stand-up cadence to twice a week.",
      "Allocate additional design resource to the mobile workstream.",
    ],
    actions: [
      {
        task: "Draft revised project timeline",
        assignee: parts[0] || "Alex",
        deadline: "In 3 days",
        priority: "High",
        status: "Pending",
      },
      {
        task: "Prepare stakeholder communication",
        assignee: parts[1] || parts[0] || "Jordan",
        deadline: "In 1 week",
        priority: "Medium",
        status: "Pending",
      },
      {
        task: "Review budget allocation",
        assignee: parts[2] || "Finance",
        deadline: "End of week",
        priority: "High",
        status: "In Progress",
      },
    ],
    followUps: [
      "Schedule follow-up review in 2 weeks.",
      "Share revised roadmap with leadership.",
      "Confirm final scope with engineering lead.",
    ],
  };
}

export interface PlannerTask {
  id: string;
  name: string;
  description: string;
  deadline: string;
  duration: number; // minutes
  priority: "High" | "Medium" | "Low";
}

export interface PlannerInput {
  tasks: PlannerTask[];
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  breakEvery: number; // minutes
  breakLength: number;
  mode: "daily" | "weekly";
}

export interface ScheduleEntry {
  id: string;
  date: string;
  start: string;
  end: string;
  task: string;
  duration: number;
  priority: "High" | "Medium" | "Low";
  break?: boolean;
  status: "Pending" | "In Progress" | "Complete";
}

function addMin(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

export function generatePlan(i: PlannerInput): { schedule: ScheduleEntry[]; tips: string[]; conflicts: string[] } {
  const priorityWeight = { High: 0, Medium: 1, Low: 2 };
  const sorted = [...i.tasks].sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
  const schedule: ScheduleEntry[] = [];
  const days = i.mode === "weekly" ? 5 : 1;
  const today = new Date();

  let dayIdx = 0;
  let current = i.startTime || "09:00";
  let sinceBreak = 0;

  for (const t of sorted) {
    // check if fits today
    const end = addMin(current, t.duration);
    if (end > (i.endTime || "17:00")) {
      dayIdx++;
      if (dayIdx >= days) break;
      current = i.startTime || "09:00";
      sinceBreak = 0;
    }
    const date = new Date(today);
    date.setDate(today.getDate() + dayIdx);
    const dateStr = date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    const eEnd = addMin(current, t.duration);
    schedule.push({
      id: t.id,
      date: dateStr,
      start: current,
      end: eEnd,
      task: t.name,
      duration: t.duration,
      priority: t.priority,
      status: "Pending",
    });
    current = eEnd;
    sinceBreak += t.duration;
    if (i.breakEvery > 0 && sinceBreak >= i.breakEvery) {
      const bEnd = addMin(current, i.breakLength);
      schedule.push({
        id: `${t.id}-break`,
        date: dateStr,
        start: current,
        end: bEnd,
        task: "Break",
        duration: i.breakLength,
        priority: "Low",
        break: true,
        status: "Pending",
      });
      current = bEnd;
      sinceBreak = 0;
    }
  }

  const tips = [
    "Tackle high-priority tasks in your first two focused blocks — this is when cognitive energy peaks.",
    "Batch similar tasks (e.g. emails, reviews) to reduce context switching.",
    "Protect breaks — short walks improve focus for the next block.",
    "Reserve the last 30 minutes to review progress and plan tomorrow.",
  ];
  const conflicts: string[] = [];
  if (sorted.length > days * 6) {
    conflicts.push("Your task list may exceed available time. Consider postponing lower-priority items or delegating.");
  }
  const lows = sorted.filter((t) => t.priority === "Low").map((t) => t.name);
  if (lows.length) {
    conflicts.push(`Low-priority tasks that could be delegated or postponed: ${lows.slice(0, 3).join(", ")}.`);
  }
  return { schedule, tips, conflicts };
}

export interface ResearchInput {
  topic: string;
  question: string;
  source: string;
  audience: string;
  depth: string;
}

export interface ResearchOutput {
  overview: string;
  findings: string[];
  insights: string[];
  recommendations: string[];
  opportunities: string[];
  risks: string[];
  nextSteps: string[];
  verify: string[];
}

export function analyzeTopic(i: ResearchInput): ResearchOutput {
  const t = i.topic || "the topic";
  return {
    overview: `${t} is an area gaining rapid attention across industries. This ${i.depth || "analysis"} is calibrated for a ${i.audience || "professional"} audience and addresses: "${i.question || "core dynamics and implications"}".`,
    findings: [
      `Adoption of ${t} has grown steadily over the past 24 months.`,
      "Leading organizations report measurable productivity gains but also new operational risks.",
      "Regulatory attention is increasing, with new guidance expected in the next 12 months.",
      "Talent and change-management remain the primary implementation blockers.",
    ],
    insights: [
      "Value is unlocked when workflows are re-designed, not just augmented.",
      "Cross-functional pilots outperform isolated departmental rollouts.",
      "Data quality is a bigger determinant of ROI than model choice.",
    ],
    recommendations: [
      "Run a focused 90-day pilot with clear success metrics.",
      "Invest in enablement and training before scaling.",
      "Establish a governance council covering ethics, privacy, and quality.",
    ],
    opportunities: [
      "Automate high-volume, low-judgement tasks first.",
      "Bundle capabilities into role-specific workflows.",
      "Position as an enablement layer, not a replacement.",
    ],
    risks: [
      "Over-reliance on generated content without verification.",
      "Data leakage through unmanaged external tools.",
      "Skill atrophy in teams that delegate too aggressively.",
    ],
    nextSteps: [
      "Scope a pilot in one department with clear KPIs.",
      "Draft an internal responsible-use policy.",
      "Identify a cross-functional champion team.",
    ],
    verify: [
      "Confirm the latest regulatory guidance for your jurisdiction.",
      "Validate any statistics against primary sources before citing.",
      "Cross-check vendor claims with independent reviews.",
    ],
  };
}

export function chatReply(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("email")) {
    return "I can help draft that. Try the Smart Email Generator, or tell me: who is the recipient, what's the purpose, and what tone do you want? I'll produce a draft you can refine.";
  }
  if (m.includes("plan") || m.includes("schedule") || m.includes("day")) {
    return "Here's a suggested structure for a productive workday:\n\n1. 09:00–10:30 — Deep work on your highest-priority task\n2. 10:30–10:45 — Short break\n3. 10:45–12:00 — Meetings or collaboration blocks\n4. 12:00–13:00 — Lunch\n5. 13:00–14:30 — Focused work block #2\n6. 14:30–15:30 — Email and admin batch\n7. 15:30–17:00 — Wrap-up, reviews, planning tomorrow\n\nWant me to build a personalized schedule? Head to the AI Task Planner.";
  }
  if (m.includes("summar") || m.includes("meeting")) {
    return "For a strong meeting summary, capture: (1) an executive summary in 2–3 sentences, (2) key discussion points, (3) decisions made, (4) action items with owner and deadline, and (5) follow-ups. Paste your notes into the Meeting Notes Summarizer and I'll structure them.";
  }
  if (m.includes("stakeholder") || m.includes("prepare")) {
    return "To prepare for a stakeholder meeting: define the outcome you want, tailor 3 key messages to their priorities, prepare 2–3 supporting data points, anticipate the top 3 objections, and end with a clear ask. Would you like a slide outline?";
  }
  if (m.includes("brainstorm") || m.includes("idea")) {
    return "Let's brainstorm. Share the challenge in one sentence and any constraints, and I'll generate 5–8 varied ideas across different angles (contrarian, low-cost, ambitious, and safe).";
  }
  return `Thanks for your message. Here's a workplace-focused response:\n\n${msg
    .split(/\s+/)
    .slice(0, 3)
    .join(" ")} is a great area to think through carefully. I'd recommend clarifying the desired outcome first, then breaking the work into 2–3 concrete steps you can complete this week. Would you like me to draft those steps?`;
}