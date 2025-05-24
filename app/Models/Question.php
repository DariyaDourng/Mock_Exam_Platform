<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['question_text', 'subject_id', 'type'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function choices()
    {
        return $this->hasMany(Choice::class);
    }

    public function exams() {
    return $this->belongsToMany(Exam::class);
}


        protected static function booted()
    {
        static::deleting(function ($question) {
            $question->choices()->delete();
        });
    }

}
