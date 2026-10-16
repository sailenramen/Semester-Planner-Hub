import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useCompleteChallenge,
  useDailyChallenge,
  useTasks,
  useUserStats,
} from "@/hooks/useApi";
import {
  buildChallengePool,
  isCorrectAnswer,
  pickDailyChallenge,
  DAILY_CHALLENGE_SIZE,
} from "@/lib/dailyChallenge";
import { CheckCircle2, Sparkles, Target } from "lucide-react";

interface DailyChallengeCardProps {
  // The Study page's sidebar cards title themselves at text-lg, while the
  // Dashboard's cards use text-base.
  titleClassName?: string;
}

/**
 * Five mixed questions a day, drawn from the mistake pile and the week being
 * studied. The server owns the day and the bonus; this only runs the quiz.
 */
export function DailyChallengeCard({ titleClassName = "text-base" }: DailyChallengeCardProps) {
  const challenge = useDailyChallenge();
  const { data: tasks = [] } = useTasks();
  const { data: stats } = useUserStats();
  const complete = useCompleteChallenge();

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  // The server's date decides the day, so the set is the same for everyone and
  // survives a reload.
  const today = challenge.data?.today;
  const mistakes = stats?.mistakes;
  const questions = useMemo(() => {
    if (!today) return [];
    return pickDailyChallenge(buildChallengePool(tasks, mistakes ?? []), today, DAILY_CHALLENGE_SIZE);
  }, [today, tasks, mistakes]);

  const total = questions.length;
  const current = questions[index];
  const completedToday = challenge.data?.completedToday ?? false;
  const streak = challenge.data?.streak ?? 0;
  const bonus = challenge.data?.bonus ?? 0;
  const options = current?.options ?? [];
  const showAnswer = selected !== null;

  const start = () => {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
    setOpen(true);
  };

  const choose = (option: string) => {
    if (showAnswer) return;
    setSelected(option);
    if (current && isCorrectAnswer(option, current.answer)) {
      setCorrectCount((count) => count + 1);
    }
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
      setSelected(null);
      return;
    }
    // The last answer is already counted: answering and finishing are separate
    // clicks, so the score is settled by the time this runs.
    complete.mutate({ correct: correctCount, total });
    setFinished(true);
  };

  return (
    <Card data-testid="card-daily-challenge">
      <CardHeader>
        <CardTitle className={titleClassName}>Daily Challenge</CardTitle>
        <CardDescription>Five questions mixed from your mistakes and this week.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Challenge streak</span>
          <span data-testid="challenge-streak">
            {streak} {streak === 1 ? "day" : "days"}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Daily bonus</span>
          <span>+{bonus} pts</span>
        </div>

        {completedToday ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span data-testid="challenge-done">Done for today</span>
          </div>
        ) : (
          <Button
            size="sm"
            className="w-full"
            onClick={start}
            disabled={total === 0}
            data-testid="button-start-challenge"
          >
            <Target className="h-4 w-4 mr-2" />
            Start challenge
          </Button>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Daily Challenge</DialogTitle>
              <DialogDescription>
                {finished ? "Today's result" : `Question ${index + 1} of ${total}`}
              </DialogDescription>
            </DialogHeader>

            {finished ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-medium" data-testid="challenge-score">
                    {correctCount} of {total} correct
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Bonus earned</span>
                  <span>+{complete.data?.bonus ?? 0} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Challenge streak</span>
                  <span>
                    {complete.data?.streak ?? streak} {(complete.data?.streak ?? streak) === 1 ? "day" : "days"}
                  </span>
                </div>
                <Button size="sm" className="w-full" onClick={() => setOpen(false)}>
                  Done
                </Button>
              </div>
            ) : current ? (
              <div className="space-y-4">
                <p className="font-medium">{current.question}</p>
                <div className="space-y-2">
                  {options.map((option, optionIndex) => {
                    const isCorrectOption = option === current.answer;
                    const isWrongSelection = selected === option && !isCorrectOption;
                    return (
                      <Button
                        key={optionIndex}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left h-auto py-3 px-4",
                          // Correct answers fill green, a wrong pick fills red.
                          showAnswer &&
                            isCorrectOption &&
                            "!border-green-600 !bg-green-600 !text-white hover:!bg-green-600 disabled:!opacity-100",
                          showAnswer &&
                            isWrongSelection &&
                            "!border-red-600 !bg-red-600 !text-white hover:!bg-red-600 disabled:!opacity-100",
                        )}
                        onClick={() => choose(option)}
                        disabled={showAnswer}
                        data-testid={`challenge-option-${optionIndex}`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                        {option}
                      </Button>
                    );
                  })}
                </div>
                {showAnswer && (
                  <Button size="sm" className="w-full" onClick={next} data-testid="button-challenge-next">
                    {index + 1 < total ? "Next question" : "Finish"}
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No questions are ready yet. Start a task for this week first.
              </p>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
