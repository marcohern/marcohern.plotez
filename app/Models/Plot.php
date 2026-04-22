<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Plot extends Model
{
    protected $fillable = ['name', 'description', 'category_id', 'coordinates', 'area_sqm', 'hectares'];

    protected $casts = [
        'coordinates' => 'array',
        'area_sqm' => 'float',
        'hectares' => 'float',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
