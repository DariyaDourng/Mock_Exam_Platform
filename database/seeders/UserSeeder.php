<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch role IDs to ensure they exist
        $adminRole = Role::where('name', 'admin')->first();
        $studentRole = Role::where('name', 'student')->first();
        $guestRole = Role::where('name', 'guest')->first();
   

        if (!$adminRole || !$studentRole || !$guestRole ) {
            throw new \Exception('Roles not found. Run `php artisan db:seed --class=RoleSeeder` first.');
        }

        User::insert([
            [
                'name' => 'Ya Admin',
                'email' => 'dariyadorung@gmail.com',
                'password' => Hash::make('admin123'),
                'role_id' => $adminRole->id,
                'gender' => 'Female',
                'school_name' => 'Admin Institute',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Jae Jeong',
                'email' => 'jeongjaehyun@nct.com',
                'password' => Hash::make('ousa123'),
                'role_id' => $studentRole->id,
                'gender' => 'Male',
                'school_name' => 'NCT 127 Institute',
                'is_active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        
        ]);
    }
}