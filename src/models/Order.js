const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    paymentMethod: {
      type: String,
      required: [true, 'Payment Method is required.'],
      enum: ['Stripe', 'PayPal', 'COD'],
    },
    orderNo: {
      type: String,
      required: [true, 'Order No is required.'],
    },
    paymentId: {
      type: String,
    },
    subTotal: {
      type: Number,
      required: [true, 'Subtotal is required.'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required.'],
    },
    totalItems: {
      type: Number,
      required: [true, 'Total items is required.'],
    },
    shipping: {
      type: Number,
      required: [true, 'ShippingFee is required.'],
    },
    tax: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    status: {
      type: String,
    },
    items: {
      type: Array,
    },
    user: {
      _id: {
        type: mongoose.Types.ObjectId, // Use ObjectId type
      },
      fullName: {
        type: String,
        required: [true, 'Full name is required.'],
      },
     
      email: {
        type: String,
        required: [true, 'Email is required.'],
      },
      phone: {
        type: String,
        required: [false, 'Phone is required.'],
      },
      address: {
        type: String,
        required: [false, 'Address is required.'],
      },
      city: {
        type: String,
        required: [false, 'City is required.'],
      },
      zip: {
        type: String,
        required: [false, 'Postal code is required.'],
      },
      country: {
        type: String,
        required: [false, 'Country is required.'],
      },
      state: {
        type: String,
        required: [false, 'State is required.'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
module.exports = Order;
