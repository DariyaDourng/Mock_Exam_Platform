<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class RoleController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles, 200);
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $role = Role::create($validated);

        return response()->json([
            'message' => 'Role created successfully.',
            'data' => $role
        ], 201);
    }

    // Display the specified resource
    public function show($id )
    {
        $role = Role::find($id);
        return response()->json($role, 200);
    }

    // Update the specified resource in storage
    public function update(Request $request, $id = 0)
    {
        try {
            $request->validate([
                'name'      => 'required|string|max:255',
                'description'     => 'nullable|string',
                

            ]);

            $roles = Role::select('id', 'name', 'description')
            ->findOrfail($id);


            if(!$roles){
                return response()->json([
                    'status'  => 'fail',
                    'message' => 'User not found'
                ], 500);
            }

            $roles->name          = $request->name;
            

            if($request->description ){
                $roles->description = $request->description;
            }

            $roles->save();

            return response()->json(
                [
                    'status'  => 'success',
                    'data'    => $roles,
                    'message' => 'Role updated successfully'
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

    // Remove the specified resource from storage
    public function destroy(Role $role)
    {
        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully.'
        ], 200);
    }

    public function search(Request $request)
    {
        try {

            $byName = $request->name??null;

            $role = New Role();

           
            if ($byName){
                $role = $role->where('name', 'like',"%$byName%");
            }
            

            $role = $role->get();

            return response()->json(
                [
                    'status'  => 'success',
                    'data'    => $role,
                    'message' => 'role found successfully'
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