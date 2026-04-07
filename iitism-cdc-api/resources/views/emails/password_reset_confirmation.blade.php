<!DOCTYPE html>
<html>
<head>
    <title>Password Reset Successful</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-top: 4px solid #2e7d32;">
        <h2 style="color: #2e7d32;">Password Reset Successful</h2>
        <p>This is a confirmation that the password for your account at the IIT (ISM) Dhanbad CDC Portal has just been changed.</p>
        
        <p>All active sessions have been securely logged out. You can now login with your new password.</p>

        <p style="text-align: center; margin: 30px 0;">
            <a href="{{ env('FRONTEND_URL') }}/login" 
               style="background-color: #1a237e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
               Login to Portal
            </a>
        </p>

        <p>If you did not make this change, please contact the CDC administration immediately at cdc@iitism.ac.in.</p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="font-size: 12px; color: #777;">
            Career Development Centre<br>
            IIT (ISM) Dhanbad
        </p>
    </div>
</body>
</html>
