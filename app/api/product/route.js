import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import { dbConnect } from '@/lib/dbConnect';


export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (status && status !== 'All') {
      query.status = status;
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products: products,
      count: products.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error: ' + error.message 
      },
      { status: 500 }
    );
  }
}