const Notifications = require('../models/Notification');
const Products = require('../models/Product');
const Orders = require('../models/Order');
const Coupons = require('../models/CouponCode');
const User = require('../models/User');

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const  mongoose  = require('mongoose');
function isExpired(expirationDate) {
  const currentDateTime = new Date();
  return currentDateTime >= new Date(expirationDate);
}
function generateOrderNumber() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let orderNumber = '';

  // Generate a random alphabet character
  orderNumber += alphabet.charAt(Math.floor(Math.random() * alphabet.length));

  // Generate 4 random digits
  for (let i = 0; i < 6; i++) {
    orderNumber += Math.floor(Math.random() * 10);
  }

  return orderNumber;
}
function readHTMLTemplate() {
  const htmlFilePath = path.join(
    process.cwd(),
    'src/email-templates',
    'order.html'
  );
  return fs.readFileSync(htmlFilePath, 'utf8');
}

const createOrder = async (req, res) => {
  
  try {
    const {
      items,
      user,
      paymentMethod,
      paymentId,
      couponCode,
      totalItems,
      shipping,
      subTotal,
      tax
    } = await req.body;

    if (!items || !items.length) {
      return res
        .status(400)
        .json({ success: false, message: 'Please Provide Item(s)' });
    }

    const products = await Products.find({
      _id: { $in: items.map((item) => item.productId) },
    });


    const updatedItems = items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      const price = product ? product.priceSale : product.price;
      const total = price * item.quantity;

      Products.findOneAndUpdate(
        { _id: item.pid, available: { $gte: 0 } },
        { $inc: { available: -item.quantity, sold: item.quantity } },
        { new: true, runValidators: true }
      ).exec();

      return {
        ...item,
        total,
        imageUrl: product?.images.length > 0 ? product.images[0]?.url : product.image?.url,
      };
    });


    const Total = updatedItems.reduce((acc, item) => acc + item.total, 0) ;
    let discount = 0;

    if (couponCode) {
      const couponData = await Coupons.findOne({ code: couponCode });

      const expired = isExpired(couponData.expire);
      if (expired) {
        return res
          .status(400)
          .json({ success: false, message: 'CouponCode Is Expired' });
      }
      // Add the user's email to the usedBy array of the coupon code
      await Coupons.findOneAndUpdate(
        { code: couponCode },
        { $addToSet: { usedBy: user.email } }
      );

      if (couponData && couponData.type === 'percent') {
        const percentLess = couponData.discount;
        discount = ((percentLess / 100) * Total).toFixed(2);
      } else if (couponData) {
        discount = couponData.discount;
      }
    }

    let discountedTotal = (Total - Number(discount) + Number(shipping) + Number(tax)).toFixed(2);
    discountedTotal = Number(discountedTotal) || Total;


    const existingUser = await User.findOne({ email: user.email });
    const orderNo = await generateOrderNumber();
    const orderCreated = await Orders.create({
      paymentMethod,
      paymentId,
      discount,
      total: discountedTotal ?? Total  + Number(shipping) + Number(tax),
      subTotal:Total ,
      // subTotal,
      shipping,
      items: updatedItems,
      // items: items.map(({ image, ...others }) => others),
      user: existingUser ? { ...user, _id: existingUser._id } : user,
      totalItems,
      orderNo,
      status: 'pending',
    });
    console.log(orderCreated)


    await existingUser.orders.push(orderCreated._id);
    await existingUser.save();

    await Notifications.create({
      opened: false,
      title: `${user.fullName} placed an order from ${user.city}.`,
      paymentMethod,
      orderId: orderCreated._id,
      city: user.city,
      cover: user?.cover?.url || '',
    });

    let htmlContent = readHTMLTemplate();

    htmlContent = htmlContent.replace(
      /{{recipientName}}/g,
      `${user.fullName}`
    );

    // <td style=" padding: 10px; border-spacing: 0; border: 0">${item.sku}</td>
    let itemsHtml = '';
    updatedItems.forEach((item) => {
      itemsHtml += `
        <tr style='border-bottom: 1px solid #e4e4e4;'>
          <td style="border-radius: 8px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.1); overflow: hidden; border-spacing: 0; border: 0">
            <img src="${item.imageUrl}" alt="${item.name}" style="width: 62px; height: 62px; object-fit: cover; border-radius: 8px;">
          </td>
          <td style=" padding: 10px; border-spacing: 0; border: 0">${item.name}</td>         
          <td style=" padding: 10px; border-spacing: 0; border: 0">${item.color.name}</td>
          <td style=" padding: 10px; border-spacing: 0; border: 0">${item.size}</td>
          <td style=" padding: 10px; border-spacing: 0; border: 0">${item.quantity}</td>
          <td style=" padding: 10px; border-spacing: 0; border: 0">$${item.total}</td>
        </tr>
      `;
    });

    htmlContent = htmlContent.replace(/{{items}}/g, itemsHtml);
    htmlContent = htmlContent.replace(/{{subTotal}}/g, `$${orderCreated.subTotal}`);
    htmlContent = htmlContent.replace(/{{Shipping}}/g, `$${orderCreated.shipping}`);
    htmlContent = htmlContent.replace(/{{Tax}}/g, `$${tax}`);
    htmlContent = htmlContent.replace(/{{grandTotal}}/g, `$${orderCreated.total}`);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host:'smtp.gmail.com',
      port :587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Your Order Confirmation',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({
      success: true,
      message: 'Order Placed',
      orderId: orderCreated._id,
      data: items.name,
      orderNo,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const getOrderById = async (req, res) => {
  try {
    const id = req.params.id;
    const orderGet = await Orders.findById(id); // Remove curly braces around _id: id

    if (!orderGet) {
      return res
        .status(404)
        .json({ success: false, message: 'Order Not Found' });
    }

    return res.status(200).json({
      success: true,
      data: orderGet,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
// **************************
const getOrdersByUserId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID' });
    }
    const userId = new mongoose.Types.ObjectId(id);

    const { page: pageQuery, limit: limitQuery, search: searchQuery } = req.query;

    const limit = Number(limitQuery) || 10;
    const page = Number(pageQuery) || 1;

    const skip = limit * (page - 1);

    // Construct the search query if searchQuery is provided
    const matchQuery = searchQuery
      ? {
          $or: [
            { 'user.firstName': { $regex: searchQuery, $options: 'i' } },
            { 'user.lastName': { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    // Count total orders for pagination
    const totalOrders = await Orders.countDocuments({
      $or: [
        { 'user.firstName': { $regex: searchQuery || '', $options: 'i' } },
        { 'user.lastName': { $regex: searchQuery || '', $options: 'i' } },
        { 'user._id': userId },
      ],
      ...matchQuery,
    });

    // Fetch the orders with pagination
    const orders = await Orders.aggregate([
      { $match: { ...matchQuery, 'user._id': userId } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Return the response with orders, pagination info
    return res.status(200).json({
      success: true,
      data: orders,
      total: totalOrders,
      count: Math.ceil(totalOrders / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in getOrdersByUserId:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// const getRecentOrdersByUserId = async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Validate the user ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid user ID' });
//     }

//     const userId = new mongoose.Types.ObjectId(id);

//     // Fetch the latest order for the user based on createdAt
//     const latestOrder = await Orders.findOne({ 'user._id': userId })
//       .sort({ createdAt: -1 }) // Sort by createdAt in descending order
//       // .exec();

//     if (!latestOrder) {
//       return res.status(404).json({ success: false, message: 'No orders found for this user.' });
//     }

//     // Return the latest order
//     return res.status(200).json({
//       success: true,
//       data: latestOrder,
//     });
//   } catch (error) {
//     console.error("Error in getLatestOrderByUserId:", error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// const getReturnOrdersByUserId = async (req, res) => {
//   try {
//     const id = req.params.id;

//     // Validate user ID
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid user ID' });
//     }

//     const userId = new mongoose.Types.ObjectId(id);

//     // Fetch all orders for the given user ID, sorted by creation date (most recent first)
//     const orders = await Orders.find({ 'user._id': userId }).sort({ createdAt: -1 });

//     if (!orders.length) {
//       return res.status(404).json({ success: false, message: 'No orders found for this user.' });
//     }

//     // Return the fetched orders
//     return res.status(200).json({
//       success: true,
//       data: orders,
//     });
//   } catch (error) {
//     console.error('Error in getOrdersByUserIdSimple:', error);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


// const getOrdersByUserId = async(req,res) => {
//   try {
//     const id = req.params.id;
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid user ID' });
//     }
//     const userId = new mongoose.Types.ObjectId(id);
//     // console.log(id)
//     const {
//       page: pageQuery,
//       limit: limitQuery,
//       search: searchQuery,
//     } = req.query;

//     const limit = parseInt(limitQuery) || 10;
//     const page = parseInt(pageQuery) || 1;

//     const skip = limit * (page - 1);
//     let matchQuery = {};

//     const totalOrders = await Orders.countDocuments({
//       $or: [
//         { 'user.firstName': { $regex: searchQuery || '', $options: 'i' } },
//         { 'user.lastName': { $regex: searchQuery || '', $options: 'i' } },
//         { 'user._id' :  userId}
//       ],
//       ...matchQuery,
//     });

//     const orders = await Orders.aggregate([
//       { $match: { ...matchQuery, "user._id": userId } },
//       { $sort: { createdAt: -1 } },
//       { $skip: skip },
//       { $limit: limit },
//     ]);
//     // console.log(orders)

//     return res.status(200).json({
//       success: true,
//       data: orders,
//       total: totalOrders,
//       count: Math.ceil(totalOrders / parseInt(limit)),
//       currentPage: page,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// }

// **************************


const getOrdersByAdmin = async (req, res) => {
  try {
    const {
      page: pageQuery,
      limit: limitQuery,
      search: searchQuery,
    } = req.query;

    const limit = parseInt(limitQuery) || 10;
    const page = parseInt(pageQuery) || 1;

    const skip = limit * (page - 1);
    let matchQuery = {};

    const totalOrders = await Orders.countDocuments({
      $or: [
        { 'user.firstName': { $regex: searchQuery || '', $options: 'i' } },
        { 'user.lastName': { $regex: searchQuery || '', $options: 'i' } },
      ],
      ...matchQuery,
    });

    const orders = await Orders.aggregate([
      { $match: { ...matchQuery } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    return res.status(200).json({
      success: true,
      data: orders,
      total: totalOrders,
      count: Math.ceil(totalOrders / parseInt(limit)),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getOneOrderByAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    await Notifications.findOneAndUpdate(
      { orderId: id },
      {
        opened: true,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    const orderGet = await Orders.findById({ _id: id });
    if (!orderGet) {
      return res.status(404).json({
        success: false,
        message: 'Order Not Found',
      });
    }

    return res.status(200).json({
      success: true,
      data: orderGet,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const updateOrderByAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await req.body;
    const order = await Orders.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order Not Found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Order Updated',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
const deleteOrderByAdmin = async (req, res) => {
  try {
    const orderId = req.params.id;

    // Find the order to be deleted
    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order Not Found',
      });
    }

    // Delete the order from the Orders collection
    await Orders.findByIdAndDelete(orderId);

    // Remove the order ID from the user's order array
    await User.findOneAndUpdate(
      { _id: order.user },
      { $pull: { orders: orderId } }
    );

    // Delete notifications related to the order
    await Notifications.deleteMany({ orderId });

    return res.status(200).json({
      success: true,
      message: 'Order Deleted',
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  getOrdersByAdmin,
  getOneOrderByAdmin,
  updateOrderByAdmin,
  deleteOrderByAdmin,
  // getRecentOrdersByUserId,
};
