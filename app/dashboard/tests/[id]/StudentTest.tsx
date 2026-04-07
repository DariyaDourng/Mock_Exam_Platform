'use client';

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import dayjs from "dayjs";
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
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

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
  duration: number;
  questions: Question[];
}

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

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

  useEffect(() => { setHasMounted(true); }, []);

  useEffect(() => {
    if (!hasMounted || !testId) return;
    setLoading(true);
    setError(null);

    axios
      .get<{ data: TestData }>(API_URL + `/api/exams/${testId}`)
      .then((res) => {
        setTestData(res.data.data);
        setTestSubmitted(false);
        setScore(null);
        setFlaggedQuestions({});

        const durationSeconds = res.data.data.duration * 60;
        let storedStartTime = safeLocalStorage.getItem(startTimeKey);
        if (!storedStartTime) {
          storedStartTime = Date.now().toString();
          safeLocalStorage.setItem(startTimeKey, storedStartTime);
        }

        const startTimeNum = parseInt(storedStartTime, 10);
        const elapsedSeconds = Math.floor((Date.now() - startTimeNum) / 1000);
        const remaining = durationSeconds - elapsedSeconds;
        setTimeLeft(remaining > 0 ? remaining : durationSeconds);

        const savedAnswers = safeLocalStorage.getItem(answersKey);
        if (savedAnswers) {
          try { setAnswers(JSON.parse(savedAnswers)); } catch { setAnswers({}); }
        }

        const savedCurrentQuestion = safeLocalStorage.getItem(currentQuestionKey);
        if (savedCurrentQuestion) {
          const idx = parseInt(savedCurrentQuestion, 10);
          if (!isNaN(idx) && idx >= 0 && idx < res.data.data.questions.length) {
            setCurrentQuestion(idx);
          }
        } else {
          setCurrentQuestion(0);
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message || "Failed to load test data");
        setLoading(false);
      });

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [hasMounted, testId]);

  useEffect(() => {
    if (!hasMounted) return;
    safeLocalStorage.setItem(answersKey, JSON.stringify(answers));
  }, [answers, hasMounted]);

  useEffect(() => {
    if (!hasMounted) return;
    safeLocalStorage.setItem(currentQuestionKey, currentQuestion.toString());
  }, [currentQuestion, hasMounted]);

  useEffect(() => {
    if (testSubmitted || loading || error || timeLeft <= 0 || !hasMounted) return;
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
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
    const newAnswers = currentAnswers.includes(optionId)
      ? currentAnswers.filter((id) => id !== optionId)
      : [...currentAnswers, optionId];
    setAnswers({ ...answers, [currentQuestion]: newAnswers });
    setShowRequiredAlert(false);
  };

  const isAnswered = () => {
    const ans = answers[currentQuestion];
    if (!testData) return false;
    const qType = testData.questions[currentQuestion].type;
    if (qType === "multiple-choice") return Array.isArray(ans) && ans.length > 0;
    return typeof ans === "string" && ans !== "";
  };

  const handleNextQuestion = () => {
    if (!isAnswered()) { setShowRequiredAlert(true); return; }
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
      const token = Cookies.get("jwt_token");
      const res = await axios.get(API_URL + "/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.id || null;
    } catch {
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

    const storedStart = safeLocalStorage.getItem(startTimeKey);
    const startTimeNum = parseInt(storedStart || "0", 10);
    const finishTimeNum = Date.now();
    const timeSpent = finishTimeNum - startTimeNum;
    const durationMinutes = Math.floor(timeSpent / 60000);
    const durationSecondsLeft = Math.floor((timeSpent % 60000) / 1000);

    const payload = {
      exam_id: testId,
      user_id: userId,
      answers: testData.questions.map((q, idx) => ({
        questionId: q.id,
        answer: answers[idx] || null,
      })),
      date_time_taken: dayjs(startTimeNum).format("YYYY-MM-DD HH:mm:ss"),
      date_time_finish: dayjs(finishTimeNum).format("YYYY-MM-DD HH:mm:ss"),
      duration_minutes: durationMinutes,
      duration_seconds: durationSecondsLeft,
    };

    try {
      const createRes = await axios.post(API_URL + "/api/exam-attempts", {
        ...payload,
        status: "submitted",
      });
      const attemptId = createRes.data.data.id;
      const gradeRes = await axios.post(API_URL + `/api/exam-attempts/${attemptId}/grade`, {});
      const score = gradeRes.data.data.attempt.score ?? 0;
      setScore(score);

      safeLocalStorage.removeItem(startTimeKey);
      safeLocalStorage.removeItem(answersKey);
      safeLocalStorage.removeItem(currentQuestionKey);

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
  if (loading) return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-2 bg-gray-200 rounded" />
        <div className="h-48 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
  if (error) return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
  if (!testData || testData.questions.length === 0) return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <p className="text-sm text-gray-500">No questions available.</p>
    </div>
  );

  const validCurrentQuestion = Math.min(currentQuestion, testData.questions.length - 1);
  const question = testData.questions[validCurrentQuestion];
  const progress = ((validCurrentQuestion + 1) / testData.questions.length) * 100;
  const options = Array.isArray(question.choices)
    ? question.choices.map((choice) => ({ id: String(choice.id), text: choice.choice_text }))
    : [];
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  const questionTypeLabel = (type: string) => {
    switch (type) {
      case "single-choice": return "Single choice";
      case "multiple-choice": return "Multiple choice";
      case "true-false": return "True / False";
      default: return type;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-6">
      <div className="space-y-4">

        {/* ── Top bar: title + timer ── */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">{testData.name}</h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-sm text-gray-500">
                Question {validCurrentQuestion + 1} of {testData.questions.length}
              </span>
              {flaggedCount > 0 && (
                <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  {flaggedCount} flagged
                </span>
              )}
            </div>
          </div>

          {/* Timer */}
          <div className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border shrink-0 ${
            timeLeft < 60
              ? "text-red-600 bg-red-50 border-red-200"
              : "text-indigo-600 bg-indigo-50 border-indigo-200"
          }`}>
            <Clock className="h-3.5 w-3.5" />
            <span className="tabular-nums">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <Progress value={progress} className="h-1.5" />

        {/* ── Submitted state ── */}
        {testSubmitted ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Test submitted</CardTitle>
              <CardDescription>
                Your answers have been recorded.{" "}
                {score !== null ? `Score: ${score}%` : "Calculating score..."}{" "}
                Redirecting to results...
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-3">
              {/* Question header row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700">
                    Q{validCurrentQuestion + 1}
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500">{questionTypeLabel(question.type)}</span>
                  {question.points !== undefined && (
                    <>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                        {question.points} pt{question.points !== 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => toggleFlagQuestion(validCurrentQuestion)}
                        className={`p-1.5 rounded-md transition-colors ${
                          flaggedQuestions[validCurrentQuestion]
                            ? "text-amber-600 bg-amber-50 hover:bg-amber-100"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                        }`}
                        aria-label={flaggedQuestions[validCurrentQuestion] ? "Unflag question" : "Flag for review"}
                      >
                        <Flag className={`h-4 w-4 ${flaggedQuestions[validCurrentQuestion] ? "fill-amber-400" : ""}`} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{flaggedQuestions[validCurrentQuestion] ? "Remove flag" : "Flag for review"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Question body */}
              <div className="mt-3 text-sm font-medium text-gray-800 leading-relaxed bg-gray-50 rounded-md px-4 py-3 border border-gray-100">
                {question.question_text ? (
                  question.question_text
                ) : question.question_image ? (
                  <img
                    src={question.question_image}
                    alt={`Question ${validCurrentQuestion + 1}`}
                    className="max-w-full object-contain h-auto mx-auto rounded"
                  />
                ) : (
                  <span className="text-gray-400">No question content provided.</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-2">
              {(question.type === "single-choice" || question.type === "true-false") && (
                <RadioGroup
                  value={(answers[validCurrentQuestion] as string) || ""}
                  onValueChange={handleAnswerChangeSingle}
                  className="space-y-2"
                >
                  {options.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors text-sm ${
                        (answers[validCurrentQuestion] as string) === option.id
                          ? "border-indigo-300 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => handleAnswerChangeSingle(option.id)}
                    >
                      <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                      <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-normal text-gray-700">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === "multiple-choice" && (
                <div className="space-y-2">
                  {options.map((option) => {
                    const selectedAnswers = (answers[validCurrentQuestion] as string[]) || [];
                    const checked = selectedAnswers.includes(option.id);
                    return (
                      <label
                        key={option.id}
                        htmlFor={`option-${option.id}`}
                        className={`flex items-center gap-3 rounded-md border px-3 py-2.5 cursor-pointer transition-colors text-sm select-none ${
                          checked
                            ? "border-indigo-300 bg-indigo-50"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`option-${option.id}`}
                          checked={checked}
                          onChange={() => handleAnswerChangeMultiple(option.id)}
                          className="cursor-pointer accent-indigo-600"
                        />
                        <span className="flex-1 font-normal text-gray-700">{option.text}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {showRequiredAlert && (
                <Alert variant="destructive" className="mt-3 py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-sm">Answer required</AlertTitle>
                  <AlertDescription className="text-xs">Please select an answer before proceeding.</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex justify-between pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevQuestion}
                disabled={validCurrentQuestion === 0}
              >
                Previous
              </Button>

              {validCurrentQuestion === testData.questions.length - 1 ? (
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleSubmitTest}
                  disabled={!isAnswered() || testSubmitted}
                >
                  Submit test
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleNextQuestion}
                >
                  Next
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}