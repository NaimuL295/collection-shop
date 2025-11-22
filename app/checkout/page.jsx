// "use client";

// import { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { 
//   Minus, 
//   Plus, 
//   Trash2, 
//   ShoppingCart, 
//   Truck,
//   CreditCard,
//   MapPin,
//   User,
//   Mail,
//   Phone,
//   Home
// } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";

// // Safe number helper function
// const safeNumber = (value, fallback = 0) => {
//   if (value === null || value === undefined || value === "") return fallback;
//   const num = Number(value);
//   return isNaN(num) ? fallback : num;
// };

// export default function Checkout() {
//   const {user} =useAuth()
//   const [cart, setCart] = useState([]);
//   const [users, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   // Form fields
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [address, setAddress] = useState("");
//   const [city, setCity] = useState("");
//   const [postalCode, setPostalCode] = useState("");
//   const [country, setCountry] = useState("Bangladesh");

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    
//     // Clean and validate cart data
//     const cleanedCart = storedCart.map(item => ({
//       ...item,
//       // Ensure all number fields are valid
//       price: safeNumber(item.price, 0),
//       offerprice: safeNumber(item.offerprice, 0),
//       // Handle both 'quantity' and 'qty' field names
//       quantity: safeNumber(item.quantity || item.qty, 1),
//       qty: safeNumber(item.quantity || item.qty, 1),
//     })).filter(item => item._id); // Remove items without ID
    
//     setCart(cleanedCart);
    
//     // Get user from localStorage
//     const userData = JSON.parse(localStorage.getItem("user")) || {};
//     if (userData) {
//       setUser(userData);
//       setName(userData.name || "");
//       setEmail(userData.email || "");
//       setPhone(userData.phone || "");
//       setAddress(userData.address?.street || "");
//       setCity(userData.address?.city || "");
//       setPostalCode(userData.address?.postalCode || "");
//     }
//   }, []);

//   // Safe price formatter
//   const formatPrice = (price) => {
//     const num = safeNumber(price);
//     return num.toFixed(2);
//   };

//   // Get item price safely
//   const getItemPrice = (item) => {
//     const offerPrice = safeNumber(item.offerprice);
//     const regularPrice = safeNumber(item.price);
//     return offerPrice > 0 ? offerPrice : regularPrice;
//   };

//   // Get item quantity safely
//   const getItemQuantity = (item) => {
//     return safeNumber(item.quantity || item.qty, 1);
//   };

//   // Update quantity safely
//   const updateQuantity = (id, newQty) => {
//     const quantity = safeNumber(newQty, 1);
//     if (quantity < 1) return;
    
//     const updatedCart = cart.map(item =>
//       item._id === id ? { 
//         ...item, 
//         quantity: quantity,
//         qty: quantity 
//       } : item
//     );
//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//   };

//   const removeItem = (id) => {
//     const updatedCart = cart.filter(item => item._id !== id);
//     setCart(updatedCart);
//     localStorage.setItem("cart", JSON.stringify(updatedCart));
//     toast.success("Item removed from cart");
//   };

//   // Calculate totals safely
//   const calculateSubtotal = () => {
//     return cart.reduce((acc, item) => {
//       const price = getItemPrice(item);
//       const quantity = getItemQuantity(item);
//       return acc + (price * quantity);
//     }, 0);
//   };

//   const subtotal = calculateSubtotal();
//   const shipping = subtotal > 500 ? 0 : 50;
//   const total = subtotal + shipping;

// //   const handleCheckout = async () => {
// //     if (!name || !email || !phone || !address || !city || !postalCode) {
// //       toast.error("Please fill all required fields");
// //       return;
// //     }

// //     if (cart.length === 0) {
// //       toast.error("Your cart is empty");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const orderData = {
// //         items: cart.map(item => ({
// //           product: item._id,
// //           name: item.name || "Unknown Product",
// //           image: item.images?.[0]?.url || item.image || "/default-product.jpg",
// //           price: getItemPrice(item),
// //           quantity: getItemQuantity(item),
// //           size: item.selectedSize || "",
// //           color: item.selectedColor || "",
// //           total: getItemPrice(item) * getItemQuantity(item)
// //         })),
// //         shippingInfo: {
// //           name,
// //           email,
// //           phone,
// //           address,
// //           city,
// //           postalCode,
// //           country
// //         },
// //         totalAmount: total,
// //         userId: user?._id || null
// //       };

// //       const response = await fetch("/api/checkout", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify(orderData),
// //       });

// //       const result = await response.json();

