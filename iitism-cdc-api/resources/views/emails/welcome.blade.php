<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #1a237e; color: #ffffff; padding: 30px; text-align: center; }
        .content { padding: 40px; text-align: left; color: #333; line-height: 1.6; }
        .welcome-heading { color: #1a237e; margin-bottom: 20px; }
        .credentials-box { background: #f0f4f8; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #1a237e; }
        .credentials-box p { margin: 5px 0; font-family: monospace; font-size: 15px; }
        .next-steps { margin-top: 30px; }
        .next-steps h4 { color: #1a237e; margin-bottom: 10px; }
        .footer { background: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 24px; background: #1a237e; color: #ffffff; border-radius: 4px; text-decoration: none; font-weight: 600; margin-top: 20px; }
        .notice { font-size: 13px; color: #b71c1c; font-weight: 600; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin:0;">Career Development Centre</h2>
            <p style="margin:5px 0 0 0;">IIT (ISM) DHANBAD</p>
        </div>
        <div class="content">
            <h2 class="welcome-heading">Welcome, {{ $companyName }}!</h2>
            <p>Your account has been created successfully on the IIT (ISM) Dhanbad CDC Portal. You can now access your dashboard to manage placements and internships.</p>
            
            <div class="credentials-box">
                <p><strong>Email:</strong> {{ $email }}</p>
                <p><strong>Password:</strong> {{ $password }}</p>
                <p><strong>Login URL:</strong> <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
            </div>
            <p class="notice">Please change your password after your first login for security purposes.</p>

            <div class="next-steps">
                <h4>What's next?</h4>
                <ol>
                    <li>Login to the portal using the credentials above.</li>
                    <li>Complete your <strong>Company Profile</strong> details.</li>
                    <li>Submit <strong>JNF</strong> (Job Notification Form) or <strong>INF</strong> (Intern Notification Form) to start the recruitment process.</li>
                </ol>
            </div>

            <a href="http://localhost:3000/login" class="button">Log In to Portal</a>
        </div>
        <div class="footer">
            <p><strong>Career Development Centre | IIT (ISM) Dhanbad</strong></p>
            <p>Email: <a href="mailto:cdc@iitism.ac.in">cdc@iitism.ac.in</a> | Contact: +91-326-2235000</p>
        </div>
    </div>
</body>
</html>
