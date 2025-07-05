<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class LeaderBoardController extends Controller
{
    public function fullLeaderboard()
    {
        // Get all subjects
        $subjects = Subject::all();

        // Prepare leaderboard results for each subject
        $results = $subjects->map(function ($subject) {
            // Get all exam IDs for the subject
            $examIds = Exam::where('subject_id', $subject->id)->pluck('id');

            // Get the highest score across all attempts for each user
            $topUsers = ExamAttempt::select('user_id', 
                DB::raw('MAX(score) as highest_score'))  // Get the highest score across all attempts
                ->whereIn('exam_id', $examIds)
                ->groupBy('user_id')
                ->orderByDesc('highest_score')  // Sort by highest score
                ->get();

            // Prepare the leaderboard for the top users
            $leaderboard = $topUsers->map(function ($item) use ($examIds, $subject) {
                // Get the most recent attempt for the user (for date and duration)
                $latestAttempt = ExamAttempt::where('user_id', $item->user_id)
                    ->whereIn('exam_id', $examIds)
                    ->latest('date_time_finish')  // Get the most recent attempt
                    ->with('user')
                    ->first();

                // If no latest attempt, skip this user
                if (!$latestAttempt) {
                    return null;
                }

                // Get the total number of attempts for the user in this subject
                $testsCount = ExamAttempt::where('user_id', $item->user_id)
                    ->whereIn('exam_id', $examIds)
                    ->count();

                // Get the highest score from all attempts, use it instead of the latest attempt's score
                $highestScore = $this->cleanScore($item->highest_score);
                
                // Get the total score for the exam attempt (total_scores from ExamAttempt)
                $totalScore = ExamAttempt::where('exam_id', $latestAttempt->exam_id)->max('total_scores');
                
                // Scale the score to 100 points
                $scaledScore = $this->scaleTo100($item->highest_score, $totalScore);

                // Get the duration for the most recent attempt, default to 0 if not set
                $minutes = str_pad($latestAttempt->duration_minutes ?? 0, 2, '0', STR_PAD_LEFT);
                $seconds = str_pad($latestAttempt->duration_seconds ?? 0, 2, '0', STR_PAD_LEFT);

                // Construct the leaderboard entry
                return [
                    'user_id' => $item->user_id,
                    'user_name' => $latestAttempt->user->name ?? 'Unknown',
                    'highest_score' => $scaledScore,  // Display highest score on 100 scale
                    'score_raw' => "{$highestScore}/{$highestScore}",  // Display score for the highest attempt
                    'tests' => $testsCount,
                    'date' => $latestAttempt?->date_time_finish
                        ? Carbon::parse($latestAttempt->date_time_finish)->toDateString()
                        : null,
                    'duration' => "{$minutes}:{$seconds}",  // Format duration as minutes:seconds
                ];
            })->filter();  // Remove null entries if any

            return [
                'subject_id' => $subject->id,
                'subject_name' => $subject->name,
                'leaderboard' => $leaderboard,
            ];
        });

        return response()->json([
            'status' => 200,
            'message' => 'Leaderboard fetched successfully',
            'data' => $results,
        ]);
    }

    // Helper function to clean score (rounding and formatting)
    private function cleanScore($value)
    {
        if (is_null($value)) return '0';

        // Round to 2 decimals and remove trailing zeros
        $formatted = number_format($value, 2, '.', '');

        // Remove trailing zeroes and dot if not needed
        return rtrim(rtrim($formatted, '0'), '.');
    }

    // Helper function to scale a score to a 100-point scale
    private function scaleTo100($score, $totalScore)
    {
        if ($totalScore == 0) return 0; // Avoid division by zero

        // Scale the score to 100
        return round(($score / $totalScore) * 100, 2);
    }
}


    