// //       if (result.success) {
// //         window.location.href = result.paymentUrl;
// //       } else {
// //         toast.error(result.message);
// //       }
// //     } catch (error) {
// //       toast.error("Checkout failed. Please try again.");
// //       console.error("Checkout error:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
// // console.log(cart);
// const handleCheckout = async () => {
//   // Check login
//   if (!user?._id) {
//     toast.error("Please login before checkout");
//     router.push("/login"); // Redirect to login page
//     return;
//   }

//   if (!name || !email || !phone || !address || !city || !postalCode) {
//     toast.error("Please fill all required fields");
//     return;
//   }

//   if (cart.length === 0) {
//     toast.error("Your cart is empty");
//     return;
//   }

//   setLoading(true);

//   try {
//     const orderData = {
//       items: cart.map(item => ({
//         product: item._id,
//         name: item.name || "Unknown Product",
//         image: item.images?.[0]?.url || item.image || "/default-product.jpg",
//         price: getItemPrice(item),
//         quantity: getItemQuantity(item),
//         size: item.selectedSize || "",
//         color: item.selectedColor || "",
//         total: getItemPrice(item) * getItemQuantity(item)
//       })),
//       shippingInfo: {
//         name,
//         email,
//         phone,
//         address,
//         city,
//         postalCode,
//         country
//       },
//       totalAmount: total,
//       userId: user?._id,  // always send valid user id now
//     };

//     const response = await fetch("/api/checkout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(orderData),
//     });

//     const result = await response.json();

//     if (result.success) {
//       window.location.href = result.paymentUrl;
//     } else {
//       toast.error(result.message);
//     }
//   } catch (error) {
//     toast.error("Checkout failed. Please try again.");
//     console.error("Checkout error:", error);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <Toaster position="top-right" />
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center gap-3 mb-8">
//           <ShoppingCart className="w-8 h-8 text-blue-600" />
//           <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
//         </div>

//         {cart.length === 0 ? (
//           <div className="text-center py-16">
//             <div className="text-5xl mb-4">😔</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">
//               Your cart is empty
//             </h3>
//             <p className="text-gray-600 mb-4">Add products to place an order</p>
//             <button
//               onClick={() => router.push("/products")}
//               className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
//             >
//               <ShoppingCart className="w-4 h-4" />
//               Continue Shopping
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Checkout Form */}
//             <div className="space-y-6">
//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center gap-2 mb-4">
//                   <MapPin className="w-5 h-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Shipping Information</h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Full Name *"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="email"
//                       placeholder="Email *"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div className="relative">
//                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="tel"
//                       placeholder="Phone Number *"
//                       value={phone}
//                       onChange={(e) => setPhone(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="City *"
//                       value={city}
//                       onChange={(e) => setCity(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <div className="relative">
//                     <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//                     <input
//                       type="text"
//                       placeholder="Postal Code *"
//                       value={postalCode}
//                       onChange={(e) => setPostalCode(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                   <select
//                     value={country}
//                     onChange={(e) => setCountry(e.target.value)}
//                     className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="Bangladesh">Bangladesh</option>
//                     <option value="Other">Other</option>
//                   </select>
//                 </div>
//                 <div className="relative mt-4">
//                   <Home className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
//                   <textarea
//                     placeholder="Full Address *"
//                     value={address}
//                     onChange={(e) => setAddress(e.target.value)}
//                     rows={3}
//                     className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-lg shadow">
//                 <div className="flex items-center gap-2 mb-4">
//                   <CreditCard className="w-5 h-5 text-blue-600" />
//                   <h2 className="text-xl font-semibold">Payment Method</h2>
//                 </div>
              
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="bg-white p-6 rounded-lg shadow h-fit sticky top-8">
//               <div className="flex items-center gap-2 mb-4">
//                 <ShoppingCart className="w-5 h-5 text-blue-600" />
//                 <h2 className="text-xl font-semibold">Order Summary</h2>
//               </div>
              
//               {/* Cart Items */}
//               <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
//                 {cart.map((item) => {
//                   const itemPrice = getItemPrice(item);
//                   const itemQuantity = getItemQuantity(item);
//                   const itemTotal = itemPrice * itemQuantity;

//                   return (
//                     <div key={item._id} className="flex items-center space-x-4 border-b pb-4">
//                     <div className="relative w-16 h-16 flex-shrink-0">
//   <Image
//     src={item.images?.[0]?.url || "/default-product.jpg"}
//     alt={item.name || "Product"}
//     width={64}
//     height={64}
//     className="w-16 h-16 object-cover rounded"
//     onError={(e) => {
//       e.target.src = "/default-product.jpg";
//     }}
//   />
// </div>

