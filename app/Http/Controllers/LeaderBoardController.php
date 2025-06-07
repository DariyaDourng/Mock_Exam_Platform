<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Illuminate\Http\Request;

class LeaderBoardController extends Controller
{
public function leaderboard($subjectId)
{
    // Get the leaderboard, grouped by user_id and sorted by highest score
    $leaderboard = ExamAttempt::selectRaw('user_id, MAX(score) as highest_score')  // Use MAX to get the highest score for each user
        ->with('user') // Eager load the user details
        ->whereIn('exam_id', function($query) use ($subjectId) {
            $query->select('id')
                ->from('exams')
                ->where('subject_id', $subjectId);  // Filter exams by subject_id
        })
        ->groupBy('user_id')  // Group by user_id to get a single result per user
        ->orderByDesc('highest_score')  // Sort by highest score
        ->limit(10)  // Limit to top 10 users
        ->get();

    // Map the leaderboard to include user name and highest score
    $leaderboardData = $leaderboard->map(function($attempt) {
        return [
            'user_id' => $attempt->user_id,
            'user_name' => $attempt->user->name,
            'highest_score' => (float)$attempt->highest_score,  // Cast the highest score to a float for numeric value
        ];
    });

    return response()->json([
        'status' => 200,
        'message' => 'Leaderboard fetched successfully',
        'data' => $leaderboardData
    ]);
}


}
