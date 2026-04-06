<?php

namespace App\Listeners;

use App\Events\CompanyRegistered;
use App\Mail\AdminNewCompanyAlert;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class SendAdminNewCompanyAlert
{
    /**
     * Handle the event.
     */
    public function handle(CompanyRegistered $event): void
    {
        $company = $event->company;
        $adminEmail = 'admin@iitism.ac.in';

        // 1. Send Email to Admin
        Mail::to($adminEmail)->queue(new AdminNewCompanyAlert($company));

        // 2. Create In-App Notification for Admins in DB
        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type' => 'company_registered',
                'title' => 'New Company Registered',
                'message' => "{$company->company_name} has registered and is awaiting review",
                'data' => [
                    'company_id' => $company->id,
                    'company_name' => $company->company_name,
                    'registered_at' => $company->created_at,
                ],
                'is_read' => false,
            ]);
        }
    }
}
