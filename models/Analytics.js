// models/Analytics.js (Updated for ৳)
import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  // Sales Analytics
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  averageOrderValue: {
    type: Number,
    default: 0
  },
  // Product Analytics
  topProducts: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    quantity: Number,
    revenue: Number
  }],
  // Customer Analytics
  newCustomers: {
    type: Number,
    default: 0
  },
  returningCustomers: {
    type: Number,
    default: 0
  },
  // Currency specific
  currency: {
    type: String,
    default: 'BDT'
  }
}, {
  timestamps: true
});

export default mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);