import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, RefreshCw, Save, Download, Trash2, Sparkles, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader, AIDisclaimer } from "@/components/workmate/PageHeader";
import { VerifyCheckbox } from "@/components/workmate/VerifyCheckbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateEmail, simulateDelay, type EmailInput } from "@/lib/workmate/ai";
import { store } from "@/lib/workmate/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkMate AI" },
      { name: "description", content: "Generate professional workplace emails with tone, audience, and length controls." },
    ],
  }),
  component: EmailPage,
});

const empty: EmailInput = {
  recipientName: "",
  recipientRole: "",
  subject: "",
  purpose: "",
  info: "",
  context: "",
  audience: "manager",
  tone: "formal",
  length: "standard",
};

function EmailPage() {
  const [form, setForm] = useState<EmailInput>(empty);
  const [output, setOutput] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof EmailInput>(k: K, v: EmailInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.recipientName.trim()) e.recipientName = "Recipient name is required";
    if (!form.purpose.trim()) e.purpose = "Purpose is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const doGenerate = async () => {
    if (!validate()) {
      toast.error("Please fill in the required fields.");
      return;
    }
    setLoading(true);
    setOutput("");
    await simulateDelay();
    setOutput(generateEmail(form));
    setLoading(false);
    setEditing(false);
    setVerified(false);
    toast.success("Email generated");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  const save = () => {
    if (!verified) {
      toast.error("Please confirm you've reviewed the output before saving.");
      return;
    }
    store.addHistory({
      kind: "email",
      title: form.subject || `Email to ${form.recipientName}`,
      content: output,
      saved: true,
    });
    store.bumpStat("email", 10);
    toast.success("Saved to history");
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `email-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clear = () => {
    setForm(empty);
    setOutput("");
    setEditing(false);
    setVerified(false);
    setErrors({});
    toast("Form cleared");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Create polished, tone-appropriate workplace emails in seconds."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="rn">Recipient name *</Label>
                <Input id="rn" value={form.recipientName} onChange={(e) => set("recipientName", e.target.value)} placeholder="Sarah Chen" />
                {errors.recipientName && <p className="mt-1 text-xs text-destructive">{errors.recipientName}</p>}
              </div>
              <div>
                <Label htmlFor="rr">Recipient role</Label>
                <Input id="rr" value={form.recipientRole} onChange={(e) => set("recipientRole", e.target.value)} placeholder="VP of Finance" />
              </div>
            </div>
            <div>
              <Label htmlFor="sub">Subject</Label>
              <Input id="sub" value={form.subject} onChange={(e) => set("subject", e.target.value)} placeholder="Q3 budget follow-up" />
            </div>
            <div>
              <Label htmlFor="pur">Purpose of the email *</Label>
              <Textarea id="pur" value={form.purpose} onChange={(e) => set("purpose", e.target.value)} placeholder="Follow up on the Q3 budget proposal and confirm next steps." rows={2} />
              {errors.purpose && <p className="mt-1 text-xs text-destructive">{errors.purpose}</p>}
            </div>
            <div>
              <Label htmlFor="info">Important information to include</Label>
              <Textarea id="info" value={form.info} onChange={(e) => set("info", e.target.value)} placeholder="Deadline is Friday. Need approval from finance team." rows={3} />
            </div>
            <div>
              <Label htmlFor="ctx">Additional context</Label>
              <Textarea id="ctx" value={form.context} onChange={(e) => set("context", e.target.value)} rows={2} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label>Audience</Label>
                <Select value={form.audience} onValueChange={(v) => set("audience", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tone</Label>
                <Select value={form.tone} onValueChange={(v) => set("tone", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="apologetic">Apologetic</SelectItem>
                    <SelectItem value="confident">Confident</SelectItem>
                    <SelectItem value="concise">Concise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Length</Label>
                <Select value={form.length} onValueChange={(v) => set("length", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={doGenerate} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Email
              </Button>
              <Button variant="outline" onClick={clear} type="button">
                <Trash2 className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Generated email</CardTitle>
              {output && (
                <Button size="sm" variant="ghost" onClick={() => setEditing((e) => !e)}>
                  <Pencil className="mr-1 h-4 w-4" /> {editing ? "Preview" : "Edit"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading && (
              <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                WorkMate AI is generating your response...
              </div>
            )}
            {!loading && !output && (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                Your generated email will appear here.
              </div>
            )}
            {!loading && output && (
              <>
                {editing ? (
                  <Textarea value={output} onChange={(e) => setOutput(e.target.value)} rows={16} className="font-mono text-sm" />
                ) : (
                  <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 font-sans text-sm">{output}</pre>
                )}
                <AIDisclaimer />
                <VerifyCheckbox checked={verified} onCheckedChange={setVerified} />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={copy}><Copy className="mr-1.5 h-4 w-4" /> Copy</Button>
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Button>
                  <Button variant="outline" size="sm" onClick={doGenerate}><RefreshCw className="mr-1.5 h-4 w-4" /> Regenerate</Button>
                  <Button size="sm" onClick={save}><Save className="mr-1.5 h-4 w-4" /> Save</Button>
                  <Button variant="outline" size="sm" onClick={download}><Download className="mr-1.5 h-4 w-4" /> Download</Button>
                  <Button variant="ghost" size="sm" onClick={() => setOutput("")}><Trash2 className="mr-1.5 h-4 w-4" /> Clear</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}