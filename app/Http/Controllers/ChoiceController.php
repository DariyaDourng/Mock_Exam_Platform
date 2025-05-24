<?php

namespace App\Http\Controllers;

use App\Models\Choice;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Http\Resources\ChoiceResource;

class ChoiceController extends Controller
{
    // List all choices (optional endpoint)
    public function index()
    {
        $choices = Choice::latest()->get();

        if ($choices->count() > 0) {
            return ChoiceResource::collection($choices);
        }

        return response()->json([
            'status' => 200,
            'message' => 'No choices found',
        ], 200);
    }

    // Show a single choice
    public function show(Choice $choice)
    {
        return new ChoiceResource($choice);
    }

    // Get all choices for a specific question
    public function choicesByQuestion(Question $question)
    {
        $choices = $question->choices()->latest()->get();

        if ($choices->count() > 0) {
            return ChoiceResource::collection($choices);
        }

        return response()->json([
            'status' => 200,
            'message' => 'No choices found for this question',
        ], 200);
    }

    // Store or update choices in bulk for a specific question
    public function storeOrUpdateChoices(Request $request, Question $question)
    {
        $data = $request->validate([
            'choices' => 'required|array|min:2',
            'choices.*.choice_id' => 'sometimes|exists:choices,id',
            'choices.*.choice_text' => 'required|string|max:500',
            'choices.*.is_correct' => 'required|boolean',
        ]);

        // Enforce exactly one correct answer
        $correctCount = collect($data['choices'])->where('is_correct', true)->count();
        if ($correctCount !== 1) {
            return response()->json([
                'status' => false,
                'message' => 'There must be exactly one correct answer.',
            ], 422);
        }

        // Optional: clear existing choices first (if replacing all)
        $question->choices()->delete();

        $result = [];

        foreach ($data['choices'] as $choiceData) {
            $newChoice = $question->choices()->create([
                'choice_text' => $choiceData['choice_text'],
                'is_correct' => $choiceData['is_correct'],
            ]);

            $result[] = $newChoice;
        }

        return response()->json([
            'status' => 200,
            'message' => 'Choices stored/updated successfully',
            'data' => ChoiceResource::collection($result),
        ]);
    }

    // Delete a single choice
    public function destroy(Choice $choice)
    {
        try {
            $choice->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Choice deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
