<?php
   
namespace App\Http\Controllers\Auth;
   
use Illuminate\Http\Request;
use App\Http\Controllers\BaseController;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthController extends BaseController
{
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function register(Request $request)
    {
        $isEmailExist = User::where('email', '=', $request->email)->first();
        if($isEmailExist){
            return response()->json($isEmailExist);
        }
        $user = User::create([
            'first_name' => $request->first_name??null,
            'last_name' => $request->last_name??null,
            'email' => $request->email,
            'password' => bcrypt($request->password)
        ]);
        $user->assignRole($request->default_role);
        if(Auth::attempt($request->only('email','password'))) {
            $user = Auth::user();
            $success = [];
            if($user){
                $success['token'] = $user->createToken($user->email)->plainTextToken;
                $success['user'] =  $user;
            }
            if($request->default_role === "Employee"){
                return $this->sendResponse($success, 'Register successfully.',200);
            }
        }else{
            return $this->sendError('User registration failed.', 500);
        }
    }

    /**
     * @throws Exception
     */
    public function login(Request $request)
    {
        try{
            if(Auth::attempt($request->only('email', 'password'))){
                $user = Auth::user();
                $success = [];
                if($user){
                    $success['token'] = $user->createToken($user->email)->plainTextToken;
                    $success['user'] =  $user;
                    $success['user']['roleName'] = $user->getRoleNames();
                }
                return $this->sendResponse($success, 'User login successfully.', 200);
            }
        }catch (\Exception $e){
            return $this->sendError($e->getMessage(), [], 500);
        }
    }
}