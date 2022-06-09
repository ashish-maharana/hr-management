<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class RoleController extends BaseController
{
    public function index()
    {
        try{
            $roles = Role::get();
            return response()->json($roles);
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addRole(Request $request)
    {
        try{
            $isRoleExist = Role::where('name', '=', $request->name)->first();
            if($isRoleExist){
                return $this->sendResponse($isRoleExist, 'Role Exist', 201);
            }
            $input = $request->all();
            $role = Role::create($input);
            return $this->sendResponse($role, 'Role added successfully.', 200);
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getRole($id)
    {
        try{
            $role = Role::find($id);
            return response()->json($role);
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }

    public function getAllRoles()
    {
        try{
            $roles = Role::get();
            return response()->json($roles->toArray());
        }catch (\Exception $e){
            return $this->sendError('something went wrong', [], 500);
        }
    }
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function editRole(Request $request)
    {
        try {
            $data = $request->all();
            $role = Role::updateOrCreate(['id' => $request->id],$data);
            return $this->sendResponse($role, 'Role has been updated successfully.', 200);
        } catch (\Exception $e) {
            return $this->sendError('something went wrong', [], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteRole($id)
    {
        try{
            $role = Role::find($id)->delete();
            return $this->sendResponse($role, 'Role deleted successfully.', 200);
        }catch (\Exception $e) {
            // return $this->sendError('Something went wrong', $e->getMessage(), 500);
            return $this->sendError('something went wrong', [], 500);
        }
    }

}
