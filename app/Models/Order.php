<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_email',
        'customer_address',
        'total_amount',
        'status',
        'tracking_number'
    ];

    // Una orden tiene muchos productos (Detalle)
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}