// "use client";

// import { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
// import Image from "next/image";
// import toast from "react-hot-toast";

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [sortBy, setSortBy] = useState("price");
//   const [sortOrder, setSortOrder] = useState("asc");

//   const [pagination, setPagination] = useState({});

//   // ------------------------------
//   //  WISHLIST HELPERS
//   // ------------------------------

//   const isInWishlist = (id) => {
//     if (typeof window === "undefined") return false;
//     const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//     return wishlist.some((item) => item._id === id);
//   };

//   const addToWishlist = async (product) => {
//     if (typeof window === "undefined") return;
    
//     let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

//     // Already exists?
//     if (wishlist.some((item) => item._id === product._id)) {
//       toast.error("Already in Wishlist");
//       return;
//     }

//     // Add locally
//     wishlist.push(product);
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     toast.success("Added to Wishlist ❤️");

//     // Save to API
//     try {
//       await fetch("/api/wishlist", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(product),
//       });
//     } catch (err) {
//       console.log("Wishlist API failed:", err);
//     }
//   };

//   // ------------------------------
//   //  ADD TO CART
//   // ------------------------------

//   const addToCart = (product) => {
//     if (typeof window === "undefined") return;
    
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     const existing = cart.find((item) => item._id === product._id);

//     if (existing) {
//       existing.qty += 1;
//       toast.success("Quantity increased!");
//     } else {
//       cart.push({ ...product, qty: 1 });
//       toast.success(`${product.name} added to cart`);
//     }

//     localStorage.setItem("cart", JSON.stringify(cart));
//   };

//   // ------------------------------
//   //  FETCH PRODUCTS
//   // ------------------------------

//   const fetchProducts = async () => {
//     setLoading(true);
//     const url = `/api/showProduct?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

//     try {
//       const res = await fetch(url);
//       const data = await res.json();

//       if (data.success) {
//         setProducts(data.data.products || []);
//         setPagination(data.data.pagination || {});
//       } else {
//         toast.error("Failed to fetch products");
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       toast.error("Error loading products");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [page, sortBy, sortOrder]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const getPageNumbers = () => {
//     const totalPages = pagination.totalPages || 1;
//     const currentPage = pagination.currentPage || 1;
    
//     if (totalPages <= 5) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }
    
//     let start = Math.max(1, currentPage - 2);
//     let end = Math.min(totalPages, currentPage + 2);
    
//     if (currentPage <= 3) {
//       end = 5;
//     } else if (currentPage >= totalPages - 2) {
//       start = totalPages - 4;
//     }
    
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   };

//   console.log("Products:", products);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">🛍️ All Products</h1>
//           <p className="text-lg text-gray-600">Browse our complete product collection</p>
//         </div>

//         {/* Sorting & Results Info */}
//         <div className="bg-white rounded-xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
//           <div className="text-sm text-gray-600">
//             Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.totalProducts || 0)} of {pagination.totalProducts || 0} products
//           </div>
          
//           <div className="flex items-center gap-4">
//             <span className="text-sm font-medium text-gray-700">Sort by:</span>
//             <select
//               value={`${sortBy}-${sortOrder}`}
//               onChange={(e) => {
//                 const [newSortBy, newSortOrder] = e.target.value.split("-");
//                 setSortBy(newSortBy);
//                 setSortOrder(newSortOrder);
//                 setPage(1);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               <option value="price-asc">Price: Low to High</option>
//               <option value="price-desc">Price: High to Low</option>
//               <option value="createdAt-desc">Newest First</option>
           
//             </select>
//           </div>
//         </div>

//         {/* Product Grid */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="text-6xl mb-4">📦</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <>
//          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//   {products.map((product) => (
//     <div
//       key={product._id}
//       className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100 overflow-hidden"
//     >
//       {/* Wishlist Button */}
//       <button
//         onClick={() => addToWishlist(product)}
//         className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-105 transition-all"
//       >
//         <Heart
//           className={`w-5 h-5 ${
//             isInWishlist(product._id)
//               ? "text-red-500 fill-red-500"
//               : "text-gray-400 group-hover:text-red-500"
//           }`}
//         />
//       </button>

