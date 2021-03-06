<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveApplication extends Model
{
    use HasFactory;
    public $fillable = [
        'leave_type_id',
        'user_id',
        'processed_by_id',
        'date_of_application',
        'from_date',
        'to_date',
        'attachment',
        'leave_status',
        'reason',
        'date_of_approval'
    ];

    public function leaveTypes()
    {
        return $this->belongsTo(leaveType::class, 'leave_type_id', 'id');
    }
}
