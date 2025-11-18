// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],
    shippingInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentInfo: {
      method: {
        type: String,
        default: "sslcommerz"
      },
      transactionId: String,
      status: {
        type: String,
        enum: ["pending", "paid", "failed", "cancelled"],
        default: "pending",
      },
      sslcommerzData: Object,
    },
    totalAmount: Number,
    orderStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);