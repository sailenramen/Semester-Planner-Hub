import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { subjects, assessmentsBySubject, Assessment, SubjectId } from "@shared/schema";
import { useGrades, useSaveGrade } from "@/hooks/useApi";
import { Calculator, TrendingUp, CheckCircle } from "lucide-react";

interface SubjectGradeData {
  subjectId: SubjectId;
  assessments: Assessment[];
  scores: Record<string, number | null>;
  average: number | null;
  entered: number;
  total: number;
}

function getGradeColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 80) return "text-blue-600 dark:text-blue-400";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getGradeBgColor(score: number | null): string {
  if (score === null) return "bg-muted";
  if (score >= 90) return "bg-green-100 dark:bg-green-900/30";
  if (score >= 80) return "bg-blue-100 dark:bg-blue-900/30";
  if (score >= 70) return "bg-yellow-100 dark:bg-yellow-900/30";
  if (score >= 60) return "bg-orange-100 dark:bg-orange-900/30";
  return "bg-red-100 dark:bg-red-900/30";
}

function getLetterGrade(score: number | null): string {
  if (score === null) return "-";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

const subjectColorClasses: Record<string, string> = {
  math: "border-l-blue-500",
  science: "border-l-green-500",
  history: "border-l-red-500",
  english: "border-l-purple-500",
};

const subjectBgClasses: Record<string, string> = {
  math: "bg-blue-500",
  science: "bg-green-500",
  history: "bg-red-500",
  english: "bg-purple-500",
};

export default function GradesPage() {
  const { data: grades = [], isLoading } = useGrades();
  const saveGrade = useSaveGrade();
  const [subjectData, setSubjectData] = useState<SubjectGradeData[]>([]);

  useEffect(() => {
    if (!isLoading) {
      loadGradeData();
    }
  }, [grades, isLoading]);

  const loadGradeData = () => {
    const data: SubjectGradeData[] = subjects.map((subject) => {
      const assessments = assessmentsBySubject[subject.id] || [];
      const subjectGrades = grades.filter(g => g.subjectId === subject.id);
      
      const scores: Record<string, number | null> = {};
      assessments.forEach((a) => {
        const grade = subjectGrades.find((g) => g.assessmentId === a.id);
        scores[a.id] = grade?.score ?? null;
      });

      const enteredScores = Object.values(scores).filter((s) => s !== null) as number[];
      const average = enteredScores.length > 0
        ? Math.round(enteredScores.reduce((a, b) => a + b, 0) / enteredScores.length)
        : null;

      return {
        subjectId: subject.id,
        assessments,
        scores,
        average,
        entered: enteredScores.length,
        total: assessments.length,
      };
    });
    setSubjectData(data);
  };

  const handleScoreChange = (subjectId: SubjectId, assessmentId: string, value: string) => {
    const numValue = value === "" ? null : Math.min(100, Math.max(0, parseInt(value) || 0));
    
    saveGrade.mutate({
      subjectId,
      assessmentId,
      score: numValue,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6" data-testid="grades-page">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const overallStats = {
    totalEntered: subjectData.reduce((acc, s) => acc + s.entered, 0),
    totalAssessments: subjectData.reduce((acc, s) => acc + s.total, 0),
    overallAverage: (() => {
      const allScores = subjectData.flatMap((s) => 
        Object.values(s.scores).filter((score) => score !== null) as number[]
      );
      return allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : null;
    })(),
  };

  return (
    <div className="p-4 md:p-6 space-y-6" data-testid="grades-page">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Grade Calculator</h1>
        <p className="text-muted-foreground">Track your assessment scores and calculate averages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card data-testid="overall-average-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${getGradeBgColor(overallStats.overallAverage)}`}>
              <TrendingUp className={`h-6 w-6 ${getGradeColor(overallStats.overallAverage)}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Average</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${getGradeColor(overallStats.overallAverage)}`}>
                  {overallStats.overallAverage !== null ? `${overallStats.overallAverage}%` : "-"}
                </span>
                {overallStats.overallAverage !== null && (
                  <Badge variant="outline" className={getGradeColor(overallStats.overallAverage)}>
                    {getLetterGrade(overallStats.overallAverage)}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="total-assessments-card">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assessments Completed</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">
                  {overallStats.totalEntered}/{overallStats.totalAssessments}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({overallStats.totalAssessments > 0 
                    ? Math.round((overallStats.totalEntered / overallStats.totalAssessments) * 100) 
                    : 0}%)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subjectData.map((data) => {
          const subject = subjects.find((s) => s.id === data.subjectId)!;
          const term1Assessments = data.assessments.filter((a) => a.term === 1);
          const term2Assessments = data.assessments.filter((a) => a.term === 2);

          return (
            <Card 
              key={data.subjectId} 
              className={`border-l-4 ${subjectColorClasses[data.subjectId]}`}
              data-testid={`grade-card-${data.subjectId}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${subjectBgClasses[data.subjectId]}`} />
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.average !== null && (
                      <Badge 
                        variant="outline" 
                        className={`${getGradeColor(data.average)} ${getGradeBgColor(data.average)}`}
                      >
                        {data.average}% ({getLetterGrade(data.average)})
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      {data.entered}/{data.total}
                    </Badge>
                  </div>
                </div>
                {data.total > 0 && (
                  <Progress 
                    value={(data.entered / data.total) * 100} 
                    className="h-1.5 mt-2"
                  />
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {term1Assessments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Term 1 {term1Assessments[0].category && `(${term1Assessments[0].category})`}
                    </h4>
                    <div className="space-y-2">
                      {term1Assessments.map((assessment) => (
                        <div 
                          key={assessment.id} 
                          className="flex items-center gap-3"
                        >
                          <span className="flex-1 text-sm truncate" title={assessment.name}>
                            {assessment.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="-"
                              value={data.scores[assessment.id] ?? ""}
                              onChange={(e) => handleScoreChange(data.subjectId, assessment.id, e.target.value)}
                              className="w-16 h-8 text-center text-sm"
                              data-testid={`input-grade-${assessment.id}`}
                            />
                            <span className="text-xs text-muted-foreground w-4">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {term2Assessments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Term 2 {term2Assessments[0].category && `(${term2Assessments[0].category})`}
                    </h4>
                    <div className="space-y-2">
                      {term2Assessments.map((assessment) => (
                        <div 
                          key={assessment.id} 
                          className="flex items-center gap-3"
                        >
                          <span className="flex-1 text-sm truncate" title={assessment.name}>
                            {assessment.name}
                          </span>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              placeholder="-"
                              value={data.scores[assessment.id] ?? ""}
                              onChange={(e) => handleScoreChange(data.subjectId, assessment.id, e.target.value)}
                              className="w-16 h-8 text-center text-sm"
                              data-testid={`input-grade-${assessment.id}`}
                            />
                            <span className="text-xs text-muted-foreground w-4">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calculator className="h-4 w-4" />
            <span>
              Averages are calculated from entered scores only. Leave fields blank if not yet completed.
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
