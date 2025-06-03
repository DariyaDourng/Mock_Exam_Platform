<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamAttemptRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'started_at' => ['nullable', 'date'],
            'score' => ['nullable', 'numeric', 'between:0,999.99'],
            'total_points' => ['nullable', 'numeric', 'between:0,999.99'],
            'status' => ['nullable', 'in:in_progress,submitted,graded'],
        ];
    }
}
