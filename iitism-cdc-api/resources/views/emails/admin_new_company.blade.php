<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 650px; background: #ffffff; border-radius: 8px; overflow: hidden; margin: 0 auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: #1a237e; color: #ffffff; padding: 25px; text-align: center; }
        .header h3 { margin: 0; font-size: 20px; }
        .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
        .content { padding: 40px; text-align: left; color: #333; }
        .alert-heading { color: #b71c1c; margin-bottom: 25px; font-size: 22px; font-weight: bold; border-bottom: 2px solid #f0f4f8; padding-bottom: 10px; }
        
        .data-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px; }
        .data-table th { background: #f8f9fa; text-align: left; padding: 12px; border: 1px solid #dee2e6; color: #1a237e; font-weight: 600; width: 150px; }
        .data-table td { padding: 12px; border: 1px solid #dee2e6; color: #444; }

        .footer { background: #eeeeee; padding: 20px; text-align: center; font-size: 11px; color: #888; }
        .button-wrapper { text-align: center; margin-top: 35px; }
        .button { display: inline-block; padding: 14px 28px; background: #1a237e; color: #ffffff; border-radius: 4px; text-decoration: none; font-weight: 600; box-shadow: 0 2px 4px rgba(26,35,126,0.2); }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h3>Career Development Centre | IIT (ISM) DHANBAD</h3>
            <p>Admin Notification System</p>
        </div>
        <div class="content">
            <h2 class="alert-heading">New Company Registration Alert</h2>
            <p>A new company has registered on the portal. Please review the details below:</p>
            
            <table class="data-table">
                <tr>
                    <th>Company Name</th>
                    <td>{{ $company->company_name }}</td>
                </tr>
                <tr>
                    <th>Sector</th>
                    <td>{{ $company->sector }}</td>
                </tr>
                <tr>
                    <th>Org Type</th>
                    <td>{{ $company->org_type }}</td>
                </tr>
                <tr>
                    <th>Website</th>
                    <td>{{ $company->website ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Contact Person</th>
                    <td>{{ $company->user->name }}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>{{ $company->user->email }}</td>
                </tr>
                <tr>
                    <th>Designation</th>
                    <td>{{ $company->contacts()->first()->designation ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Mobile</th>
                    <td>{{ $company->contacts()->first()->mobile ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Registered At</th>
                    <td>{{ $company->created_at->toDayDateTimeString() }}</td>
                </tr>
            </table>

            <div class="button-wrapper">
                <a href="http://localhost:3000/admin/companies" class="button">Review All Registrations</a>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated system notification from the IIT (ISM) Dhanbad CDC Portal.</p>
        </div>
    </div>
</body>
</html>
