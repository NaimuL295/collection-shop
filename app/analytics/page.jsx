// app/analytics/page.jsx
'use client';

import { useState, useEffect } from 'react';

import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package, 
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
  }, [period, activeTab]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/analytics?period=${period}&type=${activeTab}`);
      const data = await response.json();
      
      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        setError(data.message || 'Failed to fetch analytics data');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to connect to analytics service');
    } finally {
      setLoading(false);
    }
  };

  const periodOptions = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'revenue', label: 'Revenue', icon: TrendingUp },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Track your business performance and metrics
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {periodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Analytics Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <OverviewTab data={analyticsData?.overview} />
          )}
          
          {activeTab === 'sales' && (
            <SalesTab data={analyticsData} />
          )}
          
          {activeTab === 'revenue' && (
            <RevenueTab data={analyticsData} />
          )}
          
          {activeTab === 'products' && (
            <ProductsTab data={analyticsData} />
          )}
          
          {activeTab === 'customers' && (
            <CustomersTab data={analyticsData} />
          )}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No overview data available</p>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Revenue',
      value: `৳${(data.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      description: 'Total revenue generated',
      color: 'text-green-600'
    },
    {
      title: 'Total Orders',
      value: (data.totalOrders || 0).toLocaleString(),
      icon: ShoppingCart,
      description: 'Number of orders placed',
      color: 'text-blue-600'
    },
    {
      title: 'Average Order Value',
      value: `৳${(data.averageOrderValue || 0).toFixed(2)}`,
      icon: TrendingUp,
      description: 'Average spend per order',
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: `${(data.conversionRate || 0).toFixed(2)}%`,
      icon: Users,
      description: 'Visitor to customer rate',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </h3>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-full">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Additional Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.revenueChart && data.revenueChart.length > 0 ? (
              <div className="h-80">
                {/* Chart would go here - you can integrate Chart.js or Recharts */}
                <div className="flex items-center justify-center h-full text-gray-500">
                  Revenue chart component
                </div>
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No revenue chart data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="bg-white shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Top Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.topProducts && data.topProducts.length > 0 ? (
              <div className="space-y-4">
                {data.topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.totalQuantity} sold • ৳{product.totalRevenue?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ৳{product.totalRevenue?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2" />
                <p>No product data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Sales Tab Component
function SalesTab({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No sales data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-50 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ৳{(data.totalRevenue || 0).toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-50 rounded-full">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {(data.totalOrders || 0).toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  ৳{(data.averageOrderValue || 0).toFixed(2)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Sales by Status</CardTitle>
        </CardHeader>
        <CardContent>
          {data.salesByStatus && data.salesByStatus.length > 0 ? (
            <div className="space-y-4">
              {data.salesByStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="capitalize">{status._id}</span>
                  <div className="flex items-center space-x-4">
                    <span>{status.count} orders</span>
                    <span className="font-semibold">
                      ৳{status.revenue?.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
              <p>No sales status data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Revenue Tab Component
function RevenueTab({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No revenue data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <LineChart className="w-5 h-5" />
            <span>Revenue Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.chartData && data.chartData.length > 0 ? (
            <div className="h-96">
              {/* Chart would go here */}
              <div className="flex items-center justify-center h-full text-gray-500">
                Revenue chart component
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              <LineChart className="w-8 h-8 mr-2" />
              No revenue chart data available
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {data.chartData && data.chartData.length > 0 ? (
              <div className="space-y-3">
                {data.chartData.slice(-7).map((day, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{day.date}</span>
                    <span className="font-semibold">
                      ৳{(day.revenue || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No daily revenue data
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-bold text-lg">
                  ৳{(data.totalRevenue || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Daily Revenue</span>
                <span>
                  ৳{Math.round((data.totalRevenue || 0) / (data.chartData?.length || 1)).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Products Tab Component
function ProductsTab({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No product data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {data.inventoryStats?.totalProducts || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-4 h-4 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {data.inventoryStats?.lowStock || 0}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Package className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {data.inventoryStats?.outOfStock || 0}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topProducts && data.topProducts.length > 0 ? (
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        {product.totalQuantity} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      ৳{product.totalRevenue?.toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">
                      {product.orderCount} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <p>No product sales data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Customers Tab Component
function CustomersTab({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No customer data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(data.totalCustomers || 0).toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">New Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(data.newCustomers || 0).toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Returning Customers</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {(data.returningCustomers || 0).toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <Users className="w-8 h-8 mr-2" />
            Customer growth chart will be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}