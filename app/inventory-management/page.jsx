


// "use client";
// import React, { useState, useEffect } from 'react';
// import UploadImage from '../Components/UploadImage';
// import Link from 'next/link';
// import Image from 'next/image';

// export default function InventoryManagement() {
//   const [inventory, setInventory] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [selectedStatus, setSelectedStatus] = useState('All');
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [editingItem, setEditingItem] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     sku: '',
//     category: '',
//     price: '',
//     offerprice: '',
//     cost: '',
//     stock: '',
//     minStock: '',
//     packtype: '',
//     description: '',
//     brand: '',
//     size: '',
//     color: '',
//     images: []
//   });

//   const [customPackType, setCustomPackType] = useState('');

//   const categories = ['All', 'Shirts', 'Pants', 'Shoes', 'Accessories', 'Jackets', 'Bags', 'Watches', 'T-Shirts', 'Sweaters', 'Sarees', 'Others'];
//   const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];
//   const packTypes = ['Student Packers', 'Prime Packages', 'Other'];

//   // Fetch inventory from API
//   const fetchInventory = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/product');
//       const data = await response.json();
//       if (data.success) {
//         setInventory(data.products);
//       }
//     } catch (error) {
//       console.error('Error fetching inventory:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchInventory();
//   }, []);

//   // API call functions
//   const addProduct = async (productData) => {
//     console.log('Sending product data:', productData);
    
//     try {
//       const response = await fetch('/api/add', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(productData),
//       });
//       const data = await response.json();
//       if (data.success) {
//         fetchInventory();
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Error adding product:', error);
//       return false;
//     }
//   };

//   const updateProduct = async (id, productData) => {
//     try {
//       const response = await fetch(`/api/product/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(productData),
//       });
//       const data = await response.json();
//       if (data.success) {
//         fetchInventory();
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Error updating product:', error);
//       return false;
//     }
//   };

//   const deleteProduct = async (id) => {
//     try {
//       const response = await fetch(`/api/product/${id}`, {
//         method: 'DELETE',
//       });
//       const data = await response.json();
//       if (data.success) {
//         fetchInventory();
//         return true;
//       }
//       return false;
//     } catch (error) {
//       console.error('Error deleting product:', error);
//       return false;
//     }
//   };

//   const handleImageUpload = (imageUrl) => {
//     setFormData(prev => ({
//       ...prev,
//       images: [...prev.images, { url: imageUrl }]
//     }));
//   };

//   const filteredInventory = inventory.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
//     const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    
//     return matchesSearch && matchesCategory && matchesStatus;
//   });

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'In Stock': return 'bg-green-100 text-green-800';
//       case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
//       case 'Out of Stock': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const updateStock = async (id, newStock) => {
//     const success = await updateProduct(id, { stock: newStock });
//     if (success) {
//       setInventory(prev => prev.map(item => {
//         if (item._id === id) {
//           const updatedItem = {
//             ...item, 
//             stock: newStock,
//             lastUpdated: new Date().toISOString().split('T')[0]
//           };
          
//           if (newStock === 0) {
//             updatedItem.status = 'Out of Stock';
//           } else if (newStock <= item.minStock) {
//             updatedItem.status = 'Low Stock';
//           } else {
//             updatedItem.status = 'In Stock';
//           }
          
