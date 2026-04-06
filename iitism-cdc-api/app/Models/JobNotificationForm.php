<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobNotificationForm extends Model
{
    protected $fillable = [
        'company_id',
        'season',
        'form_type',
        'status',
        'submitted_at',
        'reviewed_at',
        'reviewed_by',
        'review_comments',
        'admin_notes',
        'rejection_reason',
        'version',
        'parent_form_id',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    public function jobProfile()
    {
        return $this->hasOne(JnfJobProfile::class, 'jnf_id');
    }

    public function eligibility()
    {
        return $this->hasOne(JnfEligibility::class, 'jnf_id');
    }

    public function salary()
    {
        return $this->hasOne(JnfSalary::class, 'jnf_id');
    }

    public function selectionProcess()
    {
        return $this->hasOne(JnfSelectionProcess::class, 'jnf_id');
    }

    public function declaration()
    {
        return $this->hasOne(JnfDeclaration::class, 'jnf_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(FormAuditLog::class, 'jnf_id');
    }
}
