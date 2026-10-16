import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AchievementCelebrations } from "@/components/AchievementCelebrations";
import { StudyMusicProvider } from "@/components/StudyMusicPlayer";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Subject from "@/pages/Subject";
import CalendarPage from "@/pages/Calendar";
import GradesPage from "@/pages/Grades";
import StudyPage from "@/pages/Study";
import ProfilePage from "@/pages/Profile";
import LoginPage from "@/pages/Login";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

function AppLayout() {
  const { isLoading, user, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    // The music player is mounted here, outside the routes, so the iframe is
    // never unmounted and the music survives moving between pages.
    <StudyMusicProvider>
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-2 p-3 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline" data-testid="header-user-name">
                {user?.name}
              </span>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => logout()}
                aria-label="Sign out"
                title="Sign out"
                data-testid="button-sign-out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/subject/:id" component={Subject} />
              <Route path="/calendar" component={CalendarPage} />
              <Route path="/grades" component={GradesPage} />
              <Route path="/study/:taskId" component={StudyPage} />
              <Route path="/profile" component={ProfilePage} />
              <Route component={NotFound} />
            </Switch>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
    {/* Mounted for signed-in pages only, so milestones are celebrated
        wherever the student happens to be in the app. */}
    <AchievementCelebrations />
    </StudyMusicProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppLayout />
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
