<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfSelectionProcess extends Model
{
    protected $table = 'jnf_selection_process';

    protected $fillable = [
        'jnf_id',
        'stages',
        'infrastructure_required',
        'psychometric_test',
        'medical_test',
        'other_screening',
    ];

    protected function casts(): array
    {
        return [
            'stages' => 'array',
            'psychometric_test' => 'boolean',
            'medical_test' => 'boolean',
        ];
    }

    public function jobNotificationForm()
    {
        return $this->belongsTo(JobNotificationForm::class, 'jnf_id');
    }
}
