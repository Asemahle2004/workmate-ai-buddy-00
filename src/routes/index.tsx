import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  CalendarClock,
  Search,
  MessageSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { store, useStore } from "@/lib/workmate/store";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — WorkMate AI" },
      {
        name: "description",
        content: "Your WorkMate AI dashboard: productivity stats, quick tools, and recent activity.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft polished emails in seconds.", icon: Mail },
  { to: "/meetings", title: "Meeting Notes Summarizer", desc: "Turn notes into decisions & actions.", icon: FileText },
  { to: "/tasks", title: "AI Task Planner", desc: "Plan focused, realistic workdays.", icon: CalendarClock },
  { to: "/research", title: "AI Research Assistant", desc: "Understand topics faster with structure.", icon: Search },
  { to: "/chat", title: "Workplace Chatbot", desc: "Ask, brainstorm, and get help anytime.", icon: MessageSquare },
] as const;

function Stat({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; sub?: string }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{value}</p>
            {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const stats = useStore(() => store.getStats());
  const history = useStore(() => store.getHistory()).slice(0, 5);
  const settings = useStore(() => store.getSettings());

  const hours = Math.floor(stats.minutesSaved / 60);
  const mins = stats.minutesSaved % 60;
  const maxWeek = Math.max(1, ...stats.weekly);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Hero */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Welcome back, {settings.name.split(" ")[0]}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Welcome to WorkMate AI</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              One integrated dashboard for all your workplace AI tools — draft emails, summarize
              meetings, plan your day, research topics, and chat with an assistant that understands
              your workflow. Save hours every week and focus on the work that matters.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button asChild size="lg">
              <Link to="/chat">
                Start a new task <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/prompts">Prompt library</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={CheckCircle2} label="Tasks completed" value={stats.tasks} sub="+5 this week" />
        <Stat icon={Mail} label="Emails generated" value={stats.emails} sub="+3 this week" />
        <Stat icon={FileText} label="Meetings summarized" value={stats.meetings} sub="+2 this week" />
        <Stat icon={Clock} label="Time saved" value={`${hours}h ${mins}m`} sub="Estimated" />
      </div>

      {/* Quick access + weekly overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick access</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {TOOLS.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                className="group flex items-start gap-3 rounded-lg border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Weekly productivity</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-end gap-2">
              {stats.weekly.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${(v / maxWeek) * 100}%`, minHeight: 6 }}
                  />
                  <span className="text-[10px] text-muted-foreground">{days[i]}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tasks completed per day this week.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity + start new */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent activity</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link to="/history">View all</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y">
              {history.map((h) => (
                <li key={h.id} className="flex items-center gap-3 px-6 py-3">
                  <Badge variant="secondary" className="capitalize">{h.kind}</Badge>
                  <span className="min-w-0 flex-1 truncate text-sm">{h.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDistanceToNow(h.createdAt, { addSuffix: true })}
                  </span>
                </li>
              ))}
              {history.length === 0 && (
                <li className="px-6 py-8 text-center text-sm text-muted-foreground">
                  No recent activity yet.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Start a new task</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/email"><Mail className="mr-2 h-4 w-4" /> Draft an email</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/meetings"><FileText className="mr-2 h-4 w-4" /> Summarize a meeting</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/tasks"><CalendarClock className="mr-2 h-4 w-4" /> Plan my day</Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/research"><Search className="mr-2 h-4 w-4" /> Research a topic</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
