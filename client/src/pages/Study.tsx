import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Task, subjects, SubjectId } from "@shared/schema";
import { getTasks, recordPomodoroSession, addStudyMinutes } from "@/lib/storage";
import { getStudyContent, getTaskType, StudyContent, PracticeQuestion, FlashcardQuestion } from "@/lib/studyContent";
import {
  ArrowLeft,
  Clock,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  FileText,
  PenTool,
  Brain,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Volume2,
} from "lucide-react";

export default function StudyPage() {
  const params = useParams<{ taskId: string }>();
  const [, setLocation] = useLocation();
  const [task, setTask] = useState<Task | null>(null);
  const [content, setContent] = useState<StudyContent | null>(null);
  
  const [timerMode, setTimerMode] = useState<"pomodoro" | "custom">("pomodoro");
  const [customMinutes, setCustomMinutes] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  useEffect(() => {
    const allTasks = getTasks();
    const foundTask = allTasks.find(t => t.id === params.taskId);
    if (foundTask) {
      setTask(foundTask);
      const studyContent = getStudyContent(foundTask.subjectId, foundTask.title, foundTask.week);
      setContent(studyContent);
    }
  }, [params.taskId]);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      playCompletionSound();
      if (timerMode === "pomodoro" && !isBreak) {
        // Completed a Pomodoro work session - record it
        recordPomodoroSession();
        addStudyMinutes(25, task?.subjectId);
        setIsBreak(true);
        setTimeRemaining(5 * 60);
      } else if (timerMode === "custom") {
        // Completed a custom timer session
        addStudyMinutes(customMinutes, task?.subjectId);
        setIsRunning(false);
      } else {
        setIsRunning(false);
        setIsBreak(false);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeRemaining, timerMode, isBreak, customMinutes, task?.subjectId]);

  const playCompletionSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startTimer = () => {
    if (timerMode === "custom") {
      setTimeRemaining(customMinutes * 60);
    } else {
      setTimeRemaining(isBreak ? 5 * 60 : 25 * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeRemaining(timerMode === "pomodoro" ? 25 * 60 : customMinutes * 60);
  };

  const subject = task ? subjects.find(s => s.id === task.subjectId) : null;
  const taskType = task ? getTaskType(task.title) : "review";
  
  const allQuestions: (PracticeQuestion | FlashcardQuestion)[] = [
    ...(content?.practiceQuestions || []),
    ...(content?.flashcards || []),
  ];

  const currentQuestion = allQuestions[currentQuestionIndex];
  const totalQuestions = allQuestions.length;
  const progressPercent = totalQuestions > 0 ? (answeredQuestions.size / totalQuestions) * 100 : 0;

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    const isCorrect = answer.toLowerCase() === currentQuestion?.answer.toLowerCase();
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    setAnsweredQuestions(prev => new Set(Array.from(prev).concat(currentQuestionIndex)));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
    }
  };

  if (!task) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Brain className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">Task not found</p>
        <Button onClick={() => setLocation("/")} data-testid="button-go-home">
          Return to Dashboard
        </Button>
      </div>
    );
  }
  
  if (!content) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading study content...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2KkZSQjIB0bG93goyUk5GNhn1zbHN9iZKUkpCMhHxycXeAi5STk5GNhX5zcXV+iJKUk5KOhoF5c3R4gYuTlJOSjoaCeXRzeoCKk5SUko+Hg3p0dHl/iZKUlJKQiIR8dXR5fomSk5SUkYmFfXZ1eH6Ik5OUlJGKhn52dXh+iJKTlJSRiod/d3Z4fYiRk5SUkYqIgHh2d32HkJOUlJKLiYF5d3d8ho+Tk5STi4qCent3fIaOkpOUk4yLg3t7eHyFjZGTlJOMjIR8e3l7hIyQk5SUjY2FfXx6e4SLj5KUlI6OhoB9ent+go2RkpSVj4+IgX5+fH6CjZCSlZWQkImCf399f4GLj5GTlZGRioOAf35+gYqOkJOWkpKLhYGAfn5/iIyPkpWTk42GgoGAfn+HjI6RlZSTjoiEgoF+foaKjZCUlZWQiYWDgn9+hYmMj5OWlZGLhoOCgH6EiIuOkpaWkoyIhYOBfoOHioyRlZaUjomGhIKAg4aJi4+UlpWPi4eGhIKCg4aIio6TlpaPjImGhYOCgoWHiY2SlpaSjouIhYSDgoSGh4qNkpaUkY2KiIaEg4OEhYmLjpKVlJKOi4mGhIODg4WIio2RlJWTj4yKh4WDg4OEhoiLjpGVlZSQjYuIhYODg4OFh4mMj5OVlJKPjImGhIODgoSGiIuNkJOVlJKQjYqHhIODgoOFh4mLjpKUlZOQjouIhYODgoOEhoiKjZCTlJWRj42KiIWDg4KDhYaIio2Pk5SUkpCNioiGhIODg4SGiIqMj5GTlJOQjo2KiIaEg4ODhIaHiYuNkJKUk5KQjouJh4WEg4OEhYaIiouOkJKUk5KQjouJiIaFg4OEhIaHiImLjZCSkpOSkI6MiomHhoSEhISFhoiJi42PkZOTkpGPjYuKiIaFhISEhYaHiImLjY+RkpOSkY+OjIqJh4aFhISEhYaHiImLjY+Rk5OSkZCOjYuKiIeGhYSEhYWGh4iKi42PkZKTkpGQjo2MioqIh4aFhYWFhoaHiYqMjY+RkpKSkZCPjoyLiomIh4aFhYWFhoaHiImLjI6QkZKSkpGQj42MioqJiIeGhYWFhYaGh4iJi4yOkJGSkpKRkI+OjYuKiYmIh4aFhYWFhYaGh4iJi4yOkJGSkpKRkI+OjYyLiomIh4eGhYWFhYWGhoaHiImLjI6PkZKSkpGQj46NjIuKiYiHhoaGhYWFhYWFhoaHiImKjI2PkJGSkpKRkI+OjYyLiomIiIeGhoWFhQ==" />
      
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="gap-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`${subject?.borderColor} ${subject?.color}`}
                >
                  {subject?.name}
                </Badge>
                <Badge variant="secondary">Week {task.week}</Badge>
              </div>
              
              <div className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 border">
                <Clock className={`h-5 w-5 ${isBreak ? "text-green-500" : "text-primary"}`} />
                <span className="font-mono text-xl font-bold" data-testid="timer-display">
                  {formatTime(timeRemaining)}
                </span>
                {isBreak && <Badge variant="secondary" className="text-xs">Break</Badge>}
                
                <div className="flex gap-1 ml-2">
                  {!isRunning ? (
                    <Button size="icon" variant="ghost" onClick={startTimer} data-testid="button-start-timer">
                      <Play className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="icon" variant="ghost" onClick={pauseTimer} data-testid="button-pause-timer">
                      <Pause className="h-4 w-4" />
                    </Button>
                  )}
                  <Button size="icon" variant="ghost" onClick={resetTimer} data-testid="button-reset-timer">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
          <p className="text-muted-foreground">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="questions" className="gap-1" data-testid="tab-questions">
                  <Brain className="h-4 w-4" />
                  Questions
                </TabsTrigger>
                <TabsTrigger value="reading" className="gap-1" data-testid="tab-reading">
                  <BookOpen className="h-4 w-4" />
                  Reading
                </TabsTrigger>
                <TabsTrigger value="writing" className="gap-1" data-testid="tab-writing">
                  <PenTool className="h-4 w-4" />
                  Writing
                </TabsTrigger>
                <TabsTrigger value="summary" className="gap-1" data-testid="tab-summary">
                  <FileText className="h-4 w-4" />
                  Summary
                </TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-4">
                {totalQuestions > 0 ? (
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Question {currentQuestionIndex + 1} of {totalQuestions}
                        </CardTitle>
                        <Badge variant="outline">
                          {correctAnswers}/{answeredQuestions.size} correct
                        </Badge>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg min-h-[100px]">
                        <p className="text-lg font-medium">{currentQuestion?.question}</p>
                      </div>

                      {"options" in currentQuestion && currentQuestion.options ? (
                        <div className="space-y-2">
                          {currentQuestion.options.map((option, idx) => (
                            <Button
                              key={idx}
                              variant={
                                showAnswer
                                  ? option === currentQuestion.answer
                                    ? "default"
                                    : selectedAnswer === option
                                      ? "destructive"
                                      : "outline"
                                  : "outline"
                              }
                              className="w-full justify-start text-left h-auto py-3 px-4"
                              onClick={() => !showAnswer && handleAnswer(option)}
                              disabled={showAnswer}
                              data-testid={`option-${idx}`}
                            >
                              <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                              {option}
                              {showAnswer && option === currentQuestion.answer && (
                                <CheckCircle2 className="h-4 w-4 ml-auto text-green-500" />
                              )}
                              {showAnswer && selectedAnswer === option && option !== currentQuestion.answer && (
                                <XCircle className="h-4 w-4 ml-auto" />
                              )}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {!showAnswer ? (
                            <Button
                              onClick={() => setShowAnswer(true)}
                              className="w-full"
                              data-testid="button-show-answer"
                            >
                              Show Answer
                            </Button>
                          ) : (
                            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                              <p className="font-medium text-primary mb-1">Answer:</p>
                              <p>{currentQuestion?.answer}</p>
                              {"solution" in currentQuestion && currentQuestion.solution && (
                                <div className="mt-3 pt-3 border-t border-primary/20">
                                  <p className="text-sm text-muted-foreground font-medium mb-1">Solution:</p>
                                  <p className="text-sm">{currentQuestion.solution}</p>
                                </div>
                              )}
                            </div>
                          )}
                          {showAnswer && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setAnsweredQuestions(prev => new Set(Array.from(prev).concat(currentQuestionIndex)));
                                  setCorrectAnswers(c => c + 1);
                                  nextQuestion();
                                }}
                                data-testid="button-got-it"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                Got it
                              </Button>
                              <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                  setAnsweredQuestions(prev => new Set(Array.from(prev).concat(currentQuestionIndex)));
                                  nextQuestion();
                                }}
                                data-testid="button-need-review"
                              >
                                <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                Need review
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={prevQuestion}
                          disabled={currentQuestionIndex === 0}
                          data-testid="button-prev-question"
                        >
                          Previous
                        </Button>
                        <div className="flex gap-1">
                          {allQuestions.slice(0, 10).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCurrentQuestionIndex(idx);
                                setShowAnswer(false);
                                setSelectedAnswer(null);
                              }}
                              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                                idx === currentQuestionIndex
                                  ? "bg-primary text-primary-foreground"
                                  : answeredQuestions.has(idx)
                                    ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                                    : "bg-muted hover-elevate"
                              }`}
                              data-testid={`question-nav-${idx}`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                          {totalQuestions > 10 && (
                            <span className="px-2 text-muted-foreground">+{totalQuestions - 10}</span>
                          )}
                        </div>
                        <Button
                          onClick={nextQuestion}
                          disabled={currentQuestionIndex === totalQuestions - 1}
                          data-testid="button-next-question"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground">No practice questions available for this topic yet.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="reading" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reading Material</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {content.reading && (
                      <div className="space-y-4">
                        <h3 className="font-semibold text-lg text-primary">{content.reading.title}</h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {content.reading.content.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-muted-foreground leading-relaxed mb-3">
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        {content.reading.keyPoints && content.reading.keyPoints.length > 0 && (
                          <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              Key Points
                            </h4>
                            <ul className="space-y-1">
                              {content.reading.keyPoints.map((point, idx) => (
                                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                  <span className="text-primary mt-1">•</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    {content.vocabulary && content.vocabulary.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Key Terms</h3>
                        <div className="grid gap-3">
                          {content.vocabulary.map((term, idx) => (
                            <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                              <span className="font-medium text-primary">{term.term}:</span>{" "}
                              <span className="text-muted-foreground">{term.definition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {content.comprehensionQuestions && content.comprehensionQuestions.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3">Comprehension Questions</h3>
                        <div className="space-y-3">
                          {content.comprehensionQuestions.map((q, idx) => (
                            <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                              <p className="font-medium mb-1">{q.question}</p>
                              <p className="text-sm text-muted-foreground">{q.answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="writing" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Writing Prompts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {content.writingPrompts && content.writingPrompts.length > 0 ? (
                      content.writingPrompts.map((prompt, idx) => (
                        <div key={idx} className="p-4 bg-muted/50 rounded-lg space-y-3">
                          <p className="font-medium">{prompt.prompt}</p>
                          <div>
                            <p className="text-sm font-medium text-primary mb-1">Requirements:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {prompt.requirements.map((req, i) => (
                                <li key={i}>{req}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary mb-1">Structure:</p>
                            <ol className="list-decimal list-inside text-sm text-muted-foreground">
                              {prompt.structure.map((s, i) => (
                                <li key={i}>{s}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No writing prompts for this topic.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Points Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {content.summaryPoints && content.summaryPoints.length > 0 ? (
                      <ul className="space-y-2">
                        {content.summaryPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No summary points available.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Timer Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={timerMode === "pomodoro" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => {
                      setTimerMode("pomodoro");
                      setTimeRemaining(25 * 60);
                      setIsRunning(false);
                    }}
                    data-testid="button-pomodoro"
                  >
                    Pomodoro
                  </Button>
                  <Button
                    variant={timerMode === "custom" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => {
                      setTimerMode("custom");
                      setTimeRemaining(customMinutes * 60);
                      setIsRunning(false);
                    }}
                    data-testid="button-custom-timer"
                  >
                    Custom
                  </Button>
                </div>
                {timerMode === "custom" && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={customMinutes}
                      onChange={(e) => {
                        const mins = parseInt(e.target.value);
                        setCustomMinutes(mins);
                        if (!isRunning) setTimeRemaining(mins * 60);
                      }}
                      className="flex-1"
                      data-testid="slider-custom-minutes"
                    />
                    <span className="text-sm font-medium w-12">{customMinutes} min</span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  {timerMode === "pomodoro" 
                    ? "25 min focus, 5 min break" 
                    : `${customMinutes} min session`}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Questions Answered</span>
                  <span className="font-medium">{answeredQuestions.size}/{totalQuestions}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span>Accuracy</span>
                  <span className="font-medium">
                    {answeredQuestions.size > 0 
                      ? Math.round((correctAnswers / answeredQuestions.size) * 100) 
                      : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-1">
                  {allQuestions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setShowAnswer(false);
                        setSelectedAnswer(null);
                      }}
                      className={`aspect-square rounded text-xs font-medium transition-colors ${
                        idx === currentQuestionIndex
                          ? "bg-primary text-primary-foreground"
                          : answeredQuestions.has(idx)
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-muted hover-elevate"
                      }`}
                      data-testid={`quick-nav-${idx}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
