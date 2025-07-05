<?php

namespace App\Http\Controllers;

use App\Models\ExamAttempt;
use Illuminate\Http\Request;

class UserExamController extends Controller
{
    /**
     * Get the list of subjects the user has attempted.
     */
    public function userExams(Request $request)
{
    $user = $request->user();

    $subjects = ExamAttempt::where('user_id', $user->id)
        ->join('exams', 'exam_attempts.exam_id', '=', 'exams.id')
        ->join('subjects', 'exams.subject_id', '=', 'subjects.id')
        ->select('subjects.id as subject_id', 'subjects.name as subject_name')
        ->distinct()
        ->get();

    return response()->json([
        'status' => 200,
        'message' => 'User attempted subjects fetched successfully',
        'data' => $subjects,
    ]);
}


}