//           return updatedItem;
//         }
//         return item;
//       }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === 'packtype') {
//       if (value === 'Other') {
//         setFormData(prev => ({ ...prev, packtype: 'Other' }));
//       } else {
//         setFormData(prev => ({ ...prev, [name]: value }));
//         setCustomPackType('');
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleCustomPackTypeChange = (e) => {
//     setCustomPackType(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Check if at least one image is uploaded
//     if (formData.images.length === 0) {
//       alert('Please upload at least one image.');
//       return;
//     }
    
//     // Determine final packtype value
//     const finalPackType = formData.packtype === 'Other' && customPackType ? customPackType : formData.packtype;

//     const productData = {
//       name: formData.name,
//       sku: formData.sku,
//       category: formData.category,
//       price: parseFloat(formData.price),
//       offerprice: parseFloat(formData.offerprice) || 0,
//       cost: parseFloat(formData.cost),
//       stock: parseInt(formData.stock),
//       minStock: parseInt(formData.minStock),
//       packtype: finalPackType,
//       description: formData.description,
//       brand: formData.brand || 'No Brand',
//       size: formData.size ? formData.size.split(',').map(s => s.trim()).filter(s => s) : [],
//       color: formData.color ? formData.color.split(',').map(c => c.trim()).filter(c => c) : [],
//       images: formData.images
//     };

//     let success = false;
//     if (editingItem) {
//       success = await updateProduct(editingItem._id, productData);
//     } else {
//       success = await addProduct(productData);
//     }

//     if (success) {
//       // Reset form
//       setFormData({
//         name: '',
//         sku: '',
//         category: '',
//         price: '',
//         offerprice: '',
//         cost: '',
//         stock: '',
//         minStock: '',
//         packtype: '',
//         description: '',
//         brand: '',
//         size: '',
//         color: '',
//         images: []
//       });
//       setCustomPackType('');
//       setShowAddForm(false);
//       setEditingItem(null);
//       alert(editingItem ? 'Product updated successfully!' : 'Product added successfully!');
//     } else {
//       alert('Failed to save product. Please try again.');
//     }
//   };

//   const handleEdit = (item) => {
//     setEditingItem(item);
    
//     // Check if packtype is one of the predefined options
//     const isPredefinedPackType = packTypes.includes(item.packtype);
    
//     setFormData({
//       name: item.name,
//       sku: item.sku || '',
//       category: item.category,
//       price: item.price.toString(),
//       offerprice: item.offerprice?.toString() || '',
//       cost: item.cost?.toString() || '',
//       stock: item.stock.toString(),
//       minStock: item.minStock?.toString() || '0',
//       packtype: isPredefinedPackType ? item.packtype : 'Other',
//       description: item.description,
//       brand: item.brand || '',
//       size: item.size?.join(', ') || '',
//       color: item.color?.join(', ') || '',
//       images: item.images || []
//     });
    
//     setCustomPackType(isPredefinedPackType ? '' : item.packtype);
//     setShowAddForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (confirm('Are you sure you want to delete this item?')) {
//       await deleteProduct(id);
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Calculate stats
//   const totalValue = inventory.reduce((sum, item) => sum + ((item.cost || item.price * 0.5) * item.stock), 0);
//   const outOfStockItems = inventory.filter(item => item.status === 'Out of Stock' || item.stock === 0).length;
//   const lowStockItems = inventory.filter(item => item.status === 'Low Stock' || (item.stock > 0 && item.stock <= (item.minStock || 5))).length;

//   if (loading && inventory.length === 0) {
//     return (
//       <div className="min-h-screen p-6 flex items-center justify-center">
//         <div className="text-lg">Loading inventory...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold">Inventory Management</h1>
//           <p className="mt-2">Manage your product inventory and stock levels</p>
//         </div>

//         {/* Stats Overview */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//           <div className="rounded-lg shadow p-6">
//             <h3 className="text-lg font-semibold mb-2">Total Products</h3>
//             <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
//           </div>
          
//           <div className="rounded-lg shadow p-6">
//             <h3 className="text-lg font-semibold mb-2">Inventory Value</h3>
//             <p className="text-3xl font-bold text-green-600">${totalValue.toFixed(2)}</p>
//           </div>
          
//           <div className="rounded-lg shadow p-6">
//             <h3 className="text-lg font-semibold mb-2">Low Stock</h3>
//             <p className="text-3xl font-bold text-yellow-600">{lowStockItems}</p>
//           </div>
          
//           <div className="rounded-lg shadow p-6">
//             <h3 className="text-lg font-semibold mb-2">Out of Stock</h3>
//             <p className="text-3xl font-bold text-red-600">{outOfStockItems}</p>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="rounded-lg shadow mb-6">
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//               <div className="flex flex-col md:flex-row gap-4 flex-1">
//                 <div className="flex-1">
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchTerm}
//                     onChange={handleSearch}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                   />
//                 </div>

//                 <select
//                   value={selectedCategory}
//                   onChange={(e) => setSelectedCategory(e.target.value)}
//                   className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                 >
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
//                 </select>

//                 <select
//                   value={selectedStatus}
//                   onChange={(e) => setSelectedStatus(e.target.value)}
//                   className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                 >
//                   {statuses.map(status => (
//                     <option key={status} value={status}>{status}</option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 onClick={() => {
//                   setShowAddForm(true);
//                   setEditingItem(null);
//                   setFormData({
//                     name: '',
//                     sku: '',
//                     category: '',
//                     price: '',
//                     offerprice: '',
//                     cost: '',
//                     stock: '',
//                     minStock: '',
//                     packtype: '',
//                     description: '',
//                     brand: '',
//                     size: '',
//                     color: '',
//                     images: []
//                   });
//                   setCustomPackType('');
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Add New Product
//               </button>
//             </div>
//           </div>

