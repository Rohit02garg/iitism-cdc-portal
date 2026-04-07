<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', fn() => response()->json(['status' => 'ok', 'service' => 'IIT ISM CDC API']));

// Auth routes (public)
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/send-otp', [AuthController::class, 'sendOtp'])->middleware('throttle:5,1');
Route::post('/auth/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Company routes
    Route::get('/company/dashboard', [\App\Http\Controllers\Api\Company\DashboardController::class, 'index']);
    Route::put('/company/profile', [\App\Http\Controllers\Api\Company\ProfileController::class, 'update']);
    
    // JNF routes
    Route::post('/jnf', [\App\Http\Controllers\Api\Company\JnfController::class, 'create']);
    Route::get('/jnf/{id}', [\App\Http\Controllers\Api\Company\JnfController::class, 'show']);
    Route::put('/jnf/{id}/draft', [\App\Http\Controllers\Api\Company\JnfController::class, 'saveDraft']);
    Route::put('/jnf/{id}/submit', [\App\Http\Controllers\Api\Company\JnfController::class, 'submit']);

    // INF routes
    Route::post('/inf', [\App\Http\Controllers\Api\Company\InfController::class, 'create']);
    Route::get('/inf/{id}', [\App\Http\Controllers\Api\Company\InfController::class, 'show']);
    Route::put('/inf/{id}/draft', [\App\Http\Controllers\Api\Company\InfController::class, 'saveDraft']);
    Route::put('/inf/{id}/submit', [\App\Http\Controllers\Api\Company\InfController::class, 'submit']);
});
