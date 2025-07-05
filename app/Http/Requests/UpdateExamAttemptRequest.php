<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamAttemptRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust authorization logic as needed
    }

    public function rules()
    {
        return [
            'date_time_taken' => ['nullable', 'date_format:Y-m-d H:i:s'], // added
            'date_time_finish' => ['nullable', 'date_format:Y-m-d H:i:s'], // added
            'duration_minutes' => ['nullable', 'integer', 'min:0'], // added
            'duration_seconds' => ['nullable', 'integer', 'min:0'], // added
            'score' => ['nullable', 'numeric', 'between:0,999.99'],
            'total_scores' => ['nullable', 'numeric', 'between:0,999.99'], // added validation for total_scores
            'status' => ['nullable', 'in:in_progress,submitted,graded'],
        ];
    }
}
