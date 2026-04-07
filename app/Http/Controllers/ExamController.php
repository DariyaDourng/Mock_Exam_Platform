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
    // List all exams with their categories
    public function index()
    {
        $exams = Exam::with('category')->latest()->get();

        if ($exams->count() > 0) {
            return ExamResource::collection($exams);
        }

        return response()->json([
            'status' => 200,
            'message' => 'No exams found',
        ], 200);
    }

    // Create new exam with random questions based on category
    public function store(StoreExamRequest $request)
    {
        try {
            $validated = $request->validated();

            // Check if there are enough questions available
            $totalQuestions = Question::where('category_id', $validated['category_id'])->count();
            if ($totalQuestions < $validated['total_questions']) {
                return response()->json([
                    'status' => 422,
                    'message' => 'Not enough questions available in the selected category.',
                ], 422);
            }

            // Create the exam
            $exam = Exam::create([
               'name' => $validated['name'],
                'category_id' => $validated['category_id'],
                'description' => $validated['description'] ?? null,
                'duration' => $validated['duration'] ?? null,
                'total_questions' => $validated['total_questions'],
                // 'passing_score' => $validated['passing_score'],
                'is_active' => $validated['is_active'] ?? 1,
            ]);

            // Fetch random questions based on category and required number of questions
            $questions = Question::where('category_id', $validated['category_id'])
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
        // Retrieve the exam along with questions and their choices, including the category name
        $exam = Exam::with(['questions' => function ($query) {
            $query->inRandomOrder(); // Randomize the order of questions
        }, 'questions.choices', 'questions.category']) // Assuming `questions` has a relationship to `category`
            ->findOrFail($examId);

        // Include the category name directly in the response
        $questionsWithCategoryName = $exam->questions->map(function ($question) {
            // Adding category_name directly to each question
            $question->category_name = $question->category ? $question->category->name : null;
            return $question;
        });

        // Return the randomized questions with choices and category names
        return response()->json([
            'status' => 200,
            'data' => $questionsWithCategoryName, // Return the randomized questions with the category name
        ]);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Exam not found'], 404);
    }
}


    // Show exam by ID
    public function show($id)
    {
        try {
            $exam = Exam::with(['category', 'questions.choices'])->findOrFail($id);
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
