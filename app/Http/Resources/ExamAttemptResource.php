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
            'started_at' => $this->started_at,
            'submitted_at' => $this->submitted_at ?? null,
            // 'score' => $this->score !== null ? round($this->score, 2) : null,
            'score' => $this->score,
            'status' => $this->status,
            'answers' => ExamAnswerResource::collection($this->whenLoaded('answers')),
            'total_points'=> $this->total_points,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
