// app/api/customers/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/User';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    // Await the params promise
    const { id } = await params;

    const customer = await User.findById(id).select('-password');
    
    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    // Get customer orders with details
    const orders = await Order.find({ user: id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('items.product', 'name images');

    // Get customer statistics
    const customerStats = await Order.aggregate([
      { $match: { user: customer._id } },
      {
        $group: {
          _id: '$user',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$finalAmount' },
          avgOrderValue: { $avg: '$finalAmount' },
          lastOrderDate: { $max: '$createdAt' }
        }
      }
    ]);

    const stats = customerStats[0] || {
      totalOrders: 0,
      totalSpent: 0,
      avgOrderValue: 0,
      lastOrderDate: null
    };

    return NextResponse.json({
      success: true,
      data: {
        customer,
        orders,
        stats
      }
    });

  } catch (error) {
    console.error('Error fetching customer details:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    // Await the params promise
    const { id } = await params;
    const body = await request.json();

    const customer = await User.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).select('-password');

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Customer updated successfully'
    });

  } catch (error) {
    console.error('Error updating customer:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: errors.join(', ') },
        { status: 400 }
      );
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    // Await the params promise
    const { id } = await params;

    const customer = await User.findById(id);

    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}