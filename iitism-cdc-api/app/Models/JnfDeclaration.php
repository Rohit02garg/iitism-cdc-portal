<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JnfDeclaration extends Model
{
    protected $table = 'jnf_declaration';

    protected $fillable = [
        'jnf_id',
        'aipc_agreed',
        'shortlisting_agreed',
        'info_verified',
        'ranking_consent',
        'accuracy_confirmed',
        'rti_nirf_consent',
        'signatory_name',
        'signatory_designation',
        'signatory_date',
        'typed_signature',
    ];

    protected function casts(): array
    {
        return [
            'aipc_agreed' => 'boolean',
            'shortlisting_agreed' => 'boolean',
            'info_verified' => 'boolean',
            'ranking_consent' => 'boolean',
            'accuracy_confirmed' => 'boolean',
            'rti_nirf_consent' => 'boolean',
            'signatory_date' => 'date',
        ];
    }

    public function jobNotificationForm()
    {
        return $this->belongsTo(JobNotificationForm::class, 'jnf_id');
    }
}
