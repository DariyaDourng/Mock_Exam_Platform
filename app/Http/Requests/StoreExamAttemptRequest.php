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
            'date_time_taken' => ['required', 'date_format:Y-m-d H:i:s'], // added
            'date_time_finish' => ['nullable', 'date_format:Y-m-d H:i:s'], // added
            'duration_minutes' => ['nullable', 'integer', 'min:0'], // added
            'duration_seconds' => ['nullable', 'integer', 'min:0'], // added
            'score' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'total_scores' => ['nullable', 'numeric', 'min:0'], // added validation for total_scores
            'status' => ['required', 'in:in_progress,submitted,graded'],

            // Answers validation
            'answers' => ['required', 'array'],
            'answers.*.questionId' => ['required', 'exists:questions,id'],
            'answers.*.choiceId' => ['nullable', 'exists:choices,id'],
            'answers.*.answer' => ['nullable'], // adjust if you expect string, array, or both
        ];
    }
}
