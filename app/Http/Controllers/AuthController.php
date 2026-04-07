<?php

namespace App\Http\Controllers;

use App\Mail\OTPMail;
use App\Models\Role;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // public function register(Request $request)
    // {
    //     try {
    //         $request->validate([
    //             'name'     => 'required|string|max:255',
    //             'email'    => 'required|string|email|max:255|unique:users',
    //             'password' => [
    //                 'required',
    //                 'confirmed',
    //                 Password::min(8)
    //                     ->mixedCase()        // Must include uppercase and lowercase
    //                     ->letters()
    //                     ->numbers()
    //                     ->symbols()
    //                     ->uncompromised(),   // Checks against known data breaches
    //             ],
    //             'gender'      => 'required|string|in:Male,Female,Other',
    //             'school_id' => 'required|string|max:255',
    //             'password_confirmation' => 'required|string|same:password',
    //         ]);

    //         $studentRole = Role::where('name', 'student')->first();
    //         if (!$studentRole) {
    //             return response()->json(['status' => 'fail', 'message' => 'Student role not found'], 500);
    //         }

    //         $user = User::create([
    //             'name'     => $request->name,
    //             'email'    => $request->email,
    //             'password' => Hash::make($request->password),
    //             'role_id'  => $studentRole->id,
    //             'gender'      => $request->gender,
    //             'school_id' => $request->school_id,
    //         ]);

    //         // Send email verification
    //         $user->sendEmailVerificationNotification();

    //         return response()->json([
    //             'status'  => 'success',
    //             'message' => 'User registered successfully. Please check your email to verify your account.',
    //             'data'    => $user
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => 'fail',
    //             'message' => 'Something went wrong: ' . $e->getMessage()
    //         ], 500);
    //     }
    // }
    public function register(Request $request)
    {
        try {
            // Fetch role once (assuming student by default)
            $studentRole = Role::where('name', 'student')->firstOrFail();

            // Add dynamic validation rules
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(8)
                        ->mixedCase()
                        ->letters()
                        ->numbers()
                        ->symbols()
                        ->uncompromised(),
                ],
                'gender' => 'required|string|in:Male,Female,Other',
                'school_id' => [
                    'required',
                    'exists:schools,id',
                ],
                'password_confirmation' => 'required|string|same:password',
            ]);

            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'gender' => $validated['gender'],
                'school_id' => $validated['school_id'],
                'role_id' => $studentRole->id,
            ]);

            // Send email verification
            $user->sendEmailVerificationNotification();

            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully. Please check your email to verify your account.',
                'data' => $user,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Something went wrong: '.$e->getMessage(),
            ], 500);
        }
    }

    // Your existing login method
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            if (! $token = Auth::attempt($credentials)) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Invalid credentials',
                ], 401);
            }
            /** @var \App\Models\User $user */
            $user = Auth::user();
            if (! $user->hasVerifiedEmail() || ! $user->is_active) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'Please verify your email before logging in.',
                ], 403);
            }

            return response()->json([
                'status' => 200,
                'message' => 'Login successful',
                'token' => $token,

                'user' => [
                    'id' => $user->id,
                    'role_id' => $user->role_id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'is_active' => $user->is_active,
                    'email_verified_at' => $user->email_verified_at,
                ],

            ])
                ->cookie(
                    'token',
                    $token,         // JWT token value
                    60,             // Expire in 60 minutes
                    '/',            // Path
                    null,           // Domain (null = current domain)
                    true,           // Secure (HTTPS only)
                    true,           // HttpOnly (not accessible via JS)
                    false,          // Raw
                    'Strict'        // SameSite
                );

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Something went wrong: '.$e->getMessage(),
            ], 500);
        }
    }

    // Add this method for user info endpoint

    public function user()
    {
        try {
            return response()->json(Auth::user());
        } catch (\Exception $e) {
            return response()->json(
                [
                    'status' => 'fail',
                    'message' => 'Something went wrong: '.$e->getMessage(),
                ],
                500
            );
        }
    }

    public function logout()
    {
        try {
            Auth::logout();

            // Clear token cookie here!
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out',
            ])->withCookie(cookie()->forget('token')); // <-- this line clears cookie named 'token'
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'fail',
                'message' => 'Something went wrong: '.$e->getMessage(),
            ], 500);
        }
    }

    // Helper function to respond with a token
    protected function respondWithToken($token)
    {
        try {
            return response()->json([
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => Auth::factory()->getTTL() * 60,
                'role' => Auth::user()->role->name,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'status' => 'fail',
                    'message' => 'Something went wrong: '.$e->getMessage(),
                ],
                500
            );
        }
    }

    // send new otp code when otp expired
    public function sendOTP(Request $req)
    {
        $req->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $req->email)->first();

        if (! $user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $otpSentAt = $user->otp_sent_at ? Carbon::parse($user->otp_sent_at) : null;

        // // Optional cooldown logic
        // if ($user->otp_sent_at && now()->diffInSeconds($user->otp_sent_at) < 30) {
        //     return response()->json(['message' => 'Please wait before requesting a new OTP.'], 429);
        // }
        if ($otpSentAt && $otpSentAt->diffInSeconds(now()) < 30) {
            return response()->json(['message' => 'Please wait before requesting a new OTP.'], 429);
        }

        $this->_sentOTP($user);

        return response()->json(['message' => 'OTP has been sent to your email.'], 200);
    }

    public function verifyOTP(Request $req)
    {

        $user = User::select('id', 'role_id', 'email', 'name', 'otp', 'otp_sent_at', 'otp_verified_at')
            ->where('email', $req->email)
            ->first();

        $checkOTPExpire = Carbon::now();
        $opt_send_at = Carbon::parse($user->otp_sent_at);

        if ($opt_send_at->diffInSeconds($checkOTPExpire) >= 60) { // if opt sent over 60 seconds expires
            return response()->json([
                'status' => 'fail',
                'message' => 'OTP exprired',
            ], Response::HTTP_BAD_REQUEST);
        }

        if ($user->otp != $req->otp) {   // Check if OTP is compatible

            return response()->json([
                'status' => 'fail',
                'message' => 'OTP invalid',
            ], Response::HTTP_BAD_REQUEST);
        }
        $user->otp_verified_at = date('Y-m-d H:i:s');
        $user->is_active = 1;
        $user->save();

        return response()->json([
            'data' => $user,
            'message' => 'OTP has been verified successfully',
        ], Response::HTTP_OK);
    }

    public function newPassword(Request $req)
    {
        $req->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string',
            'new_password' => [
                'required',
                'string',
                Password::min(8)->mixedCase()->numbers()->symbols(),
            ],
            'password_confirmation' => 'required|string|same:new_password',
        ]);

        $user = User::where('email', $req->email)->first();

        if (! $user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $otpExpired = Carbon::parse($user->otp_sent_at)->diffInSeconds(now()) > 300; // 5 mins

        if ($otpExpired) {
            return response()->json(['message' => 'OTP expired.'], 400);
        }

        if ($user->otp !== $req->otp) {
            return response()->json(['message' => 'Invalid OTP.'], 400);
        }

        $user->password = Hash::make($req->new_password);
        $user->otp_verified_at = now(); // optional tracking
        $user->save();

        return response()->json(['message' => 'Password has been reset successfully.'], 200);
    }

    public function roles()
    {
        $roles = Role::all();

        return response()->json([
            'data' => $roles,
            'message' => 'all roles',
        ], Response::HTTP_OK);
    }

    public function profile()
    {
        try {

            $user = User::select('id', 'name', 'email', 'gender', 'school_id', 'is_active', 'role_id')
                ->with(['role:id,name'])
                ->findOrfail(Auth::user()->id);

            if (! $user) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'User not found',
                ], Response::HTTP_BAD_REQUEST);
            }

            return response()->json(
                [
                    'status' => 'success',
                    'data' => $user,
                    'message' => ' User found successfully',
                ],
                201
            );
        } catch (QueryException $e) {
            return response()->json(
                [
                    'status' => 'fail',
                    'message' => 'Database error: '.$e->getMessage(),
                ],
                500
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'status' => 'fail',
                    'message' => 'Something went wrong: '.$e->getMessage(),
                ],
                500
            );
        }
    }

    public function update_profile(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255',
                'is_active' => 'required',
            ]);

            $user = User::select('id', 'name', 'email', 'is_active', 'role_id', 'password')
                ->findOrfail(Auth::user()->id);

            if (! $user) {
                return response()->json([
                    'status' => 'fail',
                    'message' => 'User not found',
                ], 500);
            }

            $user->name = $request->name;
            $user->email = $request->email;
            $user->gender = $request->gender ?? null;
            // $user->school_name    = $request->school_name ?? null;
            $user->is_active = $request->is_active;

            if ($request->current_password && $request->new_password) {
                $check_pwd = Hash::check($request->current_password, $user->password);

                if (! $check_pwd) {
                    return response()->json(
                        [
                            'status' => 'fail',
                            'message' => 'Incorrect Current Password!',
                        ],
                        500
                    );
                }
                $user->password = Hash::make($request->new_password);
            }

            $user->save();

            return response()->json(
                [
                    'status' => 'success',
                    'data' => $user,
                    'message' => 'Profile updated successfully',
                ],
                201
            );
        } catch (QueryException $e) {
            return response()->json(
                [
                    'status' => 'fail',
                    'message' => 'Database error: '.$e->getMessage(),
                ],
                500
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'status' => 'fail',
                    'message' => 'Something went wrong: '.$e->getMessage(),
                ],
                500
            );
        }
    }

    private function _sentOTP($user = null)
    {

        $user->otp = rand(100000, 999999);
        $user->otp_sent_at = date('Y-m-d H:i:s');
        $user->save();

        // send opt to email of user
        $this->_sendEmail($user);
    }

    private function _sendEmail($user = null)
    {

        $data = [
            'toEmail' => $user->email,
            'fromName' => 'Mock Exam Platform',
            'fromEmail' => 'dariyadourng@gmail.com',
            'otp' => $user->otp,
            'category' => 'New Password Verification',
            'body' => 'Your OTP code below ',
            'footer' => 'Thanks for using Mock Exam Platform',
        ];

        // sent opt code to user gmail
        Mail::to($user->email)->send(new OTPMail($data));
    }
}
