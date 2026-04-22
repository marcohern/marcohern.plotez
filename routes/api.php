<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PlotController;
use Illuminate\Support\Facades\Route;

Route::apiResource('categories', CategoryController::class);
Route::apiResource('plots', PlotController::class);
