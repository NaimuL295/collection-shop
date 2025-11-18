
import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import { dbConnect } from '@/lib/dbConnect';


export async function POST(request) {
  try {
    await dbConnect();
    
    const productData = await request.json();
    
    console.log('Received product data:', productData);

    // Validate required fields
    const requiredFields = ['name', 'category', 'price', 'offerprice', 'cost', 'stock', 'minStock'];
    const missingFields = requiredFields.filter(field => {
      const value = productData[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Create product using Mongoose
    const product = new Product({
      name: productData.name.trim(),
      description: productData.description || '',
      price: parseFloat(productData.price),
      offerprice: parseFloat(productData.offerprice) || 0,
      cost: parseFloat(productData.cost),
      category: productData.category,
      brand: productData.brand || 'No Brand',
      size: Array.isArray(productData.size) ? productData.size : 
            (productData.size ? productData.size.split(',').map(s => s.trim()).filter(s => s) : []),
      color: Array.isArray(productData.color) ? productData.color : 
             (productData.color ? productData.color.split(',').map(c => c.trim()).filter(c => c) : []),
      stock: parseInt(productData.stock),
      minStock: parseInt(productData.minStock),
      packtype: productData.packtype || '',
      images: productData.images || []
    });

    // Save to database
    const savedProduct = await product.save();

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      productId: savedProduct._id,
      sku: savedProduct.sku,
      product: savedProduct
    });

  } catch (error) {
    console.error('Error adding product:', error);
    
    // Handle duplicate SKU error
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'SKU already exists. Please try again.' 
        },
        { status: 400 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed: ' + errors.join(', ') 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error: ' + error.message 
      },
      { status: 500 }
    );
  }
}