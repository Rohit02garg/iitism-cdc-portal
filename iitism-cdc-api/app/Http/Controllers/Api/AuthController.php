<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\CompanyContact;
use App\Models\Notification;
use App\Events\CompanyRegistered;
use App\Mail\OtpEmail;
use App\Mail\WelcomeEmail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use App\Mail\PasswordResetEmail;
use App\Mail\PasswordResetConfirmationEmail;

class AuthController extends Controller
{
    /**
     * Login a user and issue a Sanctum token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            return response()->json([
                'success' => false,
                'message' => 'Account suspended. Contact CDC.',
            ], 403);
        }

        // Revoke previous tokens
        $user->tokens()->delete();

        // Issue token with role-based abilities
        $abilities = $user->role === 'admin' ? ['role:admin'] : ['role:company'];
        $token = $user->createToken('auth-token', $abilities)->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'token' => $token,
            ],
        ]);
    }

    /**
     * Logout the authenticated user.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get the authenticated user's profile.
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('company');

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Send a 6-digit OTP to the provided email.
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already registered. Please login.',
            ], 409);
        }

        // Generate random 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Clear previous OTPs for this email
        DB::table('otp_verifications')->where('email', $email)->delete();

        // Store new OTP
        DB::table('otp_verifications')->insert([
            'email' => $email,
            'otp' => $otp,
            'expires_at' => Carbon::now()->addMinutes(5),
            'is_used' => false,
            'created_at' => Carbon::now(),
        ]);

        // Queue OTP email
        Mail::to($email)->queue(new OtpEmail($otp, $email));

        return response()->json([
            'success' => true,
            'message' => 'OTP sent to your email. Valid for 5 minutes.',
        ]);
    }

    /**
     * Verify the 6-digit OTP.
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6',
        ]);

        $verification = DB::table('otp_verifications')
            ->where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('is_used', false)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$verification) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP',
            ], 400);
        }

        // Mark OTP as used
        DB::table('otp_verifications')
            ->where('id', $verification->id)
            ->update(['is_used' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Email verified successfully.',
        ]);
    }

    /**
     * Register a new company and its primary contact.
     */
    public function register(Request $request)
    {
        $sectors = [
            'Information Technology',
            'Core (Technical)',
            'Finance / Banking',
            'Consulting',
            'Analytics',
            'Oil & Gas / Energy',
            'Mining / Minerals',
            'Research & Development',
            'FMCG / Retail',
            'Education / EdTech',
            'Manufacturing',
            'Public Sector',
            'Other',
        ];

        $request->validate([
            'full_name' => 'required|string|max:255',
            'designation' => 'required|string|max:255',
            'mobile' => 'required|string|regex:/^[6-9]\d{9}$/',
            'alt_mobile' => 'nullable|string|regex:/^[6-9]\d{9}$/',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',      // at least one lowercase letter
                'regex:/[A-Z]/',      // at least one uppercase letter
                'regex:/[0-9]/',      // at least one digit
                'regex:/[@$!%*?&]/',   // at least one special character
            ],
            'company_name' => 'required|string|max:255',
            'website' => 'nullable|url',
            'sector' => 'required|string|in:' . implode(',', $sectors),
            'org_type' => 'required|string|in:PSU,MNC,Startup,NGO,Private,Government,Other',
            'postal_address' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            // Create user
            $user = User::create([
                'name' => $request->full_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'company',
                'is_active' => true,
                'email_verified_at' => Carbon::now(),
            ]);

            // Create company
            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('company_logos', 'public');
            }

            $industryTags = $request->industry_tags ? json_decode($request->industry_tags, true) : null;

            $company = Company::create([
                'user_id' => $user->id,
                'company_name' => $request->company_name,
                'website' => $request->website,
                'sector' => $request->sector,
                'org_type' => $request->org_type,
                'postal_address' => $request->postal_address,
                'nature_of_business' => $request->nature_of_business,
                'date_of_establishment' => $request->date_of_establishment,
                'annual_turnover' => $request->annual_turnover,
                'no_of_employees' => $request->no_of_employees,
                'hq_country' => $request->hq_country,
                'hq_city' => $request->hq_city,
                'industry_tags' => $industryTags,
                'social_media_url' => $request->social_media_url,
                'description' => $request->description,
                'logo_path' => $logoPath,
                'is_profile_complete' => true,
            ]);

            // Create primary contact (POC_1)
            CompanyContact::create([
                'company_id' => $company->id,
                'contact_type' => 'poc_1',
                'full_name' => $request->full_name,
                'designation' => $request->designation,
                'email' => $request->email,
                'mobile' => $request->mobile,
                'alt_mobile' => $request->alt_mobile,
            ]);

            // Send Welcome Email
            Mail::to($user->email)->queue(new WelcomeEmail($user->name, $company->company_name, $user->email, $request->password));

            // Notify admins via Event
            event(new CompanyRegistered($company));

            return response()->json([
                'success' => true,
                'message' => 'Registration successful. Check your email for login details.',
            ], 201);
        });
    }

    /**
     * Send a password reset link to the provided email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $email = $request->email;
        $user = User::where('email', $email)->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $email],
                ['token' => $token, 'created_at' => Carbon::now()]
            );

            Mail::to($email)->queue(new PasswordResetEmail($token, $email));
        }

        return response()->json([
            'success' => true,
            'message' => 'If this email exists, a reset link has been sent.',
        ]);
    }

    /**
     * Reset the user's password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => [
                'required',
                'string',
                'min:8',
                'confirmed',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[0-9]/',
                'regex:/[@$!%*?&]/',
            ],
        ]);

        $resetRequest = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        // Check if token exists and is not older than 15 minutes
        if (!$resetRequest || Carbon::parse($resetRequest->created_at)->addMinutes(15)->isPast()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired password reset token.',
            ], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.',
            ], 404);
        }

        // Update password and clear sessions
        $user->password = Hash::make($request->password);
        $user->save();
        $user->tokens()->delete();

        // Clear reset token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Send confirmation
        Mail::to($user->email)->queue(new PasswordResetConfirmationEmail());

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully.',
        ]);
    }
}
