<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('exam_question', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete(); // Links to the exam
            $table->foreignId('question_id')->constrained()->cascadeOnDelete(); // Links to the question
            $table->integer('question_order')->nullable(); // Stores order of questions in the exam
            $table->decimal('question_weight', 5, 2)->nullable(); // prevent duplicates
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_question');
    }
};
