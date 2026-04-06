<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfSalary extends Model
{
    protected $table = 'jnf_salary';

    protected $fillable = [
        'jnf_id',
        'currency',
        'salary_same_for_all',
        'salary_data',
        'additional_components',
    ];

    protected function casts(): array
    {
        return [
            'salary_data' => 'array',
            'additional_components' => 'array',
            'salary_same_for_all' => 'boolean',
        ];
    }

    public function jobNotificationForm()
    {
        return $this->belongsTo(JobNotificationForm::class, 'jnf_id');
    }
}
