<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use App\Http\Resources\QuestionResource;
use App\Models\Question;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\Storage;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::with(['category', 'choices'])->latest()->get();

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
        \Log::info('Store method hit!');
        try {
            // Decode choices JSON string if present
            if ($request->has('choices') && is_string($request->choices)) {
                $decoded = json_decode($request->choices, true);
                if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Invalid JSON format for choices.',
                    ], 422);
                }
                $request->merge(['choices' => $decoded]);
            }

            $data = $request->validated();

            // Validate at least one correct answer
            $correctAnswers = collect($data['choices'])->where('is_correct', true)->count();
            if ($correctAnswers < 1) {
                return response()->json([
                    'status' => 422,
                    'message' => 'Please select at least one correct answer.',
                ], 422);
            }

            // Handle image upload if format is image
            // $imagePath = null;
            // if (($data['format'] ?? null) === 'image' && $request->hasFile('question_image')) {
            //     // $imagePath = $request->file('question_image')->store('questions', 'public');
            //     $imagePath = Cloudinary::upload($request->file('question_image')->getRealPath(),[

            //         'folder' => 'mock-exam/questions',
            //         'resource_type' => 'auto',
            //     ])->getSecurePath();
            // }
            $imagePath = null;
            if (($data['format'] ?? null) === 'image' && $request->hasFile('question_image')) {
                $imagePath = $request->file('question_image')->store('questions/images', 'public');
            }
            // Create question
            $question = Question::create([
                'category_id' => $data['category_id'],
                'type' => $data['type'],
                'format' => $data['format'],
                'question_text' => $data['format'] === 'text' ? $data['question_text'] : null,
                'question_image' => $imagePath,
                'points' => $data['points'] ?? 1,
                'explanation' => $data['explanation'] ?? null,
            ]);
            // Create choices
            foreach ($data['choices'] as $choice) {
                $question->choices()->create($choice);
            }

            return response()->json([
                'status' => 200,
                'message' => 'Question created successfully',
                'data' => new QuestionResource($question->load(['category', 'choices'])),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Question $question)
    {
        return new QuestionResource($question->load(['category', 'choices']));
    }

    public function update(UpdateQuestionRequest $request, Question $question)
    {
        try {
            // Decode choices JSON string if present
            if ($request->has('choices') && is_string($request->choices)) {
                $decoded = json_decode($request->choices, true);
                if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Invalid JSON format for choices.',
                    ], 422);
                }
                $request->merge(['choices' => $decoded]);
            }

            $data = $request->validated();

            // Validate at least one correct answer if choices provided
            if (! empty($data['choices'])) {
                $correctAnswers = collect($data['choices'])->where('is_correct', true)->count();
                if ($correctAnswers < 1) {
                    return response()->json([
                        'status' => 422,
                        'message' => 'Please select at least one correct answer.',
                    ], 422);
                }
            }

            // Handle image update if format is image
            if (($data['format'] ?? null) === 'image' && $request->hasFile('question_image')) {
                // Delete old image
                if ($question->question_image) {
                    Storage::disk('public')->delete($question->question_image);
                }
                $imagePath = $request->file('question_image')->store('questions', 'public');
                $question->question_image = $imagePath;
            } elseif (($data['format'] ?? null) === 'text') {
                // Delete old image if switching to text format
                if ($question->question_image) {
                    Storage::disk('public')->delete($question->question_image);
                    $question->question_image = null;
                }
            }

            // Update question fields
            $question->category_id = $data['category_id'] ?? $question->category_id;
            $question->type = $data['type'] ?? $question->type;
            $question->format = $data['format'] ?? $question->format ?? null;
            $question->question_text = ($data['format'] === 'text' && isset($data['question_text'])) ? $data['question_text'] : $question->question_text;
            $question->points = $data['points'] ?? $question->points;
            $question->explanation = $data['explanation'] ?? $question->explanation;

            $question->save();

            // Update choices if provided
            if (! empty($data['choices'])) {
                // Delete old choices
                $question->choices()->delete();

                // Add new choices
                foreach ($data['choices'] as $choice) {
                    $question->choices()->create($choice);
                }
            }

            return response()->json([
                'status' => 200,
                'message' => 'Question updated successfully',
                'data' => new QuestionResource($question->load(['category', 'choices'])),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Question $question)
    {
        try {
            // Delete image if exists
            if ($question->question_image) {
                Storage::disk('public')->delete($question->question_image);
            }
            $question->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Question deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