//       {/* Badge */}
//       {product.stockQuantity <= 0 && (
//         <span className="absolute top-3 left-3 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
//           Out of Stock
//         </span>
//       )}

//       {/* Image Section */}
//      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
//   {product.images?.length > 0 && product.images[0].url ? (
//     <Image
//       src={product.images[0].url}
//       alt={product.name || "Product Image"}
//       fill
//       className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
//       onError={(e) => {
//         e.target.src = "/images/placeholder.jpg";
//       }}
//     />
//   ) : (
//     <div className="w-full h-full flex items-center justify-center text-gray-400">
//       <div className="text-center">
//         <div className="text-2xl mb-1">📷</div>
//         <div className="text-xs">No Image</div>
//       </div>
//     </div>
//   )}
// </div>


//       {/* Product Details */}
//       <div className="p-5">
//         <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight line-clamp-2">
//           {product.name}
//         </h3>

//         <p className="text-gray-500 text-sm mb-3">{product.category}</p>

//         {/* Price Section */}
//         <div className="flex items-center justify-between mb-4">
//           <div>
//             <p className="text-xl font-bold text-blue-600">
//               ${product.price}
//             </p>
//             {product.originalPrice && (
//               <p className="text-xs text-gray-400 line-through">
//                 ${product.originalPrice}
//               </p>
//             )}
//           </div>

//           {product.stockQuantity > 0 && (
//             <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
//               In Stock
//             </span>
//           )}
//         </div>

//         {/* Add to Cart Button */}
//         <button
//           onClick={() => addToCart(product)}
//           disabled={product.stock <= 0}
//           className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm 
//             ${
//               product.stockQuantity > 0
//                 ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
//                 : "bg-gray-200 text-gray-500 cursor-not-allowed"
//             }`}
//         >
//           {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"}
//         </button>
//       </div>
//     </div>
//   ))}
// </div>

//           </>
//         )}

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
//             <div className="text-sm text-gray-600">
//               Page {pagination.currentPage} of {pagination.totalPages}
//             </div>
            
//             <div className="flex items-center gap-2">
//               {/* Previous Button */}
//               <button
//                 disabled={!pagination.hasPrevPage}
//                 onClick={() => handlePageChange(page - 1)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                   pagination.hasPrevPage
//                     ? "bg-gray-800 text-white hover:bg-gray-900 hover:scale-105"
//                     : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 <ChevronLeft className="w-4 h-4" />
//                 Previous
//               </button>

//               {/* Page Numbers */}
//               <div className="flex gap-1">
//                 {getPageNumbers().map((pageNum) => (
//                   <button
//                     key={pageNum}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`min-w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
//                       page === pageNum
//                         ? "bg-blue-600 text-white shadow-lg scale-105"
//                         : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:scale-105"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 ))}
//               </div>

//               {/* Next Button */}
//               <button
//                 disabled={!pagination.hasNextPage}
//                 onClick={() => handlePageChange(page + 1)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                   pagination.hasNextPage
//                     ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
//                     : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 Next
//                 <ChevronRight className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useEffect, useState } from "react";
// import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
// import Image from "next/image";
// import toast from "react-hot-toast";

// export default function ProductsPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(1);
//   const [limit] = useState(12);
//   const [sortBy, setSortBy] = useState("price");
//   const [sortOrder, setSortOrder] = useState("asc");

//   const [pagination, setPagination] = useState({});

//   // ------------------------------
//   //  WISHLIST HELPERS
//   // ------------------------------

//   const isInWishlist = (id) => {
//     if (typeof window === "undefined") return false;
//     const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
//     return wishlist.some((item) => item._id === id);
//   };

//   const addToWishlist = async (product) => {
//     if (typeof window === "undefined") return;
    
//     let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

//     // Already exists?
//     if (wishlist.some((item) => item._id === product._id)) {
//       toast.error("Already in Wishlist");
//       return;
//     }

//     // Add locally
//     wishlist.push(product);
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//     toast.success("Added to Wishlist ❤️");

//     // Save to API
//     try {
//       await fetch("/api/wishlist", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(product),
//       });
//     } catch (err) {
//       console.log("Wishlist API failed:", err);
//     }
//   };

