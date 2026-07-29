import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, AIDisclaimer } from "@/components/workmate/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatReply, simulateDelay } from "@/lib/workmate/ai";
import { SUGGESTED_CHATS } from "@/lib/workmate/prompts";
import { store } from "@/lib/workmate/store";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "Workplace Chatbot — WorkMate AI" }, { name: "description", content: "Chat with an AI assistant for writing, planning, summarizing, and brainstorming." }] }),
  component: ChatPage,
});

interface Msg { id: string; role: "user" | "ai"; text: string; at: number }

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([{ id: "0", role: "ai", text: "Hi! I'm WorkMate AI. How can I help with your workday?", at: Date.now() }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessions, setSessions] = useState<{ id: string; title: string; at: number }[]>(() => [{ id: "s1", title: "Today's chat", at: Date.now() }]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [messages, typing]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const um: Msg = { id: crypto.randomUUID(), role: "user", text, at: Date.now() };
    setMessages((m) => [...m, um]);
    setInput("");
    setTyping(true);
    await simulateDelay(900);
    const am: Msg = { id: crypto.randomUUID(), role: "ai", text: chatReply(text), at: Date.now() };
    setMessages((m) => [...m, am]);
    setTyping(false);
    store.bumpStat("chat", 3);
  };

  const newChat = () => {
    if (messages.length > 1) {
      store.addHistory({ kind: "chat", title: `Chat — ${messages[1]?.text.slice(0, 40) ?? "New chat"}`, content: messages.map((m) => `${m.role.toUpperCase()}: ${m.text}`).join("\n\n") });
      setSessions((s) => [{ id: crypto.randomUUID(), title: messages[1]?.text.slice(0, 30) ?? "Chat", at: Date.now() }, ...s]);
    }
    setMessages([{ id: "0", role: "ai", text: "Starting a new chat. What can I help with?", at: Date.now() }]);
    toast("New chat started");
  };

  const clearChat = () => setMessages([{ id: "0", role: "ai", text: "Chat cleared. Ready when you are.", at: Date.now() }]);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <PageHeader icon={MessageSquare} title="Workplace Chatbot" description="Ask, brainstorm, draft, and plan — your AI assistant for work." />
      <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
        <Card className="hidden lg:block">
          <CardContent className="space-y-2 p-3">
            <Button className="w-full" onClick={newChat}><Plus className="mr-1.5 h-4 w-4" /> New chat</Button>
            <Button variant="outline" className="w-full" onClick={clearChat}><Trash2 className="mr-1.5 h-4 w-4" /> Clear</Button>
            <div className="mt-4 space-y-1">
              <p className="px-2 text-xs font-medium uppercase text-muted-foreground">History</p>
              {sessions.map((s) => <div key={s.id} className="cursor-pointer truncate rounded px-2 py-1.5 text-sm hover:bg-muted">{s.title}</div>)}
            </div>
          </CardContent>
        </Card>
        <Card className="flex h-[70vh] flex-col">
          <div ref={ref} className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <div className="mb-0.5 text-[10px] font-medium uppercase opacity-70">{m.role === "user" ? "You" : "WorkMate AI"}</div>
                  <pre className="whitespace-pre-wrap font-sans">{m.text}</pre>
                  <div className="mt-1 text-[10px] opacity-60">{new Date(m.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              </div>
            ))}
            {typing && <div className="flex justify-start"><div className="rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground"><Loader2 className="inline h-3 w-3 animate-spin" /> WorkMate AI is typing...</div></div>}
          </div>
          <div className="border-t p-3">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {SUGGESTED_CHATS.map((s) => <Button key={s} size="sm" variant="outline" className="h-7 text-xs" onClick={() => send(s)}>{s}</Button>)}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask WorkMate AI anything..." />
              <Button type="submit" disabled={typing}><Send className="h-4 w-4" /></Button>
              <Button type="button" variant="outline" onClick={newChat}><Plus className="h-4 w-4" /></Button>
              <Button type="button" variant="ghost" onClick={clearChat}><Trash2 className="h-4 w-4" /></Button>
            </form>
          </div>
        </Card>
      </div>
      <AIDisclaimer />
    </div>
  );
}