import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StreakTracker } from "@/components/StreakTracker";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { PointsDisplay } from "@/components/PointsDisplay";
import { 
  Streak, UserStats, subjects, getPointsForNextLevel 
} from "@shared/schema";
import { 
  getStreak, getUserStats, getTasks, getMostProductiveDay, getOverallAverage 
} from "@/lib/storage";
import { 
  User, Clock, CheckCircle2, Target, Calendar, BookOpen, 
  TrendingUp, Award, Flame 
} from "lucide-react";

export default function Profile() {
  const [streak, setStreak] = useState<Streak | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [taskStats, setTaskStats] = useState<{ completed: number; total: number }>({ completed: 0, total: 0 });

  useEffect(() => {
    setStreak(getStreak());
    setStats(getUserStats());
    const tasks = getTasks();
    setTaskStats({
      completed: tasks.filter(t => t.completed).length,
      total: tasks.length
    });
  }, []);

  if (!streak || !stats) {
    return <div className="p-6">Loading...</div>;
  }

  const studyHours = Math.floor(stats.totalStudyMinutes / 60);
  const studyMinutes = stats.totalStudyMinutes % 60;
  const mostProductiveDay = getMostProductiveDay();
  const overallAverage = getOverallAverage();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
          <User className="h-8 w-8 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Track your study progress and achievements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StreakTracker streak={streak} />
        <PointsDisplay stats={stats} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
          label="Tasks Completed"
          value={stats.totalTasksCompleted}
          subValue={`of ${taskStats.total}`}
          testId="stat-tasks"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          label="Study Time"
          value={`${studyHours}h ${studyMinutes}m`}
          subValue={`${stats.totalPomodoroSessions} sessions`}
          testId="stat-time"
        />
        <StatCard
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          label="Longest Streak"
          value={`${streak.longestStreak} days`}
          subValue={`Current: ${streak.currentStreak}`}
          testId="stat-streak"
        />
        <StatCard
          icon={<Award className="h-5 w-5 text-yellow-500" />}
          label="Badges Earned"
          value={stats.badgesEarned.length}
          subValue={`of 19 total`}
          testId="stat-badges"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Subject Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {subjects.map((subject) => {
              const minutes = stats.subjectStudyMinutes[subject.id] || 0;
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              const maxMinutes = Math.max(...Object.values(stats.subjectStudyMinutes), 1);
              const percent = (minutes / maxMinutes) * 100;
              
              return (
                <div key={subject.id} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className={subject.color}>{subject.name}</span>
                    <span className="text-muted-foreground">
                      {hours > 0 ? `${hours}h ${mins}m` : `${mins}m`}
                    </span>
                  </div>
                  <Progress value={percent} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Study Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Most Productive Day</span>
              </div>
              <Badge variant="secondary">
                {mostProductiveDay || "Not enough data"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Overall Grade Average</span>
              </div>
              <Badge variant={overallAverage && overallAverage >= 70 ? "default" : "secondary"}>
                {overallAverage !== null ? `${overallAverage}%` : "No grades yet"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Avg. Session Length</span>
              </div>
              <Badge variant="secondary">
                {stats.totalPomodoroSessions > 0 
                  ? `${Math.round(stats.totalStudyMinutes / stats.totalPomodoroSessions)} min`
                  : "No sessions yet"
                }
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <BadgeDisplay earnedBadges={stats.badgesEarned} showLocked />
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value, 
  subValue,
  testId 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  subValue?: string;
  testId: string;
}) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted">
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
            {subValue && (
              <p className="text-xs text-muted-foreground">{subValue}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
