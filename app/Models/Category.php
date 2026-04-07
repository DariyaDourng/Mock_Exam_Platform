<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{

    use HasFactory;
    protected $table = 'categories';

    protected $fillable =[
        'name',
        'description',
        'category_image',
        'is_active',

    ];

    public function exam(){

        return $this->hasMany(Exam::class);
    }

     public function exams()
    {
        // Assuming you have a many-to-many relationship through a pivot table
        return $this->belongsToMany(Exam::class, 'students_exams', 'category_id', 'exam_id');
    }

    
}
