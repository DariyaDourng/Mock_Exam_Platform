<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamAttemptRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust authorization logic as needed
    }

    public function rules()
    {
        return [
            'exam_id' => ['required', 'exists:exams,id'],
            'user_id' => ['required', 'exists:users,id'],
            'started_at' => ['nullable', 'date'],
            'submitted_at' => ['nullable', 'date'],
            'score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'status' => ['required', 'in:in_progress,submitted,graded'],

            // Add these for answers validation:
            'answers' => ['required', 'array'],
            'answers.*.questionId' => ['required', 'exists:questions,id'],
            'answers.*.choiceId' => ['nullable', 'exists:choices,id'],
            'answers.*.answer' => ['nullable'], // adjust if you expect string, array, or both
        ];
    }
}
