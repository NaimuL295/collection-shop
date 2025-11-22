import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    await dbConnect();

    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const tranId = params.get("tran_id");

    if (!tranId) {
      return NextResponse.json({ success: false, message: "Transaction ID missing" }, { status: 400 });
    }

    const order = await Order.findById(tranId);

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Update order status
    order.paymentInfo.status = "paid";
    order.orderStatus = "processing";
    await order.save();

    // Redirect user to order-success page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?order=${tranId}`);
  } catch (error) {
    console.error("Payment Success Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