//           {/* Add/Edit Product Form - ALL FIELDS TOGETHER */}
//           {showAddForm && (
//             <div className="p-6 border-b border-gray-200 bg-gray-50">
//               <h3 className="text-lg font-semibold mb-4">
//                 {editingItem ? 'Edit Product' : 'Add New Product'}
//               </h3>
              
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Basic Information Section */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Product Name *</label>
//                     <input
//                       type="text"
//                       name="name"
//                       value={formData.name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">SKU</label>
//                     <input
//                       type="text"
//                       name="sku"
//                       value={formData.sku}
//                       onChange={handleInputChange}
//                       placeholder="Auto-generate if empty"
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Category *</label>
//                     <select
//                       name="category"
//                       value={formData.category}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     >
//                       <option value="">Select Category</option>
//                       {categories.filter(cat => cat !== 'All').map(category => (
//                         <option key={category} value={category}>{category}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Brand</label>
//                     <input
//                       type="text"
//                       name="brand"
//                       value={formData.brand}
//                       onChange={handleInputChange}
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>
//                 </div>

//                 {/* Pricing Section */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Selling Price ($) *</label>
//                     <input
//                       type="number"
//                       name="price"
//                       value={formData.price}
//                       onChange={handleInputChange}
//                       step="0.01"
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Offer Price ($)</label>
//                     <input
//                       type="number"
//                       name="offerprice"
//                       value={formData.offerprice}
//                       onChange={handleInputChange}
//                       step="0.01"
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Cost Price ($) *</label>
//                     <input
//                       type="number"
//                       name="cost"
//                       value={formData.cost}
//                       onChange={handleInputChange}
//                       step="0.01"
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>
//                 </div>

//                 {/* Stock Information */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Current Stock *</label>
//                     <input
//                       type="number"
//                       name="stock"
//                       value={formData.stock}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Minimum Stock Level *</label>
//                     <input
//                       type="number"
//                       name="minStock"
//                       value={formData.minStock}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>
//                 </div>

//                 {/* Variants */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium mb-2">Sizes (comma separated)</label>
//                     <input
//                       type="text"
//                       name="size"
//                       value={formData.size}
//                       onChange={handleInputChange}
//                       placeholder="S, M, L, XL"
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium mb-2">Colors (comma separated)</label>
//                     <input
//                       type="text"
//                       name="color"
//                       value={formData.color}
//                       onChange={handleInputChange}
//                       placeholder="Red, Blue, Green"
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   </div>
//                 </div>

//                 {/* Pack Type */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Pack Type</label>
//                   <select
//                     name="packtype"
//                     value={formData.packtype}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black mb-2"
//                   >
//                     <option value="">Select Pack Type</option>
//                     {packTypes.map(type => (
//                       <option key={type} value={type}>{type}</option>
//                     ))}
//                   </select>
                  
//                   {formData.packtype === 'Other' && (
//                     <input
//                       type="text"
//                       value={customPackType}
//                       onChange={handleCustomPackTypeChange}
//                       placeholder="Enter custom pack type"
//                       className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                     />
//                   )}
//                 </div>

//                 {/* Description */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">Description</label>
//                   <textarea
//                     name="description"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
//                   />
//                 </div>

//                 {/* Image Upload Section */}
//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Upload Images (Max 3) - {formData.images.length}/3 uploaded
//                   </label>
                  
//                   <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
//                     <p className="text-yellow-800 text-sm">
//                       <strong>Important:</strong> Please upload at least one image before submitting the form.
//                     </p>
//                   </div>

//                   <UploadImage
//                     onUpload={(url) =>
//                       setFormData((prev) => {
//                         if (prev.images.length >= 3) {
//                           alert("You can upload up to 3 images only.");
//                           return prev;
//                         }
//                         return {
//                           ...prev,
//                           images: [...prev.images, { url: url }],
//                         };
//                       })
//                     }
//                   />

//                   {/* Preview uploaded images */}
//                   {formData.images.length > 0 && (
//                     <div className="mt-4">
//                       <h4 className="text-sm font-medium mb-2">Uploaded Images:</h4>
//                       <div className="flex flex-wrap gap-2">
//                         {formData.images.map((img, index) => (
//                           <div key={index} className="relative group">
//                             <Image
//                               src={img.url || img}
//                               alt={`Uploaded ${index + 1}`}
//                               width={80}
//                               height={80}
//                               className="object-cover rounded border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() =>
//                                 setFormData((prev) => ({
//                                   ...prev,
//                                   images: prev.images.filter((_, i) => i !== index),
//                                 }))
//                               }
//                               className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
//                             >
//                               ✕
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Form Actions */}
//                 <div className="flex gap-4 pt-4">
//                   <button
//                     type="submit"
//                     className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//                   >
//                     {editingItem ? 'Update Product' : 'Add Product'}
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowAddForm(false);
//                       setEditingItem(null);
//                     }}
//                     className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           )}

