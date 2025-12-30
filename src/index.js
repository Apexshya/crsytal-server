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




// 'use strict';
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');

// // Load environment variables from .env file when not in production
// // Vercel handles environment variables directly in production deployments.
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config();
// }


// const app = express();
// const PORT = process.env.PORT || 8080; // Use port 8080 as a default for local if not specified

// // =============================================================
// //  CORS Configuration
// //  This configuration allows your frontend to securely communicate
// //  with this backend API.
// // =============================================================
// // Get the allowed origin(s) from an environment variable.
// // This variable (e.g., FRONTEND_URLS) should be set on Vercel for production,
// // and in your local .env file for local development if needed.
// // Multiple URLs can be separated by commas in the environment variable.
// const FRONTEND_URLS_ENV = process.env.FRONTEND_URLS || ''; // Ensure a default empty string if variable is not set
// const allowedOrigins = FRONTEND_URLS_ENV
//   .split(',')
//   .map(url => url.trim())
//   .filter(url => url !== '');

// // Add localhost for local development if not already present in the allowed list
// // and if the application is not in a production environment.
// if (process.env.NODE_ENV !== 'production' && !allowedOrigins.includes('http://localhost:3000')) {
//   // Assuming your local frontend runs on http://localhost:3000
//   allowedOrigins.push('http://localhost:3000');
//   console.log('Added http://localhost:3000 to allowed CORS origins for local development.');
// }

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (e.g., for mobile apps, curl requests, or same-origin requests)
//     if (!origin) return callback(null, true);

//     // Check if the requesting origin is in our list of allowed origins
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
//       console.warn(msg); // Log the blocked origin for debugging
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   },
//   credentials: true, // This is CRITICAL if your frontend sends cookies or Authorization headers
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Explicitly allow common HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization', 'Referer'], // Explicitly allow headers sent by your frontend
// }));
// // =============================================================


// // Middleware
// app.use(bodyParser.json()); // To parse JSON bodies

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
// // Dynamically load all your route files. Ensure these paths are correct.
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

// // Main GET API endpoint
// app.get('/', (req, res) => {
//   res.send('Server is up && Running🚀🚀🚀!!!');
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   console.log('Allowed CORS Origins:', allowedOrigins.join(', ')); // Log active allowed origins
// });

// // For Vercel, the server needs to export the app instance.
// // If you are using a custom serverless function, this might be slightly different,
// // but for a Node.js server on Vercel, usually you just start it as above.
// // However, if Vercel is acting as a serverless platform, sometimes you need to export.
// // If you encounter issues, uncomment the module.exports line below.
// // module.exports = app;


//new

// 'use strict';
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const bodyParser = require('body-parser');

// // Load environment variables
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config();
// }

// const app = express();
// const PORT = process.env.PORT || 8080;

// // =============================================================
// //  CORS Configuration - SIMPLIFIED
// // =============================================================
// app.use(cors({
//   origin: '*',  // Allow ALL origins (TEMPORARY for testing)
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization', 'Referer', 'Origin', 'Accept', 'X-Requested-With']
// }));

// // Handle preflight requests
// app.options('*', cors());
// // =============================================================

// // Middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => {
//   console.log('✅ Connected to MongoDB');
// })
// .catch((error) => {
//   console.error('❌ Error connecting to MongoDB:', error);
// });

// // Import routes
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

// // Use routes
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
// app.use('/api', shippingRoutes);

// // Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     message: 'Server is running 🚀',
//     timestamp: new Date().toISOString()
//   });
// });

// // Main endpoint
// app.get('/', (req, res) => {
//   res.send('Server is up && Running🚀🚀🚀!!!');
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('❌ Server Error:', err.stack);
//   res.status(500).json({ 
//     success: false, 
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : {}
//   });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`
//   });
// });

// // Start server locally (for development)
// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//     console.log(`🌐 CORS enabled for all origins`);
//   });
// }

// // Export for Vercel serverless
// module.exports = app;




'use strict';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 8080;

// =============================================================
//  CORS Configuration - SIMPLIFIED
// =============================================================
app.use(cors({
  origin: '*',  // Allow ALL origins (TEMPORARY for testing)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Referer', 'Origin', 'Accept', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());
// =============================================================

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// =============================================================
//  MONGODB CONNECTION WITH POOLING (FIX FOR TIMEOUT)
// =============================================================
let isConnected = false;
let connectionPromise = null;

async function connectToDatabase() {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }
  
  if (connectionPromise) {
    console.log('🔄 Connection already in progress, waiting...');
    await connectionPromise;
    return;
  }
  
  console.log('🔄 Establishing new MongoDB connection...');
  
  connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
    maxPoolSize: 5, // LIMIT connections to prevent exhaustion
    minPoolSize: 1,
    retryWrites: true,
    w: 'majority'
  })
  .then(() => {
    isConnected = true;
    connectionPromise = null;
    console.log('✅ MongoDB connected successfully');
    
    // Log connection info
    const connection = mongoose.connection;
    connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });
    
    connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      isConnected = false;
    });
    
    return mongoose;
  })
  .catch((error) => {
    console.error('❌ Error connecting to MongoDB:', error);
    connectionPromise = null;
    throw error;
  });
  
  await connectionPromise;
}

// Connect to database
connectToDatabase().catch(console.error);

// Middleware to ensure DB connection before routes
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database connection failed',
      error: error.message 
    });
  }
});
// =============================================================

// Import routes
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

// Use routes
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
app.use('/api', shippingRoutes);

// Test endpoint without database
app.get('/api/test-simple', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is working (no database used)',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint with mock products
app.get('/api/test-products', (req, res) => {
  const mockProducts = [
    { _id: "1", name: "Test Crystal 1", price: 88, available: 35 },
    { _id: "2", name: "Test Crystal 2", price: 120, available: 20 },
    { _id: "3", name: "Test Crystal 3", price: 150, available: 10 }
  ];
  
  res.json({ 
    success: true, 
    data: mockProducts,
    message: "Mock data - Database might have issues" 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = isConnected ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    message: 'Server is running 🚀',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Main endpoint
app.get('/', (req, res) => {
  res.send('Server is up && Running🚀🚀🚀!!!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server locally (for development)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 CORS enabled for all origins`);
  });
}

// Export for Vercel serverless
module.exports = app;