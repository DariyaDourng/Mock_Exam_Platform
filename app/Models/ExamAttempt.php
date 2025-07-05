<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamAttempt extends Model
{
    use HasFactory;

    // Add the new fields to the $fillable property
    protected $fillable = [
        'exam_id',
        'user_id',
        'status',
        'score',
        'date_time_taken',   // added
        'date_time_finish',  // added
        'duration_minutes',  // added
        'duration_seconds',  // added
        'total_scores',      // added
    ];

    // Cast the date fields to datetime for proper handling
    protected $casts = [
        'date_time_taken' => 'datetime',   // added for date casting
        'date_time_finish' => 'datetime',  // added for date casting
    ];

    // Relationships
    public function exam()
    {
        return $this->belongsTo(Exam::class, 'exam_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function answers()
    {
        return $this->hasMany(ExamAnswer::class, 'attempt_id');
    }
}
