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
        Schema::create('jnf_job_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('job_notification_forms')->cascadeOnDelete();
            $table->string('job_title', 255);
            $table->string('designation', 255)->nullable();
            $table->string('place_of_posting', 500);
            $table->enum('work_mode', ['onsite', 'remote', 'hybrid'])->default('onsite');
            $table->integer('expected_hires');
            $table->integer('min_hires')->nullable();
            $table->string('tentative_joining', 20);
            $table->json('skills')->nullable();
            $table->longText('jd_text')->nullable();
            $table->string('jd_pdf_path')->nullable();
            $table->boolean('ppo_provision')->default(false);
            $table->string('registration_link')->nullable();
            $table->text('additional_info')->nullable();
            $table->text('bond_details')->nullable();
            $table->text('onboarding_procedure')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jnf_job_profiles');
    }
};
