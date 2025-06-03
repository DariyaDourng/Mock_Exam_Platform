'use client';

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Clock, Flag } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Choice {
  id: number;
  choice_text: string;
}

interface Question {
  id: number;
  question_text: string | null;
  question_image: string | null;
  points?: number;
  choices: Choice[];
  type: "single-choice" | "multiple-choice" | "true-false";
}

interface TestData {
  id: string;
  name: string;
  duration: number; // minutes
  questions: Question[];
}

export default function StudentTest({ params }: { params: { id: string } }) {
  const router = useRouter();
  const testId = params.id;

  const [hasMounted, setHasMounted] = useState(false);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showRequiredAlert, setShowRequiredAlert] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimeKey = `exam_${testId}_startTime`;
  const answersKey = `exam_${testId}_answers`;
  const currentQuestionKey = `exam_${testId}_currentQuestion`;

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !testId) return;

    setLoading(true);
    setError(null);

    axios
      .get<{ data: TestData }>(`http://localhost:8000/api/exams/${testId}`)
      .then((res) => {
        setTestData(res.data.data);
        setTestSubmitted(false);
        setScore(null);
        setFlaggedQuestions({});

        const durationSeconds = res.data.data.duration * 60;
        let storedStartTime = localStorage.getItem(startTimeKey);

        if (!storedStartTime) {
          storedStartTime = Date.now().toString();
          localStorage.setItem(startTimeKey, storedStartTime);
        }

        const startTimeNum = parseInt(storedStartTime, 10);
        const elapsedSeconds = Math.floor((Date.now() - startTimeNum) / 1000);
        const remaining = durationSeconds - elapsedSeconds;

        setTimeLeft(remaining > 0 ? remaining : durationSeconds);

        const savedAnswers = localStorage.getItem(answersKey);
        if (savedAnswers) {
          try {
            setAnswers(JSON.parse(savedAnswers));
          } catch {
            setAnswers({});
          }
        }

        const savedCurrentQuestion = localStorage.getItem(currentQuestionKey);
        if (savedCurrentQuestion) {
          const idx = parseInt(savedCurrentQuestion, 10);
          if (!isNaN(idx) && idx >= 0 && idx < res.data.data.questions.length) {
            setCurrentQuestion(idx);
          }
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to load test data");
        setLoading(false);
      });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasMounted, testId]);

  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem(answersKey, JSON.stringify(answers));
  }, [answers, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    localStorage.setItem(currentQuestionKey, currentQuestion.toString());
  }, [currentQuestion, hasMounted]);

  useEffect(() => {
    if (testSubmitted || loading || error || timeLeft <= 0) return;
    if (!hasMounted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, testSubmitted, loading, error, hasMounted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswerChangeSingle = (value: string) => {
    setAnswers({ ...answers, [currentQuestion]: value });
    setShowRequiredAlert(false);
  };

  const handleAnswerChangeMultiple = (optionId: string) => {
    const currentAnswers = (answers[currentQuestion] as string[]) || [];
    let newAnswers: string[];
    if (currentAnswers.includes(optionId)) {
      newAnswers = currentAnswers.filter((id) => id !== optionId);
    } else {
      newAnswers = [...currentAnswers, optionId];
    }
    setAnswers({ ...answers, [currentQuestion]: newAnswers });
    setShowRequiredAlert(false);
  };

  const isAnswered = () => {
    const ans = answers[currentQuestion];
    if (!testData) return false;
    const qType = testData.questions[currentQuestion].type;
    if (qType === "multiple-choice") {
      return Array.isArray(ans) && ans.length > 0;
    } else {
      return typeof ans === "string" && ans !== "";
    }
  };

  const handleNextQuestion = () => {
    if (!isAnswered()) {
      setShowRequiredAlert(true);
      return;
    }
    if (testData && currentQuestion < testData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowRequiredAlert(false);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowRequiredAlert(false);
    }
  };

  async function fetchUserId(): Promise<number | null> {
    try {
      const res = await axios.get("http://localhost:8000/api/user", {
        withCredentials: true,
      });
      return res.data.id || null;
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      return null;
    }
  }

  async function handleSubmitTest() {
    if (!testData) return;

    setTestSubmitted(true);

    const userId = await fetchUserId();
    if (!userId) {
      setError("User not logged in or session expired");
      setTestSubmitted(false);
      return;
    }

    const payload = {
      exam_id: testId,
      user_id: userId,
      answers: testData.questions.map((q, idx) => ({
        questionId: q.id,
        answer: answers[idx] || null,
      })),
    };

    try {
      // Step 1: Create exam attempt
      const createRes = await axios.post(
        "http://localhost:8000/api/exam-attempts",
        { ...payload, status: "submitted" },
        { withCredentials: true }
      );

      const attemptId = createRes.data.data.id;

      // Step 2: Grade the exam attempt
      const gradeRes = await axios.post(
        `http://localhost:8000/api/exam-attempts/${attemptId}/grade`,
        {},
        { withCredentials: true }
      );

      const score = gradeRes.data.data.attempt.score ?? 0;
      setScore(score);

      // Clear localStorage and timer state
      localStorage.removeItem(startTimeKey);
      localStorage.removeItem(answersKey);
      localStorage.removeItem(currentQuestionKey);

      // Redirect to result page
      router.push(`/dashboard/tests/${attemptId}/results?score=${score}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Failed to submit test";
      setError(message);
      setTestSubmitted(false);
    }
  }

  const toggleFlagQuestion = (index: number) => {
    setFlaggedQuestions({ ...flaggedQuestions, [index]: !flaggedQuestions[index] });
  };

  if (!hasMounted) return null;
  if (loading) return <p>Loading test...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!testData || testData.questions.length === 0) return <p>No questions available.</p>;

  const validCurrentQuestion = Math.min(currentQuestion, testData.questions.length - 1);
  const question = testData.questions[validCurrentQuestion];
  const progress = ((validCurrentQuestion + 1) / testData.questions.length) * 100;

  const options = question.choices.map((choice) => ({
    id: String(choice.id),
    text: choice.choice_text,
  }));

  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  const questionTypeLabel = (type: string) => {
    switch (type) {
      case "single-choice":
        return "Single Choice";
      case "multiple-choice":
        return "Multiple Choice";
      case "true-false":
        return "True / False";
      default:
        return "Unknown Type";
    }
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{testData.name}</h1>
            <p className="text-muted-foreground">
              Question {validCurrentQuestion + 1} of {testData.questions.length}
              {flaggedCount > 0 && (
                <span className="ml-2 text-yellow-600">
                  ({flaggedCount} question{flaggedCount > 1 ? "s" : ""} flagged for review)
                </span>
              )}
            </p>
            <p className="text-sm italic text-gray-600 mt-1">
              Type: {questionTypeLabel(question.type)}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-md border bg-background p-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={timeLeft < 60 ? "text-red-500 font-bold" : ""}>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-2" />

        {/* Submitted / Test Card */}
        {testSubmitted ? (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Test Submitted</CardTitle>
              <CardDescription>
                Your answers have been recorded. {score !== null ? `Your score: ${score}%` : "Calculating..."}
                Redirecting to results...
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Question {validCurrentQuestion + 1}</CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-semibold text-indigo-600 border border-indigo-600 p-1 rounded-md bg-indigo-100" >{question.points} points</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`p-1 h-8 w-8 ${flaggedQuestions[validCurrentQuestion] ? "text-yellow-600" : ""}`}
                          onClick={() => toggleFlagQuestion(validCurrentQuestion)}
                          aria-label={flaggedQuestions[validCurrentQuestion] ? "Unflag this question" : "Flag this question"}
                        >
                          <Flag
                            className={`h-5 w-5 ${flaggedQuestions[validCurrentQuestion] ? "fill-yellow-500 text-yellow-600" : ""}`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{flaggedQuestions[validCurrentQuestion] ? "Unflag" : "Flag"} this question for review</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <CardDescription
                className={`text-base font-medium border py-2 rounded-sm flex ${question.question_text ? "justify-start px-4" : "justify-center"}`}
              >
                {question.question_text ? (
                  question.question_text
                ) : question.question_image ? (
                  <img
                    src={question.question_image}
                    alt={`Question ${validCurrentQuestion + 1} Image`}
                    className="max-w-full object-contain h-auto mx-auto"
                  />
                ) : (
                  "No question text or image provided."
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {(question.type === "single-choice" || question.type === "true-false") && (
                <RadioGroup
                  value={(answers[validCurrentQuestion] as string) || ""}
                  onValueChange={handleAnswerChangeSingle}
                  className="space-y-3"
                >
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted cursor-pointer"
                    >
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                      <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "multiple-choice" && (
                <div className="space-y-3">
                  {options.map((option) => {
                    const selectedAnswers = (answers[validCurrentQuestion] as string[]) || [];
                    const checked = selectedAnswers.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        htmlFor={`option-${option.id}`}
                        className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          id={`option-${option.id}`}
                          checked={checked}
                          onChange={() => handleAnswerChangeMultiple(option.id)}
                          className="cursor-pointer"
                        />
                        <span className="flex-1 font-normal">{option.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {showRequiredAlert && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Required</AlertTitle>
                  <AlertDescription>Please select an answer before proceeding.</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevQuestion} disabled={validCurrentQuestion === 0}>
                Previous
              </Button>
              <div className="flex gap-2">
                {validCurrentQuestion === testData.questions.length - 1 ? (
                  <Button
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={handleSubmitTest}
                    disabled={!isAnswered() || testSubmitted}
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button className="bg-primary hover:bg-primary/90 text-white" onClick={handleNextQuestion}>
                    Next
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        )}

        {/* Question navigation buttons */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            {flaggedCount > 0 && (
              <div className="text-xs text-yellow-600 flex items-center gap-1">
                <Flag className="h-3 w-3" /> = Flagged for review
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {testData.questions.map((_, index) => {
              const isFlagged = flaggedQuestions[index];
              const isCurrentQuestion = validCurrentQuestion === index;
              const ans = answers[index];
              const answered = Array.isArray(ans) ? ans.length > 0 : typeof ans === "string" && ans !== "";

              return (
                <div key={index} className="relative">
                  <Button
                    variant={isCurrentQuestion ? "default" : answered ? "outline" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0
                      ${answered && !isCurrentQuestion ? "border-primary text-primary" : ""}
                      ${isCurrentQuestion ? "bg-primary text-white hover:bg-primary/90" : ""}
                    `}
                    onClick={() => {
                      setCurrentQuestion(index);
                      setShowRequiredAlert(false);
                    }}
                    aria-label={`Go to question ${index + 1}`}
                  >
                    {index + 1}
                  </Button>
                  {isFlagged && (
                    <div className="absolute -top-1 -right-1">
                      <Flag className="h-3 w-3 fill-yellow-500 text-yellow-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
