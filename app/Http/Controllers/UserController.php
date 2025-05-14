<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {

            $perPage = $request->get('per_page', 10);

            $postions = User::query()
            ->select('id', 'name', 'email', 'phone_number', 'address', 'is_active', 'role_id')
            ->with(['role:id,name'])
            ->paginate($perPage);

            return response()->json([
                'data'    => $postions,
                'message' => 'List all of users'
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        try {
            $request->validate([
                'name'      => 'required|string|max:255',
                'email'     => 'required|string|email|max:255|unique:users',
                'password'  => 'required|string|min:6',
                'role_id'   => 'required|numeric|integer',
                'is_active' => 'required'

            ]);

            $user = new User();

            $user = $user->create([
                'name'          => $request->name,
                'email'         => $request->email,
                'password'      => Hash::make($request->password),
                'role_id'       => $request->role_id,
                'phone_number'  => $request->phone_number,
                'address'       => $request->address,
                'is_active'     => $request->is_active
            ]);

           
            return response()->json(
                [
                    'status'  => 'success',
                    'data'    => $user,
                    'message' => 'User created successfully'
                ]
            , Response::HTTP_CREATED);

        } catch (\Exception $e) {
            return response()->json(
                [
                    'status'  => 'fail',
                    'message' => 'Something went wrong: ' . $e->getMessage()
                ], 500);
        }
    }

    public function getById($id = 0)
    {
        try {

            $user = User::select('id', 'name', 'email', 'phone_number', 'address', 'is_active', 'role_id')
            ->with(['role:id,name'])
            ->findOrfail($id);


            if(!$user){
                return response()->json([
                    'status'  => 'fail',
                    'message' => 'User not found'
                ], Response::HTTP_BAD_REQUEST);
            }

            return response()->json(
                [
                    'status'  => 'success',
                    'data'    => $user,
                    'message' => ' Get user by id successfully'
                ]
            , 201);

        } catch (QueryException $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id = 0)
    {
        try {
            $request->validate([
                'name'      => 'required|string|max:255',
                'email'     => 'required|string|email|max:255',
                'role_id'   => 'required|numeric|integer',
                'is_active' => 'required'

            ]);

            $user = User::select('id', 'name', 'email', 'phone_number', 'address', 'is_active', 'role_id')
            ->with(['role:id,name'])
            ->findOrfail($id);


            if(!$user){
                return response()->json([
                    'status'  => 'fail',
                    'message' => 'User not found'
                ], 500);
            }

            if ($request->phone_number){
                $u = User::where('phone_number', $request->phone_number)->first();
                if ($u && $u->id != $user->id){
                    return response()->json([
                        'status'  => 'fail',
                        'message' => 'Phone number already exist'
                    ], 500);
                }
            }
            $user->name          = $request->name;
            $user->email         = $request->email;
            $user->role_id       = $request->role_id;
            $user->phone_number  = $request->phone_number??null;
            $user->address       = $request->address??null;
            $user->is_active     = $request->is_active;

            if($request->new_password ){
                $user->password      = Hash::make($request->new_password);
            }

            $user->save();

            return response()->json(
                [
                    'status'  => 'success',
                    'data'    => $user,
                    'message' => 'User updated successfully'
                ]
            , 201);

        } catch (QueryException $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }



    /**
     * Remove the specified resource from storage.
     */
    public function delete($id = 0)
    {
        try {

            $user = User::select('id', 'name', 'email', 'phone_number', 'address', 'is_active', 'role_id')
            ->with(['role:id,name'])
            ->findOrfail($id);


            if(!$user){
                return response()->json([
                    'status'  => 'fail',
                    'message' => 'User not found'
                ], Response::HTTP_BAD_REQUEST);
            }
            $user->delete();

            return response()->json(
                [
                    'status'  => 'success',
                    'data'    => $user,
                    'message' => ' User Deleted successfully'
                ]
            , 201);

        } catch (QueryException $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request)
    {
        try {

            $byEmail = $request->email??null;
            $byName = $request->name??null;
            $byRole = $request->role??null;

            $user = User::select('id', 'name', 'email', 'phone_number', 'address', 'is_active', 'role_id')
            ->with(['role:id,name']);

            if ($byEmail){
                $user = $user->where('email', 'like', "%$byEmail%");
            }
            if ($byName){
                $user = $user->where('name', 'like',"%$byName%");
            }
            if ($byRole){
                $user = $user->where('role_id', 'like',"%$byRole%");
            }

            $user = $user->get();

            return response()->json(
                [
                    'status'  => 'success',
                    'data'    => $user,
                    'message' => 'User found successfully'
                ]
            , 201);

        } catch (QueryException $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            return response()->json(
            [
                'status'  => 'fail',
                'message' => 'Something went wrong: ' . $e->getMessage()
            ], 500);
        }
    }

    

}
