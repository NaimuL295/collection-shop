// app/api/payment/sslcommerz/success/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function POST(request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const { tran_id, status, val_id } = data;

    // Update order status
    const order = await Order.findById(tran_id);
    if (order) {
      order.paymentInfo.status = status === "VALID" ? "paid" : "failed";
      order.paymentInfo.transactionId = val_id;
      order.paymentInfo.sslcommerzData = data;
      
      if (status === "VALID") {
        order.orderStatus = "processing";
        
        // Update product stock
        for (let item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } }
          );
        }
      }

      await order.save();
    }

    // Redirect to frontend success page
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/checkout/success?orderId=${tran_id}`
    );

  } catch (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/checkout/error`
    );
  }
}