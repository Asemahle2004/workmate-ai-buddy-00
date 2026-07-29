import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/workmate/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { store, useStore } from "@/lib/workmate/store";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — WorkMate AI" }, { name: "description", content: "Manage your profile, appearance, notifications, privacy, and data." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const s = useStore(() => store.getSettings());

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader icon={SettingsIcon} title="Settings" description="Configure your WorkMate AI experience." />
      <Tabs defaultValue="profile">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="responsible">Responsible AI</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card><CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div><Label>Name</Label><Input value={s.name} onChange={(e) => store.setSettings({ name: e.target.value })} /></div>
              <div><Label>Email</Label><Input value={s.email} onChange={(e) => store.setSettings({ email: e.target.value })} /></div>
              <div className="sm:col-span-2"><Label>Role</Label><Input value={s.role} onChange={(e) => store.setSettings({ role: e.target.value })} /></div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card><CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div><p className="font-medium">Dark mode</p><p className="text-xs text-muted-foreground">Toggle light/dark theme.</p></div>
              <Switch checked={s.theme === "dark"} onCheckedChange={(v) => store.setSettings({ theme: v ? "dark" : "light" })} />
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card><CardHeader><CardTitle className="text-base">Notifications</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><span>Email notifications</span><Switch checked={s.notifEmail} onCheckedChange={(v) => store.setSettings({ notifEmail: v })} /></div>
              <div className="flex items-center justify-between"><span>Push notifications</span><Switch checked={s.notifPush} onCheckedChange={(v) => store.setSettings({ notifPush: v })} /></div>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card><CardHeader><CardTitle className="text-base">Privacy</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between"><div><p>Share anonymized usage</p><p className="text-xs text-muted-foreground">Helps us improve the product.</p></div>
                <Switch checked={s.privacyShare} onCheckedChange={(v) => store.setSettings({ privacyShare: v })} /></div>
              <p className="text-xs text-muted-foreground"><strong>Data usage:</strong> Your inputs and generated content are stored locally in your browser to power the History page. WorkMate AI does not share confidential workplace data.</p>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="responsible">
          <Card className="border-primary/30"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="h-4 w-4 text-primary" /> Responsible AI</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>WorkMate AI may produce incomplete, inaccurate, or biased information. Users must review and verify AI-generated content before using it for professional, financial, legal, medical, or important workplace decisions.</p>
              <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Does not guarantee accuracy</li>
                <li>May generate biased or incorrect information</li>
                <li>Should not replace professional judgement</li>
                <li>Must not be used with confidential workplace information</li>
                <li>Requires verification of important facts, dates, names, and recommendations</li>
              </ul>
            </CardContent></Card>
        </TabsContent>

        <TabsContent value="data">
          <Card><CardHeader><CardTitle className="text-base">Data</CardTitle></CardHeader>
            <CardContent><Button variant="destructive" onClick={() => { store.clearHistory(); toast.success("History cleared"); }}><Trash2 className="mr-1.5 h-4 w-4" /> Clear all history</Button></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}