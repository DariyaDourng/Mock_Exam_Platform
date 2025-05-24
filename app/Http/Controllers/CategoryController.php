<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::latest()->get();

        if ($categories->count() > 0) {
            return CategoryResource::collection($categories);
        }

        return response()->json([
            'status' => 200,
            'message' => 'No categories found',
        ], 200);
    }

    public function store(StoreCategoryRequest $request)
    {
        try {
            $category = Category::create($request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Category created successfully',
                'data' => new CategoryResource($category),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Category $category)
    {
        return new CategoryResource($category);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        try {
            $category->update($request->validated());

            return response()->json([
                'status' => 200,
                'message' => 'Category updated successfully',
                'data' => new CategoryResource($category),
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Category $category)
    {
        try {
            $category->delete();

            return response()->json([
                'status' => 200,
                'message' => 'Category deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
