"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  // Load wishlist from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedWishlist = localStorage.getItem("wishlist");
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }
  }, []);

  // Fetch product
  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/showProduct/${id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch product: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.success) {
          setProduct(data.data);
          setRelatedProducts(data.relatedProducts || []);
        } else {
          throw new Error(data.message || "Product not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Enhanced loading state with skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        {/* Breadcrumb skeleton */}
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          
          {/* Main product skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image skeleton */}
            <div>
              <div className="w-full h-96 bg-gray-200 rounded-xl mb-4"></div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
            
            {/* Product info skeleton */}
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="flex gap-4 mt-6">
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Product not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            We couldn t find the product you re looking for.
          </p>
          <Link 
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];

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

  const addToCart = async (prod) => {
    if (addingToCart) return;
    
    setAddingToCart(true);
    
    try {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const exist = cart.find((item) => item._id === prod._id);
      
      if (exist) {
        if (exist.qty + quantity > prod.stock) {
          toast.error(`Only ${prod.stock} items available in stock!`);
          return;
        }
        exist.qty += quantity;
      } else {
        cart.push({ 
          ...prod, 
          qty: quantity,
          selectedImage: images[selectedImage]?.url || null
        });
      }
      
      localStorage.setItem("cart", JSON.stringify(cart));
      
      // Trigger cart update event for other components
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart 🛒`);
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error("Cart error:", err);
    } finally {
      setAddingToCart(false);
    }
  };

  const hasDiscount = product.offerprice && product.offerprice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.offerprice) / product.price) * 100) 
    : 0;

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <nav 
        className="text-sm text-gray-600 mb-6 flex items-center space-x-1"
        aria-label="Breadcrumb"
      >
        <Link 
          href="/" 
          className="hover:text-blue-600 transition-colors"
        >
          Home
        </Link>
        <span>/</span>
        <Link 
          href="/products" 
          className="hover:text-blue-600 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Images */}
        <section aria-labelledby="product-images-heading">
          <h2 id="product-images-heading" className="sr-only">
            Product images
          </h2>
          
          <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden mb-4">
            {images[selectedImage]?.url ? (
              <Image 
                src={images[selectedImage].url} 
                alt={product.name}
                fill 
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div 
                className="flex items-center justify-center h-full text-gray-400"
                role="img"
                aria-label="No product image available"
              >
                No Image
              </div>
            )}
            
            {/* Discount badge */}
            {hasDiscount && (
              <div 
                className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold"
                aria-label={`${discountPercentage}% off`}
              >
                -{discountPercentage}%
              </div>
            )}
          </div>
          
          {/* Thumbnail navigation */}
          {images.length > 1 && (
            <div 
              className="flex gap-2 overflow-x-auto py-2"
              role="tablist"
              aria-label="Product image thumbnails"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImage === idx 
                      ? 'border-blue-500 ring-2 ring-blue-200 scale-105' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  role="tab"
                  aria-selected={selectedImage === idx}
                  aria-label={`View product image ${idx + 1}`}
                  aria-controls="product-main-image"
                >
                  <Image 
                    src={img.url} 
                    alt={`Thumbnail ${idx + 1} for ${product.name}`}
                    width={80} 
                    height={80} 
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Product Info */}
        <section aria-labelledby="product-info-heading">
          <h1 
            id="product-info-heading"
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            {product.name}
          </h1>
          
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-4 mb-4">
            {hasDiscount ? (
              <>
                <span 
                  className="text-3xl font-bold text-red-600"
                  aria-label={`Sale price ${product.offerprice} taka`}
                >
                  ৳{product.offerprice}
                </span>
                <span 
                  className="text-xl line-through text-gray-400"
                  aria-label={`Original price ${product.price} taka`}
                >
                  ৳{product.price}
                </span>
                <span 
                  className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-bold"
                  aria-label={`${discountPercentage} percent discount`}
                >
                  Save {discountPercentage}%
                </span>
              </>
            ) : (
              <span 
                className="text-3xl font-bold text-gray-900"
                aria-label={`Price ${product.price} taka`}
              >
                ৳{product.price}
              </span>
            )}
          </div>

          {/* Stock status */}
          <div 
            className={`font-semibold text-lg mb-6 ${
              product.stock > 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}
            aria-live="polite"
          >
            {product.stock > 0 ? (
              <span aria-label={`In stock, ${product.stock} available`}>
                ✅ In Stock ({product.stock} available)
              </span>
            ) : (
              <span aria-label="Out of stock">❌ Out of Stock</span>
            )}
          </div>

          {/* Quantity selector */}
          {!isOutOfStock && (
            <div className="mb-6">
              <label 
                htmlFor="quantity-selector"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Quantity:
              </label>
              <div className="flex items-center gap-2 w-fit">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <span className="text-lg font-bold">-</span>
                </button>
                
                <span 
                  id="quantity-selector"
                  className="w-16 h-10 border border-gray-300 rounded-lg flex items-center justify-center font-medium"
                  aria-live="polite"
                >
                  {quantity}
                </span>
                
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  <span className="text-lg font-bold">+</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button 
              onClick={() => addToCart(product)}
              disabled={isOutOfStock || addingToCart}
              className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                isOutOfStock || addingToCart
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
              } text-white flex items-center justify-center gap-2`}
              aria-label={isOutOfStock ? "Out of stock" : `Add ${quantity} to cart`}
            >
              {addingToCart ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : isOutOfStock ? (
                "Out of Stock"
              ) : (
                `Add to Cart (${quantity})`
              )}
            </button>
            
            <button 
              onClick={() => toggleWishlist(product)}
              className={`flex-1 py-4 rounded-lg font-semibold transition-all ${
                isInWishlist(product._id)
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } active:scale-95 flex items-center justify-center gap-2`}
              aria-label={
                isInWishlist(product._id) 
                  ? "Remove from wishlist" 
                  : "Add to wishlist"
              }
            >
              {isInWishlist(product._id) ? (
                <>
                  <span>❤️</span>
                  In Wishlist
                </>
              ) : (
                <>
                  <span>🤍</span>
                  Add to Wishlist
                </>
              )}
            </button>
          </div>

          {/* Product details
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="font-semibold text-xl mb-4 text-gray-900">
              Product Details
            </h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
              <div className="flex flex-col">
                <dt className="text-sm text-gray-500 font-medium">Brand</dt>
                <dd className="font-semibold">{product.brand || "N/A"}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-sm text-gray-500 font-medium">Category</dt>
                <dd className="font-semibold">{product.category || "N/A"}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-sm text-gray-500 font-medium">SKU</dt>
                <dd className="font-semibold">{product.sku || "N/A"}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-sm text-gray-500 font-medium">Pack Type</dt>
                <dd className="font-semibold">{product.packtype || "N/A"}</dd>
              </div>
              {product.minStock && (
                <div className="flex flex-col">
                  <dt className="text-sm text-gray-500 font-medium">Minimum Stock</dt>
                  <dd className="font-semibold">{product.minStock}</dd>
                </div>
              )}
            </dl>
          </div> */}
        </section>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section aria-labelledby="related-products-heading">
          <h2 
            id="related-products-heading"
            className="text-2xl font-bold text-gray-900 mb-6"
          >
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <Link 
                href={`/product/${rel._id}`} 
                key={rel._id}
                className="group"
              >
                <article className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 h-full flex flex-col">
                  <div className="relative h-48 bg-gray-100 rounded-lg overflow-hidden mb-3 flex-shrink-0">
                    {rel.images?.[0]?.url ? (
                      <Image 
                        src={rel.images[0].url} 
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                      </div>
                    )}
                    
                    {/* Related product discount badge */}
                    {rel.offerprice && rel.offerprice < rel.price && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                        -{Math.round(((rel.price - rel.offerprice) / rel.price) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {rel.name}
                    </h3>
                    
                    <div className="mt-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue-600 font-bold text-lg">
                          ৳{rel.offerprice || rel.price}
                        </span>
                        {rel.offerprice && rel.offerprice < rel.price && (
                          <span className="text-gray-400 line-through text-sm">
                            ৳{rel.price}
                          </span>
                        )}
                      </div>
                      
                      <p 
                        className={`text-sm font-medium ${
                          rel.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {rel.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

