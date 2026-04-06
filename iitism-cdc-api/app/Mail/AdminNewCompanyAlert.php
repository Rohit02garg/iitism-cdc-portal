<?php

namespace App\Mail;

use App\Models\Company;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AdminNewCompanyAlert extends Mailable
{
    use Queueable, SerializesModels;

    public $company;

    /**
     * Create a new message instance.
     */
    public function __construct(Company $company)
    {
        $this->company = $company->load('user');
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('[CDC Alert] New Company Registered: ' . $this->company->company_name)
                    ->view('emails.admin_new_company');
    }
}
