import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Plus, Trash2, Sparkles, Loader2, RefreshCw, Save, CheckCircle2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/workmate/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generatePlan, simulateDelay, type PlannerTask, type ScheduleEntry } from "@/lib/workmate/ai";
import { store } from "@/lib/workmate/store";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "AI Task Planner — WorkMate AI" }, { name: "description", content: "Plan your day or week with AI-optimized scheduling and breaks." }] }),
  component: TasksPage,
});

function newTask(): PlannerTask {
  return { id: crypto.randomUUID(), name: "", description: "", deadline: "", duration: 60, priority: "Medium" };
}

function TasksPage() {
  const [tasks, setTasks] = useState<PlannerTask[]>([{ ...newTask(), name: "Prepare Q4 review deck", duration: 90, priority: "High" }]);
  const [startTime, setStart] = useState("09:00");
  const [endTime, setEnd] = useState("17:00");
  const [breakEvery, setBreakEvery] = useState(90);
  const [breakLength, setBreakLength] = useState(15);
  const [mode, setMode] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleEntry[] | null>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [conflicts, setConflicts] = useState<string[]>([]);

  const upd = (id: string, patch: Partial<PlannerTask>) => setTasks((ts) => ts.map((t) => t.id === id ? { ...t, ...patch } : t));
  const rm = (id: string) => setTasks((ts) => ts.filter((t) => t.id !== id));

  const generate = async () => {
    const valid = tasks.filter((t) => t.name.trim());
    if (!valid.length) return toast.error("Please add at least one task with a name.");
    setLoading(true);
    setSchedule(null);
    await simulateDelay();
    const { schedule: s, tips: tp, conflicts: c } = generatePlan({ tasks: valid, startTime, endTime, breakEvery, breakLength, mode });
    setSchedule(s); setTips(tp); setConflicts(c);
    setLoading(false);
    toast.success("Schedule generated");
  };

  const toggleStatus = (id: string) => setSchedule((s) => s ? s.map((e) => e.id === id ? { ...e, status: e.status === "Complete" ? "Pending" : "Complete" } : e) : s);

  const save = () => {
    if (!schedule) return;
    store.addHistory({ kind: "task", title: `Plan — ${mode}`, content: JSON.stringify(schedule, null, 2), saved: true });
    store.bumpStat("task", 30);
    toast.success("Saved to history");
  };
  const clear = () => { setTasks([newTask()]); setSchedule(null); setTips([]); setConflicts([]); };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={CalendarClock} title="AI Task Planner" description="Add your tasks and let WorkMate AI build a prioritized, realistic schedule." />

      <Card>
        <CardHeader><CardTitle className="text-base">Working preferences</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div><Label>Start time</Label><Input type="time" value={startTime} onChange={(e) => setStart(e.target.value)} /></div>
          <div><Label>End time</Label><Input type="time" value={endTime} onChange={(e) => setEnd(e.target.value)} /></div>
          <div><Label>Break every (min)</Label><Input type="number" value={breakEvery} onChange={(e) => setBreakEvery(+e.target.value)} /></div>
          <div><Label>Break length (min)</Label><Input type="number" value={breakLength} onChange={(e) => setBreakLength(+e.target.value)} /></div>
          <div><Label>Schedule</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as "daily" | "weekly")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="daily">Daily</SelectItem><SelectItem value="weekly">Weekly</SelectItem></SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Tasks</CardTitle>
          <Button size="sm" variant="outline" onClick={() => setTasks((t) => [...t, newTask()])}><Plus className="mr-1.5 h-4 w-4" /> Add task</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((t, i) => (
            <div key={t.id} className="grid gap-3 rounded-lg border bg-background p-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <Label>Task name</Label>
                <Input value={t.name} onChange={(e) => upd(t.id, { name: e.target.value })} placeholder={`Task ${i + 1}`} />
              </div>
              <div><Label>Deadline</Label><Input type="date" value={t.deadline} onChange={(e) => upd(t.id, { deadline: e.target.value })} /></div>
              <div><Label>Duration (min)</Label><Input type="number" value={t.duration} onChange={(e) => upd(t.id, { duration: +e.target.value })} /></div>
              <div><Label>Priority</Label>
                <Select value={t.priority} onValueChange={(v) => upd(t.id, { priority: v as PlannerTask["priority"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="High">High</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Low">Low</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button variant="ghost" size="icon" onClick={() => rm(t.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="sm:col-span-6">
                <Label>Description</Label>
                <Textarea rows={2} value={t.description} onChange={(e) => upd(t.id, { description: e.target.value })} />
              </div>
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button onClick={generate} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} Generate Plan
            </Button>
            <Button variant="outline" onClick={clear}><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
          </div>
        </CardContent>
      </Card>

      {loading && <Card><CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin text-primary" /> Preparing your workplace solution...</CardContent></Card>}

      {schedule && !loading && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Your schedule</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Date</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead>
                  <TableHead>Task</TableHead><TableHead>Duration</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {schedule.map((s) => (
                    <TableRow key={s.id} className={s.break ? "bg-muted/50" : ""}>
                      <TableCell>{s.date}</TableCell>
                      <TableCell>{s.start}</TableCell>
                      <TableCell>{s.end}</TableCell>
                      <TableCell>{s.break ? <span className="text-muted-foreground italic">Break</span> : s.task}</TableCell>
                      <TableCell>{s.duration}m</TableCell>
                      <TableCell><Badge variant={s.priority === "High" ? "destructive" : s.priority === "Medium" ? "default" : "secondary"}>{s.priority}</Badge></TableCell>
                      <TableCell><Badge variant={s.status === "Complete" ? "outline" : "secondary"}>{s.status}</Badge></TableCell>
                      <TableCell>{!s.break && <Button size="sm" variant="ghost" onClick={() => toggleStatus(s.id)}><CheckCircle2 className="h-4 w-4" /></Button>}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Time management tips</CardTitle></CardHeader>
              <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{tips.map((t, i) => <li key={i}>{t}</li>)}</ul></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Conflicts & recommendations</CardTitle></CardHeader>
              <CardContent>{conflicts.length ? <ul className="list-disc space-y-1 pl-5 text-sm">{conflicts.map((t, i) => <li key={i}>{t}</li>)}</ul> : <p className="text-sm text-muted-foreground">No conflicts detected.</p>}</CardContent></Card>
          </div>
          <AIDisclaimer />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("Edit tasks above and regenerate.")}><Pencil className="mr-1.5 h-4 w-4" /> Edit Schedule</Button>
            <Button variant="outline" size="sm" onClick={generate}><RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate</Button>
            <Button size="sm" onClick={save}><Save className="mr-1.5 h-4 w-4" /> Save</Button>
            <Button variant="ghost" size="sm" onClick={() => setSchedule(null)}><Trash2 className="mr-1.5 h-4 w-4" /> Clear</Button>
          </div>
        </div>
      )}
    </div>
  );
}