import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  productId: {
    type: String,
    required: true
  },
  product: {
    type: Object,
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index to ensure unique products per user
wishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);