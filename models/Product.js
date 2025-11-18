const mongoose =require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    offerprice: {
      type: Number,
      min: [0, "Offer price cannot be negative"],
    },
    cost: {
      type: Number,
      required: [true, "Product cost is required"],
      min: [0, "Cost cannot be negative"],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Shirts",
        "Pants",
        "Shoes",
        "Accessories",
        "Jackets",
        "Bags",
        "Watches",
        "T-Shirts",
        "Sweaters",
        "Sarees",
        "Others",
      ],
      default: "Others",
    },
    brand: {
      type: String,
      default: "No Brand",
    },
    size: {
      type: [String],
      default: [],
    },
    color: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity required"],
      min: 0,
    },
    minStock: {
      type: Number,
      required: [true, "Minimum stock level required"],
      min: 0,
      default: 5,
    },
    packtype: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          public_id: String,
        },
      ],
      validate: [
        (val) => val.length <= 3,
        "You can upload up to 3 images only.",
      ],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate status based on stock
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.status = 'Out of Stock';
  } else if (this.stock <= this.minStock) {
    this.status = 'Low Stock';
  } else {
    this.status = 'In Stock';
  }
  next();
});

// Generate SKU before saving if not provided
productSchema.pre('save', async function(next) {
  if (!this.sku) {
    const categoryPrefix = this.category.substring(0, 3).toUpperCase();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.sku = `${categoryPrefix}-${randomNum}`;
    
    // Ensure uniqueness
    try {
      const existingProduct = await this.constructor.findOne({ sku: this.sku });
      if (existingProduct) {
        const newRandomNum = Math.floor(1000 + Math.random() * 9000);
        this.sku = `${categoryPrefix}-${newRandomNum}`;
      }
    } catch (error) {
      console.error('Error checking SKU uniqueness:', error);
    }
  }
  next();
});

// Static method to update inventory after order
productSchema.statics.decreaseStock = async function (productId, quantity) {
  const product = await this.findById(productId);
  if (!product) throw new Error("Product not found");
  if (product.stock < quantity) throw new Error("Not enough stock");
  
  product.stock -= quantity;
  await product.save();
  return product;
};

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;