//   // ------------------------------
//   //  ADD TO CART
//   // ------------------------------

//   const addToCart = (product) => {
//     if (typeof window === "undefined") return;
    
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];

//     const existing = cart.find((item) => item._id === product._id);

//     if (existing) {
//       existing.qty += 1;
//       toast.success("Quantity increased!");
//     } else {
//       cart.push({ ...product, qty: 1 });
//       toast.success(`${product.name} added to cart`);
//     }

//     localStorage.setItem("cart", JSON.stringify(cart));
//   };

//   // ------------------------------
//   //  FETCH PRODUCTS
//   // ------------------------------

//   const fetchProducts = async () => {
//     setLoading(true);
//     const url = `/api/showProduct?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

//     try {
//       const res = await fetch(url);
//       const data = await res.json();

//       if (data.success) {
//         setProducts(data.data.products || []);
//         setPagination(data.data.pagination || {});
//       } else {
//         toast.error("Failed to fetch products");
//         setProducts([]);
//       }
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       toast.error("Error loading products");
//       setProducts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, [page, sortBy, sortOrder]);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const getPageNumbers = () => {
//     const totalPages = pagination.totalPages || 1;
//     const currentPage = pagination.currentPage || 1;
    
//     if (totalPages <= 5) {
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     }
    
//     let start = Math.max(1, currentPage - 2);
//     let end = Math.min(totalPages, currentPage + 2);
    
//     if (currentPage <= 3) {
//       end = 5;
//     } else if (currentPage >= totalPages - 2) {
//       start = totalPages - 4;
//     }
    
//     return Array.from({ length: end - start + 1 }, (_, i) => start + i);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">🛍️ All Products</h1>
//           <p className="text-lg text-gray-600">Browse our complete product collection</p>
//         </div>

//         {/* Sorting & Results Info */}
//         <div className="bg-white rounded-xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-sm">
//           <div className="text-sm text-gray-600">
//             Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, pagination.totalProducts || 0)} of {pagination.totalProducts || 0} products
//           </div>
          
//           <div className="flex items-center gap-4">
//             <span className="text-sm font-medium text-gray-700">Sort by:</span>
//             <select
//               value={`${sortBy}-${sortOrder}`}
//               onChange={(e) => {
//                 const [newSortBy, newSortOrder] = e.target.value.split("-");
//                 setSortBy(newSortBy);
//                 setSortOrder(newSortOrder);
//                 setPage(1);
//               }}
//               className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//             >
//               <option value="price-asc">Price: Low to High</option>
//               <option value="price-desc">Price: High to Low</option>
//               <option value="createdAt-desc">Newest First</option>
//               <option value="name-asc">Name: A to Z</option>
//             </select>
//           </div>
//         </div>

//         {/* Product Grid */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-20">
//             <div className="text-6xl mb-4">📦</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
//             <p className="text-gray-600">Try adjusting your search or filters</p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {products.map((product) => (
//                 <div
//                   key={product._id}
//                   className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100 overflow-hidden"
//                 >
//                   {/* Wishlist Button */}
//                   <button
//                     onClick={() => addToWishlist(product)}
//                     className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-105 transition-all"
//                   >
//                     <Heart
//                       className={`w-5 h-5 ${
//                         isInWishlist(product._id)
//                           ? "text-red-500 fill-red-500"
//                           : "text-gray-400 group-hover:text-red-500"
//                       }`}
//                     />
//                   </button>

//                   {/* Badge */}
//                   {product.stock <= 0 && (
//                     <span className="absolute top-3 left-3 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
//                       Out of Stock
//                     </span>
//                   )}

//                   {/* Image Section */}
//                   <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
//                     {product.images?.length > 0 && product.images[0].url ? (
//                       <Image
//                         src={product.images[0].url}
//                         alt={product.name || "Product Image"}
//                         fill
//                         className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
//                         onError={(e) => {
//                           e.target.src = "/images/placeholder.jpg";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center text-gray-400">
//                         <div className="text-center">
//                           <div className="text-2xl mb-1">📷</div>
//                           <div className="text-xs">No Image</div>
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* Product Details */}
//                   <div className="p-5">
//                     <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight line-clamp-2">
//                       {product.name}
//                     </h3>

