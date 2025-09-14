const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
// MongoDB connection URI
const MONGO_URI = process.env.MONGODB_URI;

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose
      .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });

    console.log("Connected to MongoDB.");

    // Check if any admins already exist
    // const existingSuperAdmins = await User.countDocuments({ role: 'super admin' });

    // if (existingSuperAdmins > 0) {
    //   console.log('Admins already seeded. Exiting...');
    //   return process.exit(0);
    // }

    // Admin data to seed
    const adminData = [
      {
        fullName: "Super Admin",
        email: "superadmin@pramiraut.com",
        password: "password123",
        role: "super admin",
      },
      {
        fullName: "Super Admin",
        email: "rsaagar720@gmail.com",
        password: "rsaagar123",
        role: "super admin",
      },
      {
        fullName: "Prami Raut",
        email: "pramidesigns@gmail.com",
        password: "password123",
        role: "super admin",
      },
      {
        fullName: "admin",
        email: "pramirauts@gmail.com",
        password: "password123",
        role: "admin",
      },
      {
        fullName: "Prami Raut",
        email: "pramiraut888@gmail.com",
        password: "password123",
        role: "super admin",
      },
    ];

    // Hash passwords manually before seeding
    for (const admin of adminData) {
      // admin.password = await bcrypt.hash(admin.password, 10);
      const isAlreadyExists = await User.findOne({ email: admin.email });
      if (!isAlreadyExists) {
        const adminData = new User(admin);

        await adminData.save();
        console.log("Admin user inserted successfully!", admin.email);
      } else {
        console.log("Admin user already exists", admin.email);
      }
    }

    // Seed admin data
    // await User.insertMany(adminData);
    console.log("Admin data seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin data:", error);
    process.exit(1);
  }
};

// Execute the seed script
seedAdmins();
