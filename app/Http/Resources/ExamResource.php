<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    // public function toArray(Request $request): array
    // {
    //     return [
    //         'id'=> $this->id,
    //         'name'=> $this->name,
    //         'description' => $this->description,
    //         'category_id'=> $this->category_id,
    //         'category_name' => $this->category?->name,
    //         'duration'=> $this->duration,
    //         'total_questions'=> $this->total_questions,
    //         'is_active'=> $this->is_active,
    //         'created_at'=> $this->created_at,

    //         // Include questions with their choices and question_text + question_image
    //         'questions' => $this->whenLoaded('questions', function () {
    //             return $this->questions->map(function ($question) {
    //                 return [
    //                     'id' => $question->id,
    //                     'question_text' => $question->question_text,    // text content
    //                     'question_image' => $question->question_image,  // image URL or path (nullable)
    //                     'choices' => $question->choices->map(function ($choice) {
    //                         return [
    //                             'id' => $choice->id,
    //                             'choice_text' => $choice->choice_text,
    //                             'is_correct' => $choice->is_correct,
    //                         ];
    //                     }),
    //                 ];
    //             });
    //         }),
    //     ];
    // }

    public function toArray(Request $request): array
{
    return [
        'id'=> $this->id,
        'name'=> $this->name,
        'description' => $this->description,
        'category_id'=> $this->category_id,
        'category_name' => $this->category?->name,
        'duration'=> $this->duration,
        'total_questions'=> $this->total_questions,
        'is_active'=> $this->is_active,
        'created_at'=> $this->created_at,

        // Include questions with their choices and question_text + question_image (full URL)
        'questions' => $this->whenLoaded('questions', function () {
            return $this->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'type'=>$question->type,
                    'points'=>$question->points,
                    'question_text' => $question->question_text,
                     'question_image' => $question->question_image 
                ? asset('storage/' . $question->question_image) 
                : null,
                    'choices' => $question->choices->map(function ($choice) {
                        return [
                            'id' => $choice->id,
                            'choice_text' => $choice->choice_text,
                            'is_correct' => $choice->is_correct,
                        ];
                    }),
                ];
            });
        }),
    ];
}

}
