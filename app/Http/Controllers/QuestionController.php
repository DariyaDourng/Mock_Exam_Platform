<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::with(['subject', 'choices'])->latest()->get();

        if ($questions->count() > 0) {
            return QuestionResource::collection($questions);
        }

        return response()->json([
            'status' => 200,
            'message' => 'No questions found',
        ], 200);
    }

    public function store(StoreQuestionRequest $request)
    {
        try {
            $data = $request->validated();

            // Validate that exactly one choice is marked as correct
            $correctAnswers = collect($data['choices'])->where('is_correct', true)->count();
            if ($correctAnswers !== 1) {
                return response()->json([
                    'status' => false,
                    'message' => 'There must be exactly one correct answer.',
                ], 422);
            }

            // Create the question
            $question = Question::create([
                'subject_id' => $data['subject_id'],
                'question_text' => $data['question_text'],
                'type' => $data['type'],
            ]);

            // Create associated choices
            foreach ($data['choices'] as $choice) {
                $question->choices()->create($choice);
            }

            return response()->json([
                'status' => 200,
                'message' => 'Question created successfully',
                'data' => new QuestionResource($question->load(['subject', 'choices'])),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Question $question)
    {
        return new QuestionResource($question->load(['subject', 'choices']));
    }

    public function update(UpdateQuestionRequest $request, Question $question)
    {
        try {
            $data = $request->validated();

            // Update question data
            $question->update([
                'subject_id' => $data['subject_id'] ?? null,
                'question_text' => $data['question_text'],
            ]);

            // Optionally update choices (if included)
            if (!empty($data['choices'])) {
                // Delete old choices
                $question->choices()->delete();

                // Validate one correct choice
                $correctAnswers = collect($data['choices'])->where('is_correct', true)->count();
                if ($correctAnswers !== 1) {
                    return response()->json([
                        'status' => false,
                        'message' => 'There must be exactly one correct answer.',
                    ], 422);
                }

                // Add new choices
                foreach ($data['choices'] as $choice) {
                    $question->choices()->create($choice);
                }
            }

            return response()->json([
                'status' => 200,
                'message' => 'Question updated successfully',
                'data' => new QuestionResource($question->load(['subject', 'choices'])),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Question $question)
    {
        try {
            $question->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Question deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
