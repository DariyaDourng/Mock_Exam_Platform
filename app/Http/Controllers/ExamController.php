<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\Question;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Http\Resources\ExamResource;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    // List all exams with their subjects
    public function index()
    {
        $exams = Exam::with('subject')->latest()->get();

        if ($exams->count() > 0) {
            return ExamResource::collection($exams);
        }

        return response()->json([
            'status' => 200,
            'message' => 'No exams found',
        ], 200);
    }

    // Create new exam with random questions based on subject
    public function store(StoreExamRequest $request)
    {
        try {
            $validated = $request->validated();

            // Check if there are enough questions available
            $totalQuestions = Question::where('subject_id', $validated['subject_id'])->count();
            if ($totalQuestions < $validated['total_questions']) {
                return response()->json([
                    'status' => 422,
                    'message' => 'Not enough questions available in the selected subject.',
                ], 422);
            }

            // Create the exam
            $exam = Exam::create([
               'name' => $validated['name'],
                'subject_id' => $validated['subject_id'],
                'description' => $validated['description'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'total_questions' => $validated['total_questions'],
                // 'passing_score' => $validated['passing_score'],
                'is_active' => $validated['is_active'] ?? 1,
            ]);

            // Fetch random questions based on subject and required number of questions
            $questions = Question::where('subject_id', $validated['subject_id'])
                ->inRandomOrder()
                ->limit($validated['total_questions'])
                ->get();

            // Attach the random questions to the exam
            $exam->questions()->syncWithoutDetaching($questions->pluck('id'));

            return response()->json([
                'status' => 200,
                'message' => 'Exam created successfully with random questions',
                'data' => new ExamResource($exam),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Show all questions of an exam with choices (randomized)
  public function showQuestions($examId)
{
    try {
        // Retrieve the exam along with questions and their choices, including the subject name
        $exam = Exam::with(['questions' => function ($query) {
            $query->inRandomOrder(); // Randomize the order of questions
        }, 'questions.choices', 'questions.subject']) // Assuming `questions` has a relationship to `subject`
            ->findOrFail($examId);

        // Include the subject name directly in the response
        $questionsWithSubjectName = $exam->questions->map(function ($question) {
            // Adding subject_name directly to each question
            $question->subject_name = $question->subject ? $question->subject->name : null;
            return $question;
        });

        // Return the randomized questions with choices and subject names
        return response()->json([
            'status' => 200,
            'data' => $questionsWithSubjectName, // Return the randomized questions with the subject name
        ]);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Exam not found'], 404);
    }
}


    // Show exam by ID
    public function show($id)
    {
        try {
            $exam = Exam::with(['subject', 'questions.choices'])->findOrFail($id);
            return new ExamResource($exam);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Exam not found'], 404);
        }
    }

    // Update exam data
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        try {
            $exam->update($request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Exam updated successfully',
                'data' => new ExamResource($exam),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Delete exam
    public function destroy(Exam $exam)
    {
        try {
            $exam->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Exam deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Fetch the total number of exams
public function getTotalExams()
{
    $totalExams = Exam::count();  // Get the total number of exams
    return response()->json([
        'status' => 200,
        'message' => 'Total exams fetched successfully',
        'data' => $totalExams,
    ]);
}

}