//                     <p className="text-gray-500 text-sm mb-3">{product.category}</p>

//                     {/* Price Section */}
//                     <div className="flex items-center justify-between mb-4">
//                       <div className="flex items-center gap-2">
//                         {product.offerprice && product.offerprice < product.price ? (
//                           <>
//                             <p className="text-xl font-bold text-blue-600">
//                               ${product.offerprice}
//                             </p>
//                             <p className="text-sm text-gray-400 line-through">
//                               ${product.price}
//                             </p>
//                           </>
//                         ) : (
//                           <p className="text-xl font-bold text-blue-600">
//                             ${product.price}
//                           </p>
//                         )}
//                       </div>

//                       {product.stock > 0 ? (
//                         <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
//                           In Stock ({product.stock})
//                         </span>
//                       ) : (
//                         <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
//                           Out of Stock
//                         </span>
//                       )}
//                     </div>

//                     {/* Add to Cart Button */}
//                     <button
//                       onClick={() => addToCart(product)}
//                       disabled={product.stock <= 0}
//                       className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm 
//                         ${
//                           product.stock > 0
//                             ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
//                             : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                         }`}
//                     >
//                       {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
//             <div className="text-sm text-gray-600">
//               Page {pagination.currentPage} of {pagination.totalPages}
//             </div>
            
//             <div className="flex items-center gap-2">
//               {/* Previous Button */}
//               <button
//                 disabled={!pagination.hasPrevPage}
//                 onClick={() => handlePageChange(page - 1)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                   pagination.hasPrevPage
//                     ? "bg-gray-800 text-white hover:bg-gray-900 hover:scale-105"
//                     : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 <ChevronLeft className="w-4 h-4" />
//                 Previous
//               </button>

//               {/* Page Numbers */}
//               <div className="flex gap-1">
//                 {getPageNumbers().map((pageNum) => (
//                   <button
//                     key={pageNum}
//                     onClick={() => handlePageChange(pageNum)}
//                     className={`min-w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
//                       page === pageNum
//                         ? "bg-blue-600 text-white shadow-lg scale-105"
//                         : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:scale-105"
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 ))}
//               </div>

