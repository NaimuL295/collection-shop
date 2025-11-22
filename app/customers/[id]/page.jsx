// app/customers/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  ArrowLeft,
  ShoppingCart,
  DollarSign,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  User
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../Components/ui/card';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomer();
  }, [params.id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setCustomerData(data.data);
      } else {
        setError(data.message || 'Customer not found');
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          <p className="text-gray-600">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (error || !customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Customer Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            <Link
              href="/customers"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Customers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { customer, orders = [], stats } = customerData;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customer Details</h1>
              <p className="text-gray-600 mt-1">Manage customer information and orders</p>
            </div>
          </div>
          <Link
            href={`/customers/${customer._id}/edit`}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Customer</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                    <Users className="w-10 h-10 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {customer.name || `${customer.firstName} ${customer.lastName}`}
                    </h2>
                    <p className="text-gray-600">{customer.email}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                      customer.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : customer.status === 'premium'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {customer.status || 'active'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {stats.lastOrderDate && (
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Last Order</p>
                        <p className="font-medium">
                          {new Date(stats.lastOrderDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Address Information */}
                {customer.address && (
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="text-sm text-gray-600">
                        {customer.address.street && <p>{customer.address.street}</p>}
                        {(customer.address.city || customer.address.state) && (
                          <p>
                            {customer.address.city}
                            {customer.address.city && customer.address.state && ', '}
                            {customer.address.state}
                          </p>
                        )}
                        {customer.address.zipCode && <p>{customer.address.zipCode}</p>}
                        {customer.address.country && <p>{customer.address.country}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Orders Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Recent Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          {order.items && order.items.length > 0 && (
                            <p className="text-sm text-gray-500">
                              {order.items.length} item{order.items.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">৳{order.finalAmount?.toLocaleString()}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            order.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link
                      href={`/orders?customerId=${customer._id}`}
                      className="block text-center text-blue-600 hover:text-blue-800 font-medium py-2"
                    >
                      View All Orders
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No orders found</p>
                    <Link
                      href={`/orders/new?customerId=${customer._id}`}
                      className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Create First Order
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Customer Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-8 h-8 text-blue-600 bg-blue-50 p-1 rounded-lg" />
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="text-xl font-bold">{stats.totalOrders || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-green-600 bg-green-50 p-1 rounded-lg" />
                    <div>
                      <p className="text-sm text-gray-500">Total Spent</p>
                      <p className="text-xl font-bold">৳{(stats.totalSpent || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-8 h-8 text-purple-600 bg-purple-50 p-1 rounded-lg" />
                    <div>
                      <p className="text-sm text-gray-500">Avg. Order Value</p>
                      <p className="text-xl font-bold">
                        ৳{(stats.avgOrderValue || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href={`/orders/new?customerId=${customer._id}`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create New Order
                </Link>
                <button className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Send Email
                </button>
                <button className="block w-full text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Export Data
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}