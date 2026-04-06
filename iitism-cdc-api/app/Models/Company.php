<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'website',
        'sector',
        'org_type',
        'nature_of_business',
        'date_of_establishment',
        'annual_turnover',
        'no_of_employees',
        'hq_country',
        'hq_city',
        'industry_tags',
        'social_media_url',
        'description',
        'logo_path',
        'postal_address',
        'is_profile_complete',
    ];

    protected function casts(): array
    {
        return [
            'industry_tags' => 'array',
            'is_profile_complete' => 'boolean',
            'date_of_establishment' => 'date',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contacts()
    {
        return $this->hasMany(CompanyContact::class);
    }

    public function jobNotificationForms()
    {
        return $this->hasMany(JobNotificationForm::class);
    }
}
