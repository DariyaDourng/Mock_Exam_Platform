<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    // The fillable attributes define which attributes can be mass-assigned
    protected $fillable = [
        'question_text',
        'category_id',
        'type',
        'format',
        'question_image',
        'points',
        'explanation',
    ];

    // Relationship with the Category model
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship with the Choice model (each question can have many choices)
    public function choices()
    {
        return $this->hasMany(Choice::class);
    }

    // Relationship with the Exam model (many-to-many relationship)
    public function exams()
    {
        return $this->belongsToMany(Exam::class);
    }

    // Automatically delete associated choices when a question is deleted
    protected static function booted()
    {
        static::deleting(function ($question) {
            // Delete associated choices when a question is deleted
            $question->choices()->delete();
        });
    }
}
