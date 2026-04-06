<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       \App\Models\User::create([
            'name'     => 'Admin Test',
            'email'    => 'admin@test.com',
            'password' => bcrypt('123'),
            'role'     => 'admin',
        ]);
//BA code
$user = \App\Models\User::create([
    'name'     => 'Trần Văn Hùng',
    'email'    => 'gv0001@stu.edu.vn',
    'password' => bcrypt('GV0001'), 
    'role'     => 'teacher',
]);

// Thêm dòng này để tạo dữ liệu bảng teachers
\DB::table('teachers')->insert([
    'user_id' => $user->id,
    'teacher_code' => 'GV0001',
    'department' => 'Công nghệ thông tin',
]);

}
}