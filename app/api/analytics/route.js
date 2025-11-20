// app/api/analytics/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Analytics from '@/models/Analytics';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, 1y
    const type = searchParams.get('type') || 'overview';

    const dateRange = getDateRange(period);
    
    let analyticsData;

    switch (type) {
      case 'sales':
        analyticsData = await getSalesAnalytics(dateRange);
        break;
      case 'products':
        analyticsData = await getProductAnalytics(dateRange);
        break;
      case 'customers':
        analyticsData = await getCustomerAnalytics(dateRange);
        break;
      case 'revenue':
        analyticsData = await getRevenueAnalytics(dateRange);
        break;
      default:
        analyticsData = await getOverviewAnalytics(dateRange);
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      period,
      dateRange
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get date range
function getDateRange(period) {
  const now = new Date();
  const from = new Date();

  switch (period) {
    case '1d':
      from.setDate(now.getDate() - 1);
      break;
    case '7d':
      from.setDate(now.getDate() - 7);
      break;
    case '30d':
      from.setDate(now.getDate() - 30);
      break;
    case '90d':
      from.setDate(now.getDate() - 90);
      break;
    case '1y':
      from.setFullYear(now.getFullYear() - 1);
      break;
    default:
      from.setDate(now.getDate() - 7);
  }

  return { from, to: now };
}

// Overview Analytics
async function getOverviewAnalytics(dateRange) {
  const [salesData, productData, customerData, revenueData] = await Promise.all([
    getSalesAnalytics(dateRange),
    getProductAnalytics(dateRange),
    getCustomerAnalytics(dateRange),
    getRevenueAnalytics(dateRange)
  ]);

  return {
    overview: {
      totalRevenue: salesData.totalRevenue,
      totalOrders: salesData.totalOrders,
      averageOrderValue: salesData.averageOrderValue,
      conversionRate: salesData.conversionRate,
      topProducts: productData.topProducts.slice(0, 5),
      newCustomers: customerData.newCustomers,
      customerGrowth: customerData.growthRate,
      revenueChart: revenueData.chartData
    }
  };
}

// Sales Analytics
async function getSalesAnalytics(dateRange) {
  const orders = await Order.find({
    createdAt: { $gte: dateRange.from, $lte: dateRange.to },
    orderStatus: { $ne: 'cancelled' }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate conversion rate (simplified)
  const totalVisitors = await getTotalVisitors(dateRange); // You'd implement this
  const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0;

  // Sales by status
  const salesByStatus = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: dateRange.from, $lte: dateRange.to }
      }
    },
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        revenue: { $sum: '$finalAmount' }
      }
    }
  ]);

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    conversionRate,
    salesByStatus,
    orders
  };
}

// Product Analytics
async function getProductAnalytics(dateRange) {
  const productSales = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: dateRange.from, $lte: dateRange.to },
        orderStatus: { $ne: 'cancelled' }
      }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        totalQuantity: { $sum: '$items.quantity' },
        totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orderCount: { $sum: 1 }
      }
    },
    { $sort: { totalRevenue: -1 } },
    { $limit: 10 }
  ]);

  // Inventory analytics
  const inventoryStats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        lowStock: {
          $sum: {
            $cond: [{ $and: [{ $gt: ['$stock', 0] }, { $lte: ['$stock', 10] }] }, 1, 0]
          }
        },
        outOfStock: {
          $sum: {
            $cond: [{ $eq: ['$stock', 0] }, 1, 0]
          }
        }
      }
    }
  ]);

  return {
    topProducts: productSales,
    inventoryStats: inventoryStats[0] || { totalProducts: 0, lowStock: 0, outOfStock: 0 }
  };
}

// Customer Analytics
async function getCustomerAnalytics(dateRange) {
  const customerStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: dateRange.from, $lte: dateRange.to }
      }
    },
    {
      $group: {
        _id: '$user',
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$finalAmount' }
      }
    }
  ]);

  const newCustomers = await User.countDocuments({
    createdAt: { $gte: dateRange.from, $lte: dateRange.to }
  });

  const totalCustomers = await User.countDocuments();
  const returningCustomers = customerStats.length - newCustomers;

  return {
    totalCustomers,
    newCustomers,
    returningCustomers,
    customerStats,
    growthRate: newCustomers > 0 ? ((newCustomers / totalCustomers) * 100) : 0
  };
}

// Revenue Analytics
async function getRevenueAnalytics(dateRange) {
  const revenueData = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: dateRange.from, $lte: dateRange.to },
        orderStatus: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        revenue: { $sum: '$finalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Fill in missing dates
  const chartData = fillMissingDates(revenueData, dateRange);

  return {
    chartData,
    totalRevenue: revenueData.reduce((sum, day) => sum + day.revenue, 0)
  };
}

// Helper to fill missing dates in chart data
function fillMissingDates(data, dateRange) {
  const result = [];
  const current = new Date(dateRange.from);
  
  while (current <= dateRange.to) {
    const dateStr = current.toISOString().split('T')[0];
    const existing = data.find(item => item._id === dateStr);
    
    result.push({
      date: dateStr,
      revenue: existing ? existing.revenue : 0,
      orders: existing ? existing.orders : 0
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return result;
}

// Get total visitors (placeholder - integrate with your analytics service)
async function getTotalVisitors(dateRange) {
  // This would typically come from Google Analytics or similar
  // For now, we'll estimate based on orders
  const orders = await Order.countDocuments({
    createdAt: { $gte: dateRange.from, $lte: dateRange.to }
  });
  
  return orders * 10; // Estimate 10 visitors per order
}