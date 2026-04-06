<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #1a237e; color: #ffffff; padding: 30px; text-align: center; }
        .content { padding: 40px; text-align: center; color: #333; }
        .otp-box { background: #f0f4f8; border: 2px dashed #1a237e; border-radius: 8px; padding: 20px; margin: 20px 0; font-size: 32px; font-weight: bold; color: #1a237e; letter-spacing: 5px; }
        .warning { color: #b71c1c; font-size: 14px; font-weight: 600; margin-top: 20px; }
        .footer { background: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .footer a { color: #1a237e; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h3>Career Development Centre</h3>
            <p>IIT (ISM) DHANBAD</p>
        </div>
        <div class="content">
            <h2>Email Verification OTP</h2>
            <p>Hello, please use the OTP below to verify your email for registration on the IIT (ISM) Dhanbad CDC Portal.</p>
            <div class="otp-box">{{ $otp }}</div>
            <p class="warning">Valid for 5 minutes only.</p>
        </div>
        <div class="footer">
            <p>For any queries, contact CDC at <a href="mailto:cdc@iitism.ac.in">cdc@iitism.ac.in</a></p>
            <p>Contact: +91-326-2235000 | IIT (ISM) Dhanbad, Jharkhand - 826004</p>
        </div>
    </div>
</body>
</html>
