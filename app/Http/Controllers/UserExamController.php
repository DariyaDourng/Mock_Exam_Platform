<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Illuminate\Http\Request;

class UserExamController extends Controller
{
    /**
     * Get the list of categories the user has attempted.
     */
    public function userExams(Request $request)
{
    $user = $request->user();

    $categories = ExamAttempt::where('user_id', $user->id)
        ->join('exams', 'exam_attempts.exam_id', '=', 'exams.id')
        ->join('categories', 'exams.category_id', '=', 'categories.id')
        ->select('categories.id as category_id', 'categories.name as category_name')
        ->distinct()
        ->get();

    return response()->json([
        'status' => 200,
        'message' => 'User attempted categories fetched successfully',
        'data' => $categories,
    ]);
}


}
