<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController as BaseController;
use App\Models\LeaveType;
use App\Models\LeaveApplication;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Carbon\Carbon;


class LeaveController extends BaseController
{
    public function index()
    {
        try{
            $leaveTypes = LeaveType::get();
            return response()->json($leaveTypes);
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addLeaveType(Request $request)
    {
        try{
            $isLeaveTypeExist = LeaveType::where('name', '=', $request->name)->first();
            if($isLeaveTypeExist){
                return $this->sendResponse($isLeaveTypeExist, 'Leave Type Exist', 201);
            }
            $input = $request->all();
            $leaveType = LeaveType::create($input);
            return $this->sendResponse($leaveType, 'Leave Type added successfully.', 200);
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getLeaveType($id)
    {
        try{
            $leaveType = LeaveType::find($id);
            return response()->json($leaveType);
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    public function getAllLeaveTypes()
    {
        try{
            $leaveTypes = LeaveType::get();
            return response()->json($leaveTypes->toArray());
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editLeaveType(Request $request)
    {
        try {
            $data = $request->all();
            $leaveType = LeaveType::updateOrCreate(['id' => $request->id],$data);
            return $this->sendResponse($leaveType, 'Leave Type has been updated successfully.', 200);
        } catch (\Exception $e) {
            return $this->sendError($e, [], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteLeaveType($id)
    {
        try{
            $leaveType = LeaveType::find($id)->delete();
            return $this->sendResponse($leaveType, 'Leave Type deleted successfully.', 200);
        }catch (\Exception $e) {
            // return $this->sendError('Something went wrong', $e->getMessage(), 500);
            return $this->sendError($e, [], 500);
        }
    }

    // Leave Application API's

    public function applyLeaveApplication(Request $request)
    {
        try{
            $user = Auth::user();
            $isLeaveAppExist = LeaveApplication::where('user_id', '=' , $user->id)->where('leave_status', 0)->first();
            if($isLeaveAppExist){
                return $this->sendResponse($isLeaveAppExist, 'Leave Application Pending', 201);
            }
            $request['user_id'] = $user->id;
            $request['leave_type_id'] = intval($request->leave_type_id);
            $request['date_of_application'] =  Carbon::today()->startOfDay()->format('Y-m-d');
            $input = $request->all();
            $leaveType = LeaveApplication::create($input);
            return $this->sendResponse($leaveType, 'Leave Type added successfully.', 200);
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    public function getAllLeaveApplicationsOfEmp()
    {
        try{
            $user = Auth::user();
            $leaveApplication = LeaveApplication::with('leaveTypes')->get();
            return response()->json($leaveApplication->toArray());
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }
}