//           {/* Inventory Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pack Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {filteredInventory.map((item) => (
//                   <tr key={item._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium">
//                           <Link href={`/inventory-management/${item._id}`} className="text-blue-600 hover:underline">
//                             {item.name}
//                           </Link>
//                         </div>
//                         <div className="text-sm text-gray-500">{item.description}</div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">{item.sku}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">{item.category}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">{item.packtype || 'N/A'}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">${item.price}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <input
//                           type="number"
//                           value={item.stock}
//                           onChange={(e) => updateStock(item._id, parseInt(e.target.value) || 0)}
//                           className="w-20 p-1 border border-gray-300 rounded text-black"
//                         />
//                         <span className="text-sm text-gray-500">min: {item.minStock || 5}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
//                         {item.status || (item.stock === 0 ? 'Out of Stock' : item.stock <= (item.minStock || 5) ? 'Low Stock' : 'In Stock')}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleEdit(item)}
//                           className="text-blue-600 hover:text-blue-900"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(item._id)}
//                           className="text-red-600 hover:text-red-900"
//                         >
//                           Delete
//                         </button>
//                         <Link
//                           href={`/inventory-management/${item._id}`}
//                           className="text-green-600 hover:text-green-900"
//                         >
//                           View
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {filteredInventory.length === 0 && (
//               <div className="p-6 text-center text-gray-500">
//                 No products found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categories = ['All', 'Shirts', 'Pants', 'Shoes', 'Accessories', 'Jackets', 'Bags', 'Watches', 'T-Shirts', 'Sweaters', 'Sarees', 'Others'];
  const statuses = ['All', 'In Stock', 'Low Stock', 'Out of Stock'];

  // Fetch inventory from API
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/product');
      const data = await response.json();
      if (data.success) {
        setInventory(data.products);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // API call functions
  const updateProduct = async (id, productData) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      if (data.success) {
        fetchInventory();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      console.log(id);
      
      const response = await fetch(`/api/product/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchInventory();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-800';
      case 'Low Stock': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateStock = async (id, newStock) => {
    const success = await updateProduct(id, { stock: newStock });
    if (success) {
      setInventory(prev => prev.map(item => {
        if (item._id === id) {
          const updatedItem = {
            ...item, 
            stock: newStock,
            lastUpdated: new Date().toISOString().split('T')[0]
          };
          
          if (newStock === 0) {
            updatedItem.status = 'Out of Stock';
          } else if (newStock <= item.minStock) {
            updatedItem.status = 'Low Stock';
          } else {
            updatedItem.status = 'In Stock';
          }
          
          return updatedItem;
        }
        return item;
      }));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await deleteProduct(id);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Calculate stats
  const totalValue = inventory.reduce((sum, item) => sum + ((item.cost || item.price * 0.5) * item.stock), 0);
  const outOfStockItems = inventory.filter(item => item.status === 'Out of Stock' || item.stock === 0).length;
  const lowStockItems = inventory.filter(item => item.status === 'Low Stock' || (item.stock > 0 && item.stock <= (item.minStock || 5))).length;

  if (loading && inventory.length === 0) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-lg">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="mt-2 text-gray-600">Manage your product inventory and stock levels</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{inventory.length}</p>
          </div>
   <div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold mb-2">Inventory Value</h3>
  <p className="text-3xl font-bold text-green-600">৳{totalValue.toFixed(2)}</p>
</div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Low Stock</h3>
            <p className="text-3xl font-bold text-yellow-600">{lowStockItems}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Out of Stock</h3>
            <p className="text-3xl font-bold text-red-600">{outOfStockItems}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search products by name or SKU..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => router.push('/inventory-management/add')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add New Product
              </button>
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pack Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.sku || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.packtype || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{item.price}</td>             
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => updateStock(item._id, parseInt(e.target.value) || 0)}
                          className="w-20 p-1 border border-gray-300 rounded text-black text-sm"
                        />
                        <span className="text-sm text-gray-500">min: {item.minStock || 5}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status || (item.stock === 0 ? 'Out of Stock' : item.stock <= (item.minStock || 5) ? 'Low Stock' : 'In Stock')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3">
                        <button
                          onClick={() => router.push(`/inventory-management/edit/${item._id}`)}
                          className="text-blue-600 hover:text-blue-900 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900 text-sm"
                        >
                          Delete
                        </button>
                        <Link
                          href={`/inventory-management/${item._id}`}
                          className="text-green-600 hover:text-green-900 text-sm"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredInventory.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <div className="text-lg mb-2">No products found</div>
                <p className="text-sm mb-4">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => router.push('/inventory-management/add')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Your First Product
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => router.push('/inventory-management/add')}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New Product
            </button>
            <button
              onClick={fetchInventory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Inventory
            </button>
            <Link
              href="/inventory-management?filter=low-stock"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              View Low Stock Items
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}