//               {/* Next Button */}
//               <button
//                 disabled={!pagination.hasNextPage}
//                 onClick={() => handlePageChange(page + 1)}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
//                   pagination.hasNextPage
//                     ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
//                     : "bg-gray-200 text-gray-400 cursor-not-allowed"
//                 }`}
//               >
//                 Next
//                 <ChevronRight className="w-4 h-4" />
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

  // ------------------------------
  //  WISHLIST HELPERS
  // ------------------------------

  const isInWishlist = (id) => {
    return wishlist.some((item) => item._id === id);
  };

  const addToWishlist = async (product) => {
    if (typeof window === "undefined") return;
    
    let updatedWishlist = [...wishlist];

    // Check if already in wishlist
    const existingIndex = updatedWishlist.findIndex((item) => item._id === product._id);
    
    if (existingIndex > -1) {
      // Remove from wishlist
      updatedWishlist.splice(existingIndex, 1);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      
      toast.success("Removed from Wishlist 💔", {
        icon: '❌',
        style: {
          background: '#fef2f2',
          color: '#dc2626',
          border: '1px solid #fecaca',
        },
      });

      // Remove from API
      try {
        await fetch(`/api/wishlist/${product._id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.log("Wishlist API delete failed:", err);
      }
    } else {
      // Add to wishlist
      updatedWishlist.push(product);
      setWishlist(updatedWishlist);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      
      toast.success("Added to Wishlist ❤️", {
        icon: '💖',
        style: {
          background: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #bbf7d0',
        },
      });

      // Save to API
      try {
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });
      } catch (err) {
        console.log("Wishlist API failed:", err);
      }
    }
  };

  // ------------------------------
  //  ADD TO CART
  // ------------------------------

  const addToCart = (product) => {
    if (typeof window === "undefined") return;
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      // Check stock availability
      if (existing.qty >= product.stock) {
        toast.error(`Only ${product.stock} items available!`, {
          icon: '⚠️',
          style: {
            background: '#fef3f2',
            color: '#d92d20',
            border: '1px solid #fecdca',
          },
        });
        return;
      }
      
      existing.qty += 1;
      
      toast.success(`Increased ${product.name} quantity to ${existing.qty}! 🛒`, {
        icon: '➕',
        style: {
          background: '#f0f9ff',
          color: '#026aa2',
          border: '1px solid #bae6fd',
        },
      });
    } else {
      // Check if product is in stock
      if (product.stock <= 0) {
        toast.error("This product is out of stock! 😔", {
          icon: '❌',
          style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
          },
        });
        return;
      }
      
      cart.push({ ...product, qty: 1 });
      
      toast.success(`${product.name} added to cart! 🎉`, {
        icon: '🛒',
        style: {
          background: '#f0fdf4',
          color: '#16a34a',
          border: '1px solid #bbf7d0',
        },
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Trigger cart update event for other components
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Quick add to cart with toast
  const quickAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error("Product out of stock! 😔", {
        duration: 2000,
        icon: '❌',
      });
      return;
    }

    addToCart(product);
  };

  // ------------------------------
  //  FETCH PRODUCTS
  // ------------------------------

  const fetchProducts = async () => {
    setLoading(true);
    const url = `/api/showProduct?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data.products || []);
        setPagination(data.data.pagination || {});
      } else {
        toast.error("Failed to fetch products 😞", {
          icon: '📦',
        });
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Error loading products 📦", {
        icon: '⚠️',
      });
      setProducts([]);
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
    
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);
    
    if (currentPage <= 3) {
      end = 5;
    } else if (currentPage >= totalPages - 2) {
      start = totalPages - 4;
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🛍️ All Products</h1>
          <p className="text-lg text-gray-600">Browse our complete product collection</p>
        </div>

        {/* Sorting & Results Info */}
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="createdAt-desc">Newest First</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  {products.map((product) => (
    <Link
      href={`/product/${product._id}`}
      key={product._id}
      className="block"
    >
      <div className="relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-100 overflow-hidden">
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault(); // prevent link click
            addToWishlist(product);
          }}
          className="absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-md p-2 rounded-full shadow-sm hover:scale-105 transition-all duration-200"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              isInWishlist(product._id)
                ? "text-red-500 fill-red-500 scale-110"
                : "text-gray-400 group-hover:text-red-500 group-hover:scale-110"
            }`}
          />
        </button>

        {/* Badge */}
        {product.stock <= 0 && (
          <span className="absolute top-3 left-3 z-20 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            Out of Stock
          </span>
        )}

        {/* Image Section */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          {product.images?.[0]?.url ? (
            <Image
              src={product.images?.[0]?.url}
              alt={product.name || "Product Image"}
              fill
              className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-2xl mb-1 mt-1">📷</div>
                <div className="text-xs">No Image</div>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-2">
          <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {product.offerprice && product.offerprice < product.price ? (
                <>
                  <p className="text-xl font-bold ">৳{product.offerprice}</p>
                  <p className="text-sm text-gray-400 line-through">৳{product.price}</p>
                </>
              ) : (
                <p className="text-xl font-bold text-blue-600">
                  ${product.price}
                </p>
              )}
            </div>

            {product.stock > 0 ? (
              <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                In Stock ({product.stock})
              </span>
            ) : (
              <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault(); // prevent redirect
              addToCart(product);
            }}
            disabled={product.stock <= 0}
            className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm flex items-center justify-center gap-2
              ${
                product.stock > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
          >
            {product.stock > 0 ? (
              <>
                <span>🛒</span>
                Add to Cart
              </>
            ) : (
              "Out of Stock"
            )}
          </button>
        </div>
      </div>
    </Link>
  ))}
</div>

          </>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12">
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => handlePageChange(page - 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pagination.hasPrevPage
                    ? "bg-gray-800 text-white hover:bg-gray-900 hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`min-w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      page === pageNum
                        ? "bg-blue-600 text-white shadow-lg scale-105"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:scale-105"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => handlePageChange(page + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pagination.hasNextPage
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}