<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\BaseController as BaseController;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class EmployeesController extends BaseController
{
    public function index()
    {
        try{
            $employees = User::with('profiles')->get();
            foreach ($employees as $key => $user) {
                $employees[$key]['roleName'] = $user->getRoleNames();
            }
            return response()->json($employees);
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }
    
    /**
     * @param $red
     * @return JsonResponse
     */
    public function addEmployee(Request $request)
    {
        try{
            $isEmpExist = User::where('email', '=', $request->email)->first();
            if($isEmpExist){
                return $this->sendResponse($isEmpExist, 'User Exist', 201);
            }
            $input = $request->all();
            $user = User::create($input);
            $user->assignRole($request->default_role);
            return $this->sendResponse($user, 'User added successfully.', 200);
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function getEmployee($id){
        try{
            $user = User::with('profiles')->find($id);
            $user['roleName'] = $user->getRoleNames();
            return response()->json($user);
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }

    /**
     * @param $red
     * @return JsonResponse
     */
    public function editEmployee(Request $request)
    {
        try {
            $user = User::updateOrCreate(['id' => $request->id],[
                'first_name' => $request->first_name??null,
                'last_name' => $request->last_name??null,
                'email' => $request->email
            ]);
            $user->syncRoles($request->default_role);
            return $this->sendResponse($user, 'User has been updated successfully.', 200);
        } catch (\Exception $e) {
            return $this->sendError('something went wrong', [], 500);
        }
    }

    /**
     * @param $red
     * @return JsonResponse
     */
    public function deleteEmployee($id)
    {
        try{
            $user = User::where('id', $id)->delete();
            return $this->sendResponse($user, 'User deleted successfully.', 200);
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }

    public function addOrEditProfile(Request $request)
    {
        try {
            $user = User::updateOrCreate(['id' => $request->id],[
                'first_name' => $request->first_name??null,
                'last_name' => $request->last_name??null
            ]);
           
            $ProfileImagePath = null;
            $checkImgExist = Profile::where('image_path', '=', $request->image_path)->first();
            if(!empty($checkImgExist)){
                $ProfileImagePath = $request->image_path;
            }elseif($request->image_path === null){
                $ProfileImagePath = null;
            }else{
                $file = $request->file('image_path');
                $filename = str_replace(' ', '_', $file->getClientOriginalName());
                $ProfileImagePath = date('His').'-'.$filename;
                $file->move('images', $ProfileImagePath);
            }

            $profile = Profile::updateOrCreate(['user_id' => $request->id],[
                'about' => $request->about??null,
                'image_path' => $ProfileImagePath??null,
                'dob' => $request->dob??null,
                'gender' => $request->gender??null
            ]);
            return $this->sendResponse($profile, 'User profile updated successfully.', 200);
        } catch (\Exception $e) {
            return $this->sendError('something went wrong', [], 500);
        }
    }
}
