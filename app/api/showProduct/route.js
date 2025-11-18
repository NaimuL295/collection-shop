// /api/showProduct/route.js
import { dbConnect } from '@/lib/dbConnect';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = Math.min(parseInt(searchParams.get('limit')) || 10, 100);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const skip = (page - 1) * limit;
    
    // Build filter
    let filter = {};
    if (category && category !== 'all') filter.category = { $regex: category, $options: 'i' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    
    // Get data
    const [products, totalProducts, categories] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
      Product.distinct('category')
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        products: products.map(p => ({ ...p, _id: p._id.toString() })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
          hasNextPage: page < Math.ceil(totalProducts / limit),
          hasPrevPage: page > 1,
          limit
        },
        filters: {
          categories,
          currentCategory: category || 'all',
          currentSort: sortBy,
          currentSortOrder: sortOrder,
          search: search || ''
        }
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}