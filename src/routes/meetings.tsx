import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Copy, RefreshCw, Save, Download, Trash2, Sparkles, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/workmate/PageHeader";
import { VerifyCheckbox } from "@/components/workmate/VerifyCheckbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { summarizeMeeting, simulateDelay, type MeetingSummary } from "@/lib/workmate/ai";
import { store } from "@/lib/workmate/store";

export const Route = createFileRoute("/meetings")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkMate AI" }, { name: "description", content: "Turn meeting notes into structured summaries, decisions, and action items." }] }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [participants, setParticipants] = useState("");
  const [notes, setNotes] = useState("");
  const [length, setLength] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MeetingSummary | null>(null);
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const doSummarize = async () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Meeting title is required";
    if (!notes.trim()) e.notes = "Please paste your meeting notes";
    setErrors(e);
    if (Object.keys(e).length) return toast.error("Please fill in the required fields.");
    setLoading(true);
    setResult(null);
    await simulateDelay();
    setResult(summarizeMeeting({ title, date, participants, notes, length }));
    setLoading(false);
    setVerified(false);
    toast.success("Summary generated");
  };

  const asText = (r: MeetingSummary) => {
    return `Executive Summary\n${r.executive}\n\nKey Discussion Points\n${r.keyPoints.map((p) => `• ${p}`).join("\n")}\n\nDecisions Made\n${r.decisions.map((p) => `• ${p}`).join("\n")}\n\nAction Items\n${r.actions.map((a) => `- ${a.task} (${a.assignee}, ${a.deadline}, ${a.priority})`).join("\n")}\n\nFollow-Ups\n${r.followUps.map((p) => `• ${p}`).join("\n")}`;
  };

  const copy = async () => { if (result) { await navigator.clipboard.writeText(asText(result)); toast.success("Copied"); } };
  const save = () => {
    if (!result) return;
    if (!verified) return toast.error("Please confirm you've reviewed the output.");
    store.addHistory({ kind: "meeting", title: title || "Meeting summary", content: asText(result), saved: true });
    store.bumpStat("meeting", 20);
    toast.success("Saved to history");
  };
  const download = () => {
    if (!result) return;
    const blob = new Blob([asText(result)], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `meeting-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url);
  };
  const clear = () => { setTitle(""); setDate(""); setParticipants(""); setNotes(""); setResult(null); setVerified(false); setErrors({}); };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={FileText} title="Meeting Notes Summarizer" description="Turn raw meeting notes into a structured summary with decisions and action items." />

      <Card>
        <CardHeader><CardTitle className="text-base">Meeting details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="mt">Meeting title *</Label>
              <Input id="mt" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Roadmap Sync" />
              {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title}</p>}
            </div>
            <div>
              <Label htmlFor="md">Date</Label>
              <Input id="md" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="brief">Brief</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="mp">Participants</Label>
            <Input id="mp" value={participants} onChange={(e) => setParticipants(e.target.value)} placeholder="Sarah, Alex, Jordan, Priya" />
          </div>
          <div>
            <Label htmlFor="mn">Meeting notes *</Label>
            <Textarea id="mn" value={notes} onChange={(e) => setNotes(e.target.value)} rows={8} placeholder="Paste your meeting notes here..." />
            {errors.notes && <p className="mt-1 text-xs text-destructive">{errors.notes}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={doSummarize} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Summarize Meeting
            </Button>
            <Button variant="outline" onClick={clear}><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <Card><CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin text-primary" /> Analysing your information...
        </CardContent></Card>
      )}

      {result && !loading && (
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Executive Summary</CardTitle></CardHeader>
            <CardContent className="text-sm leading-relaxed">{result.executive}</CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card><CardHeader><CardTitle className="text-base">Key Discussion Points</CardTitle></CardHeader>
              <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{result.keyPoints.map((p, i) => <li key={i}>{p}</li>)}</ul></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-base">Decisions Made</CardTitle></CardHeader>
              <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{result.decisions.map((p, i) => <li key={i}>{p}</li>)}</ul></CardContent></Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-base">Action Items</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Task</TableHead><TableHead>Assigned</TableHead><TableHead>Deadline</TableHead>
                  <TableHead>Priority</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {result.actions.map((a, i) => (
                    <TableRow key={i}>
                      <TableCell>{a.task}</TableCell>
                      <TableCell>{a.assignee}</TableCell>
                      <TableCell>{a.deadline}</TableCell>
                      <TableCell><Badge variant={a.priority === "High" ? "destructive" : a.priority === "Medium" ? "default" : "secondary"}>{a.priority}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{a.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Follow-up Requirements</CardTitle></CardHeader>
            <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{result.followUps.map((p, i) => <li key={i}>{p}</li>)}</ul></CardContent>
          </Card>
          <AIDisclaimer />
          <VerifyCheckbox checked={verified} onCheckedChange={setVerified} />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copy}><Copy className="mr-1.5 h-4 w-4" /> Copy</Button>
            <Button variant="outline" size="sm" onClick={() => toast.info("Edit each section inline above.")}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Button>
            <Button variant="outline" size="sm" onClick={doSummarize}><RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate</Button>
            <Button size="sm" onClick={save}><Save className="mr-1.5 h-4 w-4" /> Save</Button>
            <Button variant="outline" size="sm" onClick={download}><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <Button variant="ghost" size="sm" onClick={() => setResult(null)}><Trash2 className="mr-1.5 h-4 w-4" /> Clear</Button>
          </div>
        </div>
      )}
    </div>
  );
}