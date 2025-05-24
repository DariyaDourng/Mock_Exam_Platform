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
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);
        return [
            'id'=> $this->id,
            'name'=> $this->name,
            'description' => $this->description,
            'subject_id'=>$this->subject_id,
            'subject_name' => $this->subject?->name,
            'duration'=> $this->duration,
            'total_questions'=>$this->total_questions,
            'is_active'=>$this->is_active,
            'created_at'=>$this->created_at,
    

        ];
    }
}
