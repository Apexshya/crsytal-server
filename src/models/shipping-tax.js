const mongoose = require('mongoose');

const ShippingPrice = new mongoose.Schema(
  {
    
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    
    description: {
      type: String,
      required: [true, 'Description is required.'],
    },
    shipping:{
            type:Number,
            required:[true,'Shipping Price is required.']
    },
    tax:{
        type:Number,
        required:[true,'Tax Amount is required.']
    },
    status: {
        type: String,
        required: [true, 'Status is required.'],
    },
   
  },
  {
    timestamps: true,
  }
);

const ShippingPriceModel = mongoose.models.Shipping || mongoose.model('Shipping', ShippingPrice);
module.exports = ShippingPriceModel;
