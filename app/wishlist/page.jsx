"use client";

import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2, ArrowLeft, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  // Load wishlist from localStorage
  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = () => {
    if (typeof window !== "undefined") {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(savedWishlist);
      setLoading(false);
    }
  };

  // ------------------------------
  //  REMOVE FROM WISHLIST - SINGLE ITEM
  // ------------------------------

  const removeFromWishlist = async (productId, productName) => {
    if (typeof window === "undefined") return;

    setRemovingId(productId);

    try {
      // Remove from API
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Remove from local storage and state
        const updatedWishlist = wishlist.filter(item => item._id !== productId);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

        toast.success(`Removed ${productName} from wishlist 💔`, {
          icon: '❌',
          duration: 3000,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
        });
      } else {
        throw new Error(data.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error);
      
      // Fallback: Remove from localStorage only if API fails
      const updatedWishlist = wishlist.filter(item => item._id !== productId);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      toast.error("Failed to remove from wishlist, removed locally", {
        icon: '⚠️',
        duration: 3000,
      });
    } finally {
      setRemovingId(null);
    }
  };

  // ------------------------------
  //  CLEAR ALL WISHLIST
  // ------------------------------

  const clearAllWishlist = async () => {
    if (typeof window === "undefined" || wishlist.length === 0) return;

    try {
      // Get user ID from localStorage or context (adjust based on your auth)
      const userId = localStorage.getItem("userId") || "current-user"; // Adjust based on your auth

      const response = await fetch(`/api/wishlist/clear?userId=${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Clear local storage and state
        setWishlist([]);
        localStorage.setItem("wishlist", JSON.stringify([]));

        toast.success(`Cleared all ${wishlist.length} items from wishlist 🗑️`, {
          icon: '💔',
          duration: 4000,
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
        });
      } else {
        throw new Error(data.message || "Failed to clear wishlist");
      }
    } catch (error) {
      console.error("Clear wishlist error:", error);
      
      // Fallback: Clear localStorage only
      setWishlist([]);
      localStorage.setItem("wishlist", JSON.stringify([]));

      toast.error("Failed to clear wishlist, cleared locally", {
        icon: '⚠️',
        duration: 3000,
      });
    }
  };

  // ------------------------------
  //  ADD TO CART FROM WISHLIST
  // ------------------------------

  const addToCart = (product) => {
    if (typeof window === "undefined") return;
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      if (existing.qty >= product.stock) {
        toast.error(`Only ${product.stock} items available!`, {
          icon: '⚠️',
        });
        return;
      }
      
      existing.qty += 1;
      toast.success(`Increased ${product.name} quantity to ${existing.qty}! 🛒`);
    } else {
      if (product.stock <= 0) {
        toast.error("This product is out of stock! 😔");
        return;
      }
      
      cart.push({ ...product, qty: 1 });
      toast.success(`${product.name} added to cart! 🎉`);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Move to cart and remove from wishlist
  const moveToCart = async (product) => {
    addToCart(product);
    await removeFromWishlist(product._id, product.name);
  };

  // Quick remove without API (for offline functionality)
  const quickRemoveFromWishlist = (productId, productName) => {
    const updatedWishlist = wishlist.filter(item => item._id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    
    toast.success(`Removed ${productName} from wishlist 💔`, {
      icon: '❌',
      duration: 2000,
    });
  };

  // ------------------------------
  //  RENDER COMPONENT
  // ------------------------------

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="w-8 h-8 text-pink-600 fill-pink-600" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearAllWishlist}
              disabled={removingId !== null}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-pink-100 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-pink-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">
                Save your favorite items here to keep track of products you love!
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors font-medium"
              >
                <ShoppingCart className="w-5 h-5" />
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(product._id, product.name)}
                  disabled={removingId === product._id}
                  className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-105 disabled:opacity-50 transition-all duration-200"
                >
                  {removingId === product._id ? (
                    <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </button>

                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0 w-full md:w-48 h-48 bg-gray-100 rounded-xl overflow-hidden">
                    {product.images?.length > 0 && product.images[0].url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <div className="text-2xl mb-1">📷</div>
                          <div className="text-xs">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-2">{product.category}</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Brand: {product.brand || "N/A"}
                      </p>
                      
                      {product.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      {/* Price */}
                      <div className="flex items-center gap-3 mb-4">
                        {product.offerprice && product.offerprice < product.price ? (
                          <>
                            <span className="text-2xl font-bold text-green-600">
                              ${product.offerprice}
                            </span>
                            <span className="text-lg text-gray-400 line-through">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-green-600">
                            ${product.price}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mb-4">
                        {product.stock > 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            In Stock ({product.stock} available)
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => moveToCart(product)}
                        disabled={product.stock <= 0 || removingId === product._id}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Move to Cart
                      </button>
                      
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0 || removingId === product._id}
                        className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart (Keep in Wishlist)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}