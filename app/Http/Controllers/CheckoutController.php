<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Models\Order;

class CheckoutController extends Controller
{
    // 1. Enviar los datos a Flow y crear la orden de pago
public function store(Request $request)
    {
        // ¡AQUÍ ESTÁN LAS VARIABLES QUE FALTABAN!
        // Recibimos el total desde React (o usamos 19.99 por defecto si hay un error al enviarlo)
        $totalUSD = $request->input('total') ?? 19.99; 
        $amountCLP = round($totalUSD * 950); 

        // 1. Crear la orden principal en la Base de Datos
        $order = new Order();
        $order->user_id = $request->user()->id;
        $order->customer_name = $request->user()->name; 
        $order->customer_email = $request->user()->email;
        $order->customer_address = 'Dirección no especificada'; 
        $order->total_amount = $totalUSD; // Aquí usamos $totalUSD sin problemas
        $order->status = 'pendiente'; 
        $order->save();

        // 2. Guardar el detalle del carrito
        $cart = $request->input('cart', []);
        foreach ($cart as $cartItem) {
            $order->items()->create([
                'design_id' => $cartItem['id'] ?? null, 
                'product_type' => 'merch',
                'quantity' => 1, 
                'price' => 19.99 
            ]);
        }

        // 3. Configurar Flow usando el ID de la orden real
        $commerceOrder = 'NP-' . $order->id;

        $params = [
            "amount" => $amountCLP, // Aquí usamos $amountCLP sin problemas
            "apiKey" => env('FLOW_API_KEY'),
            "commerceOrder" => $commerceOrder,
            "currency" => "CLP",
            "email" => 'poorfranph@gmail.com', // Tu correo real para evitar el error 1620
            "paymentMethod" => 9, 
            "subject" => "Orden NeoPrint",
            "urlConfirmation" => route('checkout.confirm'),
            "urlReturn" => route('checkout.return'),
        ];

        // 4. Firmar criptográficamente (Exigencia de Flow)
        $keys = array_keys($params);
        sort($keys);
        $toSign = "";
        foreach ($keys as $key) {
            $toSign .= $key . $params[$key]; 
        }
        $params['s'] = hash_hmac('sha256', $toSign, env('FLOW_SECRET_KEY'));

        // 5. Enviar a Flow
        $response = Http::asForm()->post(env('FLOW_URL') . '/payment/create', $params);
        $result = $response->json();

        // 6. Redirigir al portal de Webpay
        if (isset($result['url']) && isset($result['token'])) {
            $paymentUrl = $result['url'] . '?token=' . $result['token'];
            return Inertia::location($paymentUrl);
        }

        // Si algo falla, forzamos el error para verlo en pantalla
        dd('Error conectando con Flow:', $result);
    }

    // 2. Ruta a la que vuelve el usuario después de pagar (Éxito o Fracaso)
    public function returnUrl(Request $request)
    {
        $token = $request->token;

        // Aquí podrías consultar el estado del pago con el token si lo deseas
        // Por ahora, lo mandamos al panel con un mensaje
        return redirect()->route('checkout.success')->with('flow_token', $request->token);
    }
    public function success()
    {
        return Inertia::render('CheckoutSuccess');
    }

    // 3. Webhook: Flow llama a esta ruta de fondo para confirmar el pago (NUNCA la ve el usuario)
    public function confirm(Request $request)
    {
        try {
            $token = $request->input('token');

            // 1. Preguntarle a Flow el estado real de este pago
            $params = [
                "apiKey" => env('FLOW_API_KEY'),
                "token" => $token
            ];
            $keys = array_keys($params);
            sort($keys);
            $toSign = "";
            foreach ($keys as $key) {
                $toSign .= $key . $params[$key];
            }
            $params['s'] = hash_hmac('sha256', $toSign, env('FLOW_SECRET_KEY'));

            $response = Http::get(env('FLOW_URL') . '/payment/getStatus', $params);
            $result = $response->json();

            // 2. Si Flow dice que el status es 2 (Pagado)
            if (isset($result['status']) && $result['status'] == 2) {

                // Extraer el ID de la orden ('NP-5' -> 5)
                $orderId = str_replace('NP-', '', $result['commerceOrder']);

                // Buscar la orden y actualizarla
                $order = Order::find($orderId);
                if ($order) {
                    $order->status = 'pagado';
                    $order->save();
                }
            }

            // Flow exige que le respondamos un simple OK
            return response()->json(['status' => 'ok']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error procesando webhook'], 500);
        }
    }
}
