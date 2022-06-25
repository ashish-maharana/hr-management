<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmployeesController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\LeaveController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('/employees')->group(function () {
        Route::get('/', [EmployeesController::class, 'index']);
        Route::post('/add-employee', [EmployeesController::class, 'addEmployee']);
        Route::post('/edit-employee', [EmployeesController::class, 'editEmployee']);
        Route::post('/add-or-edit-profile', [EmployeesController::class, 'addOrEditProfile']);
        Route::get('/get-employee/{id}', [EmployeesController::class, 'getEmployee']);
        Route::post('/delete-employee/{id}', [EmployeesController::class, 'deleteEmployee']);
    });

    Route::prefix('/roles')->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::get('/get-all-roles', [RoleController::class, 'getAllRoles']);
        Route::post('/add-role', [RoleController::class, 'addRole']);
        Route::post('/edit-role', [RoleController::class, 'editRole']);
        Route::get('/get-role/{id}', [RoleController::class, 'getRole']);
        Route::post('/delete-role/{id}', [RoleController::class, 'deleteRole']);
    });

    Route::prefix('/permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index']);
        Route::get('/get-all-permissions', [PermissionController::class, 'getAllPermissions']);
        Route::post('/add-permission', [PermissionController::class, 'addPermission']);
        Route::post('/edit-permission', [PermissionController::class, 'editPermission']);
        Route::get('/get-permission/{id}', [PermissionController::class, 'getPermission']);
        Route::post('/delete-permission/{id}', [PermissionController::class, 'deletePermission']);
    });

    Route::prefix('/leave-types')->group(function () {
        Route::get('/', [LeaveController::class, 'index']);
        Route::get('/get-all-leave-types', [LeaveController::class, 'getAllLeaveTypes']);
        Route::post('/add-leave-type', [LeaveController::class, 'addLeaveType']);
        Route::post('/edit-leave-type', [LeaveController::class, 'editLeaveType']);
        Route::get('/get-leave-type/{id}', [LeaveController::class, 'getLeaveType']);
        Route::post('/delete-leave-type/{id}', [LeaveController::class, 'deleteLeaveType']);
    });

    Route::prefix('/leave-applications')->group(function () {
        Route::get('/', [LeaveController::class, 'getAllLeaveApplications']);
        Route::get('/get-all-leave-applications', [LeaveController::class, 'getAllLeaveApplicationsOfEmp']);
        Route::post('/apply-leave-application', [LeaveController::class, 'applyLeaveApplication']);
        Route::post('/apply-for-sick-doc-approval', [LeaveController::class, 'applyForSickDocApproval']);
        Route::post('/action-on-leave-application', [LeaveController::class, 'actionOnLeaveApplication']);
        Route::post('/edit-leave-application', [LeaveController::class, 'editLeaveApplication']);
        Route::get('/get-leave-applicaition/{id}', [LeaveController::class, 'getLeaveApplication']);
        Route::post('/delete-leave-application/{id}', [LeaveController::class, 'deleteLeaveApplication']);
    });
});
