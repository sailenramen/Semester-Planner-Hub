import { Task, subjects } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface SubjectProgressChartProps {
  tasks: Task[];
}

const subjectColorMap: Record<string, string> = {
  math: "hsl(217, 91%, 60%)",
  science: "hsl(142, 71%, 45%)",
  history: "hsl(0, 84%, 60%)",
  english: "hsl(270, 70%, 60%)",
};

export function SubjectProgressChart({ tasks }: SubjectProgressChartProps) {
  const data = subjects.map((subject) => {
    const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
    const completed = subjectTasks.filter((t) => t.completed).length;
    const total = subjectTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      name: subject.name.split("/")[0],
      fullName: subject.name,
      completed,
      total,
      percentage,
      color: subjectColorMap[subject.id],
    };
  });

  return (
    <Card data-testid="progress-chart">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Subject Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={70}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-popover border rounded-md shadow-lg p-2 text-sm">
                        <p className="font-medium">{item.fullName}</p>
                        <p className="text-muted-foreground">
                          {item.completed}/{item.total} tasks ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {data.map((subject) => (
            <div key={subject.name}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{subject.fullName}</span>
                <span className="text-muted-foreground">
                  {subject.completed}/{subject.total}
                </span>
              </div>
              <Progress value={subject.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
