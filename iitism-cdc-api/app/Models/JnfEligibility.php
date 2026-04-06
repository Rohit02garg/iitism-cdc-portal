<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfEligibility extends Model
{
    protected $table = 'jnf_eligibility';

    protected $fillable = [
        'jnf_id',
        'programmes',
        'min_cgpa',
        'backlogs_allowed',
        'highschool_percent',
        'gender_filter',
        'per_discipline_cgpa',
        'special_requirements',
    ];

    protected function casts(): array
    {
        return [
            'programmes' => 'array',
            'per_discipline_cgpa' => 'array',
            'backlogs_allowed' => 'boolean',
            'min_cgpa' => 'decimal:1',
            'highschool_percent' => 'decimal:2',
        ];
    }

    public function jobNotificationForm()
    {
        return $this->belongsTo(JobNotificationForm::class, 'jnf_id');
    }
}
