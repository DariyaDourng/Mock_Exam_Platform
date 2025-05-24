<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
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
            'subject_id' => 'nullable|exists:subjects,id',
            'question_text' => 'required|string|max:1000',
            'type' => 'required|string|in:multiple_choice,true_false',
            'choices' => 'required|array|min:2',
            'choices.*.choice_text' => 'required|string|max:500',
            'choices.*.is_correct' => 'required|boolean',

        ];
    }
}
