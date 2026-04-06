<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('company_name', 255);
            $table->string('website', 500)->nullable();
            $table->string('sector', 255);
            $table->enum('org_type', ['PSU', 'MNC', 'Startup', 'NGO', 'Private', 'Government', 'Other']);
            $table->text('nature_of_business')->nullable();
            $table->date('date_of_establishment')->nullable();
            $table->string('annual_turnover')->nullable();
            $table->string('no_of_employees')->nullable();
            $table->string('hq_country')->nullable();
            $table->string('hq_city')->nullable();
            $table->json('industry_tags')->nullable();
            $table->string('social_media_url')->nullable();
            $table->text('description')->nullable();
            $table->string('logo_path')->nullable();
            $table->text('postal_address')->nullable();
            $table->boolean('is_profile_complete')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
