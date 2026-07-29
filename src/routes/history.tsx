import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History as HistoryIcon, Search, Copy, Download, Trash2, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/workmate/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { store, useStore, type HistoryItem } from "@/lib/workmate/store";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — WorkMate AI" }, { name: "description", content: "Browse and manage your generated emails, summaries, plans, research, and chats." }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const items = useStore(() => store.getHistory());
  const [kind, setKind] = useState<string>("all");
  const [savedOnly, setSavedOnly] = useState<string>("all");
  const [q, setQ] = useState("");
  const [viewing, setViewing] = useState<HistoryItem | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const filtered = items.filter((h) =>
    (kind === "all" || h.kind === kind) &&
    (savedOnly === "all" || (savedOnly === "saved" ? h.saved : !h.saved)) &&
    (!q.trim() || `${h.title} ${h.content}`.toLowerCase().includes(q.toLowerCase()))
  );

  const download = (h: HistoryItem) => {
    const b = new Blob([h.content], { type: "text/plain" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a"); a.href = u; a.download = `${h.kind}-${h.id}.txt`; a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeader icon={HistoryIcon} title="History" description="Your generated content across all WorkMate AI tools." />

      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search history..." className="pl-9" />
          </div>
          <Select value={kind} onValueChange={setKind}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All features</SelectItem>
              <SelectItem value="email">Emails</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
            </SelectContent>
          </Select>
          <Select value={savedOnly} onValueChange={setSavedOnly}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All items</SelectItem>
              <SelectItem value="saved">Saved only</SelectItem>
              <SelectItem value="unsaved">Unsaved</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {filtered.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-6">
                <Badge variant="secondary" className="capitalize">{h.kind}</Badge>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDistanceToNow(h.createdAt, { addSuffix: true })}{h.saved && " • Saved"}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Button size="sm" variant="ghost" onClick={() => { setViewing(h); setDraft(h.content); setEditing(false); }}><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { setViewing(h); setDraft(h.content); setEditing(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(h.content); toast.success("Copied"); }}><Copy className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => download(h)}><Download className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => { store.deleteHistory(h.id); toast("Deleted"); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </li>
            ))}
            {filtered.length === 0 && <li className="p-10 text-center text-sm text-muted-foreground">No items match your filters.</li>}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent className="max-w-2xl">
          {viewing && (
            <>
              <DialogHeader><DialogTitle>{viewing.title}</DialogTitle></DialogHeader>
              {editing ? (
                <Textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={16} className="font-mono text-sm" />
              ) : (
                <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 font-sans text-sm">{viewing.content}</pre>
              )}
              <DialogFooter>
                {editing ? (
                  <Button onClick={() => { store.updateHistory(viewing.id, { content: draft }); setEditing(false); toast.success("Saved"); }}>Save changes</Button>
                ) : (
                  <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-1.5 h-4 w-4" /> Edit</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}