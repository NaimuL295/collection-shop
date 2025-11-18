"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Truck,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Home
} from "lucide-react";

// Safe number helper function
const safeNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Bangladesh");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Clean and validate cart data
    const cleanedCart = storedCart.map(item => ({
      ...item,
      // Ensure all number fields are valid
      price: safeNumber(item.price, 0),
      offerprice: safeNumber(item.offerprice, 0),
      // Handle both 'quantity' and 'qty' field names
      quantity: safeNumber(item.quantity || item.qty, 1),
      qty: safeNumber(item.quantity || item.qty, 1),
    })).filter(item => item._id); // Remove items without ID
    
    setCart(cleanedCart);
    
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    if (userData) {
      setUser(userData);
      setName(userData.name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setAddress(userData.address?.street || "");
      setCity(userData.address?.city || "");
      setPostalCode(userData.address?.postalCode || "");
    }
  }, []);

  // Safe price formatter
  const formatPrice = (price) => {
    const num = safeNumber(price);
    return num.toFixed(2);
  };

  // Get item price safely
  const getItemPrice = (item) => {
    const offerPrice = safeNumber(item.offerprice);
    const regularPrice = safeNumber(item.price);
    return offerPrice > 0 ? offerPrice : regularPrice;
  };

  // Get item quantity safely
  const getItemQuantity = (item) => {
    return safeNumber(item.quantity || item.qty, 1);
  };

  // Update quantity safely
  const updateQuantity = (id, newQty) => {
    const quantity = safeNumber(newQty, 1);
    if (quantity < 1) return;
    
    const updatedCart = cart.map(item =>
      item._id === id ? { 
        ...item, 
        quantity: quantity,
        qty: quantity 
      } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  // Calculate totals safely
  const calculateSubtotal = () => {
    return cart.reduce((acc, item) => {
      const price = getItemPrice(item);
      const quantity = getItemQuantity(item);
      return acc + (price * quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!name || !email || !phone || !address || !city || !postalCode) {
      toast.error("Please fill all required fields");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name || "Unknown Product",
          image: item.images?.[0]?.url || item.image || "/default-product.jpg",
          price: getItemPrice(item),
          quantity: getItemQuantity(item),
          size: item.selectedSize || "",
          color: item.selectedColor || "",
          total: getItemPrice(item) * getItemQuantity(item)
        })),
        shippingInfo: {
          name,
          email,
          phone,
          address,
          city,
          postalCode,
          country
        },
        totalAmount: total,
        userId: user?._id || null
      };

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        window.location.href = result.paymentUrl;
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Checkout failed. Please try again.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };
console.log();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">😔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-4">Add products to place an order</p>
            <button
              onClick={() => router.push("/products")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <ShoppingCart className="w-4 h-4" />
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="City *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Postal Code *"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="relative mt-4">
                  <Home className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                  <textarea
                    placeholder="Full Address *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white font-bold mr-3">
                      SSL
                    </div>
                    <div>
                      <p className="font-semibold">SSLCommerz</p>
                      <p className="text-sm text-gray-600">Secure payment gateway</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Order Summary</h2>
              </div>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.map((item) => {
                  const itemPrice = getItemPrice(item);
                  const itemQuantity = getItemQuantity(item);
                  const itemTotal = itemPrice * itemQuantity;

                  return (
                    <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        {/* <Image
                          src={item.images?.[0]?.url || item.image || "/default-product.jpg"}
                          alt={item.name || "Product"}
                          width={64}
                          height={64}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.target.src = "/default-product.jpg";
                          }}
                        /> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.name || "Unknown Product"}</h3>
                        <p className="text-gray-600 text-xs">
                          ${formatPrice(itemPrice)} x {itemQuantity} {item.packtype || "pack"}
                        </p>
                        {item.selectedSize && (
                          <p className="text-gray-500 text-xs">Size: {item.selectedSize}</p>
                        )}
                        {item.selectedColor && (
                          <p className="text-gray-500 text-xs">Color: {item.selectedColor}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item._id, itemQuantity - 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{itemQuantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, itemQuantity + 1)}
                          className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ${formatPrice(itemTotal)}
                        </p>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-xs mt-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sub-Total:</span>
                  <span className="font-medium">${formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Shipping:
                  </span>
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : `$${formatPrice(shipping)}`}
                  </span>
                </div>
                {subtotal < 500 && (
                  <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    Add ${formatPrice(500 - subtotal)} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-blue-600">${formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? "Processing..." : `Pay $${formatPrice(total)} via SSLCommerz`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}