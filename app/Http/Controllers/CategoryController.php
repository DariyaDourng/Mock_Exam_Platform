<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    // Get all categories
    public function index()
    {
        $categories = Category::all();
        if ($categories->count() > 0) {
            return CategoryResource::collection($categories);
        }
        return response()->json([
            'status' => false,
            'message' => 'No categories found',
        ], 200);
    }

    // Store a new category 
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string|max:255',
            'category_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
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
            if ($request->hasFile('category_image')) {
                $imagePath = $request->file('category_image')->store('category_images', 'public');
            }

            $category = Category::create([
                'name' => $request->input('name'),
                'description' => $request->input('description'),
                'category_image' => $imagePath,
                'is_active' => $request->boolean('is_active', true),
            ]);

            return response()->json([
                'status' => true,
                'message' => 'Category created successfully',
                'data' => new CategoryResource($category)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Show a single category
    public function show(Category $category)
    {
        $category->category_image = $category->category_image 
            ? asset('storage/' . $category->category_image)
            : null;

        return new CategoryResource($category);
    }

    // Update a category
    public function update(Request $request, Category $category)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string|max:255',
            'category_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
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
                'is_active' => $request->boolean('is_active', $category->is_active),
            ];
            if ($request->hasFile('category_image')) {
                if ($category->category_image) {
                    Storage::disk('public')->delete($category->category_image);
                }
                $imagePath = $request->file('category_image')->store('category_images', 'public');
                $data['category_image'] = $imagePath;
            }
            $category->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Category updated successfully',
                'data' => new CategoryResource($category)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Delete a category
    public function destroy(Category $category)
    {
        try {
            if ($category->category_image) {
                Storage::disk('public')->delete($category->category_image);
            }

            $category->delete();

            return response()->json([
                'status' => true,
                'message' => 'Category deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getTotalCategories()
{
    $totalCategories = Category::count();  // Or any other logic to count categories
    return response()->json([
        'status' => 200,
        'message' => 'Total categories fetched successfully',
        'data' => $totalCategories,
    ]);
}

public function getStudentAndExamCount(Category $category)
{
    try {
        // Count distinct students who have taken exams for this category
        $studentCount = \DB::table('exam_attempts')
            ->join('exams', 'exams.id', '=', 'exam_attempts.exam_id') // Join with 'exams'
            ->where('exams.category_id', $category->id)               // Filter by category
            ->distinct('exam_attempts.user_id')                      // Count distinct students (user_id)
            ->count('exam_attempts.user_id');                         // Count distinct students
        
        // Count total exams for this category
        $examCount = \DB::table('exams')
            ->where('exams.category_id', $category->id)               // Filter by category
            ->count();                                              // Count total exams
        
        return response()->json([
            'status' => true,
            'message' => 'Total students and exams count fetched successfully',
            'data' => [
                'student_count' => $studentCount,
                'exam_count' => $examCount
            ],
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Error fetching student and exam count',
            'error' => $e->getMessage(),
        ], 500);
    }
}
}
