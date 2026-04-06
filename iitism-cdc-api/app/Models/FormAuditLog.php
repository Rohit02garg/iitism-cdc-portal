<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormAuditLog extends Model
{
    public $timestamps = false;

    protected $table = 'form_audit_log';

    protected $fillable = [
        'jnf_id',
        'action',
        'performed_by',
        'section_edited',
        'note',
        'old_data',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'old_data' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function jobNotificationForm()
    {
        return $this->belongsTo(JobNotificationForm::class, 'jnf_id');
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
