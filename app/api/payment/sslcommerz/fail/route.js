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

    await Order.findByIdAndUpdate(tranId, {
      paymentInfo: { status: "failed" },
      orderStatus: "failed",
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`);
  } catch (error) {
    console.error("Payment Failed Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
