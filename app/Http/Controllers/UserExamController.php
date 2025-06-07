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
        // Ensure the user is authenticated
        $user = $request->user();

        // Get the exams the user has attempted along with the subject information
        $subjects = ExamAttempt::where('user_id', $user->id)
            ->join('exams', 'exam_attempts.exam_id', '=', 'exams.id')  // Join exams table
            ->join('subjects', 'exams.subject_id', '=', 'subjects.id') // Join subjects table
            ->select('subjects.id as subject_id', 'subjects.name as subject_name')  // Select subject info
            ->distinct()  // Ensure we only get distinct subjects
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'User attempted subjects fetched successfully',
            'data' => $subjects,
        ]);
    }
}
