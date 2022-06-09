<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class PermissionController extends BaseController
{
    public function index()
    {
        try{
            $permissions = Permission::get();
            return response()->json($permissions);
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
    public function addPermission(Request $request)
    {
        try{
            $isPermissionExist = Permission::where('name', '=', $request->name)->first();
            if($isPermissionExist){
                return response()->json($isPermissionExist);
            }
            $input = $request->all();
            $permission = Permission::create($input);
            return $this->sendResponse($permission, 'Permission added successfully.', 200);
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
    public function getPermission($id)
    {
        try{
            $permission = Permission::find($id);
            return response()->json($permission);
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
    public function editPermission(Request $request)
    {
        try {
            $data = $request->all();
            $permission = Permission::updateOrCreate(['id' => $request->id],$data);
            return $this->sendResponse($permission, 'Permission has been updated successfully.', 200);
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
    public function deletePermission($id)
    {
        try{
            $permission = Permission::find($id)->delete();
            return $this->sendResponse($permission, 'Permission deleted successfully.', 200);
        }catch (\Exception $e) {
            // return $this->sendError('Something went wrong', $e->getMessage(), 500);
            return $this->sendError('something went wrong', [], 500);
        }
    }

}
