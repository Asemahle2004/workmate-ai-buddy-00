import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookMarked, Copy, Plus, Save, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/workmate/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { LIBRARY, type PromptTemplate } from "@/lib/workmate/prompts";
import { store, useStore } from "@/lib/workmate/store";

export const Route = createFileRoute("/prompts")({
  head: () => ({ meta: [{ title: "Prompt Library — WorkMate AI" }, { name: "description", content: "Reusable workplace prompts for emails, meetings, planning, research, and more." }] }),
  component: PromptsPage,
});

const empty = { title: "", category: "Custom", role: "", context: "", task: "", input: "", constraints: "", output: "" };

function PromptsPage() {
  const custom = useStore(() => store.getPrompts());
  const [form, setForm] = useState({ ...empty });
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PromptTemplate | null>(null);

  const all = [...custom, ...LIBRARY];

  const save = () => {
    if (!form.title.trim()) return toast.error("Title required");
    store.savePrompt(form);
    setOpen(false); setForm({ ...empty }); toast.success("Prompt saved");
  };

  const copy = async (p: PromptTemplate) => {
    const text = `Role: ${p.role}\nContext: ${p.context}\nTask: ${p.task}\nInput: ${p.input}\nConstraints: ${p.constraints}\nOutput: ${p.output}`;
    await navigator.clipboard.writeText(text);
    toast.success("Prompt copied");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={BookMarked} title="Prompt Library" description="Structured, reusable prompts for common workplace tasks.">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1.5 h-4 w-4" /> New prompt</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Create custom prompt</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
              </div>
              {(["role", "context", "task", "input", "constraints", "output"] as const).map((k) => (
                <div key={k}><Label className="capitalize">{k}</Label><Textarea rows={2} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></div>
              ))}
            </div>
            <DialogFooter><Button onClick={save}><Save className="mr-1.5 h-4 w-4" /> Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((p) => {
          const isCustom = "createdAt" in p;
          return (
            <Card key={p.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">{p.title}</CardTitle>
                  <Badge variant="secondary">{p.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-3">{p.task}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => setSelected(p as PromptTemplate)}><Pencil className="mr-1 h-3.5 w-3.5" /> View</Button>
                  <Button size="sm" variant="outline" onClick={() => copy(p as PromptTemplate)}><Copy className="mr-1 h-3.5 w-3.5" /> Copy</Button>
                  {isCustom && <Button size="sm" variant="ghost" onClick={() => { store.deletePrompt(p.id); toast("Deleted"); }}><Trash2 className="h-3.5 w-3.5" /></Button>}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader><DialogTitle>{selected.title}</DialogTitle></DialogHeader>
              <div className="space-y-3 text-sm">
                {(["role", "context", "task", "input", "constraints", "output"] as const).map((k) => (
                  <div key={k}><p className="text-xs font-medium uppercase text-muted-foreground">{k}</p><p className="mt-0.5 whitespace-pre-wrap">{selected[k]}</p></div>
                ))}
              </div>
              <DialogFooter><Button onClick={() => copy(selected)}><Copy className="mr-1.5 h-4 w-4" /> Copy prompt</Button></DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}