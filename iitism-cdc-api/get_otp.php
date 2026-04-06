<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$otp = Illuminate\Support\Facades\DB::table('otp_verifications')->where('email', 'test@company.com')->latest()->first();

if ($otp) {
    echo "\n\n=== YOUR OTP IS: " . $otp->otp . " ===\n\n";
} else {
    echo "\n\n=== NO OTP FOUND ===\n\n";
}
