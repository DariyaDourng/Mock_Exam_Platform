<?php

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChoiceController;
use App\Http\Controllers\ExamController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\SubjectController;
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
Route::post('subjects', [SubjectController::class, 'store']);
Route::get('subjects/{subject}', [SubjectController::class, 'show']);
Route::get('subjects', [SubjectController::class, 'index']);
Route::put('subjects/{subject}', [SubjectController::class, 'update']);
Route::delete('subjects/{subject}', [SubjectController::class, 'destroy']);

// Exam Routes
Route::post('exams', [ExamController::class, 'store']);
Route::get('exams/{exam}', [ExamController::class, 'show']);
Route::get('exams', [ExamController::class, 'index']);
Route::put('exams/{exam}', [ExamController::class, 'update']);
Route::delete('exams/{exam}', [ExamController::class, 'destroy']);

// Question Routes
Route::apiResource('questions', QuestionController::class);

// If you want to delete a question from an exam, define a controller method in ExamController:
// Example: removeQuestionFromExam
Route::delete('/exams/{exam}/questions/{question}', [ExamController::class, 'removeQuestionFromExam']);

// Choice Routes
Route::get('/choices', [ChoiceController::class, 'index']);
Route::get('/choices/{choice}', [ChoiceController::class, 'show']);
Route::delete('/choices/{choice}', [ChoiceController::class, 'destroy']);
Route::get('/questions/{question}/choices', [ChoiceController::class, 'choicesByQuestion']);
Route::post('/questions/{question}/choices', [ChoiceController::class, 'storeOrUpdateChoices']);

// Category Routes
Route::apiResource('categories', CategoryController::class);

// School Routes
Route::apiResource('schools', SchoolController::class);
