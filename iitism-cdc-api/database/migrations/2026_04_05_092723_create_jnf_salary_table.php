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
        Schema::create('jnf_salary', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('job_notification_forms')->cascadeOnDelete();
            $table->enum('currency', ['INR', 'USD', 'EUR'])->default('INR');
            $table->boolean('salary_same_for_all')->default(true);
            $table->json('salary_data');
            $table->json('additional_components')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jnf_salary');
    }
};
