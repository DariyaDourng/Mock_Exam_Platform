<?php

namespace App\Http\Controllers;

use App\Http\Resources\SubjectResource;
use App\Models\Subject;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SubjectController extends Controller
{
    // Get all subjects
    public function index()
    {
        $subjects = Subject::all();

        if ($subjects->count() > 0) {
            return SubjectResource::collection($subjects);
        }

        return response()->json([
            'status' => false,
            'message' => 'No subjects found',
        ], 200);
    }

    // Store a new subject
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:subjects,name',
            'description' => 'nullable|string|max:255',
            'subject_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $imagePath = null;
            if ($request->hasFile('subject_image')) {
                $imagePath = $request->file('subject_image')->store('subject_images', 'public');
            }

            $subject = Subject::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'subject_image' => $imagePath,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Subject created successfully',
                'data' => new SubjectResource($subject)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Show a single subject
    public function show(Subject $subject)
    {
        $subject->subject_image = $subject->subject_image 
            ? asset('storage/' . $subject->subject_image)
            : null;

        return new SubjectResource($subject);
    }

    // Update a subject
    public function update(Request $request, Subject $subject)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:subjects,name,' . $subject->id,
            'description' => 'nullable|string|max:255',
            'subject_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = [
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'is_active' => $request->boolean('is_active', $subject->is_active),
            ];

            if ($request->hasFile('subject_image')) {
                if ($subject->subject_image) {
                    Storage::disk('public')->delete($subject->subject_image);
                }

                $imagePath = $request->file('subject_image')->store('subject_images', 'public');
                $data['subject_image'] = $imagePath;
            }

            $subject->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Subject updated successfully',
                'data' => new SubjectResource($subject)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Delete a subject
    public function destroy(Subject $subject)
    {
        try {
            if ($subject->subject_image) {
                Storage::disk('public')->delete($subject->subject_image);
            }

            $subject->delete();

            return response()->json([
                'status' => true,
                'message' => 'Subject deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
