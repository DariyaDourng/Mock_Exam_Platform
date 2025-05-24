<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subject extends Model
{

    use HasFactory;
    protected $table = 'subjects';

    protected $fillable =[
        'name',
        'description',
        'subject_image',
        'is_active',

    ];

    public function exam(){

        return $this->hasMany(Exam::class);
    }

    
}
