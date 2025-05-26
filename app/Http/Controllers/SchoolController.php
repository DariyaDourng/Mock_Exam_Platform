<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Http\Resources\SchoolResource;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index()
    {
        $schools = School::latest()->get();

        if ($schools->count() >0 ){
            return SchoolResource::collection($schools);
        }

        return response()->json([
            'status'=> 200,
            'message'=> 'No schools found'
        ], 200);
    }

    public function store(StoreSchoolRequest $request)
    {
        try {
            $school = School::create($request->validated());
            
            return response()->json([
                'status' => 200,
                'message' => 'School created successfully',
                'data' => new SchoolResource($school),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                 'status' => 500,
                 'message' => 'Internal Server Error',
                 'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(School $school)
    {
        return new SchoolResource($school);
    }


    public function update(UpdateSchoolRequest $request, School $school)
    {
        try {
            $school->update($request->validated());
            
            return response()->json([
                'status' => 200,
                'message' => 'School updated successfully',
                'data' => new SchoolResource($school),
            ], 200);
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'data' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy( School $school)
    {
        try{
            $school ->delete();
            
            return response()->json([
                'status' => 200,
                'message' => 'School deleted successfully',
               
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'data' => $e->getMessage(),
            ], 500);
        }
    }
}
