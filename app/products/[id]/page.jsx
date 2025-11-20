// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import toast from "react-hot-toast";
// import { Heart, Star, Share2 } from "lucide-react";

// export default function ProductPage() {
//   const params = useParams();
//   const { id } = params;

//   const [product, setProduct] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [wishlist, setWishlist] = useState([]);
//   const [relatedProducts, setRelatedProducts] = useState([]);

//   // Load wishlist from localStorage
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
//       setWishlist(saved);
//     }
//   }, []);

//   // Fetch product details
//   useEffect(() => {
//     if (!id) return;
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`/api/showProduct/${id}`);
//         const data = await res.json();
//         if (data.success) {
//           setProduct(data.data);
//           setRelatedProducts(data.relatedProducts.slice(0, 3)); // only 3 cards
//         } else {
//           toast.error("Product not found");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to load product");
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (!product) return <p className="p-4">Loading...</p>;

//   const images = product.images || [];

//   const isInWishlist = (pid) => wishlist.some((item) => item._id === pid);

//   const addToWishlist = (p) => {
//     if (typeof window === "undefined") return;
//     let updated = [...wishlist];
//     const idx = updated.findIndex((i) => i._id === p._id);
//     if (idx > -1) updated.splice(idx, 1);
//     else updated.push(p);
//     setWishlist(updated);
//     localStorage.setItem("wishlist", JSON.stringify(updated));
//     toast.success(idx > -1 ? "Removed from wishlist" : "Added to wishlist");
//   };

//   const addToCart = (p, qty = quantity) => {
//     if (typeof window === "undefined") return;
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const existing = cart.find((i) => i._id === p._id);
//     if (existing) existing.qty = Math.min(existing.qty + qty, p.stock);
//     else cart.push({ ...p, qty });
//     localStorage.setItem("cart", JSON.stringify(cart));
//     toast.success("Added to cart!");
//   };

//   const buyNow = (p) => {
//     addToCart(p);
//     window.location.href = "/checkout";
//   };

//   const shareProduct = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: product.name,
//         text: product.description,
//         url: window.location.href,
//       }).catch(console.error);
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       toast.success("Link copied!");
//     }
//   };

//   const hasDiscount = product.offerprice && product.offerprice < product.price;
//   const discountPercentage = hasDiscount
//     ? Math.round(((product.price - product.offerprice) / product.price) * 100)
//     : 0;

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       {/* Breadcrumb */}
//       <nav className="text-sm text-gray-500 mb-4">
//         <Link href="/" className="hover:text-blue-600">Home</Link> /{" "}
//         <Link href="/products" className="hover:text-blue-600">Products</Link> /{" "}
//         <span>{product.name}</span>
//       </nav>

//       {/* Product Main Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//         {/* Left: Image */}
//         <div>
//           <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
//             {images[selectedImage]?.url ? (
//               <Image
//                 src={images[selectedImage].url}
//                 alt={product.name}
//                 width={600}
//                 height={600}
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <div className="flex items-center justify-center h-full">No Image</div>
//             )}
//           </div>

//           {/* Thumbnail Gallery */}
//           <div className="flex gap-2">
//             {images.slice(0, 3).map((img, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setSelectedImage(idx)}
//                 className={`w-20 h-20 rounded-md overflow-hidden border-2 ${
//                   selectedImage === idx ? "border-blue-500" : "border-gray-200"
//                 }`}
//               >
//                 <Image
//                   src={img.url}
//                   alt={`${product.name} thumbnail ${idx + 1}`}
//                   width={80}
//                   height={80}
//                   className="object-cover w-full h-full"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Right: Details */}
//         <div className="space-y-4">
//           <h1 className="text-3xl font-bold">{product.name}</h1>
//           <div className="flex items-center gap-4">
//             {hasDiscount ? (
//               <>
//                 <span className="text-2xl font-bold">৳{product.offerprice}</span>
//                 <span className="text-gray-400 line-through">৳{product.price}</span>
//                 <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm">
//                   -{discountPercentage}%
//                 </span>
//               </>
//             ) : (
//               <span className="text-2xl font-bold">৳{product.price}</span>
//             )}
//           </div>
//           <p>{product.description}</p>
//           <p>Stock: {product.stock}</p>

