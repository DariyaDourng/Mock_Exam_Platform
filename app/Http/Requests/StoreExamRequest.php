<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
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
            'name' => 'required|string|max:255|unique:exams,name',
            'category_id'=> 'required|exists:categories,id',
            'description'=> 'nullable|string',
            'duration' => 'required|integer|min:1',
            'total_questions' => 'sometimes|required|integer|min:1',
            // 'passing_score' => ' required|integer|min:1',
            'is_active' => 'boolean'
        ];
    }
}
