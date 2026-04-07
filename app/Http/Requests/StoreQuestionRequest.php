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
              'category_id' => ['required', 'exists:categories,id'],
            'type' => ['required', 'in:single-choice,multiple-choice,true-false'],
            'format' => ['required', 'in:text,image'],
            'question_text' => ['required_if:format,text', 'nullable', 'string'],
            'question_image' => ['required_if:format,image', 'nullable', 'image', 'max:5120'], // max 5MB
            'points' => ['required', 'numeric', 'min:0.5', 'max:100'],
            'explanation' => ['nullable', 'string'],
            'choices' => ['required', 'array', 'min:2', 'max:8'],
            'choices.*.choice_text' => ['required', 'string'],
            'choices.*.is_correct' => ['required', 'boolean'],

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
