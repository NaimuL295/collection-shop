"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UploadImage from '../../Components/UploadImage';
import Image from 'next/image';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: '',
    offerprice: '',
    cost: '',
    stock: '',
    minStock: '',
    packtype: '',
    description: '',
    brand: '',
    size: '',
    color: '',
    images: []
  });

  const [customPackType, setCustomPackType] = useState('');

  const categories = ['Shirts', 'Pants', 'Shoes', 'Accessories', 'Jackets', 'Bags', 'Watches', 'T-Shirts', 'Sweaters', 'Sarees', 'Others'];
  const packTypes = ['Student Packers', 'Prime Packages', 'Other'];

  // API call function
  const addProduct = async (productData) => {
    try {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error adding product:', error);
      return false;
    }
  };

  const handleImageUpload = (imageUrl) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: imageUrl }]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'packtype') {
      if (value === 'Other') {
        setFormData(prev => ({ ...prev, packtype: 'Other' }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
        setCustomPackType('');
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomPackTypeChange = (e) => {
    setCustomPackType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if at least one image is uploaded
    if (formData.images.length === 0) {
      alert('Please upload at least one image.');
      setLoading(false);
      return;
    }
    
    // Determine final packtype value
    const finalPackType = formData.packtype === 'Other' && customPackType ? customPackType : formData.packtype;

    const productData = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price),
      offerprice: parseFloat(formData.offerprice) || 0,
      cost: parseFloat(formData.cost),
      stock: parseInt(formData.stock),
      minStock: parseInt(formData.minStock),
      packtype: finalPackType,
      description: formData.description,
      brand: formData.brand || 'No Brand',
      size: formData.size ? formData.size.split(',').map(s => s.trim()).filter(s => s) : [],
      color: formData.color ? formData.color.split(',').map(c => c.trim()).filter(c => c) : [],
      images: formData.images
    };

    const success = await addProduct(productData);

    if (success) {
      alert('Product added successfully!');
      router.push('/inventory-management');
    } else {
      alert('Failed to add product. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Add New Product</h1>
              <p className="mt-2 text-gray-600">Add a new product to your inventory</p>
            </div>
            <button
              onClick={() => router.push('/inventory-management')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Inventory
            </button>
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Auto-generate if empty"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
         {/* Pricing Section */}
<div>
  <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Pricing Information</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div>
      <label className="block text-sm font-medium mb-2">Selling Price (৳) *</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        step="0.01"
        required
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Offer Price (৳)</label>
      <input
        type="number"
        name="offerprice"
        value={formData.offerprice}
        onChange={handleInputChange}
        step="0.01"
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">Cost Price (৳) *</label>
      <input
        type="number"
        name="cost"
        value={formData.cost}
        onChange={handleInputChange}
        step="0.01"
        required
        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
      />
    </div>
  </div>
</div>

            {/* Stock Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Stock Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Stock Level *</label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Product Variants</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="S, M, L, XL"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Colors (comma separated)</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="Red, Blue, Green"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Pack Type & Description */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Additional Information</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Pack Type</label>
                  <select
                    name="packtype"
                    value={formData.packtype}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black mb-2"
                  >
                    <option value="">Select Pack Type</option>
                    {packTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  
                  {formData.packtype === 'Other' && (
                    <input
                      type="text"
                      value={customPackType}
                      onChange={handleCustomPackTypeChange}
                      placeholder="Enter custom pack type"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 pb-2 border-b">Product Images</h3>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Important:</strong> Please upload at least one image. Maximum 3 images allowed.
                </p>
              </div>

              <UploadImage
                onUpload={(url) =>
                  setFormData((prev) => {
                    if (prev.images.length >= 3) {
                      alert("You can upload up to 3 images only.");
                      return prev;
                    }
                    return {
                      ...prev,
                      images: [...prev.images, { url: url }],
                    };
                  })
                }
              />

              {/* Preview uploaded images */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Uploaded Images ({formData.images.length}/3):</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={img.url || img}
                          alt={`Uploaded ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                          className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-white rounded-lg transition-colors ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/inventory-management')}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}