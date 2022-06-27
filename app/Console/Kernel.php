<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\DB;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $users = DB::table('users')->get();
            foreach ($users as $user) {
                DB::table('users')
                ->where('id', $user->id)
                ->update(['c_l' => 10, 's_l' => 10, 'balanced_leaves' => $user->balanced_leaves + $user->s_l]);
            }
        })->timezone('Asia/Kolkata')->yearlyOn(4, 1, '12:10');
        // $schedule->command('inspire')->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
