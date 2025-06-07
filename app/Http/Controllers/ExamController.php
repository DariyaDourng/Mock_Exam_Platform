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

    // Create new exam
    public function store(StoreExamRequest $request)
    {
        try {
            $exam = Exam::create($request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Exam created successfully',
                'data' => new ExamResource($exam)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Show exam with subject and questions + choices
    public function show($id)
    {
        try {
            $exam = Exam::with('subject', 'questions.choices')->findOrFail($id);
            return new ExamResource($exam);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Exam not found'], 404);
        }
    }

    // Show specific question of exam with choices
    public function showQuestion(Exam $exam, Question $question)
    {
        $belongs = $exam->questions()->where('questions.id', $question->id)->exists();

        if (!$belongs) {
            return response()->json(['message' => 'Question does not belong to this exam'], 404);
        }

        $question->load('choices');

        return response()->json(['data' => $question]);
    }

    // Show all questions of an exam with choices
    public function showQuestions(Exam $exam)
    {
        $questions = $exam->questions()->with('choices')->get();

        return response()->json([
            'status' => 200,
            'data' => $questions,
        ]);
    }

    // Update exam data
    public function update(UpdateExamRequest $request, Exam $exam)
    {
        try {
            $exam->update($request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Exam updated successfully',
                'data' => new ExamResource($exam)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Add questions to exam (many-to-many sync without detaching)
    public function addQuestions(Request $request, Exam $exam)
    {
        $request->validate([
            'question_ids' => 'required|array',
            'question_ids.*' => 'exists:questions,id',
        ]);

        $exam->questions()->syncWithoutDetaching($request->question_ids);

        return response()->json([
            'message' => 'Questions added to exam successfully.',
            'questions' => $exam->questions()->get(),
        ]);
    }

    // Remove a question from exam (optional - if implemented)
    public function removeQuestionFromExam(Exam $exam, Question $question)
    {
        $exam->questions()->detach($question->id);

        return response()->json([
            'message' => 'Question removed from exam successfully.',
        ]);
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
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // In your ExamController.php
public function getAverageScores()
{
    $averageScores = Exam::avg('score');  // Calculate average score across exams
    return response()->json([
        'status' => 200,
        'message' => 'Average score fetched successfully',
        'data' => $averageScores,
    ]);
    
}

   public function getTotalExams()
{
    $totalExams = Exam::count();  // Or any other logic to count courses
    return response()->json([
        'status' => 200,
        'message' => 'Total exams fetched successfully',
        'data' => $totalExams,
    ]);
}
}
