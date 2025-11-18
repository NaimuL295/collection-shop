"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [stockUpdate, setStockUpdate] = useState('');

  // Fetch product details
  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/product/${productId}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.product);
        setFormData({
          name: data.product.name,
          sku: data.product.sku || '',
          category: data.product.category,
          price: data.product.price.toString(),
          cost: data.product.cost?.toString() || '',
          stock: data.product.stock.toString(),
          minStock: data.product.minStock?.toString() || '0',
          description: data.product.description,
          brand: data.product.brand || '',
          size: data.product.size?.join(', ') || '',
          color: data.product.color?.join(', ') || '',
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const updateProduct = async (productData) => {
    try {
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      if (data.success) {
        fetchProduct();
        setEditing(false);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  const deleteProduct = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        if (data.success) {
          router.push('/inventory-management');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      description: formData.description,
      brand: formData.brand || 'No Brand',
      size: formData.size ? formData.size.split(',').map(s => s.trim()) : [],
      color: formData.color ? formData.color.split(',').map(c => c.trim()) : [],
    };

    await updateProduct(productData);
  };

  const handleQuickStockUpdate = async () => {
    if (stockUpdate !== '') {
      const newStock = parseInt(stockUpdate);
      await updateProduct({ stock: newStock });
      setStockUpdate('');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-lg">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-lg">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/inventory-management" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Back to Inventory
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Product Details</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editing ? 'Cancel Edit' : 'Edit Product'}
              </button>
              <button
                onClick={deleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Product Images</h2>
            {product.images && product.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <Image
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500">No images available</p>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div>
            {!editing ? (
              // View Mode
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Product Information</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="font-semibold">Name:</label>
                      <p className="text-lg">{product.name}</p>
                    </div>
                    <div>
                      <label className="font-semibold">SKU:</label>
                      <p>{product.sku || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Category:</label>
                      <p>{product.category}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Brand:</label>
                      <p>{product.brand || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="font-semibold">Description:</label>
                      <p>{product.description || 'N/A'}</p>
                    </div>
                  </div>
                </div>

               <div>
  <h2 className="text-xl font-semibold mb-4">Pricing & Stock</h2>
  <div className="space-y-3">
    <div>
      <label className="font-semibold">Selling Price:</label>
      <p className="text-lg">৳{product.price}</p>
    </div>
    <div>
      <label className="font-semibold">Cost Price:</label>
      <p>৳{product.cost || 'N/A'}</p>
    </div>
    <div>
      <label className="font-semibold">Current Stock:</label>
      <div className="flex items-center gap-2">
        <p className="text-lg">{product.stock}</p>
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
          {product.status || (product.stock === 0 ? 'Out of Stock' : product.stock <= (product.minStock || 5) ? 'Low Stock' : 'In Stock')}
        </span>
      </div>
    </div>
    <div>
      <label className="font-semibold">Minimum Stock:</label>
      <p>{product.minStock || 5}</p>
    </div>
  </div>
</div>
                {/* Quick Stock Update */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Quick Stock Update</h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={stockUpdate}
                      onChange={(e) => setStockUpdate(e.target.value)}
                      placeholder="Enter new stock quantity"
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-black"
                    />
                    <button
                      onClick={handleQuickStockUpdate}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Update Stock
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
                
                <div>
                  <label className="block font-medium mb-2">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">SKU</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Cost ($)</label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Min Stock</label>
                    <input
                      type="number"
                      name="minStock"
                      value={formData.minStock}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg text-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}