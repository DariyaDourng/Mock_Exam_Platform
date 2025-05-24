<?php
namespace App\Http\Controllers;

use App\Models\Exam;
use App\Http\Requests\ExamRequest;
use App\Http\Requests\StoreExamRequest;
use App\Http\Requests\UpdateExamRequest;
use App\Http\Resources\ExamResource;
use App\Models\Question;
use App\Models\Subject;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ExamController extends Controller
{
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

// public function show(Exam $exam)
// {
//     $exam->load('subject', 'questions.choice_text');
//     return new ExamResource($exam);
// }

public function show($id)
{
    try {
        $exam = Exam::with('exam', 'questions.choices')->findOrFail($id);
        return new ExamResource($exam);
    } catch (ModelNotFoundException $e) {
        return response()->json(['message' => 'Exam not found'], 404);
    }
}


public function showQuestion(Subject $subject, Question $question)
{
    // Check if the question belongs to the exam
    if ($question->subject_id !== $subject->id) {
        return response()->json(['message' => 'Question does not belong to this exam'], 404);
    }

    // Optionally load relations like choices
    $question->load('choices'); // or whatever relation you have

    return response()->json(['data' => $question]);
}

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
}
