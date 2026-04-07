<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamAttempt;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class LeaderBoardController extends Controller
{
    public function fullLeaderboard()
{
    // Get all categories
    $categories = Category::all();

    // Prepare leaderboard results for each category
    $results = $categories->map(function ($category) {
        // Get all exam IDs for the category
        $examIds = Exam::where('category_id', $category->id)->pluck('id');

        // Get the highest score across all attempts for each user
        $topUsers = ExamAttempt::select('user_id', 
            DB::raw('MAX(score) as highest_score'))  // Get the highest score across all attempts
            ->whereIn('exam_id', $examIds)
            ->groupBy('user_id')
            ->orderByDesc('highest_score')  // Sort by highest score
            ->limit(10) // Use limit instead of get(10)
            ->get();

        // Prepare the leaderboard for the top users
        $leaderboard = $topUsers->map(function ($item) use ($examIds, $category) {
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

            // Get the total number of attempts for the user in this category
            $testsCount = ExamAttempt::where('user_id', $item->user_id)
                ->whereIn('exam_id', $examIds)
                ->count();

            // Clean highest score (rounded string)
            $highestScore = $this->cleanScore($item->highest_score);
            
            // Get the total score for the exam attempt (max total_scores for this exam)
            $totalScore = ExamAttempt::where('exam_id', $latestAttempt->exam_id)->max('total_scores');
            
            // Scale highest score to 100-point scale
            $scaledScore = $this->scaleTo100($item->highest_score, $totalScore);

            // ---- Duration calculation fix starts here ----

            // Assume duration_seconds holds total duration in seconds (if your DB stores it differently, adjust accordingly)
            $totalSeconds = intval($latestAttempt->duration_seconds ?? 0);

            // Convert total seconds into minutes and seconds
            $minutes = intdiv($totalSeconds, 60);
            $seconds = $totalSeconds % 60;

            // Format with leading zeros
            $minutesFormatted = str_pad($minutes, 2, '0', STR_PAD_LEFT);
            $secondsFormatted = str_pad($seconds, 2, '0', STR_PAD_LEFT);

            $duration = "{$minutesFormatted}:{$secondsFormatted}";

            // ---- Duration calculation fix ends here ----

            // Construct the leaderboard entry
            return [
                'user_id' => $item->user_id,
                'user_name' => $latestAttempt->user->name ?? 'Unknown',
                'highest_score' => $scaledScore,  // Display highest score on 100 scale
                'score_raw' => "{$highestScore}/{$highestScore}",  // Display raw highest score
                'tests' => $testsCount,
                'date' => $latestAttempt?->date_time_finish
                    ? Carbon::parse($latestAttempt->date_time_finish)->toDateString()
                    : null,
                'duration' => $duration,  // Use fixed formatted duration string
            ];
        })->filter();  // Remove null entries if any

        return [
            'category_id' => $category->id,
            'category_name' => $category->name,
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


    