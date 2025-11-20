"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function SearchPage({ searchParams }) {
  const params = use(searchParams);
  const query = params.query || "";
  const page = Number(params.page) || 1;
  const limit = 12;

  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState([]);
  const isInWishlist = (id) => wishlist.some((p) => p._id === id);

  const toggleWishlist = (product) => {
    const exists = isInWishlist(product._id);
    const updated = exists
      ? wishlist.filter((p) => p._id !== product._id)
      : [...wishlist, product];
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  useEffect(() => {
    const local = localStorage.getItem("wishlist");
    if (local) setWishlist(JSON.parse(local));
  }, []);

  // Load products
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
      );
      const data = await res.json();
      setProducts(data.products || []);
      setPages(data.pages || 1);
      setLoading(false);
    }

    if (query) loadData();
  }, [query, page]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Search results for: "{query}"
      </h2>

      {loading && <p>Loading...</p>}
      {!loading && products.length === 0 && (
        <p className="text-gray-500">No products found</p>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <div
            key={item._id}
            className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden border border-gray-100"
          >
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                toggleWishlist(item);
              }}
              className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition-all"
            >
              <Heart
                className={`w-5 h-5 ${
                  isInWishlist(item._id)
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 group-hover:text-red-500"
                }`}
              />
            </button>

            <Link href={`/product/${item._id}`} className="block">
              {/* Image */}
              <div className="relative h-52 w-full overflow-hidden bg-gray-100 rounded-t-2xl">
                <Image
                  src={item.images?.[0]?.url || "/no-image.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>

              {/* Details */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[48px]">
                  {item.name}
                </h3>

                <div className="flex justify-between items-center mt-3">
                  {item.offerprice && item.offerprice < item.price ? (
                    <div className="flex items-center gap-2">
                      <p className="text-blue-600 font-bold text-xl">
                        ৳{item.offerprice}
                      </p>
                      <p className="text-gray-400 line-through text-sm">
                        ৳{item.price}
                      </p>
                    </div>
                  ) : (
                    <p className="text-blue-600 font-bold text-xl">৳{item.price}</p>
                  )}

                  {item.stock > 0 ? (
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Add To Cart */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(item);
                  }}
                  disabled={item.stock <= 0}
                  className={`w-full mt-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
                    item.stock > 0
                      ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {item.stock > 0 ? (
                    <>
                      <span>🛒</span>
                      Add to Cart
                    </>
                  ) : (
                    "Out of Stock"
                  )}
                </button>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-8 flex-wrap">
        {page > 1 && (
          <Link
            href={`/search?query=${query}&page=${page - 1}`}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Previous
          </Link>
        )}

        {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={`/search?query=${query}&page=${p}`}
            className={`px-4 py-2 rounded-lg ${
              p === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {p}
          </Link>
        ))}

        {page < pages && (
          <Link
            href={`/search?query=${query}&page=${page + 1}`}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
