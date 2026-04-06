<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyContact extends Model
{
    protected $fillable = [
        'company_id',
        'contact_type',
        'full_name',
        'designation',
        'email',
        'mobile',
        'alt_mobile',
        'landline',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
