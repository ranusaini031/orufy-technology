import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
    minlength: [2, "Product name must be at least 2 characters"],
    maxlength: [100, "Product name cannot exceed 100 characters"]
  },

  mrp: {
    type: Number,
    required: true,
    min: 0
  },

  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },

  brandName: {
    type: String,
    required: [true, "Brand name is required"],
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  images: {
    type: [String],
    default: []
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  isPublished: {
    type: Boolean,
    default: false
  },

  category: {
    type: String,
    enum: ["electronics", "clothing", "fashion", "home",
      "beauty", "sports", "books", "food", "furniture", "other"],
    default: "electronics"
  },

  stock: {
    type: Number,
    default: 0
  },

  exchangeEligible: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });




const Product = mongoose.model("Product", productSchema);

export default Product;