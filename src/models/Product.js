const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    code: {
      type: String,
    },
    status: {
      type: String,
    },
    isFeatured: {
      type: Boolean,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
    },
    likes: {
      type: Number,
    },

    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "please provide a category id"],
    },
    // subCategory: {
    //   type: mongoose.Types.ObjectId,
    //   ref: 'SubCategory',
    //   required: [true, 'please provide a sub category id'],
    // },
    gender: {
      type: String,
    },
    // tags: [String],
    // sku: {
    //   type: String,
    //   required: [true, 'SKU is required.'],
    // },
    price: {
      type: Number,
      // required: [true, "Price is required."],
    },
    priceSale: {
      type: Number,
      // required: [true, "Sale price is required."],
    },
    
    available: {
      type: Number,
      // required: [true, "Available quantity is required."],
    },
    sold: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
    ],
    
    images: [
      {
        url: {
          type: String,
          required: [true],
        },
        _id: {
          type: String,
          required: [true],
        },
        blurDataURL: {
          type: String,
          required: [true, "image-blur-data-url-required-error"],
        },
      },
    ],
    image:{
      _id: {
        type: String,
        required: [true, "image-id-required-error"],
      },
      url: {
        type: String,
        required: [true, "image-url-required-error"],
      },
      blurDataURL: {
        type: String,
        required: [true, "image-blur-data-url-required-error"],
      },
    },
    // size guideee
    // sizeGuide: {
    //   _id: {
    //     type: String,
    //     required: [true, "image-id-required-error"],
    //   },
    //   url: {
    //     type: String,
    //     required: [true, "image-url-required-error"],
    //   },
    //   blurDataURL: {
    //     type: String,
    //     required: [true, "image-blur-data-url-required-error"],
    //   },
    // },

    colors: [
      {
        name: String,
        value: String,
      },
    ],
    // sizes: [
    //   {
    //     value: String,
    //     label: String,
    //   },
    // ],
    // 🔹 Size-based pricing
    sizes: [
      {
        value: { type: String,  }, // e.g. "M"
        label: { type: String }, // e.g. "Medium"
        price: { type: Number,  }, // retail price
        PriceSale: { type: Number,  }, // discounted retail price
        available: { type: Number, default: 0 }, // stock for this size
        freepeople:{type: String},
        measurement:{type: String},
        weight:{type: String},
        sold: { type: Number, default: 0 }, // sold count
      },
    ],
    productDetails: {
      description: {
        type: String,
      },
      measurement: {
        type: String,
      },
      weight: {
        type: String,
      },
      freepeople: {
        type: String,
      },
    },
  },
  { timestamps: true, strict: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = Product;
