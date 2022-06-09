<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLeaveApplicationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('leave_application', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('leave_type_id')->comment('leave types from leave types table');
            $table->unsignedBigInteger('user_id')->comment('person who applied for leave-application');
            $table->unsignedBigInteger('processed_by_id')->comment('person who approved or rejected the leave-application');
            $table->date('date_of_application');
            $table->date('from_date');
            $table->date('to_date');
            $table->longText('attachment')->nullable();
            $table->tinyInteger('leave_status')->comment('0->pending 1->approved 2->rejected');
            $table->text('reason');
            $table->date('date_of_approval');

            $table->foreign('leave_type_id')->references('id')->on('leave_types')
                ->onUpdate('cascade')->onDelete('cascade'); 
            $table->foreign('user_id')->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->foreign('processed_by_id')->references('id')->on('users')
                ->onUpdate('cascade')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('leave_application');
    }
}
