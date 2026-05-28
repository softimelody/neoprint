<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Design; 

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'design_id',
        'product_type',
        'price',
        'quantity'
    ];

    // Cada item pertenece a una orden
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Cada item está asociado a un diseño de arte
    public function design() 
    {
        return $this->belongsTo(Design::class); 
    }
}