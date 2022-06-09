<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // change the password after seeding
        $user = User::create(['first_name'=>'Ashish', 'last_name'=>'Maharana', 'email'=>'ashish@broadweb.com.au', 'password'=>bcrypt('123456')]);
        $user->assignRole('Admin');
    }
}
