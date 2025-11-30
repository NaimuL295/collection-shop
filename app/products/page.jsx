
"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");

  const [pagination, setPagination] = useState({});

  // Initialize wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(savedWishlist);
    }
  }, []);

  const isInWishlist = (id) => wishlist.some((item) => item._id === id);

  const addToWishlist = async (product) => {
    if (typeof window === "undefined") return;
    
    let updatedWishlist = [...wishlist];
    const index = updatedWishlist.findIndex((item) => item._id === product._id);

    if (index > -1) {
      updatedWishlist.splice(index, 1);
      toast.success("Removed from Wishlist 💔", {
        icon: "❌",
        style: { background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }
      });
    } else {
      updatedWishlist.push(product);
      toast.success("Added to Wishlist ❤️", {
        icon: "💖",
        style: { background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }
      });
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const addToCart = (product) => {
    if (typeof window === "undefined") return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      if (existing.qty >= product.stock) {
        toast.error(`Only ${product.stock} items available! ⚠️`);
        return;
      }
      existing.qty += 1;
    } else {
      if (product.stock <= 0) {
        toast.error("Out of stock! ❌");
        return;
      }
      cart.push({ ...product, qty: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/showProduct?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products || []);
        setPagination(data.data.pagination || {});
      } else {
        setProducts([]);
        toast.error("Failed to fetch products 😞");
      }
    } catch (err) {
      setProducts([]);
      toast.error("Error loading products 📦");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, sortBy, sortOrder]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const totalPages = pagination.totalPages || 1;
    const currentPage = pagination.currentPage || 1;

    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) end = 5;
    else if (currentPage >= totalPages - 2) start = totalPages - 4;

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-lg text-gray-600">Browse our complete product collection</p>
        </div>

        {/* Sorting */}
        <div className="bg-white rounded-xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
          <div className="text-sm text-gray-600">
            Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.totalProducts || 0)} of {pagination.totalProducts || 0} products
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split("-");
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="createdAt-desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
  {/* Products Grid */}
{loading ? (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2"></div>
  </div>
) : products.length === 0 ? (
  <div className="text-center py-20">
    <div className="text-6xl mb-4">📦</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
    <p className="text-gray-600">Try adjusting your search or filters</p>
  </div>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">

    {products.map((product) => (
      <Link
        href={`/products/${product._id}`}
        key={product._id}
        className="block group"
      >
        <div className="relative bg-white rounded-[18px] shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.12)] transition-all duration-500 border border-gray-100 overflow-hidden">

          {/* Wishlist Button (Responsive small on mobile) */}
          <button
            onClick={(e) => { e.preventDefault(); addToWishlist(product); }}
            className="
              absolute top-3 right-3 z-20
              bg-white/90 backdrop-blur-sm
              p-2 sm:p-2.5
              rounded-full shadow-md
              hover:scale-110 transition-all
            "
          >
            <Heart
              className={`
                w-4 h-4 sm:w-5 sm:h-5
                ${isInWishlist(product._id)
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 group-hover:text-red-500"
                }
              `}
            />
          </button>

          {/* Badge */}
          {product.stock <= 0 && (
            <span className="absolute top-4 left-4 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              Out of Stock
            </span>
          )}

          {/* Image Section */}
          <div className="relative w-full" style={{ paddingTop: "61.8%" }}>
            {product.images?.[0]?.url ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No Image</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3 text-[15px] leading-snug line-clamp-2">
              {product.name}
            </h3>

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {product.offerprice ? (
                  <>
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      ৳{product.offerprice}
                    </p>
                    <p className="text-sm text-gray-400 line-through">
                      ৳{product.price}
                    </p>
                  </>
                ) : (
                  <p className="text-lg sm:text-xl font-bold text-blue-600">
                    ৳{product.price}
                  </p>
                )}
              </div>

              <span
                className={`text-[10px] sm:text-xs px-2 py-1 rounded-full ${
                  product.stock > 0
                    ? "text-green-700 bg-green-100"
                    : "text-red-700 bg-red-100"
                }`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock})`
                  : "Out of Stock"}
              </span>
            </div>

            <button
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              disabled={product.stock <= 0}
              className={`
                w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-md
                flex items-center justify-center gap-2
                ${
                  product.stock > 0
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-[2px] active:scale-95 hover:shadow-xl"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {product.stock > 0 ? <>🛒 Add to Cart</> : "Out of Stock"}
            </button>
          </div>
        </div>
      </Link>
    ))}
  </div>
)}


        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
            <div className="text-sm text-gray-600">Page {pagination.currentPage} of {pagination.totalPages}</div>
            <div className="flex items-center gap-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(page - 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${pagination.hasPrevPage ? "bg-gray-800 text-white hover:bg-gray-900 hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex gap-1">
                {getPageNumbers().map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => handlePageChange(pNum)}
                    className={`min-w-[38px] h-10 rounded-lg font-medium transition-all duration-200 ${page === pNum ? "bg-blue-600 text-white shadow-lg scale-105" : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:scale-105"}`}
                  >
                    {pNum}
                  </button>
                ))}
              </div>

              <button
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(page + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${pagination.hasNextPage ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
