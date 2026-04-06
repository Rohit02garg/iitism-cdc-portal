<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin user
        User::create([
            'name' => 'CDC Admin',
            'email' => 'admin@iitism.ac.in',
            'password' => Hash::make('Admin@IITISM#2024'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // 2. Test company user + company record
        $companyUser = User::create([
            'name' => 'Test Company HR',
            'email' => 'hr@testcompany.com',
            'password' => Hash::make('Company@123'),
            'role' => 'company',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Company::create([
            'user_id' => $companyUser->id,
            'company_name' => 'Test Technologies Pvt. Ltd.',
            'sector' => 'Information Technology',
            'org_type' => 'Private',
            'nature_of_business' => 'Software Development and IT Services',
            'postal_address' => '123 Tech Park, Bangalore, Karnataka 560001',
        ]);
    }
}
