<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Exam extends Model

{
    use HasFactory;

    protected $fillable=[
        'name',
        'subject_id',
        'description',
        'duration',
        'total_questions',
        'passing_score',
        'is_active'
    ];

    public function subject(){
        return $this->belongsTo(Subject::class);
    }

    public function questions(){
        return $this->belongsToMany(Question::class, 'exam_question');
    }

    public function attempts(){
        return $this->hasMany(Exam::class);
    }


}