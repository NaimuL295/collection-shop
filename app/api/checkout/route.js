// app/api/checkout/route.js

import { dbConnect } from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    await dbConnect();
    
    const { items, shippingInfo, totalAmount, userId } = await request.json();

    // Validate stock
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product ${item.name} not found` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { 
            success: false, 
            message: `Insufficient stock for ${item.name}. Available: ${product.stock}` 
          },
          { status: 400 }
        );
      }
    }

    // Create order
    const order = await Order.create({
      user: userId,
      items: items.map(item => ({
        ...item,
        price: item.offerprice || item.price,
        total: (item.offerprice || item.price) * item.quantity
      })),
      shippingInfo,
      totalAmount,
      paymentInfo: {
        method: "sslcommerz",
        status: "pending"
      }
    });

    // Initialize SSLCommerz payment
    const sslResponse = await initSSLCommerzPayment(order);

    return NextResponse.json({
      success: true,
      orderId: order._id,
      paymentUrl: sslResponse.GatewayPageURL,
      sessionKey: sslResponse.sessionkey
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function initSSLCommerzPayment(order) {
  const data = {
    store_id: process.env.SSLCOMMERZ_STORE_ID,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD,
    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id: order._id.toString(),
    success_url: `${process.env.NEXTAUTH_URL}/api/payment/sslcommerz/success`,
    fail_url: `${process.env.NEXTAUTH_URL}/api/payment/sslcommerz/fail`,
    cancel_url: `${process.env.NEXTAUTH_URL}/api/payment/sslcommerz/cancel`,
    ipn_url: `${process.env.NEXTAUTH_URL}/api/payment/sslcommerz/ipn`,
    shipping_method: "Courier",
    product_name: "Fashion Products",
    product_category: "Fashion",
    product_profile: "physical-goods",
    cus_name: order.shippingInfo.name,
    cus_email: order.shippingInfo.email,
    cus_add1: order.shippingInfo.address,
    cus_city: order.shippingInfo.city,
    cus_postcode: order.shippingInfo.postalCode,
    cus_country: order.shippingInfo.country,
    cus_phone: order.shippingInfo.phone,
    ship_name: order.shippingInfo.name,
    ship_add1: order.shippingInfo.address,
    ship_city: order.shippingInfo.city,
    ship_postcode: order.shippingInfo.postalCode,
    ship_country: order.shippingInfo.country,
  };

  const response = await fetch("https://sandbox.sslcommerz.com/gwprocess/v4/api.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  });

  return await response.json();
}