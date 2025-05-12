<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $position = [
            [
                'name'=> 'admin',
                'created_at'=> now(),
                'updated_at'=> now(),
            ],
            [
                'name'=> 'student',
                'created_at'=> now(),
                'updated_at'=> now(),
            ],
            [
                'name'=> 'guest',
                'created_at'=> now(),
                'updated_at'=> now(),
            ],
           
        ];

        Role::insert($position);
    }
}