//                       <div className="flex-1 min-w-0">
//                         <h3 className="font-medium text-sm truncate">{item.name || "Unknown Product"}</h3>
//                         <p className="text-gray-600 text-xs">
//                           ${formatPrice(itemPrice)} x {itemQuantity} {item.packtype || "pack"}
//                         </p>
//                         {item.selectedSize && (
//                           <p className="text-gray-500 text-xs">Size: {item.selectedSize}</p>
//                         )}
//                         {item.selectedColor && (
//                           <p className="text-gray-500 text-xs">Color: {item.selectedColor}</p>
//                         )}
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <button
//                           onClick={() => updateQuantity(item._id, itemQuantity - 1)}
//                           className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
//                         >
//                           <Minus className="w-3 h-3" />
//                         </button>
//                         <span className="w-8 text-center text-sm font-medium">{itemQuantity}</span>
//                         <button
//                           onClick={() => updateQuantity(item._id, itemQuantity + 1)}
//                           className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
//                         >
//                           <Plus className="w-3 h-3" />
//                         </button>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-semibold text-sm">
//                           ${formatPrice(itemTotal)}
//                         </p>
//                         <button
//                           onClick={() => removeItem(item._id)}
//                           className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 text-xs mt-1"
//                         >
//                           <Trash2 className="w-3 h-3" />
//                           Remove
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>

//               {/* Price Breakdown */}
//               <div className="space-y-3">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Sub-Total:</span>
//                   <span className="font-medium">${formatPrice(subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600 flex items-center gap-1">
//                     <Truck className="w-4 h-4" />
//                     Shipping:
//                   </span>
//                   <span className="font-medium">
//                     {shipping === 0 ? "FREE" : `$${formatPrice(shipping)}`}
//                   </span>
//                 </div>
//                 {subtotal < 500 && (
//                   <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
//                     Add ${formatPrice(500 - subtotal)} more for free shipping!
//                   </p>
//                 )}
//                 <div className="border-t pt-3 flex justify-between font-bold text-lg">
//                   <span>Total:</span>
//                   <span className="text-blue-600">${formatPrice(total)}</span>
//                 </div>
//               </div>

//               <button
//                 onClick={handleCheckout}
//                 disabled={loading}
//                 className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
//               >
//                 <CreditCard className="w-5 h-5" />
//                 {loading ? "Processing..." : `Pay $${formatPrice(total)}`}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Minus, Plus, Trash2, ShoppingCart, Truck, CreditCard,
  MapPin, User, Mail, Phone, Shield, Clock, Gift,
  Heart, Star, Crown, Gem, Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const safeNumber = (value, fallback = 0) => {
  if (!value) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

// Premium payment options with icons
const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, popular: true },
  { id: "cod", name: "Cash on Delivery", icon: Truck },
  { id: "bank", name: "Bank Transfer", icon: Gem },
  { id: "digital", name: "Digital Wallet", icon: Sparkles }
];

// Trust badges
const trustBadges = [
  { icon: Shield, text: "Secure Payment" },
  { icon: Clock, text: "Fast Delivery" },
  { icon: Gift, text: "Gift Wrapping" }
];

export default function Checkout() {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [orderNotes, setOrderNotes] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh"
  });

  // Load cart
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const cleanedCart = storedCart.map(item => ({
      ...item,
      quantity: safeNumber(item.quantity || item.qty, 1),
      qty: safeNumber(item.quantity || item.qty, 1),
    }));
    setCart(cleanedCart);
  }, []);

  // Autofill user
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.street || "",
        city: user.address?.city || "",
        postalCode: user.address?.postalCode || ""
      }));
    }
  }, [user]);

  const updateQuantity = (id, qty) => {
    qty = safeNumber(qty, 1);
    if (qty < 1) return;

    const updatedCart = cart.map(item =>
      item._id === id ? { ...item, quantity: qty, qty } : item
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

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => {
      const price = safeNumber(item.price || item.salePrice || 0);
      return sum + (price * safeNumber(item.quantity, 1));
    }, 0);

    const shipping = subtotal > 500 ? 0 : 60;
    const tax = subtotal * 0.05; // 5% tax
    const giftWrapFee = giftWrap ? 50 : 0;
    const total = subtotal + shipping + tax + giftWrapFee;

    return { subtotal, shipping, tax, giftWrapFee, total };
  };

  const { subtotal, shipping, tax, giftWrapFee, total } = calculateTotals();

