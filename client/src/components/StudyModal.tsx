import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Task, subjects } from "@shared/schema";
import { getStudyContent, StudyContent, PracticeQuestion, FlashcardQuestion } from "@/lib/studyContent";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  BookOpen, 
  PenTool, 
  CheckCircle,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  Timer,
  Coffee,
} from "lucide-react";

interface StudyModalProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TimerMode = "pomodoro" | "custom";

export function StudyModal({ task, open, onOpenChange }: StudyModalProps) {
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<TimerMode>("pomodoro");
  const [isBreak, setIsBreak] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [currentFlashcard, setCurrentFlashcard] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [userNotes, setUserNotes] = useState("");
  const [writingChecklist, setWritingChecklist] = useState<Set<number>>(new Set());
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const subject = task ? subjects.find((s) => s.id === task.subjectId) : null;
  const content = task ? getStudyContent(task.subjectId, task.title, task.week) : null;

  useEffect(() => {
    if (open) {
      setShowAnswers({});
      setUserAnswers({});
      setCurrentFlashcard(0);
      setFlashcardFlipped(false);
      setCompletedQuestions(new Set());
      setUserNotes("");
      setWritingChecklist(new Set());
      resetTimer();
    }
  }, [open, task]);

  useEffect(() => {
    if (isRunning && timerSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      playAlarm();
      if (timerMode === "pomodoro") {
        if (!isBreak) {
          setIsBreak(true);
          setTimerSeconds(5 * 60);
        } else {
          setIsBreak(false);
          setTimerSeconds(25 * 60);
        }
      }
      setIsRunning(false);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timerSeconds, timerMode, isBreak]);

  const playAlarm = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1jZGF/g4OFhISFgoJ/fn9+fn5/gIGCg4OCgX9+fX19fX5/gIGCg4OCgYB/fn19fX1+f4CBgoODgoGAf359fX19fn+AgYKDg4KBgH9+fX19fX5/gIGCg4OCgYB/fn19fX1+f4CBgoODgoGAf359fX19fn+AgYKDg4KBgH9+fX19fX5/gIGCg4OCgYB/fn19fX1+f4CBgoODgoGAf359fX19fn+AgYKDg4KBgH9+fX19fX5/gIGCg4OCgYA=");
    audio.play().catch(() => {});
  };

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsBreak(false);
    if (timerMode === "pomodoro") {
      setTimerSeconds(25 * 60);
    } else {
      setTimerSeconds(customMinutes * 60);
    }
  }, [timerMode, customMinutes]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleAnswer = (questionId: string) => {
    setShowAnswers((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const markQuestionComplete = (questionId: string) => {
    setCompletedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  if (!task || !content) return null;

  const renderTimer = () => (
    <Card className="border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="font-medium">Study Timer</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={timerMode === "pomodoro" ? "default" : "outline"}
              onClick={() => {
                setTimerMode("pomodoro");
                setTimerSeconds(25 * 60);
                setIsBreak(false);
              }}
              data-testid="button-pomodoro"
            >
              Pomodoro
            </Button>
            <Button
              size="sm"
              variant={timerMode === "custom" ? "default" : "outline"}
              onClick={() => {
                setTimerMode("custom");
                setTimerSeconds(customMinutes * 60);
              }}
              data-testid="button-custom-timer"
            >
              Custom
            </Button>
          </div>
        </div>

        {timerMode === "custom" && (
          <div className="flex items-center gap-2 mb-4">
            <Input
              type="number"
              min={1}
              max={120}
              value={customMinutes}
              onChange={(e) => {
                const mins = parseInt(e.target.value) || 1;
                setCustomMinutes(mins);
                if (!isRunning) {
                  setTimerSeconds(mins * 60);
                }
              }}
              className="w-20"
              data-testid="input-custom-minutes"
            />
            <span className="text-sm text-muted-foreground">minutes</span>
          </div>
        )}

        <div className="text-center">
          {isBreak && (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <Coffee className="h-4 w-4" />
              <span className="text-sm font-medium">Break Time!</span>
            </div>
          )}
          <div className="text-5xl font-mono font-bold mb-4" data-testid="timer-display">
            {formatTime(timerSeconds)}
          </div>
          <div className="flex justify-center gap-2">
            <Button
              size="icon"
              variant={isRunning ? "destructive" : "default"}
              onClick={() => setIsRunning(!isRunning)}
              data-testid="button-timer-toggle"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={resetTimer}
              data-testid="button-timer-reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderReadingContent = () => (
    <div className="space-y-4">
      {content.vocabulary && content.vocabulary.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Key Vocabulary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {content.vocabulary.map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="font-medium text-sm min-w-[120px]">{item.term}:</span>
                <span className="text-sm text-muted-foreground">{item.definition}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {content.comprehensionQuestions && content.comprehensionQuestions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Comprehension Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {content.comprehensionQuestions.map((q, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm font-medium">{i + 1}. {q.question}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleAnswer(`comp-${i}`)}
                  className="h-auto p-1 text-xs"
                >
                  {showAnswers[`comp-${i}`] ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                  {showAnswers[`comp-${i}`] ? "Hide Hint" : "Show Hint"}
                </Button>
                {showAnswers[`comp-${i}`] && (
                  <p className="text-sm text-muted-foreground pl-4 border-l-2 border-primary/30">
                    {q.answer}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {content.summaryPoints && content.summaryPoints.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Key Points to Note</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {content.summaryPoints.map((point, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            Your Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Write your notes here..."
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            className="min-h-[100px]"
            data-testid="textarea-notes"
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderPracticeContent = () => {
    const questions = content.practiceQuestions || [];
    const progressPercent = questions.length > 0 
      ? (completedQuestions.size / questions.length) * 100 
      : 0;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Progress: {completedQuestions.size}/{questions.length} questions
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAnswers({})}
            data-testid="button-hide-all-answers"
          >
            <EyeOff className="h-3 w-3 mr-1" />
            Hide All
          </Button>
        </div>
        <Progress value={progressPercent} className="h-2" />

        {content.vocabulary && content.vocabulary.length > 0 && (
          <Card className="bg-muted/30">
            <CardContent className="p-3">
              <details>
                <summary className="cursor-pointer text-sm font-medium">Reference: Key Terms</summary>
                <div className="mt-2 space-y-1">
                  {content.vocabulary.map((item, i) => (
                    <div key={i} className="text-xs">
                      <span className="font-medium">{item.term}:</span>{" "}
                      <span className="text-muted-foreground">{item.definition}</span>
                    </div>
                  ))}
                </div>
              </details>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card 
              key={q.id} 
              className={completedQuestions.has(q.id) ? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10" : ""}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={completedQuestions.has(q.id)}
                    onCheckedChange={() => markQuestionComplete(q.id)}
                    className="mt-1"
                    data-testid={`checkbox-question-${q.id}`}
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">{i + 1}. {q.question}</p>
                    
                    {q.type === "multiple-choice" && q.options && (
                      <div className="space-y-1 pl-2">
                        {q.options.map((opt, j) => (
                          <label key={j} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={opt}
                              checked={userAnswers[q.id] === opt}
                              onChange={() => setUserAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                              className="accent-primary"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === "short" && (
                      <Input
                        placeholder="Your answer..."
                        value={userAnswers[q.id] || ""}
                        onChange={(e) => setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        className="text-sm"
                        data-testid={`input-answer-${q.id}`}
                      />
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleAnswer(q.id)}
                      className="h-auto p-1 text-xs"
                    >
                      {showAnswers[q.id] ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                      {showAnswers[q.id] ? "Hide Answer" : "Show Answer"}
                    </Button>

                    {showAnswers[q.id] && (
                      <div className="pl-4 border-l-2 border-green-500/50 space-y-1">
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">
                          Answer: {q.answer}
                        </p>
                        {q.solution && (
                          <p className="text-xs text-muted-foreground">
                            Solution: {q.solution}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {content.summaryPoints && (
          <Card className="bg-primary/5">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-2">Remember:</h4>
              <ul className="space-y-1">
                {content.summaryPoints.map((point, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span>•</span> {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderWritingContent = () => {
    const prompt = content.writingPrompts?.[0];
    
    return (
      <div className="space-y-4">
        {prompt && (
          <>
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Writing Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{prompt.prompt}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Structure Template</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {prompt.structure.map((item, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">{i + 1}</Badge>
                      {item}
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Requirements Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {prompt.requirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Checkbox
                      checked={writingChecklist.has(i)}
                      onCheckedChange={() => {
                        setWritingChecklist((prev) => {
                          const newSet = new Set(prev);
                          if (newSet.has(i)) {
                            newSet.delete(i);
                          } else {
                            newSet.add(i);
                          }
                          return newSet;
                        });
                      }}
                      data-testid={`checkbox-requirement-${i}`}
                    />
                    <span className={`text-sm ${writingChecklist.has(i) ? "line-through text-muted-foreground" : ""}`}>
                      {req}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PenTool className="h-4 w-4" />
              Draft Your Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Start writing your draft here..."
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              className="min-h-[200px]"
              data-testid="textarea-writing-draft"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Word count: {userNotes.trim() ? userNotes.trim().split(/\s+/).length : 0}
            </p>
          </CardContent>
        </Card>

        {content.summaryPoints && (
          <Card className="bg-muted/30">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-2">Writing Tips:</h4>
              <ul className="space-y-1">
                {content.summaryPoints.map((point, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <Lightbulb className="h-3 w-3 mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderReviewContent = () => {
    const flashcards = content.flashcards || [];
    const currentCard = flashcards[currentFlashcard];

    if (!flashcards.length) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p>No flashcards available for this topic.</p>
          <p className="text-sm mt-2">Use the Reading or Practice tabs instead.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Card {currentFlashcard + 1} of {flashcards.length}
          </span>
          <Progress value={((currentFlashcard + 1) / flashcards.length) * 100} className="w-32 h-2" />
        </div>

        <Card 
          className="min-h-[200px] cursor-pointer hover-elevate"
          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
          data-testid="flashcard"
        >
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            {!flashcardFlipped ? (
              <>
                <p className="text-lg font-medium mb-4">{currentCard.question}</p>
                {currentCard.type === "multiple-choice" && currentCard.options && (
                  <div className="space-y-2 w-full max-w-sm">
                    {currentCard.options.map((opt, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUserAnswers((prev) => ({ ...prev, [`flash-${currentFlashcard}`]: opt }));
                          setFlashcardFlipped(true);
                        }}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-4">Click to reveal answer</p>
              </>
            ) : (
              <>
                <Badge className="mb-2" variant="outline">Answer</Badge>
                <p className="text-lg font-medium text-green-700 dark:text-green-400">
                  {currentCard.answer}
                </p>
                {userAnswers[`flash-${currentFlashcard}`] && (
                  <p className="text-sm mt-2">
                    Your answer: {userAnswers[`flash-${currentFlashcard}`]}
                    {userAnswers[`flash-${currentFlashcard}`] === currentCard.answer ? (
                      <CheckCircle className="inline h-4 w-4 ml-1 text-green-500" />
                    ) : (
                      <span className="text-red-500 ml-1">(incorrect)</span>
                    )}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setCurrentFlashcard((prev) => Math.max(0, prev - 1));
              setFlashcardFlipped(false);
            }}
            disabled={currentFlashcard === 0}
            data-testid="button-prev-card"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCurrentFlashcard((prev) => Math.min(flashcards.length - 1, prev + 1));
              setFlashcardFlipped(false);
            }}
            disabled={currentFlashcard === flashcards.length - 1}
            data-testid="button-next-card"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {content.summaryPoints && (
          <Card className="bg-muted/30">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-2">Key Points:</h4>
              <ul className="space-y-1">
                {content.summaryPoints.map((point, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span>•</span> {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {subject && (
              <Badge className={`${subject.bgColor} ${subject.color}`}>
                {subject.name}
              </Badge>
            )}
            <Badge variant="outline">Week {task.week}</Badge>
          </div>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {renderTimer()}

          <Tabs defaultValue={content.type} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="reading" data-testid="tab-reading">
                <BookOpen className="h-4 w-4 mr-1" />
                Reading
              </TabsTrigger>
              <TabsTrigger value="practice" data-testid="tab-practice">
                <PenTool className="h-4 w-4 mr-1" />
                Practice
              </TabsTrigger>
              <TabsTrigger value="writing" data-testid="tab-writing">
                <Clock className="h-4 w-4 mr-1" />
                Writing
              </TabsTrigger>
              <TabsTrigger value="review" data-testid="tab-review">
                <CheckCircle className="h-4 w-4 mr-1" />
                Review
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reading" className="mt-4">
              {renderReadingContent()}
            </TabsContent>
            <TabsContent value="practice" className="mt-4">
              {renderPracticeContent()}
            </TabsContent>
            <TabsContent value="writing" className="mt-4">
              {renderWritingContent()}
            </TabsContent>
            <TabsContent value="review" className="mt-4">
              {renderReviewContent()}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
