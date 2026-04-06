<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfJobProfile extends Model
{
    protected $fillable = [
        'jnf_id',
        'job_title',
        'designation',
        'place_of_posting',
        'work_mode',
        'expected_hires',
        'min_hires',
        'tentative_joining',
        'skills',
        'jd_text',
        'jd_pdf_path',
        'ppo_provision',
        'registration_link',
        'additional_info',
        'bond_details',
        'onboarding_procedure',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'ppo_provision' => 'boolean',
        ];
    }

    public function jobNotificationForm()
    {
        return $this->belongsTo(JobNotificationForm::class, 'jnf_id');
    }
}
