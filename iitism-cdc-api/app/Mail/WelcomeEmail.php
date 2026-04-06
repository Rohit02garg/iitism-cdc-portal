<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $companyName;
    public $email;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct($name, $companyName, $email, $password)
    {
        $this->name = $name;
        $this->companyName = $companyName;
        $this->email = $email;
        $this->password = $password;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Welcome to IIT (ISM) Dhanbad CDC Portal — Your Login Details')
                    ->view('emails.welcome');
    }
}