//           {/* Quantity Selector */}
//           <div className="flex items-center gap-2">
//             <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="px-3 py-1 border rounded">
//               -
//             </button>
//             <span className="px-4 py-1 border rounded">{quantity}</span>
//             <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="px-3 py-1 border rounded">
//               +
//             </button>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-2">
//             <button
//               onClick={() => addToCart(product)}
//               disabled={product.stock <= 0}
//               className={`flex-1 py-2 rounded-lg text-white ${product.stock > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}`}
//             >
//               Add to Cart
//             </button>
//             <button
//               onClick={() => buyNow(product)}
//               disabled={product.stock <= 0}
//               className={`flex-1 py-2 rounded-lg text-white ${product.stock > 0 ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-300 cursor-not-allowed"}`}
//             >
//               Buy Now
//             </button>
//           </div>

//           {/* Wishlist & Share */}
//           <div className="flex gap-2 mt-2">
//             <button onClick={() => addToWishlist(product)} className="flex items-center gap-1 px-3 py-1 border rounded">
//               <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-red-600 text-red-600" : ""}`} /> Wishlist
//             </button>
//             <button onClick={shareProduct} className="flex items-center gap-1 px-3 py-1 border rounded">
//               <Share2 className="w-4 h-4" /> Share
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Related Products (3 cards) */}
//       {relatedProducts.length > 0 && (
//         <div>
//           <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {relatedProducts.map((rel) => (
//               <Link href={`/product/${rel._id}`} key={rel._id}>
//                 <div className="bg-white rounded-xl shadow hover:shadow-lg p-3 transition">
//                   <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
//                     {rel.images?.[0]?.url ? (
//                       <Image src={rel.images[0].url} alt={rel.name} fill className="object-cover"/>
//                     ) : (
//                       <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
//                     )}
//                   </div>
//                   <h3 className="font-semibold text-gray-900 line-clamp-2">{rel.name}</h3>
//                   <p className="text-blue-600 font-bold">৳{rel.offerprice || rel.price}</p>
//                   <p className="text-sm text-gray-500">{rel.stock > 0 ? `In Stock` : "Out of Stock"}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import toast from "react-hot-toast";

// export default function ProductPage() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [relatedProducts, setRelatedProducts] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [wishlist, setWishlist] = useState([]);

//   // Load wishlist from localStorage
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
//     }
//   }, []);

//   // Fetch product
//   useEffect(() => {
//     if (!id) return;
//     const fetchProduct = async () => {
//       const res = await fetch(`/api/showProduct/${id}`);
//       const data = await res.json();
//       if (data.success) {
//         setProduct(data.data);
//         setRelatedProducts(data.relatedProducts || []);
//       } else {
//         toast.error("Product not found");
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   if (!product) return <p>Loading...</p>;

//   const images = product.images || [];

//   const isInWishlist = (pid) => wishlist.some((item) => item._id === pid);

//   const toggleWishlist = (prod) => {
//     let updated = [...wishlist];
//     const idx = updated.findIndex((item) => item._id === prod._id);
//     if (idx > -1) {
//       updated.splice(idx, 1);
//       toast.success("Removed from wishlist 💔");
//     } else {
//       updated.push(prod);
//       toast.success("Added to wishlist ❤️");
//     }
//     setWishlist(updated);
//     localStorage.setItem("wishlist", JSON.stringify(updated));
//   };

//   const addToCart = (prod) => {
//     let cart = JSON.parse(localStorage.getItem("cart")) || [];
//     const exist = cart.find((item) => item._id === prod._id);
//     if (exist) {
//       if (exist.qty + quantity > prod.stock) {
//         toast.error(`Only ${prod.stock} available!`);
//         return;
//       }
//       exist.qty += quantity;
//     } else {
//       cart.push({ ...prod, qty: quantity });
//     }
//     localStorage.setItem("cart", JSON.stringify(cart));
//     toast.success("Added to cart 🛒");
//   };

//   const hasDiscount = product.offerprice && product.offerprice < product.price;
//   const discountPercentage = hasDiscount ? Math.round(((product.price - product.offerprice)/product.price)*100) : 0;

//   return (
//     <div className="max-w-7xl mx-auto p-4">
//       {/* Breadcrumb */}
//       <nav className="text-sm text-gray-600 mb-4">
//         <Link href="/">Home</Link> / <Link href="/products">Products</Link> / {product.name}
//       </nav>

