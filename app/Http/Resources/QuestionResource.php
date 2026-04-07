<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'category_name' => $this->category?->name,
            'type' => $this->type,
            'format' => $this->format,
            'question_text' => $this->question_text,
            'question_image' => $this->question_image 
                ? asset('storage/' . $this->question_image) 
                : null,
            'points' => $this->points,
            'explanation' => $this->explanation,
            'choices' => ChoiceResource::collection($this->whenLoaded('choices')),
            'created_at' => $this->created_at?->toDateTimeString(),  // Format date/time as string
            // 'updated_at' => $this->updated_at?->toDateTimeString(),
        ];
    }
}
