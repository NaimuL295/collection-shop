// app/customers/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Edit, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../Components/ui/card';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchCustomers();
  }, [filters, pagination.page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const response = await fetch(`/api/customers?${params}`);
      const data = await response.json();

      if (data.success) {
        setCustomers(data.data.customers);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      } else {
        setError(data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      setError('Failed to connect to customers service');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading && !customers.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-base">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error && !customers.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Error Loading Customers</h2>
          <p className="text-gray-600 mb-4 text-base leading-relaxed">{error}</p>
          <button
            onClick={fetchCustomers}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
console.log(customers);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Golden Ratio Proportions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12">
          <div className="flex-1 max-w-[61.8%] mb-6 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Customers</h1>
            <p className="text-base text-gray-600 leading-relaxed max-w-[38.2rem]">
              Manage and view your customer information with comprehensive insights
            </p>
          </div>
          
          <div className="flex items-center space-x-4 w-full lg:w-auto">
            <button
              onClick={fetchCustomers}
              className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              title="Refresh data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <Link
              href="/customers/new"
              className="flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-5 h-5" />
              <span className="text-base font-semibold">Add Customer</span>
            </Link>
          </div>
        </div>

        {/* Statistics Grid with Golden Ratio */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            <GoldenStatCard 
              title="Total Customers"
              value={stats.totalCustomers}
              icon={Users}
              description="All registered customers"
              color="blue"
            />
            <GoldenStatCard
              title="Active Customers"
              value={stats.activeCustomers}
              icon={TrendingUp}
              description="Currently active"
              color="green"
            />
            <GoldenStatCard
              title="New Customers"
              value={stats.newCustomers}
              icon={UserPlus}
              description="Last 30 days"
              color="purple"
            />
            <GoldenStatCard
              title="Avg. Order Value"
              value={`৳${stats.avgOrderValue?.toFixed(2)}`}
              icon={DollarSign}
              description="Per customer"
              color="orange"
            />
          </div>
        )}

        {/* Filters and Search Section */}
        <Card className="mb-8 rounded-2xl shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center">
              {/* Search - Golden Ratio Width */}
              <div className="flex-1 w-full xl:max-w-[61.8%]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search customers by name, email, or phone..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-0 bg-gray-50 rounded-xl focus:ring-2 focus:ring-blue-200 focus:bg-white text-base shadow-inner transition-all duration-300"
                  />
                </div>
              </div>

              {/* Filters - Proportional Width */}
              <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto xl:max-w-[38.2%]">
                <select
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-200 text-base shadow-inner transition-all duration-300"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="premium">Premium</option>
                </select>

                <select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    setFilters(prev => ({ ...prev, sortBy, sortOrder }));
                  }}
                  className="px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-200 text-base shadow-inner transition-all duration-300"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="totalSpent-desc">Highest Spent</option>
                  <option value="orderCount-desc">Most Orders</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card className="rounded-2xl shadow-lg border-0 overflow-hidden">
          <CardHeader className="pb-4 px-6 pt-6 bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl font-bold text-gray-900">Customer List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {customers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100 bg-gray-50">
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-base">Customer</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-base">Contact</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-base">Orders</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-base">Total Spent</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-base">Status</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-900 text-base">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer, index) => (
                      <GoldenCustomerRow 
                        key={customer._id} 
                        customer={customer} 
                        index={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <p className="text-xl text-gray-500 mb-3">No customers found</p>
                {filters.search && (
                  <p className="text-base text-gray-400">
                    Try adjusting your search criteria
                  </p>
                )}
              </div>
            )}

            {/* Pagination with Golden Ratio */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="text-base text-gray-600 mb-3 sm:mb-0">
                  Showing <span className="font-semibold">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
                  <span className="font-semibold">{Math.min(pagination.page * pagagination.limit, pagination.total)}</span> of{' '}
                  <span className="font-semibold">{pagination.total}</span> customers
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base font-medium shadow-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNext}
                    className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base font-medium shadow-lg"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Enhanced Customer Row with Golden Ratio Proportions
function GoldenCustomerRow({ customer, index }) {
  return (
    <tr 
      className={`border-b border-gray-100 transition-all duration-300 ${
        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
      } hover:bg-blue-50 group`}
    >
      <td className="py-4 px-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base mb-1">{customer.name}</p>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-400" />
            <span className="text-base">{customer.email}</span>
          </div>
          {customer.phone && (
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-base">{customer.phone}</span>
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-50 rounded-xl">
            <ShoppingCart className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <span className="font-bold text-lg block">{customer.orderCount || 0}</span>
            <span className="text-xs text-gray-500">orders</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-50 rounded-xl">
            <DollarSign className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <span className="font-bold text-lg block">৳{(customer.totalSpent || 0).toLocaleString()}</span>
            <span className="text-xs text-gray-500">lifetime</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold ${
          customer.status === 'active' 
            ? 'bg-green-100 text-green-800 border border-green-200'
            : customer.status === 'premium'
            ? 'bg-purple-100 text-purple-800 border border-purple-200'
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <span className={`w-2 h-2 rounded-full mr-1 ${
            customer.status === 'active' ? 'bg-green-500' :
            customer.status === 'premium' ? 'bg-purple-500' : 'bg-red-500'
          }`}></span>
          {customer.status || 'active'}
        </span>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center space-x-2">
          <Link
            href={`/customers/${customer._id}`}
            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 hover:text-blue-800 transition-all duration-300 shadow-sm hover:shadow-md"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
          <Link
            href={`/customers/${customer._id}/edit`}
            className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 hover:text-gray-800 transition-all duration-300 shadow-sm hover:shadow-md"
            title="Edit Customer"
          >
            <Edit className="w-5 h-5" />
          </Link>
        </div>
      </td>
    </tr>
  );
}

// Enhanced Stat Card with Golden Ratio
function GoldenStatCard({ title, value, icon: Icon, description, color }) {
  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', iconBg: 'bg-blue-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', iconBg: 'bg-green-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', iconBg: 'bg-purple-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', iconBg: 'bg-orange-100' }
  };

  const { bg, text, iconBg } = colorClasses[color];

  return (
    <Card className="rounded-2xl shadow-lg border-0 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <CardContent className="p-6 relative">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {value}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
            
            <div className={`p-3 rounded-xl ${iconBg} ${text} shadow-md group-hover:scale-105 transition-transform duration-300`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}