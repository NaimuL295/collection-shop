"use client";
import { useSearchParams } from "next/navigation";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
      <p>Your order ID: <strong>{orderId}</strong></p>
      <p>Thank you for your purchase.</p>
    </div>
  );
}
