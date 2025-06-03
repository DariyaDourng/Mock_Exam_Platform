<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExamAnswerResource extends JsonResource
{
    public function toArray($request)
    {
        // Fetch correct answers texts for the question
        $correctAnswers = $this->question->choices()
            ->where('is_correct', true)
            ->pluck('choice_text')
            ->toArray();

        // Normalize correct answers for comparison
        $correctAnswersNormalized = array_map('trim', array_map('strtolower', $correctAnswers));
        sort($correctAnswersNormalized);

        // Decode student answer text (could be JSON array or plain string)
        $studentAnswerRaw = $this->answer_text;

        $decodedAnswers = json_decode($studentAnswerRaw, true);

        // If decoded is an array, map each choice ID or text to choice_text
        if (is_array($decodedAnswers)) {
            // Map choice IDs to choice texts if possible
            $choicesMap = $this->question->choices->pluck('choice_text', 'id')->toArray();

            $studentAnswers = array_map(function ($ans) use ($choicesMap) {
                // If $ans is numeric (choice id), convert to choice_text
                return isset($choicesMap[$ans]) ? $choicesMap[$ans] : $ans;
            }, $decodedAnswers);
        } else {
            // Not an array, treat as a single answer string
            $studentAnswers = [$studentAnswerRaw];
        }

        // Normalize student's answers for comparison
        $studentAnswersNormalized = array_map('trim', array_map('strtolower', $studentAnswers));
        sort($studentAnswersNormalized);

        // Determine correctness
        $isCorrect = ($studentAnswersNormalized === $correctAnswersNormalized);

        // Get points for the question (default 1 if not set)
        $totalPoints = $this->question->points ?? 1;

        // Calculate earned points based on correctness
        $earnedPoints = $isCorrect ? $totalPoints : 0;

        return [
            'id' => $this->id,
            'question_id' => $this->question_id,
            'question_text' => $this->question->question_text,
            'question_image' => $this->question->question_image 
                ? asset('storage/' . $this->question->question_image) 
                : null,
            // Join student answers as a string for frontend display
            'student_answer' => implode(', ', $studentAnswers),
            'correct_answers' => $correctAnswers,
            'points' => $totalPoints,
            'earned_points' => $earnedPoints,
            'status' => $isCorrect ? 'correct' : 'incorrect',
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
