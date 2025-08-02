<?php

namespace App\Models;

use App\Enum\RoleEnum;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Notifications\CustomVerifyEmail;

class User extends Authenticatable implements JWTSubject, MustVerifyEmail
{

    use Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'gender',
        'school_id',
        'is_active',
        'otp',
        'otp_sent_at',
        'otp_verified_at',
        'email_verified_at'
    ];
    /**
     * Get the identifier that will be stored in the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key-value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [ 'role_id' => $this->role_id];
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function isAdmin()
    {
        return $this->role->name === 'admin';
    }

        public function student(){
        return $this->select('id', 'name', 'email', 'role_id')
        ->with(['role:id,name'])
        ->where('role_id', RoleEnum::Student);
        }
    public function guest(){
        return $this->select('id', 'name', 'email', 'role_id')
        ->with(['role:id,name'])
        ->where('role_id', RoleEnum::Guest);
    }


public function sendEmailVerificationNotification()
{
    $this->notify(new CustomVerifyEmail());
}


public function school(){
  return  $this->belongsTo(School::class, 'school_id');
  
}

public function examAttempts()
{
    return $this->hasMany(ExamAttempt::class);
}


}
