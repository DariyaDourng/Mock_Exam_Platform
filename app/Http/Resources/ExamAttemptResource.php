<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamAttemptResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'exam' => [
                'id' => $this->exam->id,
                'name' => $this->exam->name,
                'duration' => $this->exam->duration,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'date_time_taken' => $this->date_time_taken,  // added
            'date_time_finish' => $this->date_time_finish ?? null, // added
            'duration_minutes' => $this->duration_minutes,  // added
            'duration_seconds' => $this->duration_seconds,  // added
            'score' => $this->score,
            'total_scores' => $this->total_scores,  // added
            'status' => $this->status,
            'answers' => ExamAnswerResource::collection($this->whenLoaded('answers')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