const handleCheckout = async () => {
  if (!user?._id) {
    toast.error("Please login before checkout");
    router.push("/login");
    return;
  }

  const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'postalCode'];
  const missingField = requiredFields.find(field => !formData[field]);
  
  if (missingField) {
    toast.error(`Please fill in ${missingField}`);
    return;
  }

  if (cart.length === 0) {
    toast.error("Your cart is empty");
    return;
  }

  setLoading(true);

  try {
    const { total } = calculateTotals(); // totalAmount

    const orderData = {
      items: cart.map(item => ({
        product: item._id,
        name: item.name,
        image: item.images?.[0]?.url || "",
        price: item.price || item.salePrice || 0,
        quantity: item.quantity,
        total: safeNumber(item.price || item.salePrice, 0) * safeNumber(item.quantity, 1)
      })),
      shippingInfo: formData,
      paymentMethod: selectedPayment,
      orderNotes,
      giftWrap,
      userId: user._id,
      totalAmount: safeNumber(total, 0)
    };

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (result.success) {
      // Cart empty করা
      console.log(result.success);
      
      localStorage.removeItem("cart");

      // SSLCommerz payment page redirect
    window.location.href = result.url; // 'url', না যে 'paymentUrl'

    } else {
      toast.error(result.error || "Checkout failed. Please try again.");
    }
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error("Checkout failed. Please try again.");
  } finally {
    setLoading(false);
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8">
      <Toaster position="top-right" />
      
      {/* Premium Header */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-10 h-10 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{cart.length}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Checkout
            </h1>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure Checkout</span>
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className="flex items-center text-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <span className="ml-2 font-medium">Cart</span>
            </div>
            <div className="w-16 h-1 bg-blue-300 mx-4"></div>
            <div className="flex items-center text-blue-600">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <span className="ml-2 font-medium">Details</span>
            </div>
            <div className="w-16 h-1 bg-blue-300 mx-4"></div>
            <div className="flex items-center text-gray-400">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-sm">3</span>
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some products to continue shopping</p>
          <button 
            onClick={() => router.push("/products")}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Forms */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Shipping Information */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Shipping Information</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Full Name *</label>
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address *</label>
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                        placeholder="+880 1XXX-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">City *</label>
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                        placeholder="Your city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Postal Code *</label>
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200" 
                        placeholder="1230"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Country</label>
                      <select 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                        value={formData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                      >
                        <option>Bangladesh</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <label className="text-sm font-medium text-gray-700">Full Address *</label>
                    <textarea
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 h-24 resize-none"
                      placeholder="Enter your complete address with area and street details"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-white" />
                    <h2 className="text-xl font-bold text-white">Payment Method</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <div key={method.id} className="relative">
                          <input
                            type="radio"
                            name="payment"
                            id={method.id}
                            checked={selectedPayment === method.id}
                            onChange={() => setSelectedPayment(method.id)}
                            className="hidden"
                          />
                          <label
                            htmlFor={method.id}
                            className={`block p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              selectedPayment === method.id
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedPayment === method.id
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                              }`}>
                                {selectedPayment === method.id && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                              <Icon className={`w-5 h-5 ${
                                selectedPayment === method.id ? 'text-blue-600' : 'text-gray-400'
                              }`} />
                              <span className="font-medium">{method.name}</span>
                              {method.popular && (
                                <span className="ml-auto px-2 py-1 text-xs bg-blue-500 text-white rounded-full">
                                  Popular
                                </span>
                              )}
                            </div>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Options</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Gift Wrapping</p>
                          <p className="text-sm text-gray-600">Add premium gift wrapping (+৳50)</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={giftWrap}
                          onChange={(e) => setGiftWrap(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Order Notes (Optional)</label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 h-20 resize-none"
                        placeholder="Any special instructions or notes for your order..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6">
                  <h2 className="text-xl font-bold text-white">Order Summary</h2>
                </div>
                
                <div className="p-6">
                  {/* Cart Items */}
                  <div className="space-y-4 max-h-80 overflow-y-auto mb-6">
                    {cart.map(item => (
                      <div key={item._id} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <Image
                          src={item.images?.[0]?.url || "/default-product.jpg"}
                          width={60}
                          height={60}
                          className="rounded-lg object-cover border border-blue-200"
                          alt={item.name}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-blue-600 font-semibold">
                            ৳{safeNumber(item.price || item.salePrice || 0).toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-200"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs hover:bg-blue-200"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item._id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">৳{subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? 'Free' : `৳${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tax (5%)</span>
                      <span className="font-medium">৳{tax.toFixed(2)}</span>
                    </div>
                    
                    {giftWrap && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Gift Wrapping</span>
                        <span className="font-medium">৳{giftWrapFee.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                      <span>Total</span>
                      <span className="text-blue-600">৳{total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                    {trustBadges.map((badge, index) => {
                      const Icon = badge.icon;
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <Icon className="w-5 h-5 text-blue-500 mb-1" />
                          <span className="text-xs text-gray-600">{badge.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay ৳${total.toFixed(2)}`
                    )}
                  </button>
                  
                  <p className="text-xs text-center text-gray-500 mt-3">
                    By completing your purchase, you agree to our terms of service
                  </p>
                </div>
              </div>

              {/* Security Badge */}
              <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Secure Checkout</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}