// app/api/customers/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build filter object
    let filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    // Get customers with order statistics
    const customers = await User.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders'
        }
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' },
          totalSpent: { $sum: '$orders.finalAmount' },
          lastOrder: { $max: '$orders.createdAt' }
        }
      },
      {
        $project: {
          password: 0,
          orders: 0
        }
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    // Get total count for pagination
    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get customer statistics
    const stats = await getCustomerStats();

    return NextResponse.json({
      success: true,
      data: {
        customers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, email, phone, address, status = 'active' } = body;

    // Check if customer already exists
    const existingCustomer = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingCustomer) {
      return NextResponse.json(
        { success: false, message: 'Customer with this email or phone already exists' },
        { status: 400 }
      );
    }

    const customer = await User.create({
      name,
      email,
      phone,
      address,
      status,
      role: 'customer'
    });

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Customer created successfully'
    });

  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Customer Statistics
async function getCustomerStats() {
  const totalCustomers = await User.countDocuments({ role: 'customer' });
  const activeCustomers = await User.countDocuments({ 
    role: 'customer', 
    status: 'active' 
  });
  const newCustomers = await User.countDocuments({
    role: 'customer',
    createdAt: { 
      $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
    }
  });

  // Customer lifetime value and order stats
  const customerStats = await Order.aggregate([
    {
      $group: {
        _id: '$user',
        totalSpent: { $sum: '$finalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        avgOrderValue: { $avg: '$totalSpent' },
        avgOrdersPerCustomer: { $avg: '$orderCount' },
        totalRevenue: { $sum: '$totalSpent' }
      }
    }
  ]);

  const stats = customerStats[0] || { 
    avgOrderValue: 0, 
    avgOrdersPerCustomer: 0, 
    totalRevenue: 0 
  };

  return {
    totalCustomers,
    activeCustomers,
    newCustomers,
    inactiveCustomers: totalCustomers - activeCustomers,
    avgOrderValue: stats.avgOrderValue,
    avgOrdersPerCustomer: stats.avgOrdersPerCustomer,
    totalRevenue: stats.totalRevenue
  };
}