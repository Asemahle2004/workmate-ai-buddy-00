import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  Search,
  MessageSquare,
  BookMarked,
  History,
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/sonner";
import { initTheme, store, useStore } from "@/lib/workmate/store";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Smart Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Notes Summarizer", icon: FileText },
  { to: "/tasks", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "AI Research Assistant", icon: Search },
  { to: "/chat", label: "Workplace Chatbot", icon: MessageSquare },
  { to: "/prompts", label: "Prompt Library", icon: BookMarked },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">WorkMate AI</span>
            <span className="text-[11px] text-muted-foreground">Workplace productivity</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                      <Link to={item.to}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <p className="px-2 py-2 text-[11px] leading-snug text-muted-foreground">
          AI outputs may be inaccurate. Please review before use.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopBar() {
  const settings = useStore(() => store.getSettings());
  const [query, setQuery] = useState("");

  const toggleTheme = () => {
    store.setSettings({ theme: settings.theme === "dark" ? "light" : "dark" });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur sm:px-6">
      <SidebarTrigger className="shrink-0" />
      <form
        onSubmit={(e) => e.preventDefault()}
        className="relative ml-1 hidden max-w-md flex-1 md:block"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, prompts, history..."
          className="pl-9"
        />
      </form>
      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
          {settings.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start">
              <span className="text-sm font-medium">Meeting summary ready</span>
              <span className="text-xs text-muted-foreground">Product Roadmap Sync</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start">
              <span className="text-sm font-medium">Weekly plan generated</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start">
              <span className="text-sm font-medium">3 action items due today</span>
              <span className="text-xs text-muted-foreground">Review your task planner</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {settings.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">{settings.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{settings.name}</span>
                <span className="text-xs font-normal text-muted-foreground">{settings.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <User className="mr-2 h-4 w-4" /> Profile & Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/history">
                <History className="mr-2 h-4 w-4" /> History
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export function ResponsibleFooter() {
  return (
    <footer className="border-t bg-muted/30 px-4 py-4 text-center text-xs leading-relaxed text-muted-foreground sm:px-6">
      WorkMate AI may produce incomplete, inaccurate, or biased information. Users must review and
      verify AI-generated content before using it for professional, financial, legal, medical, or
      important workplace decisions.
    </footer>
  );
}

export default function AppShell() {
  useEffect(() => {
    initTheme();
  }, []);
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-h-svh w-full min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="min-w-0 flex-1 overflow-x-hidden bg-muted/20 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
        <ResponsibleFooter />
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}