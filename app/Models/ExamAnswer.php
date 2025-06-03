<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAnswer extends Model
{
    use HasFactory;

    protected $fillable=['attempt_id', 'question_id', 'choice_id', 'answer_text'];

    public function attempt()
    {
        return $this->belongsTo(ExamAttempt::class, 'attempt_id');

    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'question_id');
    }

    public function choice()
    {
        return $this->belongsTo(Choice::class);
    }
}
