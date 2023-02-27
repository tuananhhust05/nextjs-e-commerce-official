import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, default:"" },
    slug: { type: String, default:""},
    category: { type: String, default:"" },
    image: { type: String, default:"" },
    price: { type: Number, default:0 },
    brand: { type: String, default:"" },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    description: { type: String, default:"" },
    isFeatured: { type: Boolean, default:false },
    banner: { type: String, default:""},
    country: { type: String, default:"" },
    site: { type: String, default:"" }
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