//       {/* Product Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
//         {/* Images */}
//         <div>
//           <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden mb-4">
//             {images[selectedImage]?.url ? (
//               <Image src={images[selectedImage].url} alt={product.name} fill className="object-cover" />
//             ) : (
//               <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
//             )}
//           </div>
//           <div className="flex gap-2">
//             {images.map((img, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => setSelectedImage(idx)}
//                 className={`w-20 h-20 border rounded-lg overflow-hidden ${selectedImage === idx ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
//               >
//                 <Image src={img.url} alt={`Thumbnail ${idx+1}`} width={80} height={80} className="object-cover"/>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="space-y-4">
//           <h1 className="text-3xl font-bold">{product.name}</h1>
//           <p className="text-gray-600">{product.description}</p>

//           {/* Price */}
//           <div className="flex items-center gap-4 text-2xl font-bold">
//             {hasDiscount ? (
//               <>
//                 <span className="text-red-600">৳{product.offerprice}</span>
//                 <span className="line-through text-gray-400">৳{product.price}</span>
//                 <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">-{discountPercentage}%</span>
//               </>
//             ) : (
//               <span>৳{product.price}</span>
//             )}
//           </div>

//           {/* Stock */}
//           <div className={`font-semibold ${product.stock>0?'text-green-600':'text-red-600'}`}>
//             {product.stock>0?`In Stock (${product.stock})`:'Out of Stock'}
//           </div>

//           {/* Quantity selector */}
//           <div className="flex items-center gap-2">
//             <button onClick={() => setQuantity(Math.max(1, quantity-1))} className="px-3 py-1 bg-gray-200 rounded">-</button>
//             <span className="px-3 py-1 border rounded">{quantity}</span>
//             <button onClick={() => setQuantity(Math.min(product.stock, quantity+1))} className="px-3 py-1 bg-gray-200 rounded">+</button>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-4">
//             <button onClick={()=>addToCart(product)} disabled={product.stock<=0} className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add to Cart</button>
//             <button onClick={()=>toggleWishlist(product)} className={`flex-1 py-3 rounded-lg ${isInWishlist(product._id)?'bg-red-600 text-white':'bg-gray-200 text-gray-700'}`}>Wishlist</button>
//           </div>

