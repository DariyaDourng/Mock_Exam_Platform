<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;

class CustomVerifyEmail extends VerifyEmail
{
    /**
     * Build the mail message.
     */
    public function toMail($notifiable)
    {
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('📧 Verify Your Online Exam Account')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Thank you for registering. Please verify your email address by clicking the button below:')
            ->action('Verify Email', $verificationUrl)
            ->line('If you did not create an account, no further action is required. ')
            
            ->salutation('Thanks, Online Exam System Team');
    }

    /**
     * Generate the verification URL.
     */
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
            'verification.verify',
            Carbon::now()->addMinutes(60),
            [
                'id'   => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    }
}
