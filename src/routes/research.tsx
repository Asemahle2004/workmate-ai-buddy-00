import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Loader2, Copy, RefreshCw, Save, Download, Trash2, Pencil, X, Check } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/workmate/PageHeader";
import { VerifyCheckbox } from "@/components/workmate/VerifyCheckbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analyzeTopic, simulateDelay, type ResearchOutput } from "@/lib/workmate/ai";
import { store } from "@/lib/workmate/store";

export const Route = createFileRoute("/research")({
  head: () => ({ meta: [{ title: "AI Research Assistant — WorkMate AI" }, { name: "description", content: "Structured AI-powered research: findings, insights, risks, and next steps." }] }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [source, setSource] = useState("");
  const [audience, setAudience] = useState("professional");
  const [depth, setDepth] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResearchOutput | null>(null);
  const [verified, setVerified] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [editedText, setEditedText] = useState<string | null>(null);

  const run = async () => {
    if (!topic.trim()) return toast.error("Please enter a research topic.");
    setLoading(true); setResult(null); setEditing(false); setEditedText(null);
    await simulateDelay(1400);
    setResult(analyzeTopic({ topic, question, source, audience, depth }));
    setLoading(false); setVerified(false);
  };

  const asText = (r: ResearchOutput) =>
    `Overview\n${r.overview}\n\nFindings\n${r.findings.map((x) => `• ${x}`).join("\n")}\n\nInsights\n${r.insights.map((x) => `• ${x}`).join("\n")}\n\nRecommendations\n${r.recommendations.map((x) => `• ${x}`).join("\n")}\n\nOpportunities\n${r.opportunities.map((x) => `• ${x}`).join("\n")}\n\nRisks\n${r.risks.map((x) => `• ${x}`).join("\n")}\n\nNext Steps\n${r.nextSteps.map((x) => `• ${x}`).join("\n")}\n\nVerify\n${r.verify.map((x) => `• ${x}`).join("\n")}`;

  const outputText = (r: ResearchOutput) => editedText ?? asText(r);

  const startEdit = (r: ResearchOutput) => {
    setDraft(outputText(r));
    setEditing(true);
  };

  const saveEdit = () => {
    setEditedText(draft);
    setEditing(false);
    toast.success("Changes saved");
  };

  const save = () => {
    if (!result) return;
    if (!verified) return toast.error("Please confirm you've reviewed the output.");
    store.addHistory({ kind: "research", title: topic, content: outputText(result), saved: true });
    store.bumpStat("research", 25);
    toast.success("Saved to history");
  };

  const Section = ({ title, items }: { title: string; items: string[] }) => (
    <Card><CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
      <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{items.map((x, i) => <li key={i}>{x}</li>)}</ul></CardContent></Card>
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={Search} title="AI Research Assistant" description="Get a structured briefing on any workplace topic in seconds." />
      <Card>
        <CardHeader><CardTitle className="text-base">Research inputs</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Research topic *</Label><Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="AI in workplace productivity" /></div>
            <div><Label>Research question</Label><Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What ROI can we expect in 12 months?" /></div>
          </div>
          <div><Label>Optional source material</Label><Textarea rows={4} value={source} onChange={(e) => setSource(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="professional">Professional</SelectItem><SelectItem value="executive">Executive</SelectItem></SelectContent>
              </Select></div>
            <div><Label>Depth</Label>
              <Select value={depth} onValueChange={setDepth}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="quick">Quick overview</SelectItem><SelectItem value="standard">Standard</SelectItem><SelectItem value="detailed">Detailed report</SelectItem></SelectContent>
              </Select></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={run} disabled={loading}>{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} Analyse Topic</Button>
            <Button variant="outline" onClick={() => { setTopic(""); setQuestion(""); setSource(""); setResult(null); setEditing(false); setEditedText(null); }}><Trash2 className="mr-2 h-4 w-4" /> Clear</Button>
          </div>
          <AIDisclaimer />
        </CardContent>
      </Card>

      {loading && <Card><CardContent className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground"><Loader2 className="h-6 w-6 animate-spin text-primary" /> Analysing your information...</CardContent></Card>}

      {result && !loading && editing && (
        <Card>
          <CardHeader><CardTitle className="text-base">Edit research output</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              aria-label="Edit research output"
              rows={22}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="font-mono text-xs"
            />
            <div className="flex flex-wrap gap-2">
              <Button size="sm" onClick={saveEdit}><Check className="mr-1.5 h-4 w-4" /> Save changes</Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}><X className="mr-1.5 h-4 w-4" /> Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {result && !loading && !editing && editedText !== null && (
        <Card>
          <CardHeader><CardTitle className="text-base">Edited research output</CardTitle></CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">{editedText}</CardContent>
        </Card>
      )}

      {result && !loading && !editing && editedText === null && (
        <div className="space-y-4">
          <Card><CardHeader><CardTitle className="text-base">Topic Overview</CardTitle></CardHeader><CardContent className="text-sm leading-relaxed">{result.overview}</CardContent></Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Key Findings" items={result.findings} />
            <Section title="Important Insights" items={result.insights} />
            <Section title="Recommendations" items={result.recommendations} />
            <Section title="Opportunities" items={result.opportunities} />
            <Section title="Risks & Limitations" items={result.risks} />
            <Section title="Suggested Next Steps" items={result.nextSteps} />
          </div>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader><CardTitle className="text-base">Information That Requires Verification</CardTitle></CardHeader>
            <CardContent><ul className="list-disc space-y-1 pl-5 text-sm">{result.verify.map((x, i) => <li key={i}>{x}</li>)}</ul></CardContent>
          </Card>
        </div>
      )}

      {result && !loading && !editing && (
        <div className="space-y-4">
          <VerifyCheckbox checked={verified} onCheckedChange={setVerified} />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(outputText(result)); toast.success("Copied"); }}><Copy className="mr-1.5 h-4 w-4" /> Copy</Button>
            <Button variant="outline" size="sm" onClick={() => startEdit(result)}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Button>
            <Button variant="outline" size="sm" onClick={run}><RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate</Button>
            <Button size="sm" onClick={save}><Save className="mr-1.5 h-4 w-4" /> Save</Button>
            <Button variant="outline" size="sm" onClick={() => { const b = new Blob([outputText(result)], { type: "text/plain" }); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href = u; a.download = `research-${Date.now()}.txt`; a.click(); URL.revokeObjectURL(u); }}><Download className="mr-1.5 h-4 w-4" /> Export</Button>
            <Button variant="ghost" size="sm" onClick={() => { setResult(null); setEditedText(null); }}><Trash2 className="mr-1.5 h-4 w-4" /> Clear</Button>
          </div>
        </div>
      )}
    </div>
  );
}