//           {/* Product details */}
//           <div className="mt-6">
//             <h2 className="font-semibold mb-2">Details</h2>
//             <ul className="text-gray-600 space-y-1">
//               <li><strong>Brand:</strong> {product.brand}</li>
//               <li><strong>Category:</strong> {product.category}</li>
//               <li><strong>SKU:</strong> {product.sku}</li>
//               <li><strong>Packtype:</strong> {product.packtype}</li>
//               <li><strong>Min Stock:</strong> {product.minStock}</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Related Products */}
//       {relatedProducts.length>0 && (
//         <div>
//           <h2 className="text-2xl font-bold mb-4">Related Products</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//             {relatedProducts.map((rel)=>(
//               <Link href={`/product/${rel._id}`} key={rel._id}>
//                 <div className="bg-white rounded-xl shadow p-3 hover:shadow-lg transition">
//                   <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-2">
//                     {rel.images?.[0]?.url ? <Image src={rel.images[0].url} fill className="object-cover"/> :
//                       <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}
//                   </div>
//                   <h3 className="font-semibold text-gray-900 line-clamp-2">{rel.name}</h3>
//                   <p className="text-blue-600 font-bold">৳{rel.offerprice || rel.price}</p>
//                   <p className="text-sm text-gray-500">{rel.stock>0?'In Stock':'Out of Stock'}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Heart,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
} from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")) || []);
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/showProduct/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.data);
          setRelatedProducts(data.relatedProducts || []);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        toast.error("Failed to load product");
      }
    };
    
    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const images = product.images || [];
  const hasDiscount = product.offerprice && product.offerprice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.offerprice) / product.price) * 100)
    : 0;

  const isInWishlist = (pid) => wishlist.some((item) => item._id === pid);

  const toggleWishlist = (prod) => {
    let updated = [...wishlist];
    const idx = updated.findIndex((item) => item._id === prod._id);
    
    if (idx > -1) {
      updated.splice(idx, 1);
      toast.success("Removed from wishlist 💔");
    } else {
      updated.push(prod);
      toast.success("Added to wishlist ❤️");
    }
    
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const addToCart = (prod, qty = quantity) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const exist = cart.find((item) => item._id === prod._id);
    
    if (exist) {
      if (exist.qty + qty > prod.stock) {
        toast.error(`Only ${prod.stock} items available!`);
        return;
      }
      exist.qty += qty;
      toast.success(`Added ${qty} more to cart! 🛒`);
    } else {
      if (prod.stock <= 0) {
        toast.error("This product is out of stock! 😔");
        return;
      }
      cart.push({ ...prod, qty });
      toast.success("Product added to cart! 🎉");
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const buyNow = (prod) => {
    addToCart(prod);
    window.location.href = "/checkout";
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard! 📋");
    }
  };

  const nextImage = () => setSelectedImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setSelectedImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white ">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 py-4 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/products" className="hover:text-blue-600 transition-colors">Products</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/products?category=${product.category}`} className="hover:text-blue-600 transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden group">
              {images.length > 0 ? (
                <>
                  <Image
                    src={images[selectedImage]?.url}
                    alt={product.name}
                    fill
                    className="object-cover transition-opacity duration-300"
                    onLoadingComplete={() => setImageLoading(false)}
                    priority
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{discountPercentage}% OFF
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-400">
                    <div className="text-3xl mb-2">📷</div>
                    <div>No Image Available</div>
                  </div>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                      selectedImage === idx
                        ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star)=>(
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= (product.rating||4) ? "text-yellow-400 fill-yellow-400":"text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviewCount||24} reviews)</span>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.stock>0?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}`}>
                  {product.stock>0?`In Stock (${product.stock})`:"Out of Stock"}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-gray-900">৳{product.offerprice}</span>
                  <span className="text-2xl text-gray-400 line-through">৳{product.price}</span>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    Save ৳{product.price - product.offerprice}
                  </span>
                </>
              ) : <span className="text-3xl font-bold text-gray-900">৳{product.price}</span>}
            </div>

            {/* Short Description */}
            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>

            {/* Key Features */}
            {product.features && product.features.length>0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Key Features:</h3>
                <ul className="grid grid-cols-1 gap-2">
                  {product.features.slice(0,4).map((feature,index)=>(
                    <li key={index} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-green-500"/>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={()=>setQuantity(Math.max(1,quantity-1))}
                  disabled={quantity<=1}
                  className="px-5 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                >
                  <Minus className="w-4 h-4"/>
                </button>
                <span className="px-6 py-3 text-gray-900 font-medium min-w-12 text-center border-x border-gray-300">{quantity}</span>
                <button
                  onClick={()=>setQuantity(Math.min(product.stock,quantity+1))}
                  disabled={quantity>=product.stock}
                  className="px-5 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-4 h-4"/>
                </button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} available</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={()=>addToCart(product)}
                disabled={product.stock<=0}
                className={`flex-1 py-3 px-5 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 ${product.stock>0?"bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95":"bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                <ShoppingCart className="w-5 h-5"/>
                {product.stock>0?"Add to Cart":"Out of Stock"}
              </button>

              <button
                onClick={()=>buyNow(product)}
                disabled={product.stock<=0}
                className={`flex-1 py-3 px-5 rounded-lg font-semibold text-base transition-all duration-200 flex items-center justify-center gap-3 ${product.stock>0?"bg-orange-600 text-white hover:bg-orange-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95":"bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                <Zap className="w-5 h-5"/>
                Buy Now
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={()=>toggleWishlist(product)}
                className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-200 text-base ${isInWishlist(product._id)?"text-red-600 bg-red-50 border border-red-200":"text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200"}`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product._id)?"fill-red-600":""}`}/>
                Wishlist
              </button>

              <button
                onClick={shareProduct}
                className="flex items-center gap-3 px-5 py-3 text-base text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 rounded-lg transition-all duration-200"
              >
                <Share2 className="w-5 h-5"/>
                Share
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Truck className="w-6 h-6 text-green-600"/>
                <div>
                  <div className="font-semibold text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over ৳500</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <RotateCcw className="w-6 h-6 text-blue-600"/>
                <div>
                  <div className="font-semibold text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">30-day return policy</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600"/>
                <div>
                  <div className="font-semibold text-gray-900">Secure Payment</div>
                  <div className="text-sm text-gray-600">100% secure</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs & Related Products remain same */}
      </div>
    </div>
  );
}
