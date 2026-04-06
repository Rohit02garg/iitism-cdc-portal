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
        Schema::create('jnf_declaration', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jnf_id')->constrained('job_notification_forms')->cascadeOnDelete();
            $table->boolean('aipc_agreed')->default(false);
            $table->boolean('shortlisting_agreed')->default(false);
            $table->boolean('info_verified')->default(false);
            $table->boolean('ranking_consent')->default(false);
            $table->boolean('accuracy_confirmed')->default(false);
            $table->boolean('rti_nirf_consent')->default(false);
            $table->string('signatory_name')->nullable();
            $table->string('signatory_designation')->nullable();
            $table->date('signatory_date')->nullable();
            $table->string('typed_signature')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jnf_declaration');
    }
};
