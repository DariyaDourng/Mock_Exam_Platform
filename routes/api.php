<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth)
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Public Auth Routes
|--------------------------------------------------------------------------
*/

use Illuminate\Support\Facades\Auth;


Route::post('/dev-login', function (Request $request) {
    $user = \App\Models\User::where('email', $request->email)->first();

    if (! $user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    // Issue token without password check
    $token = Auth::login($user);

    return response()->json([
        'token' => $token,
        'note' => 'Dev login: do not use in production.'
    ]);
});

Route::controller(AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::get('/roles', 'roles');

    // OTP-related routes
    Route::post('/sendOTP', 'sendOTP');
    Route::post('/verifyOTP', 'verifyOTP');
    Route::post('/newPassword', 'newPassword');
});

/*
|--------------------------------------------------------------------------
| Email Verification Routes
|--------------------------------------------------------------------------
*/

// ✅ When user clicks email verification link

Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();

    // ✅ Activate user
    $user = $request->user();
    $user->is_active = true;
    $user->save();

    return response()->json(['message' => 'Email verified successfully, account is now active.']);
})->middleware(['auth:api', 'signed'])->name('verification.verify');


// ✅ When user requests to resend the verification email
Route::post('/email/resend', function (Request $request) {
    if ($request->user()->hasVerifiedEmail()) {
        return response()->json(['message' => 'Email already verified.']);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => 'Verification email sent.']);
})->middleware(['auth:api'])->name('verification.send');

/*
|--------------------------------------------------------------------------
| Protected Routes (Require Auth)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:api'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authenticated User Actions
    |--------------------------------------------------------------------------
    */
    Route::controller(AuthController::class)->group(function () {
        Route::get('/profile', 'profile');
        Route::post('/profile/update', 'update_profile');
        Route::post('/logout', 'logout');
    });

    /*
    |--------------------------------------------------------------------------
    | User Management
    |--------------------------------------------------------------------------
    */
    Route::controller(UserController::class)->group(function () {
        Route::get('/user/lists', 'index');
        Route::post('/user/create', 'create');
        Route::get('/user/{id}/edit', 'getById');
        Route::post('/user/{id}/update', 'update');
        Route::delete('/user/{id}/delete', 'delete');
        Route::get('/user/search', 'search');
    });

    /*
    |--------------------------------------------------------------------------
    | Role Management
    |--------------------------------------------------------------------------
    */
    Route::controller(RoleController::class)->group(function () {
        Route::get('/roles/lists', 'index');
        Route::post('/roles/create', 'store');
        Route::get('/roles/{id}/edit', 'show');
        Route::post('/roles/{id}/update', 'update');
        Route::delete('/roles/{id}/delete', 'destroy');
        Route::get('/roles/search', 'search');
    });
});
