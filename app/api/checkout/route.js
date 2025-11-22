export const runtime = "nodejs"; // MUST

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
  

    const { items, shippingInfo, totalAmount, userId } = body;

    // Validation
    if (!userId) return NextResponse.json({ error: "User not logged in" }, { status: 400 });
    if (!items || items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    if (!totalAmount || Number(totalAmount) <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });

    // Create order
    const newOrder = await Order.create({
      user: userId,
      items,
      shippingInfo,
      totalAmount,
      paymentInfo: { method: "sslcommerz", status: "pending" },
      orderStatus: "pending",
    });

    const tran_id = newOrder._id.toString();

    // Base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // SSLCommerz data
    const sslData = {
      store_id: process.env.SSL_STORE_ID,
      store_passwd: process.env.SSL_STORE_PASSWORD,

      total_amount: Number(totalAmount).toString(),
      currency: "BDT",
      tran_id,

      success_url: `${baseUrl}/api/payment/sslcommerz/success`,
      fail_url: `${baseUrl}/api/payment/sslcommerz/fail`,
      cancel_url: `${baseUrl}/api/payment/sslcommerz/cancel`,
      ipn_url: `${baseUrl}/api/payment/sslcommerz/ipn`,

      cus_name: shippingInfo.name,
      cus_email: shippingInfo.email,
      cus_phone: shippingInfo.phone,
      cus_add1: shippingInfo.address,
      cus_city: shippingInfo.city,
      cus_postcode: shippingInfo.postalCode,
      cus_country: shippingInfo.country,

      product_name: "Ecommerce Order",
      product_category: "General",
      product_profile: "general",
    };

     console.log("SSL SEND =", sslData);

    // POST to SSLCommerz
    const response = await fetch(
      "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
      {
        method: "POST",
        body: new URLSearchParams(sslData),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const result = await response.json();
  

    if (!result.GatewayPageURL) {
      return NextResponse.json({ success: false, message: "SSLCommerz Failed", data: result }, { status: 500 });
    }

    // Send payment URL to frontend
    return NextResponse.json({
      success: true,
      url: result.GatewayPageURL, // frontend এ result.url ব্যবহার করতে হবে
      orderId: tran_id,
    });

  } catch (err) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
