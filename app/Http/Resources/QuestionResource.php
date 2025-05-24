<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);

         return [
            'id' => $this->id,
            'question_text' => $this->question_text,
            'subject_id' => $this->subject_id,
            'subject_name'=> $this->subject?->name,
            'type' => $this->type,
            'choices' => ChoiceResource::collection($this->whenLoaded('choices')),
            'created_at' => $this->created_at,
         
        ];
    }
}
