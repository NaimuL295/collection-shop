"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const increaseQty = (productId) => {
    const newCart = cart.map((item) =>
      item._id === productId ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(newCart);
    toast.success("Quantity increased");
  };

  const decreaseQty = (productId) => {
    const newCart = cart
      .map((item) =>
        item._id === productId ? { ...item, qty: item.qty - 1 } : item
      )
      .filter((item) => item.qty > 0);
    updateCart(newCart);
    toast.success("Quantity decreased");
  };

  const removeItem = (productId) => {
    const newCart = cart.filter((item) => item._id !== productId);
    updateCart(newCart);
    toast.success("Item removed from cart");
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <h1 className="text-4xl font-bold text-gray-900 mb-8">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600">Add some products to continue shopping</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
                  <img src={item.image || "/placeholder.png"} alt={item.name} className="w-24 h-24 object-cover rounded"/>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500">
                      ${item.discountPrice || item.price} x {item.qty}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 bg-gray-100 rounded">{item.qty}</span>
                      <button
                        onClick={() => increaseQty(item._id)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="ml-auto text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
              <h3 className="text-xl font-semibold">Order Summary</h3>
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-bold">$0</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
