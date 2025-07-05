<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChoiceController;
use App\Http\Controllers\ExamAttemptController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\LeaderBoardController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\UserExamController;
use App\Models\Subject;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\URL;
use App\Models\User;

// Email verification route
Route::get('/email/verify/{id}/{hash}', function ($id, $hash, Request $request) {
    $user = User::findOrFail($id);

    if (!hash_equals(sha1($user->getEmailForVerification()), $hash)) {
        abort(403, 'Invalid verification link.');
    }

    if ($user->hasVerifiedEmail()) {
        return redirect('http://localhost:3000/login?already_verified=1');
    }

    $user->markEmailAsVerified();
    event(new Verified($user));

    return redirect('http://localhost:3000/login?verified=1');
})->middleware(['signed'])->name('verification.verify');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        // Only verified users can access
    });
});

Route::post('/check-email', function (Request $request) {
    $request->validate(['email' => 'required|email']);
    $exists = \App\Models\User::where('email', $request->email)->exists();
    return response()->json(['exists' => $exists]);
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::get('/roles', 'roles');
    // OTP routes could be here
});

Route::post('/sendOTP', [AuthController::class, 'sendOTP']);
Route::post('/verifyOTP', [AuthController::class, 'verifyOTP']);
Route::post('/resetpassword', [AuthController::class, 'newPassword']);

Route::post('/email/resend', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.']);
    }
    $request->user()->sendEmailVerificationNotification();
    return response()->json(['message' => 'Verification email sent.']);
})->middleware(['auth:api'])->name('verification.send');

Route::middleware(['auth:api'])->group(function () {

    Route::controller(AuthController::class)->group(function () {
        Route::get('/profile', 'profile');
        Route::post('/profile/update', 'update_profile');
        Route::post('/logout', 'logout');
    });

    Route::controller(UserController::class)->group(function () {
        Route::get('/user/lists', 'index');
        Route::post('/user/create', 'create');
        Route::get('/user/{id}/edit', 'getById');
        Route::post('/user/{id}/update', 'update');
        Route::delete('/user/{id}/delete', 'delete');
        Route::get('/user/search', 'search');
    });

    Route::controller(RoleController::class)->group(function () {
        Route::get('/roles/lists', 'index');
        Route::post('/roles/create', 'store');
        Route::get('/roles/{id}/edit', 'show');
        Route::post('/roles/{id}/update', 'update');
        Route::delete('/roles/{id}/delete', 'destroy');
        Route::get('/roles/search', 'search');
    });
});

// Subject Routes
Route::post('/subjects', [SubjectController::class, 'store']);
Route::get('/subjects/{subject}', [SubjectController::class, 'show']);
Route::get('/subjects', [SubjectController::class, 'index']);
Route::put('/subjects/{subject}', [SubjectController::class, 'update']);
Route::delete('/subjects/{subject}', [SubjectController::class, 'destroy']);

// Exam Routes
Route::post('exams', [ExamController::class, 'store']);
Route::get('exams/{exam}', [ExamController::class, 'show']);
Route::get('exams', [ExamController::class, 'index']);
Route::put('exams/{exam}', [ExamController::class, 'update']);
Route::delete('exams/{exam}', [ExamController::class, 'destroy']);

// Question Routes
 Route::apiResource('questions', QuestionController::class);

// Route::get('/questions', [QuestionController::class, 'show']);

// Delete a question from an exam
Route::delete('/exams/{exam}/questions/{question}', [ExamController::class, 'removeQuestionFromExam']);

// Choice Routes
Route::get('/choices', [ChoiceController::class, 'index']);
Route::get('/choices/{choice}', [ChoiceController::class, 'show']);
Route::delete('/choices/{choice}', [ChoiceController::class, 'destroy']);
Route::get('/questions/{question}/choices', [ChoiceController::class, 'choicesByQuestion']);
Route::post('/questions/{question}/choices', [ChoiceController::class, 'storeOrUpdateChoices']);

// Category Routes
Route::apiResource('categories', CategoryController::class);

// Exam Questions Management
Route::post('/exams/{exam}/questions', [ExamController::class, 'addQuestions']);
Route::get('/exams/{exam}/questions/{question}', [ExamController::class, 'showQuestion']);
Route::get('/exams/{exam}/questions', [ExamController::class, 'showQuestions']);

// Redundant exam show route (already declared above, you can remove one if duplicated)
Route::get('/exams/{exam}', [ExamController::class, 'show']);

// School Routes
Route::apiResource('schools', SchoolController::class);

// Route::apiResource('exam-attempts', ExamAttemptController::class);

// // Add a POST route to save answers separately (optional)
// Route::post('exam-attempts/{examAttempt}/answers', [ExamAttemptController::class, 'saveAnswers']);

Route::middleware('auth:api')->group(function () {
    
});
Route::apiResource('exam-attempts', ExamAttemptController::class);
Route::post('/exam-attempts', [ExamAttemptController::class, 'store']);
Route::post('exam-attempts/{examAttempt}/answers', [ExamAttemptController::class, 'saveAnswers']);
Route::post('/exam-attempts/{examAttempt}/grade', [ExamAttemptController::class, 'gradeExamAttempt']);

Route::get('/exam-attempts/{id}', [ExamAttemptController::class, 'show']);



Route::middleware('auth:api')->get('/user', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'name' => $request->user()->name,
        'email' => $request->user()->email,
        // add other user fields you need here
    ]);
});

// Route::get('/leaderboard/{subjectId}', [LeaderBoardController::class, 'leaderboard']);

Route::get('/leaderboard', [LeaderBoardController::class, 'fullLeaderboard']);

// Route::get('/user-exams', [UserExamController::class, 'userExams']);

Route::get('/user-exams', [UserExamController::class, 'userExams']);

Route::get('/enrollments', [ExamAttemptController::class, 'getEnrollmentData']);
Route::get('/students', [UserController::class, 'getTotalStudents']);
Route::get('/average-scores', [ExamAttemptController::class, 'getAverageScores']);
Route::get('/totalsubjects', [SubjectController::class, 'getTotalSubjects']);
Route::get('/countExams', [ExamController::class, 'getTotalExams']);
Route::get('/student', [UserController::class, 'getStudents']);

Route::post('/questions', [QuestionController::class, 'store']);

Route::get('subjects/{subject}/student-and-exam-count', [SubjectController::class, 'getStudentAndExamCount']);
