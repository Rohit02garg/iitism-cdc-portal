<!DOCTYPE html>
<html>
<head>
    <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-top: 4px solid #1a237e;">
        <h2 style="color: #1a237e;">Password Reset Request</h2>
        <p>You are receiving this email because we received a password reset request for your account at the IIT (ISM) Dhanbad CDC Portal.</p>
        
        <p style="text-align: center; margin: 30px 0;">
            <a href="{{ env('FRONTEND_URL') }}/reset-password?token={{ $token }}&email={{ urlencode($email) }}" 
               style="background-color: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
               Reset Password
            </a>
        </p>

        <p><strong>Note:</strong> This link expires in 15 minutes.</p>

        <p>If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="font-size: 12px; color: #777;">
            Career Development Centre<br>
            IIT (ISM) Dhanbad
        </p>
    </div>
</body>
</html>
