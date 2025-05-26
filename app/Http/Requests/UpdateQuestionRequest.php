<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateQuestionRequest extends FormRequest
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
    'subject_id' => ['sometimes', 'exists:subjects,id'],
    'type' => ['sometimes', 'in:single-choice,multiple-choice,true-false'],
    'format' => ['sometimes', 'in:text,image'],
    'question_text' => ['sometimes', 'required_if:format,text', 'string', 'nullable'],
    'question_image' => ['sometimes', 'required_if:format,image', 'image', 'max:5120', 'nullable'],
    'points' => ['sometimes', 'numeric', 'min:0.5', 'max:100'],
    'explanation' => ['nullable', 'string'],
    'choices' => ['sometimes', 'array', 'min:2', 'max:8'],
    'choices.*.choice_text' => ['required_with:choices', 'string'],
    'choices.*.is_correct' => ['required_with:choices', 'boolean'],
];

    }
    protected function prepareForValidation()
{
    if ($this->has('choices') && is_string($this->choices)) {
        $decoded = json_decode($this->choices, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $this->merge([
                'choices' => $decoded,
            ]);
        }
    }
}

}
