<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreExamAttemptRequest;
use App\Http\Requests\UpdateExamAttemptRequest;
use App\Http\Resources\ExamAttemptResource;
use App\Models\Choice;
use App\Models\ExamAttempt;
use App\Models\ExamAnswer;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ExamAttemptController extends Controller
{
    // List all attempts
    public function index()
    {
        $attempts = ExamAttempt::with('exam', 'user')->latest()->get();

        if ($attempts->count() > 0) {
            return ExamAttemptResource::collection($attempts);
        }

        return response()->json([
            'status' => 200,
            'message' => 'No exam attempts found',
        ], 200);
    }

    // Store new exam attempt
    public function store(Request $request)
    {
        $validated = $request->validate([
            'exam_id' => 'required|exists:exams,id',
            'user_id' => 'required|exists:users,id',
            'answers' => 'required|array',
            'answers.*.questionId' => 'required|exists:questions,id',
            'answers.*.answer' => 'nullable',
            'status' => 'required|string',
            'date_time_taken' => 'required|date_format:Y-m-d H:i:s',
            'date_time_finish' => 'nullable|date_format:Y-m-d H:i:s',
            'duration_minutes' => 'nullable|integer|min:0',
            'duration_seconds' => 'nullable|integer|min:0',
        ]);

        DB::beginTransaction();

        try {
            // Ensure date format consistency
            $date_time_taken = Carbon::createFromFormat('Y-m-d H:i:s', $validated['date_time_taken'])->format('Y-m-d H:i:s');
            $date_time_finish = $validated['date_time_finish'] ? Carbon::createFromFormat('Y-m-d H:i:s', $validated['date_time_finish'])->format('Y-m-d H:i:s') : null;

            $examAttempt = ExamAttempt::create([
                'exam_id' => $validated['exam_id'],
                'user_id' => $validated['user_id'],
                'status' => $validated['status'],
                'date_time_taken' => $date_time_taken,
                'date_time_finish' => $date_time_finish,
                'duration_minutes' => $validated['duration_minutes'] ?? 0,
                'duration_seconds' => $validated['duration_seconds'] ?? 0,
                'score' => 0, // initial score, will be updated after grading
                'total_scores' => 0, // initial total score
            ]);

            foreach ($validated['answers'] as $answerData) {
                $answer = $answerData['answer'];

                if (is_array($answer)) {
                    // Multiple answers (e.g. multiple-choice)
                    ExamAnswer::create([
                        'attempt_id' => $examAttempt->id,
                        'question_id' => $answerData['questionId'],
                        'choice_id' => null,
                        'answer_text' => json_encode($answer),
                    ]);
                } else {
                    // Single answer, try to find choice by ID
                    $choice = Choice::where('question_id', $answerData['questionId'])
                        ->where('id', $answer)
                        ->first();

                    ExamAnswer::create([
                        'attempt_id' => $examAttempt->id,
                        'question_id' => $answerData['questionId'],
                        'choice_id' => $choice ? $choice->id : null,
                        'answer_text' => $choice ? $choice->choice_text : $answer,
                    ]);
                } 
                
            }

            // Grade exam attempt immediately
            $this->gradeExamAttempt($examAttempt->id);

            DB::commit();

            return response()->json([
                'message' => 'Exam attempt stored and graded successfully',
                'data' => $examAttempt->load('answers'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'message' => 'Failed to store exam attempt',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Show attempt details including answers
    public function show(ExamAttempt $examAttempt)
    {
        $examAttempt->load(['exam', 'user', 'answers.choice', 'answers.question.choices']);

        return new ExamAttemptResource($examAttempt);
    }

    // Update attempt details
    public function update(UpdateExamAttemptRequest $request, ExamAttempt $examAttempt)
    {
        $validated = $request->validated();

        try {
            $examAttempt->update($validated);

            return response()->json([
                'status' => 200,
                'message' => 'Exam attempt updated successfully',
                'data' => new ExamAttemptResource($examAttempt),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Delete an attempt
    public function destroy(ExamAttempt $examAttempt)
    {
        try {
            $examAttempt->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Exam attempt deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Grade the exam attempt and update score
    public function gradeExamAttempt($id)
    {
        $attempt = ExamAttempt::with(['answers.choice', 'answers.question.choices'])->findOrFail($id);

        $totalPoints = 0;
        $earnedPoints = 0;

        foreach ($attempt->answers as $answer) {
            $question = $answer->question;
            $points = $question->points ?? 1; // default 1 point if none set
            $totalPoints += $points;

            // Get all correct choice texts for this question and normalize them
            $correctAnswers = $question->choices
                ->where('is_correct', true)
                ->pluck('choice_text')
                ->map(fn($a) => strtolower(trim($a)))
                ->sort()
                ->values()
                ->all();

            // Determine student's answers:
            if ($answer->choice_id !== null && $answer->choice !== null) {
                // Single choice answer stored as related choice
                $studentAnswers = [strtolower(trim($answer->choice->choice_text))];
            } else {
                // Multiple choice or text answer stored in answer_text
                $decoded = json_decode($answer->answer_text, true);

                if (is_array($decoded)) {
                    // Map choice IDs to choice texts if possible
                    $choicesMap = $question->choices->pluck('choice_text', 'id')->toArray();

                    $studentAnswers = array_map(function ($ans) use ($choicesMap) {
                        return isset($choicesMap[$ans]) ? strtolower(trim($choicesMap[$ans])) : strtolower(trim($ans));
                    }, $decoded);
                    sort($studentAnswers);
                } else {
                    // Plain string answer
                    $studentAnswers = [strtolower(trim($answer->answer_text ?? ''))];
                }
            }

            // Compare normalized student answers with normalized correct answers
            $isCorrect = ($studentAnswers === $correctAnswers);

            if ($isCorrect) {
                $earnedPoints += $points;
            }
        }

        // Save results
        $attempt->score = $earnedPoints;
        $attempt->status = 'graded';
        $attempt->total_scores = $totalPoints;
        $attempt->save();

        $percentage = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0;

        return response()->json([
            'status' => 200,
            'message' => 'Exam attempt graded successfully',
            'data' => [
                'attempt' => new ExamAttemptResource($attempt),
                'percentage' => $percentage,
            ],
        ]);
    }

    // Save answers (optional additional endpoint)
    public function saveAnswers(Request $request, ExamAttempt $examAttempt)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.*.questionId' => 'required|exists:questions,id',
            'answers.*.student_text' => 'nullable|string', // expecting student text answer
        ]);

        try {
            // Delete old answers for this attempt
            $examAttempt->answers()->delete();

            foreach ($request->input('answers') as $ans) {
                $questionId = $ans['questionId'];
                $studentText = $ans['student_text'] ?? null;

                if ($studentText !== null) {
                    // Optionally find matching choice ID by text (if needed)
                    $choice = Choice::where('question_id', $questionId)
                        ->where('choice_text', $studentText)
                        ->first();

                    ExamAnswer::create([
                        'attempt_id' => $examAttempt->id,
                        'question_id' => $questionId,
                        'choice_id' => $choice ? $choice->id : null,
                        'answer_text' => $studentText,
                    ]);
                }
            }

            return response()->json([
                'status' => 200,
                'message' => 'Answers saved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Failed to save answers',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Get enrollment data
    public function getEnrollmentData(Request $request)
    {
        try {
            // Optionally handle time range filter
            $timeRange = $request->input('time_range', 'month');
            $currentDate = now();

            // Get enrollments (excluding NULL started_at)
            $enrollments = ExamAttempt::whereNotNull('started_at')
                                      ->groupBy('exam_id')  // Group by exam_id to get enrollments per category
                                      ->selectRaw('exam_id, COUNT(DISTINCT user_id) as count')
                                      ->get();

            return response()->json([
                'status' => 200,
                'message' => 'Enrollment data fetched successfully',
                'data' => $enrollments,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching enrollment data',
                'error' => $e->getMessage(),
            ]);
        }
    }

    // Get average scores
    public function getAverageScores()
    {
        try {
            $averageScore = ExamAttempt::avg('score');  // Calculate the average score from all exam attempts
            return response()->json([
                'status' => 200,
                'message' => 'Average score fetched successfully',
                'data' => $averageScore,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Error fetching average score',
                'error' => $e->getMessage(),
            ]);
        }
    }
    // Get exam attempts for a specific student
public function getStudentExamAttempts(Request $request)
{
    $userId = $request->user()->id; // If using auth
    // $userId = $request->query('user_id'); // If passed manually

    try {
        $attempts = ExamAttempt::with(['exam'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($attempts, 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch student exam attempts',
            'error' => $e->getMessage(),
        ], 500);
    }
}

}
