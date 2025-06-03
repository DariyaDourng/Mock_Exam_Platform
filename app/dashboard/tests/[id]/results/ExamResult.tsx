'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  Share2,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface ExamResultProps {
  examAttemptId: string;
}

interface Answer {
  id: number;
  question_id: number;
  question_text?: string | null;
  question_image?: string | null;
  student_answer: string;
  correct_answers: string[];
  status: 'correct' | 'incorrect';
  points?: number | string;
  earned_points?: number | string;
  created_at: string;
}

interface ExamResultData {
  id: number;
  exam: {
    id: number;
    name: string;
    duration: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  started_at?: string | null;
  submitted_at?: string | null;
  score: number | string | null;
  status: string;
  answers: Answer[];
  created_at: string;
  updated_at: string;
}

export default function ExamResult({ examAttemptId }: ExamResultProps) {
  const [result, setResult] = useState<ExamResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchResult() {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/exam-attempts/${examAttemptId}`, {
          withCredentials: true,
        });
        setResult(res.data.data ?? res.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load exam results',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    if (examAttemptId) {
      fetchResult();
    }
  }, [examAttemptId]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-72 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-700">Results Not Found</h3>
              <p className="text-gray-500">Unable to load exam results</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const examTitle = result.exam?.name ?? "Exam";
  const completedAt = result.submitted_at ?? result.started_at ?? "";

  // Use backend score as earned points
  const earnedPoints = typeof result.score === 'string' ? parseFloat(result.score) : result.score ?? 0;

  // Calculate total possible points from all questions
  const totalPoints = result.answers.reduce(
    (sum, ans) => sum + Number(ans.points ?? 0),
    0
  );

  // Calculate percentage based on backend score and total points
  const percentage = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  // Determine if student passed based on status from backend
  const isPass = result.status === 'passed' || result.status === 'graded';

  return (
    <div className="container mx-auto p-2 sm:p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button variant="ghost" onClick={() => router.back()} className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">{examTitle}</h1>
            {/* <p className="text-xs sm:text-sm text-gray-600">
              Completed on {completedAt ? new Date(completedAt).toLocaleDateString() : "N/A"}
            </p> */}
          </div>
        </div>
        {/* <div className="flex space-x-2 w-full sm:w-auto justify-start sm:justify-end">
          <Button
            variant="outline"
            className="text-gray-600 hover:bg-gray-100"
            onClick={() =>
              toast({
                title: 'Download Started',
                description: 'Your exam results are being downloaded as PDF',
              })
            }
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button
            variant="outline"
            className="text-gray-600 hover:bg-gray-100"
            onClick={() =>
              toast({
                title: 'Share Link Copied',
                description: 'Results share link copied to clipboard',
              })
            }
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div> */}
      </div>

      {/* Score Card */}
      <Card className={`border-2 ${isPass ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}`}>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            {isPass ? (
              <CheckCircle className="h-10 w-10 text-green-600" />
            ) : (
              <XCircle className="h-10 w-10 text-red-600" />
            )}
            <div>
              <h2 className="text-lg font-medium text-gray-800">{isPass ? 'Congratulations!' : 'Keep Trying!'}</h2>
              <p className="text-sm text-gray-600">
                You {isPass ? 'passed' : 'did not pass'} the exam
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-gray-800">{earnedPoints.toFixed(2)} points</div>
            <div className="text-xs text-gray-500 mt-1">Points scored</div>
            <div className="text-sm font-semibold text-gray-700 mt-1">
              Total Points Earned: {earnedPoints.toFixed(2)} / {totalPoints.toFixed(2)} ({percentage.toFixed(2)}%)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers List */}
      <div className="space-y-5">
        {result.answers.length === 0 && <p className="text-gray-600">No questions answered yet.</p>}

        {result.answers.map((answer, idx) => (
          <Card
            key={answer.id}
            className={`border-l-4 ${answer.status === "correct" ? "border-green-500" : "border-red-500 text-white"}`}
          >
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <div className="text-base font-semibold text-gray-700">
                  Question {idx + 1}
                </div>
                <div className="mt-2 text-[12px] text-gray-500">
                  Points: {Number(answer.earned_points ?? 0).toFixed(2)} / {Number(answer.points ?? 0).toFixed(2)}
                </div>
              </CardTitle>

              <div className="mt-2 w-full">
                <Badge
                  variant={answer.status === "correct" ? "default" : "destructive"}
                  className="w-full text-center"
                >
                  {answer.status === "correct" ? "Correct" : "Incorrect"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="text-gray-700">
              {answer.question_text ? (
                <p className="mb-4">{answer.question_text}</p>
              ) : answer.question_image ? (
                <img
                  src={answer.question_image}
                  alt={`Question ${idx + 1}`}
                  className="max-w-full sm:max-w-md rounded-lg border object-contain"
                />
              ) : (
                <p className="mb-4 text-gray-500">No question text or image</p>
              )}

              <p className="mb-2 font-medium text-gray-700">
                Your answer:{" "}
                <span className="font-normal text-gray-700">
                  {(() => {
                    try {
                      const parsed = JSON.parse(answer.student_answer);
                      if (Array.isArray(parsed)) return parsed.join(", ");
                      return answer.student_answer;
                    } catch {
                      return answer.student_answer;
                    }
                  })()}
                </span>
              </p>

              <p className="font-medium text-green-600 max-w-full sm:max-w-xs">
                Correct answer(s):{" "}
                <span className="font-normal text-green-600">
                  {answer.correct_answers.join(", ")}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
