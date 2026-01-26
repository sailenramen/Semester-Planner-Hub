import { Calendar, LayoutDashboard, BookOpen, Calculator, Leaf, Clock, GraduationCap, BarChart3, User, Trophy } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { subjects, getCurrentWeek, getCurrentTerm, getTermLabel } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const subjectIcons: Record<string, React.ReactNode> = {
  math: <Calculator className="h-4 w-4" />,
  science: <Leaf className="h-4 w-4" />,
  history: <Clock className="h-4 w-4" />,
  english: <BookOpen className="h-4 w-4" />,
};

const subjectColors: Record<string, string> = {
  math: "text-blue-600 dark:text-blue-400",
  science: "text-green-600 dark:text-green-400",
  history: "text-red-600 dark:text-red-400",
  english: "text-purple-600 dark:text-purple-400",
};

export function AppSidebar() {
  const [location] = useLocation();
  const currentWeek = getCurrentWeek();
  const currentTerm = getCurrentTerm();
  const termLabel = getTermLabel(currentWeek);

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Study Planner</span>
        </div>
        <div className="mt-2 flex gap-2">
          <Badge variant="secondary" className="text-xs">
            {termLabel}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Term {currentTerm}
          </Badge>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={location === "/"}>
                  <Link href="/" data-testid="link-dashboard">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={location === "/grades"}>
                  <Link href="/grades" data-testid="link-grades">
                    <BarChart3 className="h-4 w-4" />
                    <span>Grades</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={location === "/calendar"}>
                  <Link href="/calendar" data-testid="link-calendar">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild data-active={location === "/profile"}>
                  <Link href="/profile" data-testid="link-profile">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>Profile & Badges</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Subjects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {subjects.map((subject) => (
                <SidebarMenuItem key={subject.id}>
                  <SidebarMenuButton 
                    asChild 
                    data-active={location === `/subject/${subject.id}`}
                  >
                    <Link 
                      href={`/subject/${subject.id}`} 
                      data-testid={`link-subject-${subject.id}`}
                    >
                      <span className={subjectColors[subject.id]}>
                        {subjectIcons[subject.id]}
                      </span>
                      <span>{subject.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          Semester 1, 2025
          <br />
          Term 1: Jan 25 - Mar 28
          <br />
          Term 2: Apr 12 - Jun 6
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
