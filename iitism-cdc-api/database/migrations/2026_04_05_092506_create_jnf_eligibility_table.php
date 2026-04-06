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
        Schema::create('jnf_eligibility', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('job_notification_forms')->cascadeOnDelete();
            $table->json('programmes');
            $table->decimal('min_cgpa', 3, 1)->nullable();
            $table->boolean('backlogs_allowed')->default(false);
            $table->decimal('highschool_percent', 5, 2)->nullable();
            $table->enum('gender_filter', ['all', 'male', 'female', 'other'])->default('all');
            $table->json('per_discipline_cgpa')->nullable();
            $table->text('special_requirements')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jnf_eligibility');
    }
};
