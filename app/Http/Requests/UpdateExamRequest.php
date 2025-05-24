<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExamRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
            return [
            'name' => 'sometimes|required|string|max:255',
            'subject_id' => 'sometimes|required|exists:subjects,id',
            'description' => 'nullable|string',
            'duration' => 'sometimes|required|integer|min:1',
            'total_questions' => 'sometimes|required|integer|min:1',
            'passing_score' => 'sometimes|required|integer|min:0|max:100',
            'is_active' => 'sometimes|boolean'
        ];
        
    }
}
