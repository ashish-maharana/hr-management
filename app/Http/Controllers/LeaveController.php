<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController as BaseController;
use App\Models\LeaveType;
use App\Models\LeaveApplication;
use App\Models\User;
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
            $data = $request->all();
            $leaveType = LeaveType::create($data);
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
            $leaveTypeId = LeaveType::where('name', '=', 'Casual Leave')->first();
            if($isLeaveAppExist){
                return $this->sendResponse($isLeaveAppExist, 'Leave Application Pending', 201);
            }

            $request['user_id'] = $user->id;
            $request['leave_type_id'] = $leaveTypeId->id;
            $request['date_of_application'] =  Carbon::today()->startOfDay()->format('Y-m-d');
            $data = $request->all();
            $leaveType = LeaveApplication::create($data);
            return $this->sendResponse($leaveType, 'Leave Type added successfully.', 200);
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    // Actions On Leave
    public function actionOnLeaveApplication(Request $request)
    {
        try{
            $user = Auth::user();
            $applicantUser = User::find($request->ApplicantId);
            $req['processed_by_id'] = $user->id;
            $req['leave_status'] = intval($request->leaveStatus);
            $req['date_of_approval'] =  Carbon::today()->startOfDay()->format('Y-m-d');
            $req['c_l'] = $applicantUser->c_l;
            $req['s_l'] = $applicantUser->s_l;
            $req['balanced_leaves'] = $applicantUser->balanced_leaves;
            if(!$request->sickDoc && intval($request->leaveStatus) === 1){
                $req['c_l'] = $applicantUser->c_l - intval($request->NoOfDays);
            }
            if($request->sickDoc && intval($request->leaveStatus) === 1){
                $req['leave_status'] = intval($request->leaveStatus);
                $req['c_l'] = $applicantUser->c_l + intval($request->NoOfDays);
                if(intval($request->NoOfDays) <= $applicantUser->s_l){
                    $req['s_l'] = $applicantUser->s_l - intval($request->NoOfDays);
                }else{
                    $req['s_l'] = 0;
                    $req['balanced_leaves'] = $applicantUser->balanced_leaves - (intval($request->NoOfDays) - $applicantUser->s_l);
                }
            }
            $leaveAction = LeaveApplication::where('id',intval($request->leaveAppId))->update(array(
                'processed_by_id'=>$req['processed_by_id'], 
                'leave_status'=>$req['leave_status'], 
                'date_of_approval'=>$req['date_of_approval']
            ));
            $userDataUpdate = User::where('id', $request->ApplicantId)->update(array(
                'c_l'=>$req['c_l'],
                's_l'=>$req['s_l'],
                'balanced_leaves'=>$req['balanced_leaves'],
            ));
            return $this->sendResponse($leaveAction, 'Leave Application Updated Successfully.', 200);
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    public function getAllLeaveApplicationsOfEmp()
    {
        try{
            $user = Auth::user();
            $leaveApplication = LeaveApplication::with('leaveTypes')->where('user_id', '=' , $user->id)->get();
            return response()->json($leaveApplication->toArray());
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    public function getAllLeaveApplications()
    {
        try{
            $leaveApplication = LeaveApplication::with('leaveTypes')->get();
            return response()->json($leaveApplication->toArray());
        }catch (\Exception $e){
            return $this->sendError($e, [], 500);
        }
    }

    public function applyForSickDocApproval(Request $request)
    {
        try {
            $sickDocument = null;
            $checkImgExist = LeaveApplication::where('attachment', '=', $request->attachment)->first();
            if(!empty($checkImgExist)){
                $sickDocument = $request->attachment;
            }elseif($request->attachment === null){
                $sickDocument = null;
            }else{
                $file = $request->file('attachment');
                $filename = str_replace(' ', '_', $file->getClientOriginalName());
                $sickDocument = date('His').'-'.$filename;
                $file->move('images/sickDocs', $sickDocument);
            }

            $sickDocUpload = LeaveApplication::updateOrCreate(['id' => $request->id],[
                'attachment' => $sickDocument??null,
                'leave_status' => 0
            ]);
            return $this->sendResponse($sickDocUpload, 'Sick Doc Uploaded successfully.', 200);
        } catch (\Exception $e) {
            return $this->sendError($e, [], 500);
        }
    }
}
