<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
    use HasFactory;
    public $fillable = [
        'name',
        'description',
        'no_of_days_allowed'
    ];
}
