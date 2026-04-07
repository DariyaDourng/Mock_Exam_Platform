<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;



class Exam extends Model

{
    use HasFactory;

    protected $fillable=[
        'name',
        'category_id',
        'description',
        'duration',
        'total_questions',
        'is_active',
    ];

    public function category(){
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function questions(){
        return $this->belongsToMany(Question::class, 'exam_question');
    }

    public function attempts(){
        return $this->hasMany(ExamAttempt::class);
    }


}