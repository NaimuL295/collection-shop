import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    await dbConnect();

    const bodyText = await request.text();
    const params = new URLSearchParams(bodyText);

    const tranId = params.get("tran_id");
    const status = params.get("status"); // VALID, FAILED, CANCELLED

    if (!tranId) {
      return NextResponse.json(
        { success: false, message: "Transaction ID missing" },
        { status: 400 }
      );
    }

    const order = await Order.findById(tranId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ Update order status based on SSLCommerz notification
    switch (status) {
      case "VALID":
        order.paymentInfo.status = "paid";
        order.orderStatus = "processing";
        break;
      case "FAILED":
        order.paymentInfo.status = "failed";
        order.orderStatus = "failed";
        break;
      case "CANCELLED":
        order.paymentInfo.status = "cancelled";
        order.orderStatus = "cancelled";
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Unknown status received" },
          { status: 400 }
        );
    }

    await order.save();

    // Return success response to SSLCommerz
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("IPN Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
