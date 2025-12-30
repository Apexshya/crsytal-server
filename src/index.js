// 'use strict';
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');
// // Load environment variables from .env file
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 8080;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('Connected to MongoDB');
//   })
//   .catch((error) => {
//     console.error('Error connecting to MongoDB:', error);
//   });

// // Routes

// const homeRoutes = require('./routes/home');
// const authRoutes = require('./routes/auth');
// const brandRoutes = require('./routes/brand');
// const categoryRoutes = require('./routes/category');
// const subcategoryRoutes = require('./routes/subcategory');
// const newsletterRoutes = require('./routes/newsletter');
// const productRoutes = require('./routes/product');
// const dashboardRoutes = require('./routes/dashboard');
// const searchRoutes = require('./routes/search');
// const userRoutes = require('./routes/user');
// const cartRoutes = require('./routes/cart');
// const couponCodeRoutes = require('./routes/coupon-code');
// const reviewRoutes = require('./routes/review');
// const wishlistRoutes = require('./routes/wishlist');
// const OrderRoutes = require('./routes/order');
// const paymentRoutes = require('./routes/payment-intents');
// const delete_fileRoutes = require('./routes/file-delete');
// const shippingRoutes = require('./routes/shipping');

// app.use('/api', homeRoutes);
// app.use('/api', authRoutes);
// app.use('/api', brandRoutes);
// app.use('/api', categoryRoutes);
// app.use('/api', subcategoryRoutes);
// app.use('/api', newsletterRoutes);
// app.use('/api', productRoutes);
// app.use('/api', dashboardRoutes);
// app.use('/api', searchRoutes);
// app.use('/api', userRoutes);
// app.use('/api', cartRoutes);
// app.use('/api', couponCodeRoutes);
// app.use('/api', reviewRoutes);
// app.use('/api', wishlistRoutes);
// app.use('/api', OrderRoutes);
// app.use('/api', paymentRoutes);
// app.use('/api', delete_fileRoutes);
// app.use('/api',shippingRoutes);

// // GET API
// app.get('/', (req, res) => {
//   res.send('Server is up  &&  Running🚀🚀🚀!!!');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
// // const server = app.listen(0, () => {
// //   const port = server.address().port; // Get the port from the server object
// //   console.log(`Server is running on port ${port}`);
// // });


'use strict';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables from .env file when not in production
// Vercel handles environment variables directly in production deployments.
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}


const app = express();
const PORT = process.env.PORT || 8080; // Use port 8080 as a default for local if not specified

// =============================================================
//  CORS Configuration
//  This configuration allows your frontend to securely communicate
//  with this backend API.
// =============================================================
// Get the allowed origin(s) from an environment variable.
// This variable (e.g., FRONTEND_URLS) should be set on Vercel for production,
// and in your local .env file for local development if needed.
// Multiple URLs can be separated by commas in the environment variable.
const FRONTEND_URLS_ENV = process.env.FRONTEND_URLS || ''; // Ensure a default empty string if variable is not set
const allowedOrigins = FRONTEND_URLS_ENV
  .split(',')
  .map(url => url.trim())
  .filter(url => url !== '');

// Add localhost for local development if not already present in the allowed list
// and if the application is not in a production environment.
if (process.env.NODE_ENV !== 'production' && !allowedOrigins.includes('http://localhost:3000')) {
  // Assuming your local frontend runs on http://localhost:3000
  allowedOrigins.push('http://localhost:3000');
  console.log('Added http://localhost:3000 to allowed CORS origins for local development.');
}

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., for mobile apps, curl requests, or same-origin requests)
    if (!origin) return callback(null, true);

    // Check if the requesting origin is in our list of allowed origins
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
      console.warn(msg); // Log the blocked origin for debugging
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // This is CRITICAL if your frontend sends cookies or Authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Explicitly allow common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Referer'], // Explicitly allow headers sent by your frontend
}));
// =============================================================


// Middleware
app.use(bodyParser.json()); // To parse JSON bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Routes
// Dynamically load all your route files. Ensure these paths are correct.
const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const brandRoutes = require('./routes/brand');
const categoryRoutes = require('./routes/category');
const subcategoryRoutes = require('./routes/subcategory');
const newsletterRoutes = require('./routes/newsletter');
const productRoutes = require('./routes/product');
const dashboardRoutes = require('./routes/dashboard');
const searchRoutes = require('./routes/search');
const userRoutes = require('./routes/user');
const cartRoutes = require('./routes/cart');
const couponCodeRoutes = require('./routes/coupon-code');
const reviewRoutes = require('./routes/review');
const wishlistRoutes = require('./routes/wishlist');
const OrderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment-intents');
const delete_fileRoutes = require('./routes/file-delete');
const shippingRoutes = require('./routes/shipping');

app.use('/api', homeRoutes);
app.use('/api', authRoutes);
app.use('/api', brandRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subcategoryRoutes);
app.use('/api', newsletterRoutes);
app.use('/api', productRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', searchRoutes);
app.use('/api', userRoutes);
app.use('/api', cartRoutes);
app.use('/api', couponCodeRoutes);
app.use('/api', reviewRoutes);
app.use('/api', wishlistRoutes);
app.use('/api', OrderRoutes);
app.use('/api', paymentRoutes);
app.use('/api', delete_fileRoutes);
app.use('/api',shippingRoutes);

// Main GET API endpoint
app.get('/', (req, res) => {
  res.send('Server is up && Running🚀🚀🚀!!!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('Allowed CORS Origins:', allowedOrigins.join(', ')); // Log active allowed origins
});

// For Vercel, the server needs to export the app instance.
// If you are using a custom serverless function, this might be slightly different,
// but for a Node.js server on Vercel, usually you just start it as above.
// However, if Vercel is acting as a serverless platform, sometimes you need to export.
// If you encounter issues, uncomment the module.exports line below.
// module.exports = app;
