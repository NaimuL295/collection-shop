import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zipCode: String,
  country: String
});

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: addressSchema,
  status: {
    type: String,
    enum: ['active', 'inactive', 'premium'],
    default: 'active'
  },
  notes: {
    type: String,
    trim: true
  },
  orderCount: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  lastOrder: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for search functionality
customerSchema.index({ name: 'text', email: 'text', phone: 'text' });
customerSchema.index({ status: 1 });
customerSchema.index({ createdAt: -1 });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);