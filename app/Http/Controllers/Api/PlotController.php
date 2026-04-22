<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plot;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlotController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Plot::with('category')->orderBy('name')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'coordinates' => 'required|array|min:3',
            'coordinates.*.lat' => 'required|numeric',
            'coordinates.*.lng' => 'required|numeric',
            'area_sqm' => 'required|numeric|min:0',
            'hectares' => 'required|numeric|min:0',
        ]);

        $plot = Plot::create($data);
        $plot->load('category');

        return response()->json($plot, 201);
    }

    public function show(Plot $plot): JsonResponse
    {
        return response()->json($plot->load('category'));
    }

    public function update(Request $request, Plot $plot): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'coordinates' => 'required|array|min:3',
            'coordinates.*.lat' => 'required|numeric',
            'coordinates.*.lng' => 'required|numeric',
            'area_sqm' => 'required|numeric|min:0',
            'hectares' => 'required|numeric|min:0',
        ]);

        $plot->update($data);
        $plot->load('category');

        return response()->json($plot);
    }

    public function destroy(Plot $plot): JsonResponse
    {
        $plot->delete();

        return response()->json(null, 204);
    }
}
